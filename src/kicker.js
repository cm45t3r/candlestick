// kicker.js
// Kicker pattern logic extracted from candlestick.js

const { isBullish, isBearish, hasGapUp, hasGapDown, bodyEnds, bodyLen, wickLen, tailLen, findPattern } = require('./utils.js');
const { isHammer } = require('./hammer.js');
const { isInvertedHammer } = require('./invertedHammer.js');

/**
 * Returns true if a bearish candle is followed by a bullish candle with a gap up (not a hammer or inverted hammer). (Bullish Kicker)
 * @param {Object} previous - { open, high, low, close }
 * @param {Object} current - { open, high, low, close }
 * @returns {boolean}
 */
function isBullishKicker(previous, current) {
  return isBearish(previous) &&
    isBullish(current) &&
    hasGapUp(previous, current) &&
    !(isHammer(current) || isInvertedHammer(current));
}

/**
 * Returns true if a bullish candle is followed by a bearish candle with a gap down (not a hammer or inverted hammer). (Bearish Kicker)
 * @param {Object} previous - { open, high, low, close }
 * @param {Object} current - { open, high, low, close }
 * @returns {boolean}
 */
function isBearishKicker(previous, current) {
  return isBullish(previous) &&
    isBearish(current) &&
    hasGapDown(previous, current) &&
    !(isHammer(current) || isInvertedHammer(current));
}

/**
 * Finds all Bullish Kicker patterns in a series.
 * @param {Array<Object>} dataArray
 * @returns {Array<number>}
 */
function bullishKicker(dataArray) {
  return findPattern(dataArray, isBullishKicker);
}

/**
 * Finds all Bearish Kicker patterns in a series.
 * @param {Array<Object>} dataArray
 * @returns {Array<number>}
 */
function bearishKicker(dataArray) {
  return findPattern(dataArray, isBearishKicker);
}

module.exports = {
  isBullishKicker,
  isBearishKicker,
  bullishKicker,
  bearishKicker,
}; 