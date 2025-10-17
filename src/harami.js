// harami.js
// Harami pattern logic extracted from candlestick.js

const {
  isEngulfed,
  findPattern,
  precomputeCandleProps,
} = require("./utils.js");

/**
 * Returns true if a bearish candle is followed by a smaller bullish candle inside the previous body (Bullish Harami).
 * @param {Object} previous
 * @param {Object} current
 * @return {boolean}
 */
function isBullishHarami(previous, current) {
  let p = previous,
    c = current;
  if (p.isBearish === undefined || c.isBullish === undefined) {
    [p, c] = require("./utils.js").precomputeCandleProps([previous, current]);
  }
  return p.isBearish && c.isBullish && isEngulfed(c, p);
}

/**
 * Returns true if a bullish candle is followed by a smaller bearish candle inside the previous body (Bearish Harami).
 * @param {Object} previous
 * @param {Object} current
 * @return {boolean}
 */
function isBearishHarami(previous, current) {
  let p = previous,
    c = current;
  if (p.isBullish === undefined || c.isBearish === undefined) {
    [p, c] = require("./utils.js").precomputeCandleProps([previous, current]);
  }
  return p.isBullish && c.isBearish && isEngulfed(c, p);
}

/**
 * Finds all Bullish Harami patterns in a series.
 * @param {Array<Object>} dataArray
 * @return {Array<number>}
 */
function bullishHarami(dataArray) {
  const candles = precomputeCandleProps(dataArray);
  return findPattern(candles, isBullishHarami);
}

/**
 * Finds all Bearish Harami patterns in a series.
 * @param {Array<Object>} dataArray
 * @return {Array<number>}
 */
function bearishHarami(dataArray) {
  const candles = precomputeCandleProps(dataArray);
  return findPattern(candles, isBearishHarami);
}

module.exports = {
  isBullishHarami,
  isBearishHarami,
  bullishHarami,
  bearishHarami,
};
