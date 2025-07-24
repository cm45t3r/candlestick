// engulfing.js
// Engulfing pattern logic extracted from candlestick.js

const { bodyEnds, isBullish, isBearish, findPattern } = require('./utils.js');

/**
 * Returns true if the previous candle's body is engulfed by the current candle's body.
 * @param {Object} previous - { open, close }
 * @param {Object} current - { open, close }
 * @returns {boolean}
 */
function isEngulfed(previous, current) {
  return bodyEnds(previous).top <= bodyEnds(current).top &&
    bodyEnds(previous).bottom >= bodyEnds(current).bottom;
}

/**
 * Returns true if a bearish candle is followed by a bullish candle that engulfs the previous body (Bullish Engulfing).
 * @param {Object} previous - { open, high, low, close }
 * @param {Object} current - { open, high, low, close }
 * @returns {boolean}
 */
function isBullishEngulfing(previous, current) {
  return isBearish(previous) &&
    isBullish(current) &&
    isEngulfed(previous, current);
}

/**
 * Returns true if a bullish candle is followed by a bearish candle that engulfs the previous body (Bearish Engulfing).
 * @param {Object} previous - { open, high, low, close }
 * @param {Object} current - { open, high, low, close }
 * @returns {boolean}
 */
function isBearishEngulfing(previous, current) {
  return isBullish(previous) &&
    isBearish(current) &&
    isEngulfed(previous, current);
}

/**
 * Finds all Bullish Engulfing patterns in a series.
 * @param {Array<Object>} dataArray
 * @returns {Array<number>}
 */
function bullishEngulfing(dataArray) {
  return findPattern(dataArray, isBullishEngulfing);
}

/**
 * Finds all Bearish Engulfing patterns in a series.
 * @param {Array<Object>} dataArray
 * @returns {Array<number>}
 */
function bearishEngulfing(dataArray) {
  return findPattern(dataArray, isBearishEngulfing);
}

module.exports = {
  isEngulfed,
  isBullishEngulfing,
  isBearishEngulfing,
  bullishEngulfing,
  bearishEngulfing,
}; 