// darkCloudCover.js
// Dark Cloud Cover pattern detection module (bearish reversal)

const { findPattern, precomputeCandleProps } = require("./utils.js");

/**
 * Returns true if the pattern is a Dark Cloud Cover (bearish reversal).
 * Dark Cloud Cover:
 * 1. First candle: Bullish candle
 * 2. Second candle: Bearish candle that opens above first's high, closes below first's midpoint
 *
 * @param {Object} first - First candlestick (bullish)
 * @param {Object} second - Second candlestick (bearish)
 * @return {boolean}
 */
function isDarkCloudCover(first, second) {
  let c1 = first,
    c2 = second;
  if (c1.bodyLen === undefined || c2.bodyLen === undefined) {
    [c1, c2] = precomputeCandleProps([first, second]);
  }

  // First candle must be bullish with significant body
  if (!c1.isBullish) return false;
  const range1 = c1.high - c1.low;
  if (range1 === 0 || c1.bodyLen < range1 * 0.5) return false;

  // Second candle must be bearish
  if (!c2.isBearish) return false;
  const range2 = c2.high - c2.low;
  if (range2 === 0 || c2.bodyLen < range2 * 0.5) return false;

  // Second candle opens above first candle's high (gap up)
  if (c2.open <= c1.high) return false;

  // Second candle closes below midpoint of first candle's body
  const firstBodyMidpoint = (c1.bodyEnds.top + c1.bodyEnds.bottom) / 2;
  if (c2.close >= firstBodyMidpoint) return false;

  // Second candle should not close below first candle's open
  if (c2.close <= c1.bodyEnds.bottom) return false;

  return true;
}

/**
 * Finds all Dark Cloud Cover patterns in a series.
 * @param {Array<Object>} dataArray
 * @return {Array<number>}
 */
function darkCloudCover(dataArray) {
  const candles = precomputeCandleProps(dataArray);
  return findPattern(candles, isDarkCloudCover);
}

module.exports = {
  isDarkCloudCover,
  darkCloudCover,
};
