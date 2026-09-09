// streaming.js
// Streaming API for processing large datasets efficiently

/**
 * Create a streaming pattern detector
 * Processes candles in chunks to reduce memory usage
 *
 * @param {Object} options - Configuration options
 * @param {Array<string>|null} options.patterns - Pattern names to detect (null = all)
 * @param {number} options.chunkSize - Number of candles to process at once (default: 1000)
 * @param {Function} options.onMatch - Callback for each match found
 * @param {Function} options.onProgress - Callback for progress updates
 * @param {boolean} options.enrichMetadata - Add metadata to results (default: false)
 * @return {Object} Stream processor with process() and end() methods
 */
function createStream(options = {}) {
  const {
    patterns = null,
    chunkSize = 1000,
    onMatch = null,
    onProgress = null,
    enrichMetadata = false,
    strict = false,
  } = options;

  if (!Number.isInteger(chunkSize) || chunkSize < 1) {
    throw new Error(`chunkSize must be a positive integer, got: ${chunkSize}`);
  }

  // Get pattern functions
  const candlestick = require("../index.js");
  let patternFns;

  if (patterns === null) {
    patternFns = candlestick.allPatterns;
  } else {
    const patternNames = Array.isArray(patterns) ? patterns : [patterns];
    patternFns = candlestick.allPatterns.filter((p) =>
      patternNames.includes(p.name),
    );
    if (patternFns.length === 0) {
      throw new Error(
        `No matching patterns found for: ${patternNames.join(", ")}. ` +
          `Check the "patterns" option.`,
      );
    }
  }

  // State
  let buffer = [];
  let globalOffset = 0;
  let totalProcessed = 0;
  let ended = false;
  let endSummary = null;
  // Every pattern carries a numeric paramCount: the built-ins define it, and
  // plugins.registerPattern() normalizes and validates it (1-10). Enforced by
  // the "every pattern declares a numeric paramCount" test.
  const paramCountByName = new Map(
    patternFns.map((p) => [p.name, p.paramCount]),
  );
  const maxPatternSize = Math.max(...paramCountByName.values());

  /**
   * The carry-over overlap is sized for the longest pattern (`maxPatternSize`),
   * so shorter patterns anchored at the start of a non-first chunk were already
   * detected and emitted by the previous chunk. Drop those repeats: a pattern of
   * size `k` at local index `i` is a repeat when `i < maxPatternSize - k`.
   * @param {Array<Object>} results - patternChain results, local indices
   * @param {boolean} isFirstChunk - first chunk has no preceding overlap
   * @return {Array<Object>} results with boundary repeats removed
   */
  function dropOverlapRepeats(results, isFirstChunk) {
    if (isFirstChunk) {
      return results;
    }
    return results.filter(
      // every r.pattern came from patternFns, so the lookup always hits
      (r) => r.index >= maxPatternSize - paramCountByName.get(r.pattern),
    );
  }

  /**
   * Process a chunk of data
   * @param {Array<Object>} chunk - Array of OHLC objects
   * @throws {Error} If called after end(); call reset() to reuse the stream
   */
  function process(chunk) {
    if (ended) {
      throw new Error(
        "Cannot process() after end(); call reset() to reuse this stream",
      );
    }
    if (!Array.isArray(chunk) || chunk.length === 0) {
      return;
    }

    // Add to buffer (for...of avoids the RangeError that push(...chunk) triggers on large chunks)
    for (const candle of chunk) buffer.push(candle);

    // Process buffer if it's large enough
    while (buffer.length >= chunkSize + maxPatternSize) {
      const toProcess = buffer.slice(0, chunkSize);
      const overlap = buffer.slice(chunkSize - maxPatternSize + 1);

      // Detect patterns in this chunk
      const results = dropOverlapRepeats(
        candlestick.patternChain(toProcess, patternFns, {
          strict,
        }),
        globalOffset === 0,
      );

      // Enrich with metadata if requested
      const finalResults = enrichMetadata
        ? candlestick.metadata.enrichWithMetadata(results)
        : results;

      // Update state before callbacks so a throwing onMatch doesn't corrupt stream state
      const chunkOffset = globalOffset;
      buffer = overlap;
      globalOffset += chunkSize - maxPatternSize + 1;
      // Only the candles this iteration leaves behind are consumed; the last
      // maxPatternSize - 1 are carried into `overlap` and counted by the
      // iteration (or by end()) that finally consumes them.
      totalProcessed += chunkSize - maxPatternSize + 1;

      // Progress callback
      if (onProgress) {
        onProgress({
          processed: totalProcessed,
          matchesFound: finalResults.length,
        });
      }

      // Adjust indices to global offset and fire callbacks
      finalResults.forEach((result) => {
        result.index += chunkOffset;
        if (onMatch) {
          onMatch(result);
        }
      });
    }
  }

  /**
   * Process remaining data and finalize. Idempotent: the first call drains the
   * buffer and emits its matches, and later calls return the same summary
   * without re-emitting or firing onProgress again.
   * @return {Object} Summary statistics; `totalProcessed` equals the total
   *   candles passed to process(), counting the per-chunk overlap only once
   */
  function end() {
    if (ended) {
      return { ...endSummary };
    }

    const pending = buffer;
    let finalResults = [];
    if (pending.length > 0) {
      const results = dropOverlapRepeats(
        candlestick.patternChain(pending, patternFns, { strict }),
        globalOffset === 0,
      );
      finalResults = enrichMetadata
        ? candlestick.metadata.enrichWithMetadata(results)
        : results;
      totalProcessed += pending.length;
    }
    const endOffset = globalOffset;

    // Finalize state before any callback runs. A throwing onMatch must not
    // leave the stream drained but still accepting input: resuming without the
    // carry-over candles would silently miss patterns spanning that boundary.
    buffer = [];
    ended = true;
    endSummary = {
      totalProcessed,
      patternsDetected: patternFns.length,
    };

    // The completion signal must survive a throwing onMatch: consumers close
    // their sink on it, and the memoized early-return above means a retried
    // end() would never deliver it. Mirrors the guarantee added for #83.
    try {
      finalResults.forEach((result) => {
        result.index += endOffset;
        if (onMatch) {
          onMatch(result);
        }
      });
    } finally {
      if (onProgress) {
        onProgress({
          processed: totalProcessed,
          matchesFound: finalResults.length,
          complete: true,
        });
      }
    }

    // Hand back a copy: the memoized summary must survive a caller mutating it.
    return { ...endSummary };
  }

  /**
   * Reset the stream state
   */
  function reset() {
    buffer = [];
    globalOffset = 0;
    totalProcessed = 0;
    ended = false;
    endSummary = null;
  }

  return {
    process,
    end,
    reset,
  };
}

/**
 * Helper: Process large dataset in streaming fashion
 * @param {Array<Object>} data - Full dataset
 * @param {Object} options - Same as createStream options
 * @return {Array<Object>} All pattern matches
 */
function processLargeDataset(data, options = {}) {
  const results = [];
  const userOnMatch = options.onMatch;
  const stream = createStream({
    ...options,
    onMatch: (match) => {
      results.push(match);
      if (userOnMatch) userOnMatch(match);
    },
  });

  // Process in chunks
  const chunkSize = options.chunkSize || 1000;
  try {
    for (let i = 0; i < data.length; i += chunkSize) {
      stream.process(data.slice(i, i + chunkSize));
    }
  } finally {
    stream.end();
  }
  return results;
}

module.exports = {
  createStream,
  processLargeDataset,
};
