const { precomputeCandleProps, findPattern } = require("./utils.js");

/**
 * Tweezers Top - Two candles with matching or near-matching highs
 * Indicates potential bearish reversal
 *
 * @param {Object} first - First candle
 * @param {Object} second - Second candle
 * @return {boolean} True if matches Tweezers Top pattern
 */
function isTweezersTop(first, second) {
  let f = first,
    s = second;
  if (f.isBullish === undefined || s.isBearish === undefined) {
    [f, s] = precomputeCandleProps([first, second]);
  }

  // Highs should be very close (within 1% of range)
  const avgRange = (f.high - f.low + (s.high - s.low)) / 2;
  if (avgRange === 0) return false;

  const highDiff = Math.abs(f.high - s.high);
  const tolerance = avgRange * 0.01; // 1% tolerance

  if (highDiff > tolerance) return false;

  // First candle should be bullish (uptrend)
  if (!f.isBullish) return false;

  // Second candle should be bearish (reversal)
  if (!s.isBearish) return false;

  // Both candles should have significant bodies
  const firstBodyRatio = f.bodyLen / (f.high - f.low);
  const secondBodyRatio = s.bodyLen / (s.high - s.low);

  if (firstBodyRatio < 0.4 || secondBodyRatio < 0.4) return false;

  return true;
}

/**
 * Tweezers Bottom - Two candles with matching or near-matching lows
 * Indicates potential bullish reversal
 *
 * @param {Object} first - First candle
 * @param {Object} second - Second candle
 * @return {boolean} True if matches Tweezers Bottom pattern
 */
function isTweezersBottom(first, second) {
  let f = first,
    s = second;
  if (f.isBearish === undefined || s.isBullish === undefined) {
    [f, s] = precomputeCandleProps([first, second]);
  }

  // Lows should be very close (within 1% of range)
  const avgRange = (f.high - f.low + (s.high - s.low)) / 2;
  if (avgRange === 0) return false;

  const lowDiff = Math.abs(f.low - s.low);
  const tolerance = avgRange * 0.01; // 1% tolerance

  if (lowDiff > tolerance) return false;

  // First candle should be bearish (downtrend)
  if (!f.isBearish) return false;

  // Second candle should be bullish (reversal)
  if (!s.isBullish) return false;

  // Both candles should have significant bodies
  const firstBodyRatio = f.bodyLen / (f.high - f.low);
  const secondBodyRatio = s.bodyLen / (s.high - s.low);

  if (firstBodyRatio < 0.4 || secondBodyRatio < 0.4) return false;

  return true;
}

/**
 * Generic Tweezers - Detects both top and bottom
 */
function isTweezers(first, second) {
  return isTweezersTop(first, second) || isTweezersBottom(first, second);
}

/**
 * Find all Tweezers Top patterns in array
 */
function tweezersTop(dataArray) {
  const candles = precomputeCandleProps(dataArray);
  return findPattern(candles, isTweezersTop);
}

/**
 * Find all Tweezers Bottom patterns in array
 */
function tweezersBottom(dataArray) {
  const candles = precomputeCandleProps(dataArray);
  return findPattern(candles, isTweezersBottom);
}

/**
 * Find all Tweezers patterns (top or bottom) in array
 */
function tweezers(dataArray) {
  const candles = precomputeCandleProps(dataArray);
  return findPattern(candles, isTweezers);
}

module.exports = {
  isTweezers,
  isTweezersTop,
  isTweezersBottom,
  tweezers,
  tweezersTop,
  tweezersBottom,
};
