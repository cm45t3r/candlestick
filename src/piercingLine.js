// piercingLine.js
// Piercing Line pattern detection module (bullish reversal)

const { findPattern, precomputeCandleProps } = require("./utils.js");

/**
 * Returns true if the pattern is a Piercing Line (bullish reversal).
 * Piercing Line:
 * 1. First candle: Bearish candle
 * 2. Second candle: Bullish candle that opens below first's low, closes above first's midpoint
 *
 * @param {Object} first - First candlestick (bearish)
 * @param {Object} second - Second candlestick (bullish)
 * @return {boolean}
 */
function isPiercingLine(first, second) {
  let c1 = first,
    c2 = second;
  if (c1.bodyLen === undefined || c2.bodyLen === undefined) {
    [c1, c2] = precomputeCandleProps([first, second]);
  }

  // First candle must be bearish with significant body
  if (!c1.isBearish) return false;
  const range1 = c1.high - c1.low;
  if (range1 === 0 || c1.bodyLen < range1 * 0.5) return false;

  // Second candle must be bullish
  if (!c2.isBullish) return false;
  const range2 = c2.high - c2.low;
  if (range2 === 0 || c2.bodyLen < range2 * 0.5) return false;

  // Second candle opens below first candle's low (gap down)
  if (c2.open >= c1.low) return false;

  // Second candle closes above midpoint of first candle's body
  const firstBodyMidpoint = (c1.bodyEnds.top + c1.bodyEnds.bottom) / 2;
  if (c2.close <= firstBodyMidpoint) return false;

  // Second candle should not close above first candle's open
  if (c2.close >= c1.bodyEnds.top) return false;

  return true;
}

/**
 * Finds all Piercing Line patterns in a series.
 * @param {Array<Object>} dataArray
 * @return {Array<number>}
 */
function piercingLine(dataArray) {
  const candles = precomputeCandleProps(dataArray);
  return findPattern(candles, isPiercingLine);
}

module.exports = {
  isPiercingLine,
  piercingLine,
};
