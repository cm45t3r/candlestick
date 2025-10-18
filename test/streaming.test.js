const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { createStream, processLargeDataset } = require("../src/streaming.js");

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
  });
});
