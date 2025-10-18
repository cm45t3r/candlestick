const { findPattern, precomputeCandleProps } = require("./utils.js");

/**
 * Marubozu - A candlestick with a long body and little to no shadows/wicks
 * Represents strong buying (bullish) or selling (bearish) pressure
 *
 * Bullish Marubozu: Opens at low, closes at high (strong uptrend)
 * Bearish Marubozu: Opens at high, closes at low (strong downtrend)
 *
 * @param {Object} candle - Candle with or without precomputed properties
 * @return {boolean} True if matches Marubozu pattern
 */
function isMarubozu(candle) {
  let c = candle;
  if (
    c.bodyLen === undefined ||
    c.wickLen === undefined ||
    c.tailLen === undefined
  ) {
    c = precomputeCandleProps([candle])[0];
  }

  // Body must be at least 70% of total range
  const range = c.high - c.low;
  if (range === 0) return false;

  const bodyRatio = c.bodyLen / range;
  if (bodyRatio < 0.7) return false;

  // Shadows should be minimal (< 10% of body each)
  const maxShadow = c.bodyLen * 0.1;
  if (c.wickLen > maxShadow || c.tailLen > maxShadow) return false;

  return true;
}

/**
 * Bullish Marubozu - Strong bullish candle
 * Opens near low, closes near high
 */
function isBullishMarubozu(candle) {
  let c = candle;
  if (c.isBullish === undefined) {
    c = precomputeCandleProps([candle])[0];
  }
  if (!c.isBullish) return false;
  return isMarubozu(c);
}

/**
 * Bearish Marubozu - Strong bearish candle
 * Opens near high, closes near low
 */
function isBearishMarubozu(candle) {
  let c = candle;
  if (c.isBearish === undefined) {
    c = precomputeCandleProps([candle])[0];
  }
  if (!c.isBearish) return false;
  return isMarubozu(c);
}

/**
 * Find all Marubozu patterns in array
 */
function marubozu(dataArray) {
  const candles = precomputeCandleProps(dataArray);
  return findPattern(candles, isMarubozu);
}

/**
 * Find all Bullish Marubozu patterns in array
 */
function bullishMarubozu(dataArray) {
  const candles = precomputeCandleProps(dataArray);
  return findPattern(candles, isBullishMarubozu);
}

/**
 * Find all Bearish Marubozu patterns in array
 */
function bearishMarubozu(dataArray) {
  const candles = precomputeCandleProps(dataArray);
  return findPattern(candles, isBearishMarubozu);
}

module.exports = {
  isMarubozu,
  isBullishMarubozu,
  isBearishMarubozu,
  marubozu,
  bullishMarubozu,
  bearishMarubozu,
};
