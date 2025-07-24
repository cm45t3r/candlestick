const hammer = require('./hammer.js');
const invertedHammer = require('./invertedHammer.js');
const engulfing = require('./engulfing.js');
const harami = require('./harami.js');
const kicker = require('./kicker.js');
const reversal = require('./reversal.js');
const doji = require('./doji.js');

const allPatterns = [
  { name: 'hammer', fn: hammer.hammer },
  { name: 'bullishHammer', fn: hammer.bullishHammer },
  { name: 'bearishHammer', fn: hammer.bearishHammer },
  { name: 'invertedHammer', fn: invertedHammer.invertedHammer },
  { name: 'bullishInvertedHammer', fn: invertedHammer.bullishInvertedHammer },
  { name: 'bearishInvertedHammer', fn: invertedHammer.bearishInvertedHammer },
  { name: 'bullishEngulfing', fn: engulfing.bullishEngulfing },
  { name: 'bearishEngulfing', fn: engulfing.bearishEngulfing },
  { name: 'bullishHarami', fn: harami.bullishHarami },
  { name: 'bearishHarami', fn: harami.bearishHarami },
  { name: 'bullishKicker', fn: kicker.bullishKicker },
  { name: 'bearishKicker', fn: kicker.bearishKicker },
  { name: 'hangingMan', fn: reversal.hangingMan },
  { name: 'shootingStar', fn: reversal.shootingStar },
  { name: 'doji', fn: doji.doji },
];

/**
 * Scans a candlestick series for a sequence of patterns.
 * @param {Array<Object>} candles - Array of candlesticks
 * @param {Array<{name: string, fn: function}>} patterns - Array of pattern objects
 * @returns {Array<{ index: number, pattern: string, match: Object|Array<Object> }>} Array of matches
 */
function patternChain(candles, patterns = allPatterns) {
  const results = [];
  for (const pattern of patterns) {
    const { name, fn, paramCount = 1 } = pattern;
    const indices = fn(candles);
    for (const idx of indices) {
      const match = candles.slice(idx, idx + paramCount);
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
