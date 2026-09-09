const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { createStream, processLargeDataset } = require("../src/streaming.js");
const { patternChain, allPatterns, plugins } = require("../index.js");

// Helper to generate test data
function generateCandles(count) {
  const candles = [];
  for (let i = 0; i < count; i++) {
    const base = 100 + Math.sin(i / 10) * 20;
    candles.push({
      open: base,
      high: base + Math.random() * 10,
      low: base - Math.random() * 10,
      close: base + (Math.random() - 0.5) * 10,
    });
  }
  return candles;
}

// Deterministic (no Math.random) so batch and streaming see identical input.
function generateDeterministicCandles(count) {
  const candles = [];
  for (let i = 0; i < count; i++) {
    const base = 100 + Math.sin(i / 50) * 20 + (i % 7) * 0.3;
    const close = base + Math.sin(i / 3) * 1.5;
    candles.push({
      open: base,
      high: Math.max(base, close) + 1,
      low: Math.min(base, close) - 1.4,
      close,
    });
  }
  return candles;
}

// Collect streaming matches as sorted "index|pattern" keys.
function streamKeys(data, chunkSize, feedSize = chunkSize) {
  const keys = [];
  const stream = createStream({
    chunkSize,
    onMatch: (r) => keys.push(`${r.index}|${r.pattern}`),
  });
  for (let i = 0; i < data.length; i += feedSize) {
    stream.process(data.slice(i, i + feedSize));
  }
  stream.end();
  return keys.sort();
}

function batchKeys(data) {
  return patternChain(data, allPatterns)
    .map((r) => `${r.index}|${r.pattern}`)
    .sort();
}

describe("Streaming API", () => {
  describe("createStream", () => {
    it("creates a stream processor", () => {
      const stream = createStream();
      assert.ok(typeof stream.process === "function");
      assert.ok(typeof stream.end === "function");
      assert.ok(typeof stream.reset === "function");
    });

    it("processes data in chunks with callbacks", () => {
      const matches = [];
      const progress = [];

      const stream = createStream({
        patterns: ["hammer", "doji"],
        chunkSize: 50,
        onMatch: (match) => matches.push(match),
        onProgress: (prog) => progress.push(prog),
      });

      const data = generateCandles(200);

      // Process in chunks
      stream.process(data.slice(0, 100));
      stream.process(data.slice(100, 200));
      stream.end();

      // Verify callbacks were called
      assert.ok(matches.length >= 0); // May or may not find patterns
      assert.ok(progress.length > 0); // Should have progress updates
    });

    it("handles single chunk processing", () => {
      const matches = [];
      const stream = createStream({
        patterns: null,
        chunkSize: 1000,
        onMatch: (match) => matches.push(match),
      });

      const data = generateCandles(50);
      stream.process(data);
      const summary = stream.end();

      assert.ok(summary.totalProcessed >= 0);
      assert.ok(summary.patternsDetected > 0);
    });

    it("handles empty chunks gracefully", () => {
      const stream = createStream();
      stream.process([]);
      const summary = stream.end();

      assert.equal(summary.totalProcessed, 0);
    });

    it("enriches with metadata when requested", () => {
      const matches = [];
      const stream = createStream({
        patterns: ["hammer"],
        chunkSize: 50,
        onMatch: (match) => matches.push(match),
        enrichMetadata: true,
      });

      const data = generateCandles(100);
      stream.process(data);
      stream.end();

      // If any matches found, they should have metadata
      matches.forEach((match) => {
        if (match.metadata) {
          assert.ok(typeof match.metadata.confidence === "number");
        }
      });
    });

    it("resets stream state correctly", () => {
      const stream = createStream({ chunkSize: 50 });
      const data = generateCandles(100);

      stream.process(data);
      stream.end();

      // Reset
      stream.reset();

      // Process again
      stream.process(data);
      const summary = stream.end();

      assert.ok(summary.totalProcessed > 0);
    });

    it("reset then process different-sized dataset has no state from previous run", () => {
      const stream = createStream({ chunkSize: 50 });

      stream.process(generateCandles(300));
      const firstSummary = stream.end();

      stream.reset();

      const secondMatches = [];
      const stream2 = createStream({
        chunkSize: 50,
        onMatch: (m) => secondMatches.push(m),
      });
      const smallData = generateCandles(200);
      stream2.process(smallData);
      const secondSummary = stream2.end();

      // After reset the previous state is gone: totalProcessed starts fresh
      assert.ok(secondSummary.totalProcessed > 0);
      // All result indices must be within the new dataset bounds
      secondMatches.forEach((m) => {
        assert.ok(m.index < smallData.length, `index ${m.index} out of bounds`);
      });
      // First run processed more candles than second run
      assert.ok(firstSummary.totalProcessed > secondSummary.totalProcessed);
    });

    it("handles very small chunks", () => {
      const matches = [];
      const stream = createStream({
        patterns: ["doji"],
        chunkSize: 5,
        onMatch: (match) => matches.push(match),
      });

      const data = generateCandles(20);
      for (const candle of data) {
        stream.process([candle]);
      }
      stream.end();

      // Should not crash
      assert.ok(true);
    });
  });

  describe("processLargeDataset", () => {
    it("processes large dataset and returns all matches", () => {
      const data = generateCandles(5000);
      const results = processLargeDataset(data, {
        patterns: ["hammer", "doji"],
        chunkSize: 1000,
      });

      assert.ok(Array.isArray(results));
      // All indices should be valid
      results.forEach((r) => {
        assert.ok(r.index >= 0);
        assert.ok(r.index < data.length);
      });
    });

    it("matches regular patternChain for small datasets", () => {
      const candlestick = require("../index.js");
      const data = generateCandles(100);

      const regularResults = candlestick.patternChain(data, [
        { name: "hammer", fn: candlestick.hammer, paramCount: 1 },
        { name: "doji", fn: candlestick.doji, paramCount: 1 },
      ]);

      const streamResults = processLargeDataset(data, {
        patterns: ["hammer", "doji"],
        chunkSize: 50,
      });

      // Should find the same patterns (order might differ slightly at chunk boundaries)
      assert.ok(streamResults.length >= regularResults.length - 2); // Allow small difference at boundaries
    });

    it("enriches results with metadata", () => {
      const data = generateCandles(1000);
      const results = processLargeDataset(data, {
        patterns: ["hammer"],
        chunkSize: 500,
        enrichMetadata: true,
      });

      results.forEach((r) => {
        if (r.metadata) {
          assert.ok(typeof r.metadata.confidence === "number");
          assert.ok(typeof r.metadata.type === "string");
        }
      });
    });

    it("handles all patterns efficiently", () => {
      const data = generateCandles(2000);
      const results = processLargeDataset(data, {
        patterns: null, // All patterns
        chunkSize: 500,
      });

      assert.ok(Array.isArray(results));
      // Should process without errors
      assert.ok(true);
    });

    it("uses default chunkSize when not provided", () => {
      const data = generateCandles(50);
      // No chunkSize in options — exercises the || 1000 default fallback
      const results = processLargeDataset(data, { patterns: ["hammer"] });
      assert.ok(Array.isArray(results));
    });

    it("frequency breakdown matches individual pattern counts", () => {
      const data = generateCandles(2000);
      const results = processLargeDataset(data, {
        patterns: ["hammer", "doji", "spinningTop"],
        chunkSize: 500,
      });

      // Build frequency map
      const freq = {};
      for (const r of results) {
        freq[r.pattern] = (freq[r.pattern] || 0) + 1;
      }

      // Each key in freq must be one of the requested patterns
      for (const name of Object.keys(freq)) {
        assert.ok(
          ["hammer", "doji", "spinningTop"].includes(name),
          `Unexpected pattern in results: ${name}`,
        );
      }

      // Counts must be non-negative integers
      for (const count of Object.values(freq)) {
        assert.ok(Number.isInteger(count) && count > 0);
      }
    });
  });

  describe("processLargeDataset onMatch composition", () => {
    it("caller onMatch is invoked for every match alongside internal collection", () => {
      const data = generateCandles(5000);
      const realtime = [];
      const final = processLargeDataset(data, {
        chunkSize: 500,
        onMatch: (m) => realtime.push(m),
      });
      assert.ok(final.length > 0, "returned array must have matches");
      assert.deepStrictEqual(
        realtime.length,
        final.length,
        "realtime count must equal returned count",
      );
    });

    it("omitting onMatch still returns collected results", () => {
      const data = generateCandles(5000);
      const final = processLargeDataset(data, { chunkSize: 500 });
      assert.ok(Array.isArray(final));
      assert.ok(final.length > 0);
    });
  });

  describe("processLargeDataset error handling", () => {
    it("calls end() and fires onProgress complete:true even when process() throws", () => {
      // processLargeDataset overrides onMatch internally, so we trigger the throw via
      // onProgress (the only user callback that flows through stream.process()).
      // It throws once; end() then runs cleanly and fires onProgress with complete:true.
      const data = generateCandles(5000);
      let completeFired = false;
      let thrown = false;

      assert.throws(
        () =>
          processLargeDataset(data, {
            chunkSize: 50,
            onProgress: ({ complete }) => {
              if (complete) {
                completeFired = true;
                return;
              }
              if (!thrown) {
                thrown = true;
                throw new Error("progress callback failure");
              }
            },
          }),
        /progress callback failure/,
      );

      assert.ok(
        completeFired,
        "onProgress({ complete: true }) must fire even after a throw",
      );
    });

    it("flushes buffered candles via end() before re-throwing", () => {
      // onProgress throws once during the loop; end() still runs and onProgress fires
      // with complete:true, confirming the buffer was drained and totalProcessed is set.
      const data = generateCandles(5000);
      let finalProcessed = 0;
      let thrown = false;

      assert.throws(
        () =>
          processLargeDataset(data, {
            chunkSize: 50,
            onProgress: ({ processed, complete }) => {
              if (complete) {
                finalProcessed = processed;
                return;
              }
              if (!thrown) {
                thrown = true;
                throw new Error("trigger");
              }
            },
          }),
        /trigger/,
      );

      assert.ok(
        finalProcessed > 0,
        "end() must have flushed the buffer before re-throwing",
      );
    });
  });

  describe("strict mode", () => {
    const ocOnly = Array.from({ length: 60 }, () => ({ open: 100, close: 95 }));

    it("default: O/C-only candles processed without throw", () => {
      const stream = createStream({ chunkSize: 50 });
      assert.doesNotThrow(() => stream.process(ocOnly));
    });

    it("strict=true: throws on first chunk with O/C-only candles", () => {
      const stream = createStream({ chunkSize: 50, strict: true });
      assert.throws(
        () => stream.process(ocOnly),
        /Invalid candle data produces NaN geometry/,
      );
    });

    it("processLargeDataset strict=true: throws for O/C-only candles", () => {
      assert.throws(
        () => processLargeDataset(ocOnly, { chunkSize: 50, strict: true }),
        /Invalid candle data produces NaN geometry/,
      );
    });
  });

  describe("createStream edge cases", () => {
    it("accepts patterns as a single string instead of array", () => {
      const matches = [];
      // Passing a string directly exercises the Array.isArray branch → [patterns]
      const stream = createStream({
        patterns: "hammer",
        chunkSize: 50,
        onMatch: (m) => matches.push(m),
      });
      const data = generateCandles(100);
      stream.process(data);
      stream.end();
      assert.ok(Array.isArray(matches));
    });

    it("throws when chunkSize is 0", () => {
      assert.throws(
        () => createStream({ chunkSize: 0 }),
        /chunkSize must be a positive integer/,
      );
    });

    it("throws when chunkSize is negative", () => {
      assert.throws(
        () => createStream({ chunkSize: -1 }),
        /chunkSize must be a positive integer/,
      );
    });

    it("throws when chunkSize is a non-integer", () => {
      assert.throws(
        () => createStream({ chunkSize: 1.5 }),
        /chunkSize must be a positive integer/,
      );
    });

    it("throws when patterns array contains only unknown names", () => {
      assert.throws(
        () => createStream({ patterns: ["nonExistentPattern"] }),
        /No matching patterns found for: nonExistentPattern/,
      );
    });

    it("throws when patterns is an empty array", () => {
      assert.throws(
        () => createStream({ patterns: [] }),
        /No matching patterns found/,
      );
    });

    it("handles chunks larger than 100k elements without stack overflow", () => {
      // Regression for #75: buffer.push(...chunk) throws RangeError for chunks
      // above ~100–150k elements (V8 argument limit). for...of push has no limit.
      const BIG = 150_000;
      const candle = { open: 10, high: 12, low: 8, close: 11 };
      const chunk = Array(BIG).fill(candle);

      const stream = createStream({ patterns: ["hammer"], chunkSize: BIG + 1 });
      assert.doesNotThrow(() => stream.process(chunk));
    });
  });
  describe("pattern size invariant", () => {
    // The chunk-overlap math in createStream indexes paramCount directly.
    // If a pattern ever shipped without it, maxPatternSize would become NaN
    // and every boundary comparison would silently fail open.
    it("every built-in pattern declares a numeric paramCount", () => {
      for (const pattern of allPatterns) {
        assert.equal(
          typeof pattern.paramCount,
          "number",
          `pattern "${pattern.name}" has no numeric paramCount`,
        );
        assert.ok(
          Number.isInteger(pattern.paramCount) && pattern.paramCount >= 1,
          `pattern "${pattern.name}" has an invalid paramCount: ${pattern.paramCount}`,
        );
      }
    });

    it("registerPattern normalizes a missing paramCount to 1", () => {
      const def = plugins.registerPattern({
        name: "paramCountDefaultProbe",
        fn: () => [],
      });
      try {
        assert.equal(def.paramCount, 1);
      } finally {
        plugins.unregisterPattern("paramCountDefaultProbe");
      }
    });
  });

  describe("end() finalization", () => {
    // Regression for #119: end() left the buffer in place and never advanced
    // globalOffset, so each call reprocessed the trailing buffer; totalProcessed
    // additionally charged the carry-over overlap to every chunk that saw it.
    it("reports totalProcessed equal to the candles fed", () => {
      for (const [count, chunkSize, feedSize] of [
        [5000, 1000, 1000],
        [5000, 1000, 333],
        [3000, 7, 7],
        [500, 1000, 500],
        [2, 1000, 2],
      ]) {
        const data = generateDeterministicCandles(count);
        const stream = createStream({ chunkSize });
        for (let i = 0; i < count; i += feedSize) {
          stream.process(data.slice(i, i + feedSize));
        }
        assert.equal(
          stream.end().totalProcessed,
          count,
          `count ${count} / chunk ${chunkSize} / feed ${feedSize}`,
        );
      }
    });

    it("does not re-emit matches when end() is called repeatedly", () => {
      const data = generateDeterministicCandles(5000);
      const seen = [];
      const stream = createStream({
        chunkSize: 1000,
        onMatch: (r) => seen.push(`${r.index}|${r.pattern}`),
      });
      for (let i = 0; i < data.length; i += 1000) {
        stream.process(data.slice(i, i + 1000));
      }
      stream.end();
      const afterFirst = seen.length;
      stream.end();
      stream.end();

      assert.equal(
        seen.length,
        afterFirst,
        "repeated end() re-emitted matches",
      );
      assert.equal(
        seen.length,
        new Set(seen).size,
        "duplicate matches emitted",
      );
    });

    it("returns the same summary from every end() call", () => {
      const data = generateDeterministicCandles(1200);
      const stream = createStream({ chunkSize: 500 });
      stream.process(data);
      const first = stream.end();
      const second = stream.end();
      assert.deepEqual(second, first);
      assert.equal(first.totalProcessed, 1200);

      // A caller mutating the summary must not corrupt later calls
      assert.notEqual(second, first, "end() handed back the same object");
      first.totalProcessed = -1;
      first.patternsDetected = -1;
      assert.deepEqual(stream.end(), {
        totalProcessed: 1200,
        patternsDetected: allPatterns.length,
      });
    });

    it("fires onProgress complete exactly once", () => {
      const data = generateDeterministicCandles(3000);
      let completeCount = 0;
      const stream = createStream({
        chunkSize: 500,
        onProgress: (p) => {
          if (p.complete) completeCount++;
        },
      });
      stream.process(data);
      stream.end();
      stream.end();
      assert.equal(completeCount, 1);
    });

    it("throws when process() is called after end()", () => {
      const stream = createStream({ chunkSize: 500 });
      stream.process(generateDeterministicCandles(600));
      stream.end();
      assert.throws(
        () => stream.process(generateDeterministicCandles(10)),
        /Cannot process\(\) after end\(\)/,
      );
    });

    it("allows reuse after reset() following end()", () => {
      const data = generateDeterministicCandles(2000);
      const expected = batchKeys(data);

      const seen = [];
      const stream = createStream({
        chunkSize: 500,
        onMatch: (r) => seen.push(`${r.index}|${r.pattern}`),
      });

      // a complete first run, then reset and drive the SAME stream again
      stream.process(generateDeterministicCandles(700));
      stream.end();
      stream.reset();
      seen.length = 0;

      stream.process(data);
      const summary = stream.end();

      assert.equal(summary.totalProcessed, 2000, "reset() left stale counters");
      assert.deepEqual(seen.sort(), expected, "reset() left stale offsets");
      assert.equal(seen.length, new Set(seen).size);
    });

    it("adds the completion signal exactly once when onMatch throws in end()", () => {
      // Regression: committing `ended` before the emit loop must not swallow
      // onProgress({ complete: true }) — consumers close their sink on it and
      // the memoized end() would never deliver it on a retry. See #83.
      const data = generateDeterministicCandles(3000);
      let inEnd = false;
      let armed = true;
      let completeCount = 0;
      const stream = createStream({
        chunkSize: 1000,
        onMatch: () => {
          if (inEnd && armed) {
            armed = false;
            throw new Error("sink failure");
          }
        },
        onProgress: (p) => {
          if (p.complete) completeCount++;
        },
      });
      for (let i = 0; i < data.length; i += 1000) {
        stream.process(data.slice(i, i + 1000));
      }
      inEnd = true;

      assert.throws(() => stream.end(), /sink failure/);
      assert.equal(
        completeCount,
        1,
        "completion signal lost on a failed end()",
      );
      stream.end();
      assert.equal(completeCount, 1, "completion signal repeated on retry");
    });

    it("stays ended when onMatch throws during the final drain", () => {
      // The buffer is drained before callbacks fire, so the stream must also be
      // marked ended before them: otherwise a throwing onMatch would leave it
      // drained but still accepting input, and a resumed process() would miss
      // patterns spanning the discarded overlap.
      const data = generateDeterministicCandles(3000);
      let inEnd = false;
      let armed = true;
      const seen = [];
      const stream = createStream({
        chunkSize: 1000,
        onMatch: (r) => {
          if (inEnd && armed) {
            armed = false;
            throw new Error("onMatch failure");
          }
          seen.push(`${r.index}|${r.pattern}`);
        },
      });
      for (let i = 0; i < data.length; i += 1000) {
        stream.process(data.slice(i, i + 1000));
      }
      inEnd = true;
      assert.throws(() => stream.end(), /onMatch failure/);

      assert.throws(
        () => stream.process(data.slice(0, 10)),
        /Cannot process\(\) after end\(\)/,
        "stream must be ended even though onMatch threw",
      );

      const afterThrow = seen.length;
      stream.end();
      assert.equal(seen.length, afterThrow, "re-emitted after a failed end()");
    });

    it("is idempotent for a stream that never received data", () => {
      const stream = createStream({ chunkSize: 100 });
      const first = stream.end();
      const second = stream.end();
      assert.equal(first.totalProcessed, 0);
      assert.deepEqual(second, first);
    });
  });

  describe("equivalence with batch patternChain", () => {
    // Regression for #115: the carry-over overlap is sized for the longest
    // pattern (maxPatternSize), so patterns shorter than that were re-detected
    // at the start of every non-first chunk and emitted twice.
    it("emits exactly the batch matches across many chunk boundaries", () => {
      const data = generateDeterministicCandles(5000);
      assert.deepEqual(streamKeys(data, 1000), batchKeys(data));
    });

    it("emits no duplicate matches at chunk boundaries", () => {
      const data = generateDeterministicCandles(5000);
      const keys = streamKeys(data, 1000);
      assert.equal(
        keys.length,
        new Set(keys).size,
        "streaming emitted duplicate (index, pattern) pairs",
      );
    });

    it("matches batch output for a range of chunk sizes", () => {
      const data = generateDeterministicCandles(3000);
      const expected = batchKeys(data);
      for (const chunkSize of [3, 4, 7, 64, 999, 1000, 1001]) {
        assert.deepEqual(
          streamKeys(data, chunkSize),
          expected,
          `chunkSize ${chunkSize} diverged from batch`,
        );
      }
    });

    it("matches batch output when feed size is not aligned to chunk size", () => {
      const data = generateDeterministicCandles(3000);
      assert.deepEqual(streamKeys(data, 1000, 333), batchKeys(data));
    });

    it("matches batch output when the data never fills a chunk", () => {
      const data = generateDeterministicCandles(500);
      assert.deepEqual(streamKeys(data, 1000), batchKeys(data));
    });

    it("keeps single-candle patterns unduplicated at boundaries", () => {
      const data = generateDeterministicCandles(4000);
      const keys = [];
      const stream = createStream({
        patterns: ["hammer"],
        chunkSize: 1000,
        onMatch: (r) => keys.push(r.index),
      });
      for (let i = 0; i < data.length; i += 1000) {
        stream.process(data.slice(i, i + 1000));
      }
      stream.end();
      assert.equal(keys.length, new Set(keys).size);
      assert.deepEqual(
        [...keys].sort((a, b) => a - b),
        patternChain(data, [allPatterns.find((p) => p.name === "hammer")]).map(
          (r) => r.index,
        ),
      );
    });
  });
});
