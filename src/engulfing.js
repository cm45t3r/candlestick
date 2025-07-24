// engulfing.js
// Engulfing pattern logic extracted from candlestick.js

const { findPattern, precomputeCandleProps } = require('./utils.js');

/**
 * Returns true if the previous candle's body is engulfed by the current candle's body.
 * @param {Object} previous - { bodyEnds }
 * @param {Object} current - { bodyEnds }
 * @return {boolean}
 */
function isEngulfed(previous, current) {
  let p = previous, c = current;
  if (!p.bodyEnds || !c.bodyEnds) {
    [p, c] = require('./utils.js').precomputeCandleProps([previous, current]);
  }
  return p.bodyEnds.top <= c.bodyEnds.top &&
    p.bodyEnds.bottom >= c.bodyEnds.bottom;
}

/**
 * Returns true if a bearish candle is followed by a bullish candle that engulfs the previous body (Bullish Engulfing).
 * @param {Object} previous
 * @param {Object} current
 * @return {boolean}
 */
function isBullishEngulfing(previous, current) {
  let p = previous, c = current;
  if (p.isBearish === undefined || c.isBullish === undefined) {
    [p, c] = require('./utils.js').precomputeCandleProps([previous, current]);
  }
  return p.isBearish && c.isBullish && isEngulfed(p, c);
}

/**
 * Returns true if a bullish candle is followed by a bearish candle that engulfs the previous body (Bearish Engulfing).
 * @param {Object} previous
 * @param {Object} current
 * @return {boolean}
 */
function isBearishEngulfing(previous, current) {
  let p = previous, c = current;
  if (p.isBullish === undefined || c.isBearish === undefined) {
    [p, c] = require('./utils.js').precomputeCandleProps([previous, current]);
  }
  return p.isBullish && c.isBearish && isEngulfed(p, c);
}

/**
 * Finds all Bullish Engulfing patterns in a series.
 * @param {Array<Object>} dataArray
 * @return {Array<number>}
 */
function bullishEngulfing(dataArray) {
  const candles = precomputeCandleProps(dataArray);
  return findPattern(candles, isBullishEngulfing);
}

/**
 * Finds all Bearish Engulfing patterns in a series.
 * @param {Array<Object>} dataArray
 * @return {Array<number>}
 */
function bearishEngulfing(dataArray) {
  const candles = precomputeCandleProps(dataArray);
  return findPattern(candles, isBearishEngulfing);
}

module.exports = {
  isEngulfed,
  isBullishEngulfing,
  isBearishEngulfing,
  bullishEngulfing,
  bearishEngulfing,
};
