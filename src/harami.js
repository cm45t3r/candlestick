// harami.js
// Harami pattern logic extracted from candlestick.js

const { isBullish, isBearish, isEngulfed, findPattern } = require('./utils.js');

/**
 * Returns true if a bearish candle is followed by a smaller bullish candle inside the previous body (Bullish Harami).
 * @param {Object} previous - { open, high, low, close }
 * @param {Object} current - { open, high, low, close }
 * @return {boolean}
 */
function isBullishHarami(previous, current) {
  return isBearish(previous) &&
    isBullish(current) &&
    isEngulfed(current, previous);
}

/**
 * Returns true if a bullish candle is followed by a smaller bearish candle inside the previous body (Bearish Harami).
 * @param {Object} previous - { open, high, low, close }
 * @param {Object} current - { open, high, low, close }
 * @return {boolean}
 */
function isBearishHarami(previous, current) {
  return isBullish(previous) &&
    isBearish(current) &&
    isEngulfed(current, previous);
}

/**
 * Finds all Bullish Harami patterns in a series.
 * @param {Array<Object>} dataArray
 * @return {Array<number>}
 */
function bullishHarami(dataArray) {
  return findPattern(dataArray, isBullishHarami);
}

/**
 * Finds all Bearish Harami patterns in a series.
 * @param {Array<Object>} dataArray
 * @return {Array<number>}
 */
function bearishHarami(dataArray) {
  return findPattern(dataArray, isBearishHarami);
}

module.exports = {
  isBullishHarami,
  isBearishHarami,
  bullishHarami,
  bearishHarami,
};
