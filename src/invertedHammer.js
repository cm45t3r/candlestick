// invertedHammer.js
// Inverted Hammer (Inverted Pinbar) pattern logic extracted from candlestick.js

const { bodyLen, wickLen, tailLen, isBullish, isBearish, findPattern } = require('./utils.js');

/**
 * Returns true if the candle is an Inverted Hammer (body in lower third, long upper shadow, small lower shadow).
 * @param {Object} candlestick - { open, high, low, close }
 * @returns {boolean}
 */
function isInvertedHammer(candlestick) {
  const body = Math.abs(candlestick.open - candlestick.close);
  const lower = Math.min(candlestick.open, candlestick.close) - candlestick.low;
  const upper = candlestick.high - Math.max(candlestick.open, candlestick.close);
  const range = candlestick.high - candlestick.low;
  const epsilon = 1e-8;
  // Body in lower third, upper shadow at least 2x body, lower shadow small
  return (
    range > 0 &&
    upper >= 2 * body &&
    lower <= body + epsilon &&
    (Math.min(candlestick.open, candlestick.close) <= candlestick.high - range * 2 / 3 + epsilon)
  );
}

/**
 * Returns true if the candle is a Bullish Inverted Hammer (Inverted Hammer with bullish body).
 * @param {Object} candlestick - { open, high, low, close }
 * @returns {boolean}
 */
function isBullishInvertedHammer(candlestick) {
  return isBullish(candlestick) && isInvertedHammer(candlestick);
}

/**
 * Returns true if the candle is a Bearish Inverted Hammer (Inverted Hammer with bearish body).
 * @param {Object} candlestick - { open, high, low, close }
 * @returns {boolean}
 */
function isBearishInvertedHammer(candlestick) {
  return isBearish(candlestick) && isInvertedHammer(candlestick);
}

/**
 * Finds all Inverted Hammer patterns in a series.
 * @param {Array<Object>} dataArray
 * @returns {Array<number>}
 */
function invertedHammer(dataArray) {
  return findPattern(dataArray, isInvertedHammer);
}

/**
 * Finds all Bullish Inverted Hammer patterns in a series.
 * @param {Array<Object>} dataArray
 * @returns {Array<number>}
 */
function bullishInvertedHammer(dataArray) {
  return findPattern(dataArray, isBullishInvertedHammer);
}

/**
 * Finds all Bearish Inverted Hammer patterns in a series.
 * @param {Array<Object>} dataArray
 * @returns {Array<number>}
 */
function bearishInvertedHammer(dataArray) {
  return findPattern(dataArray, isBearishInvertedHammer);
}

module.exports = {
  isInvertedHammer,
  isBullishInvertedHammer,
  isBearishInvertedHammer,
  invertedHammer,
  bullishInvertedHammer,
  bearishInvertedHammer,
};