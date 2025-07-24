// hammer.js
// Hammer (Pinbar) pattern logic extracted from candlestick.js

const { bodyLen, wickLen, tailLen, isBullish, isBearish, findPattern } = require('./utils.js');

/**
 * Returns `true` if candle tail is at least 2x longer than body and wick is shorter than body (Hammer/Pinbar).
 * @param {Object} candlestick - { open, high, low, close }
 * @returns {boolean}
 */
function isHammer(candlestick) {
  const body = Math.abs(candlestick.open - candlestick.close);
  const lower = Math.min(candlestick.open, candlestick.close) - candlestick.low;
  const upper = candlestick.high - Math.max(candlestick.open, candlestick.close);
  const range = candlestick.high - candlestick.low;
  // Body in upper third, lower shadow at least 2x body, upper shadow small
  return (
    range > 0 &&
    lower >= 2 * body &&
    upper <= body &&
    (Math.max(candlestick.open, candlestick.close) > candlestick.low + range * 2 / 3)
  );
}

/**
 * Returns `true` if candle is bullish and it's a hammer (Bullish Pinbar).
 * @param {Object} candlestick - { open, high, low, close }
 * @returns {boolean}
 */
function isBullishHammer(candlestick) {
  return isBullish(candlestick) && isHammer(candlestick);
}

/**
 * Returns `true` if candle is bearish and it's a hammer (Bearish Pinbar).
 * @param {Object} candlestick - { open, high, low, close }
 * @returns {boolean}
 */
function isBearishHammer(candlestick) {
  return isBearish(candlestick) && isHammer(candlestick);
}

/**
 * Finds all Hammer (Pinbar) patterns in a series.
 * @param {Array<Object>} dataArray
 * @returns {Array<number>}
 */
function hammer(dataArray) {
  return findPattern(dataArray, isHammer);
}

/**
 * Finds all Bullish Hammer (Pinbar) patterns in a series.
 * @param {Array<Object>} dataArray
 * @returns {Array<number>}
 */
function bullishHammer(dataArray) {
  return findPattern(dataArray, isBullishHammer);
}

/**
 * Finds all Bearish Hammer (Pinbar) patterns in a series.
 * @param {Array<Object>} dataArray
 * @returns {Array<number>}
 */
function bearishHammer(dataArray) {
  return findPattern(dataArray, isBearishHammer);
}

module.exports = {
  isHammer,
  isBullishHammer,
  isBearishHammer,
  hammer,
  bullishHammer,
  bearishHammer,
}; 