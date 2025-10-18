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
  } = options;

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
  }

  // State
  let buffer = [];
  let globalOffset = 0;
  let totalProcessed = 0;
  const maxPatternSize = Math.max(...patternFns.map((p) => p.paramCount || 1));

  /**
   * Process a chunk of data
   * @param {Array<Object>} chunk - Array of OHLC objects
   */
  function process(chunk) {
    if (!Array.isArray(chunk) || chunk.length === 0) {
      return;
    }

    // Add to buffer
    buffer = buffer.concat(chunk);

    // Process buffer if it's large enough
    while (buffer.length >= chunkSize + maxPatternSize) {
      const toProcess = buffer.slice(0, chunkSize);
      const overlap = buffer.slice(chunkSize - maxPatternSize + 1);

      // Detect patterns in this chunk
      const results = candlestick.patternChain(toProcess, patternFns);

      // Enrich with metadata if requested
      const finalResults = enrichMetadata
        ? candlestick.metadata.enrichWithMetadata(results)
        : results;

      // Adjust indices to global offset
      finalResults.forEach((result) => {
        result.index += globalOffset;

        if (onMatch) {
          onMatch(result);
        }
      });

      // Update state
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
      const results = candlestick.patternChain(buffer, patternFns);
      const finalResults = enrichMetadata
        ? candlestick.metadata.enrichWithMetadata(results)
        : results;

      finalResults.forEach((result) => {
        result.index += globalOffset;
        finalMatches++;

        if (onMatch) {
          onMatch(result);
        }
      });

      totalProcessed += buffer.length;
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
  const stream = createStream({
    ...options,
    onMatch: (match) => results.push(match),
  });

  // Process in chunks
  const chunkSize = options.chunkSize || 1000;
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    stream.process(chunk);
  }

  stream.end();
  return results;
}

module.exports = {
  createStream,
  processLargeDataset,
};
