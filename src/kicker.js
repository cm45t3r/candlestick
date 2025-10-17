// kicker.js
// Kicker pattern logic extracted from candlestick.js

const {
  hasGapUp,
  hasGapDown,
  findPattern,
  precomputeCandleProps,
} = require("./utils.js");
const { isHammer } = require("./hammer.js");
const { isInvertedHammer } = require("./invertedHammer.js");

/**
 * Returns true if a bearish candle is followed by a bullish candle with a gap up (not a hammer or inverted hammer). (Bullish Kicker)
 * @param {Object} previous
 * @param {Object} current
 * @return {boolean}
 */
function isBullishKicker(previous, current) {
  let p = previous,
    c = current;
  if (p.isBearish === undefined || c.isBullish === undefined) {
    [p, c] = require("./utils.js").precomputeCandleProps([previous, current]);
  }
  return (
    p.isBearish &&
    c.isBullish &&
    hasGapUp(p, c) &&
    !(isHammer(c) || isInvertedHammer(c))
  );
}

/**
 * Returns true if a bullish candle is followed by a bearish candle with a gap down (not a hammer or inverted hammer). (Bearish Kicker)
 * @param {Object} previous
 * @param {Object} current
 * @return {boolean}
 */
function isBearishKicker(previous, current) {
  let p = previous,
    c = current;
  if (p.isBullish === undefined || c.isBearish === undefined) {
    [p, c] = require("./utils.js").precomputeCandleProps([previous, current]);
  }
  return (
    p.isBullish &&
    c.isBearish &&
    hasGapDown(p, c) &&
    !(isHammer(c) || isInvertedHammer(c))
  );
}

/**
 * Finds all Bullish Kicker patterns in a series.
 * @param {Array<Object>} dataArray
 * @return {Array<number>}
 */
function bullishKicker(dataArray) {
  const candles = precomputeCandleProps(dataArray);
  return findPattern(candles, isBullishKicker);
}

/**
 * Finds all Bearish Kicker patterns in a series.
 * @param {Array<Object>} dataArray
 * @return {Array<number>}
 */
function bearishKicker(dataArray) {
  const candles = precomputeCandleProps(dataArray);
  return findPattern(candles, isBearishKicker);
}

module.exports = {
  isBullishKicker,
  isBearishKicker,
  bullishKicker,
  bearishKicker,
};
