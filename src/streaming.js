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
  const maxPatternSize = Math.max(...patternFns.map((p) => p.paramCount || 1));
  const paramCountByName = new Map(
    patternFns.map((p) => [p.name, p.paramCount || 1]),
  );

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
      (r) => r.index >= maxPatternSize - (paramCountByName.get(r.pattern) || 1),
    );
  }

  /**
   * Process a chunk of data
   * @param {Array<Object>} chunk - Array of OHLC objects
   */
  function process(chunk) {
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
      totalProcessed += toProcess.length;

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
   * Process remaining data and finalize
   * @return {Object} Summary statistics
   */
  function end() {
    let finalMatches = 0;

    // Process remaining buffer
    if (buffer.length > 0) {
      const results = dropOverlapRepeats(
        candlestick.patternChain(buffer, patternFns, { strict }),
        globalOffset === 0,
      );
      const finalResults = enrichMetadata
        ? candlestick.metadata.enrichWithMetadata(results)
        : results;

      const endOffset = globalOffset;
      totalProcessed += buffer.length;
      finalMatches = finalResults.length;

      finalResults.forEach((result) => {
        result.index += endOffset;
        if (onMatch) {
          onMatch(result);
        }
      });
    }

    // Final progress
    if (onProgress) {
      onProgress({
        processed: totalProcessed,
        matchesFound: finalMatches,
        complete: true,
      });
    }

    // Return summary
    return {
      totalProcessed,
      patternsDetected: patternFns.length,
    };
  }

  /**
   * Reset the stream state
   */
  function reset() {
    buffer = [];
    globalOffset = 0;
    totalProcessed = 0;
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
