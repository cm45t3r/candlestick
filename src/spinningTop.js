const { findPattern, precomputeCandleProps } = require("./utils.js");

/**
 * Spinning Top - A candlestick with a small body and long upper/lower shadows
 * Indicates indecision in the market
 *
 * Characteristics:
 * - Small body (< 30% of total range)
 * - Long upper and lower shadows
 * - Can be bullish or bearish, indicates potential reversal or consolidation
 *
 * @param {Object} candle - Candle with or without precomputed properties
 * @return {boolean} True if matches Spinning Top pattern
 */
function isSpinningTop(candle) {
  let c = candle;
  if (
    c.bodyLen === undefined ||
    c.wickLen === undefined ||
    c.tailLen === undefined
  ) {
    c = precomputeCandleProps([candle])[0];
  }

  const range = c.high - c.low;
  if (range === 0) return false;

  // Body should be small (< 30% of range)
  const bodyRatio = c.bodyLen / range;
  if (bodyRatio >= 0.3) return false;

  // Both shadows should be significant (each > 20% of range)
  const wickRatio = c.wickLen / range;
  const tailRatio = c.tailLen / range;

  if (wickRatio < 0.2 || tailRatio < 0.2) return false;

  return true;
}

/**
 * Bullish Spinning Top - Spinning top with bullish close
 */
function isBullishSpinningTop(candle) {
  let c = candle;
  if (c.isBullish === undefined) {
    c = precomputeCandleProps([candle])[0];
  }
  if (!c.isBullish) return false;
  return isSpinningTop(c);
}

/**
 * Bearish Spinning Top - Spinning top with bearish close
 */
function isBearishSpinningTop(candle) {
  let c = candle;
  if (c.isBearish === undefined) {
    c = precomputeCandleProps([candle])[0];
  }
  if (!c.isBearish) return false;
  return isSpinningTop(c);
}

/**
 * Find all Spinning Top patterns in array
 */
function spinningTop(dataArray) {
  const candles = precomputeCandleProps(dataArray);
  return findPattern(candles, isSpinningTop);
}

/**
 * Find all Bullish Spinning Top patterns in array
 */
function bullishSpinningTop(dataArray) {
  const candles = precomputeCandleProps(dataArray);
  return findPattern(candles, isBullishSpinningTop);
}

/**
 * Find all Bearish Spinning Top patterns in array
 */
function bearishSpinningTop(dataArray) {
  const candles = precomputeCandleProps(dataArray);
  return findPattern(candles, isBearishSpinningTop);
}

module.exports = {
  isSpinningTop,
  isBullishSpinningTop,
  isBearishSpinningTop,
  spinningTop,
  bullishSpinningTop,
  bearishSpinningTop,
};
