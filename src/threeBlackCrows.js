// threeBlackCrows.js
// Three Black Crows pattern detection module

const { findPattern, precomputeCandleProps } = require("./utils.js");

/**
 * Returns true if the pattern is Three Black Crows (bearish continuation/reversal).
 * Three Black Crows:
 * - Three consecutive bearish candles
 * - Each candle opens within the previous candle's body
 * - Each candle closes lower than the previous
 * - Each candle has a significant body
 * - Limited lower shadows
 *
 * @param {Object} first - First candlestick
 * @param {Object} second - Second candlestick
 * @param {Object} third - Third candlestick
 * @return {boolean}
 */
function isThreeBlackCrows(first, second, third) {
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

  // All three candles must be bearish
  if (!c1.isBearish || !c2.isBearish || !c3.isBearish) return false;

  // Each candle should have a significant body (at least 60% of range)
  const range1 = c1.high - c1.low;
  const range2 = c2.high - c2.low;
  const range3 = c3.high - c3.low;

  if (range1 === 0 || c1.bodyLen < range1 * 0.6) return false;
  if (range2 === 0 || c2.bodyLen < range2 * 0.6) return false;
  if (range3 === 0 || c3.bodyLen < range3 * 0.6) return false;

  // Each candle should close lower than the previous
  if (c2.close >= c1.close || c3.close >= c2.close) return false;

  // Second candle should open within first candle's body
  if (c2.open > c1.open || c2.open < c1.close) return false;

  // Third candle should open within second candle's body
  if (c3.open > c2.open || c3.open < c2.close) return false;

  // Limited lower shadows (tails should be small, less than 30% of body)
  if (c1.tailLen > c1.bodyLen * 0.3) return false;
  if (c2.tailLen > c2.bodyLen * 0.3) return false;
  if (c3.tailLen > c3.bodyLen * 0.3) return false;

  return true;
}

/**
 * Finds all Three Black Crows patterns in a series.
 * @param {Array<Object>} dataArray
 * @return {Array<number>}
 */
function threeBlackCrows(dataArray) {
  const candles = precomputeCandleProps(dataArray);
  return findPattern(candles, isThreeBlackCrows);
}

module.exports = {
  isThreeBlackCrows,
  threeBlackCrows,
};
