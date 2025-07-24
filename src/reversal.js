// reversal.js
// Hanging Man and Shooting Star pattern logic extracted from candlestick.js

const { isBullish, hasGapUp, findPattern } = require('./utils.js');
const { isBearishHammer } = require('./hammer.js');
const { isBearishInvertedHammer } = require('./invertedHammer.js');

/**
 * Returns true if a bullish candle is followed by a bearish hammer with a gap up (Hanging Man).
 * @param {Object} previous - { open, high, low, close }
 * @param {Object} current - { open, high, low, close }
 * @returns {boolean}
 */
function isHangingMan(previous, current) {
  return isBullish(previous) &&
    isBearishHammer(current) &&
    current.open > previous.high;
}

/**
 * Returns true if a bullish candle is followed by a bearish inverted hammer with a gap up (Shooting Star).
 * @param {Object} previous - { open, high, low, close }
 * @param {Object} current - { open, high, low, close }
 * @returns {boolean}
 */
function isShootingStar(previous, current) {
  return isBullish(previous) &&
    isBearishInvertedHammer(current) &&
    current.open > previous.high;
}

/**
 * Finds all Hanging Man patterns in a series.
 * @param {Array<Object>} dataArray
 * @returns {Array<number>}
 */
function hangingMan(dataArray) {
  return findPattern(dataArray, isHangingMan);
}

/**
 * Finds all Shooting Star patterns in a series.
 * @param {Array<Object>} dataArray
 * @returns {Array<number>}
 */
function shootingStar(dataArray) {
  return findPattern(dataArray, isShootingStar);
}

module.exports = {
  isHangingMan,
  isShootingStar,
  hangingMan,
  shootingStar,
}; 