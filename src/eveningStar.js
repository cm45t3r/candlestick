// eveningStar.js
// Evening Star pattern detection module

const { findPattern, precomputeCandleProps } = require("./utils.js");

/**
 * Returns true if the pattern is an Evening Star (bearish reversal).
 * Evening Star:
 * 1. First candle: Long bullish candle
 * 2. Second candle: Small body (star) that gaps up
 * 3. Third candle: Long bearish candle that closes well into first candle's body
 *
 * @param {Object} first - First candlestick (bullish)
 * @param {Object} second - Second candlestick (small body, star)
 * @param {Object} third - Third candlestick (bearish)
 * @return {boolean}
 */
function isEveningStar(first, second, third) {
  let c1 = first,
    c2 = second,
    c3 = third;
  if (
    c1.bodyLen === undefined ||
    c2.bodyLen === undefined ||
    c3.bodyLen === undefined
  ) {
    [c1, c2, c3] = precomputeCandleProps([first, second, third]);
  }

  // First candle must be bullish with significant body
  if (!c1.isBullish) return false;
  const range1 = c1.high - c1.low;
  if (range1 === 0 || c1.bodyLen < range1 * 0.6) return false;

  // Second candle must have small body (indecision)
  const range2 = c2.high - c2.low;
  if (range2 === 0 || c2.bodyLen > range2 * 0.3) return false;

  // Second candle should gap up from first
  if (c2.bodyEnds.bottom <= c1.bodyEnds.top) return false;

  // Third candle must be bearish with significant body
  if (!c3.isBearish) return false;
  const range3 = c3.high - c3.low;
  if (range3 === 0 || c3.bodyLen < range3 * 0.6) return false;

  // Third candle should close well into first candle's body (at least 50%)
  const firstBodyMidpoint = (c1.bodyEnds.top + c1.bodyEnds.bottom) / 2;
  if (c3.close > firstBodyMidpoint) return false;

  return true;
}

/**
 * Finds all Evening Star patterns in a series.
 * @param {Array<Object>} dataArray
 * @return {Array<number>}
 */
function eveningStar(dataArray) {
  const candles = precomputeCandleProps(dataArray);
  return findPattern(candles, isEveningStar);
}

module.exports = {
  isEveningStar,
  eveningStar,
};
