// hammer.js
// Hammer (Pinbar) pattern logic extracted from candlestick.js

const { findPattern, precomputeCandleProps } = require("./utils.js");

/**
 * Returns true if the candle is a Hammer (body in upper third, long lower shadow, small upper shadow).
 * @param {Object} candlestick - { open, high, low, close, bodyLen, wickLen, tailLen }
 * @return {boolean}
 */
function isHammer(candlestick) {
  let c = candlestick;
  if (
    c.bodyLen === undefined ||
    c.wickLen === undefined ||
    c.tailLen === undefined
  ) {
    c = precomputeCandleProps([candlestick])[0];
  }
  const { bodyLen, tailLen, wickLen, high, low, open, close } = c;
  const range = high - low;
  // Body in upper third, lower shadow at least 2x body, upper shadow small
  return (
    range > 0 &&
    tailLen >= 2 * bodyLen &&
    wickLen <= bodyLen &&
    Math.max(open, close) > low + (range * 2) / 3
  );
}

/**
 * Returns true if the candle is a Bullish Hammer (Hammer with bullish body).
 * @param {Object} candlestick
 * @return {boolean}
 */
function isBullishHammer(candlestick) {
  let c = candlestick;
  if (c.isBullish === undefined) {
    c = precomputeCandleProps([candlestick])[0];
  }
  return c.isBullish && isHammer(c);
}

/**
 * Returns true if the candle is a Bearish Hammer (Hammer with bearish body).
 * @param {Object} candlestick
 * @return {boolean}
 */
function isBearishHammer(candlestick) {
  let c = candlestick;
  if (c.isBearish === undefined) {
    c = precomputeCandleProps([candlestick])[0];
  }
  return c.isBearish && isHammer(c);
}

/**
 * Finds all Hammer patterns in a series.
 * @param {Array<Object>} dataArray
 * @return {Array<number>}
 */
function hammer(dataArray) {
  const candles = precomputeCandleProps(dataArray);
  return findPattern(candles, isHammer);
}

/**
 * Finds all Bullish Hammer patterns in a series.
 * @param {Array<Object>} dataArray
 * @return {Array<number>}
 */
function bullishHammer(dataArray) {
  const candles = precomputeCandleProps(dataArray);
  return findPattern(candles, isBullishHammer);
}

/**
 * Finds all Bearish Hammer patterns in a series.
 * @param {Array<Object>} dataArray
 * @return {Array<number>}
 */
function bearishHammer(dataArray) {
  const candles = precomputeCandleProps(dataArray);
  return findPattern(candles, isBearishHammer);
}

module.exports = {
  isHammer,
  isBullishHammer,
  isBearishHammer,
  hammer,
  bullishHammer,
  bearishHammer,
};
