// utils.js
// Utility functions extracted from candlestick.js

/**
 * Absolute distance between `open` and `close`.
 * @param {Object} candlestick - { open, close }
 * @return {number}
 */
function bodyLen(candlestick) {
  return Math.abs(candlestick.open - candlestick.close);
}

/**
 * Absolute distance between `open` and `high` on bearish candles or `close` and `high` on bullish candles.
 * @param {Object} candlestick - { open, high, close }
 * @return {number}
 */
function wickLen(candlestick) {
  return candlestick.high - Math.max(candlestick.open, candlestick.close);
}

/**
 * Absolute distance between `low` and `open` on bullish candles or `low` and `close` on bearish candles.
 * @param {Object} candlestick - { open, low, close }
 * @return {number}
 */
function tailLen(candlestick) {
  return Math.min(candlestick.open, candlestick.close) - candlestick.low;
}

/**
 * Returns `top` and `bottom` ends from a body.
 * @param {Object} candlestick - { open, close }
 * @return {Object} { bottom, top }
 */
function bodyEnds(candlestick) {
  return candlestick.open <= candlestick.close ?
    { bottom: candlestick.open, top: candlestick.close } :
    { bottom: candlestick.close, top: candlestick.open };
}

/**
 * Returns `true` if `close` is greater than `open` (bullish candle).
 * @param {Object} candlestick - { open, close }
 * @return {boolean}
 */
function isBullish(candlestick) {
  return candlestick.open < candlestick.close;
}

/**
 * Returns `true` if `close` is less than `open` (bearish candle).
 * @param {Object} candlestick - { open, close }
 * @return {boolean}
 */
function isBearish(candlestick) {
  return candlestick.open > candlestick.close;
}

/**
 * Returns `true` if previous top is less than current bottom (gap up).
 * @param {Object} previous - { open, close }
 * @param {Object} current - { open, close }
 * @return {boolean}
 */
function hasGapUp(previous, current) {
  return bodyEnds(previous).top < bodyEnds(current).bottom;
}

/**
 * Returns `true` if previous bottom is greater than current top (gap down).
 * @param {Object} previous - { open, close }
 * @param {Object} current - { open, close }
 * @return {boolean}
 */
function hasGapDown(previous, current) {
  return bodyEnds(previous).bottom > bodyEnds(current).top;
}

/**
 * Returns `true` if previous top is less or equal than current and bottom is greater or equal (engulfed body).
 * @param {Object} previous - { open, close }
 * @param {Object} current - { open, close }
 * @return {boolean}
 */
function isEngulfed(previous, current) {
  return bodyEnds(previous).top <= bodyEnds(current).top &&
    bodyEnds(previous).bottom >= bodyEnds(current).bottom;
}

/**
 * Generalized pattern search utility for arrays.
 * @param {Array} dataArray - Array of candlesticks
 * @param {Function} callback - Pattern function
 * @return {Array<number>} Indices where the pattern is found
 */
function findPattern(dataArray, callback) {
  const paramCount = callback.length;
  const upperBound = dataArray.length - paramCount;
  const results = [];
  for (let i = 0; i <= upperBound; i++) {
    const values = [];
    for (let j = 0; j < paramCount; j++) {
      values.push(dataArray[i + j]);
    }
    if (callback(...values)) {
      results.push(i);
    }
  }
  return results;
}

module.exports = {
  bodyLen,
  wickLen,
  tailLen,
  bodyEnds,
  isBullish,
  isBearish,
  hasGapUp,
  hasGapDown,
  findPattern,
  isEngulfed,
};
