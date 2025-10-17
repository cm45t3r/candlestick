// threeWhiteSoldiers.js
// Three White Soldiers pattern detection module

const { findPattern, precomputeCandleProps } = require("./utils.js");

/**
 * Returns true if the pattern is Three White Soldiers (bullish continuation/reversal).
 * Three White Soldiers:
 * - Three consecutive bullish candles
 * - Each candle opens within the previous candle's body
 * - Each candle closes higher than the previous
 * - Each candle has a significant body
 * - Limited upper shadows
 *
 * @param {Object} first - First candlestick
 * @param {Object} second - Second candlestick
 * @param {Object} third - Third candlestick
 * @return {boolean}
 */
function isThreeWhiteSoldiers(first, second, third) {
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

  // All three candles must be bullish
  if (!c1.isBullish || !c2.isBullish || !c3.isBullish) return false;

  // Each candle should have a significant body (at least 60% of range)
  const range1 = c1.high - c1.low;
  const range2 = c2.high - c2.low;
  const range3 = c3.high - c3.low;

  if (range1 === 0 || c1.bodyLen < range1 * 0.6) return false;
  if (range2 === 0 || c2.bodyLen < range2 * 0.6) return false;
  if (range3 === 0 || c3.bodyLen < range3 * 0.6) return false;

  // Each candle should close higher than the previous
  if (c2.close <= c1.close || c3.close <= c2.close) return false;

  // Second candle should open within first candle's body
  if (c2.open < c1.open || c2.open > c1.close) return false;

  // Third candle should open within second candle's body
  if (c3.open < c2.open || c3.open > c2.close) return false;

  // Limited upper shadows (wicks should be small, less than 30% of body)
  if (c1.wickLen > c1.bodyLen * 0.3) return false;
  if (c2.wickLen > c2.bodyLen * 0.3) return false;
  if (c3.wickLen > c3.bodyLen * 0.3) return false;

  return true;
}

/**
 * Finds all Three White Soldiers patterns in a series.
 * @param {Array<Object>} dataArray
 * @return {Array<number>}
 */
function threeWhiteSoldiers(dataArray) {
  const candles = precomputeCandleProps(dataArray);
  return findPattern(candles, isThreeWhiteSoldiers);
}

module.exports = {
  isThreeWhiteSoldiers,
  threeWhiteSoldiers,
};
