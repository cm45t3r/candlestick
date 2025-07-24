// invertedHammer.js
// Inverted Hammer (Inverted Pinbar) pattern logic extracted from candlestick.js

const { findPattern, precomputeCandleProps } = require('./utils.js');

/**
 * Returns true if the candle is an Inverted Hammer (body in lower third, long upper shadow, small lower shadow).
 * @param {Object} candlestick - { open, high, low, close, bodyLen, wickLen, tailLen }
 * @return {boolean}
 */
function isInvertedHammer(candlestick) {
  let c = candlestick;
  if (c.bodyLen === undefined || c.wickLen === undefined || c.tailLen === undefined) {
    c = require('./utils.js').precomputeCandleProps([candlestick])[0];
  }
  const { bodyLen, tailLen, wickLen, high, low, open, close } = c;
  const range = high - low;
  const epsilon = 1e-8;
  // Body in lower third, upper shadow at least 2x body, lower shadow small
  return (
    range > 0 &&
    wickLen >= 2 * bodyLen &&
    tailLen <= bodyLen + epsilon &&
    (Math.min(open, close) <= high - range * 2 / 3 + epsilon)
  );
}

/**
 * Returns true if the candle is a Bullish Inverted Hammer (Inverted Hammer with bullish body).
 * @param {Object} candlestick
 * @return {boolean}
 */
function isBullishInvertedHammer(candlestick) {
  let c = candlestick;
  if (c.isBullish === undefined) {
    c = require('./utils.js').precomputeCandleProps([candlestick])[0];
  }
  return c.isBullish && isInvertedHammer(c);
}

/**
 * Returns true if the candle is a Bearish Inverted Hammer (Inverted Hammer with bearish body).
 * @param {Object} candlestick
 * @return {boolean}
 */
function isBearishInvertedHammer(candlestick) {
  let c = candlestick;
  if (c.isBearish === undefined) {
    c = require('./utils.js').precomputeCandleProps([candlestick])[0];
  }
  return c.isBearish && isInvertedHammer(c);
}

/**
 * Finds all Inverted Hammer patterns in a series.
 * @param {Array<Object>} dataArray
 * @return {Array<number>}
 */
function invertedHammer(dataArray) {
  const candles = precomputeCandleProps(dataArray);
  return findPattern(candles, isInvertedHammer);
}

/**
 * Finds all Bullish Inverted Hammer patterns in a series.
 * @param {Array<Object>} dataArray
 * @return {Array<number>}
 */
function bullishInvertedHammer(dataArray) {
  const candles = precomputeCandleProps(dataArray);
  return findPattern(candles, isBullishInvertedHammer);
}

/**
 * Finds all Bearish Inverted Hammer patterns in a series.
 * @param {Array<Object>} dataArray
 * @return {Array<number>}
 */
function bearishInvertedHammer(dataArray) {
  const candles = precomputeCandleProps(dataArray);
  return findPattern(candles, isBearishInvertedHammer);
}

module.exports = {
  isInvertedHammer,
  isBullishInvertedHammer,
  isBearishInvertedHammer,
  invertedHammer,
  bullishInvertedHammer,
  bearishInvertedHammer,
};
