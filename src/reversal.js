// reversal.js
// Hanging Man and Shooting Star pattern logic extracted from candlestick.js

const { findPattern, precomputeCandleProps } = require('./utils.js');
const { isBearishHammer } = require('./hammer.js');
const { isBearishInvertedHammer } = require('./invertedHammer.js');

/**
 * Returns true if a bullish candle is followed by a bearish hammer with a gap up (Hanging Man).
 * @param {Object} previous
 * @param {Object} current
 * @return {boolean}
 */
function isHangingMan(previous, current) {
  let p = previous, c = current;
  if (p.isBullish === undefined) {
    [p, c] = require('./utils.js').precomputeCandleProps([previous, current]);
  }
  return p.isBullish && isBearishHammer(c) && c.open > p.high;
}

/**
 * Returns true if a bullish candle is followed by a bearish inverted hammer with a gap up (Shooting Star).
 * @param {Object} previous
 * @param {Object} current
 * @return {boolean}
 */
function isShootingStar(previous, current) {
  let p = previous, c = current;
  if (p.isBullish === undefined) {
    [p, c] = require('./utils.js').precomputeCandleProps([previous, current]);
  }
  return p.isBullish && isBearishInvertedHammer(c) && c.open > p.high;
}

/**
 * Finds all Hanging Man patterns in a series.
 * @param {Array<Object>} dataArray
 * @return {Array<number>}
 */
function hangingMan(dataArray) {
  const candles = precomputeCandleProps(dataArray);
  return findPattern(candles, isHangingMan);
}

/**
 * Finds all Shooting Star patterns in a series.
 * @param {Array<Object>} dataArray
 * @return {Array<number>}
 */
function shootingStar(dataArray) {
  const candles = precomputeCandleProps(dataArray);
  return findPattern(candles, isShootingStar);
}

module.exports = {
  isHangingMan,
  isShootingStar,
  hangingMan,
  shootingStar,
};
