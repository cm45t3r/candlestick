// doji.js
// Doji pattern detection module

const { findPattern, precomputeCandleProps } = require("./utils.js");

/**
 * Returns true if the candlestick is a Doji (body is very small compared to the range, indicating indecision).
 * @param {Object} candlestick - { open, high, low, close, bodyLen }
 * @return {boolean}
 */
function isDoji(candlestick) {
  let c = candlestick;
  if (c.bodyLen === undefined) {
    c = require("./utils.js").precomputeCandleProps([candlestick])[0];
  }
  const { high, low, bodyLen } = c;
  const range = high - low;
  // Body is less than 10% of the range, and range is not zero
  return range > 0 && bodyLen / range < 0.1;
}

/**
 * Finds all Doji patterns in a series.
 * @param {Array<Object>} dataArray
 * @return {Array<number>}
 */
function doji(dataArray) {
  const candles = precomputeCandleProps(dataArray);
  return findPattern(candles, isDoji);
}

module.exports = {
  isDoji,
  doji,
};
