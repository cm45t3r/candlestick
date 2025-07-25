const hammer = require('./hammer.js');
const invertedHammer = require('./invertedHammer.js');
const engulfing = require('./engulfing.js');
const harami = require('./harami.js');
const kicker = require('./kicker.js');
const reversal = require('./reversal.js');
const doji = require('./doji.js');

const allPatterns = [
  { name: 'hammer', fn: hammer.hammer, paramCount: 1 },
  { name: 'bullishHammer', fn: hammer.bullishHammer, paramCount: 1 },
  { name: 'bearishHammer', fn: hammer.bearishHammer, paramCount: 1 },
  { name: 'invertedHammer', fn: invertedHammer.invertedHammer, paramCount: 1 },
  { name: 'bullishInvertedHammer', fn: invertedHammer.bullishInvertedHammer, paramCount: 1 },
  { name: 'bearishInvertedHammer', fn: invertedHammer.bearishInvertedHammer, paramCount: 1 },
  { name: 'bullishEngulfing', fn: engulfing.bullishEngulfing, paramCount: 2 },
  { name: 'bearishEngulfing', fn: engulfing.bearishEngulfing, paramCount: 2 },
  { name: 'bullishHarami', fn: harami.bullishHarami, paramCount: 2 },
  { name: 'bearishHarami', fn: harami.bearishHarami, paramCount: 2 },
  { name: 'bullishKicker', fn: kicker.bullishKicker, paramCount: 2 },
  { name: 'bearishKicker', fn: kicker.bearishKicker, paramCount: 2 },
  { name: 'hangingMan', fn: reversal.hangingMan, paramCount: 2 },
  { name: 'shootingStar', fn: reversal.shootingStar, paramCount: 2 },
  { name: 'doji', fn: doji.doji, paramCount: 1 },
];

const { precomputeCandleProps } = require('./utils.js');

/**
 * Scans a candlestick series for a sequence of patterns.
 * @param {Array<Object>} candles - Array of candlesticks
 * @param {Array<{name: string, fn: function}>} patterns - Array of pattern objects
 * @returns {Array<{ index: number, pattern: string, match: Object|Array<Object> }>} Array of matches
 */
function patternChain(candles, patterns = allPatterns) {
  const precomputed = precomputeCandleProps(candles);
  const results = [];
  for (const pattern of patterns) {
    const { name, fn, paramCount = 1 } = pattern;
    const indices = fn(precomputed);
    for (const idx of indices) {
      const match = precomputed.slice(idx, idx + paramCount);
      results.push({ index: idx, pattern: name, match });
    }
  }
  // Sort by index for chronological order
  results.sort((a, b) => a.index - b.index);
  return results;
}

module.exports = {
  patternChain,
  allPatterns,
};
