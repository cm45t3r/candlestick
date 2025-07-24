// doji.js
// Doji pattern detection module

const { bodyLen, findPattern } = require('./utils.js');

/**
 * Returns true if the candlestick is a Doji (body is very small compared to the range, indicating indecision).
 * @param {Object} candlestick - { open, high, low, close }
 * @return {boolean}
 */
function isDoji(candlestick) {
  const range = candlestick.high - candlestick.low;
  // Body is less than 10% of the range, and range is not zero
  return range > 0 && bodyLen(candlestick) / range < 0.1;
}

/**
 * Finds all Doji patterns in a series.
 * @param {Array<Object>} dataArray
 * @return {Array<number>}
 */
function doji(dataArray) {
  return findPattern(dataArray, isDoji);
}

module.exports = {
  isDoji,
  doji,
};
