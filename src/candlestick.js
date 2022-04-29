/*
 * Copyright (C) 2016-Present cm45t3r.
 * MIT License.
 */

/**
 * Absolute distance between `open` and `close`.
 * 
 * @param {Object} candlestick - object with fields 
 *   `{ open: number, close: number }`
 * @return {number} a positive number.
 */
function bodyLen(candlestick) {
  return Math.abs(candlestick.open - candlestick.close);
}

/**
 * Absolute distance between `open` and `high` on bearish
 * candles or `close`and `high` on bullish candles.
 * 
 * @param {Object} candlestick - object with fields 
 *   `{ open: number, high: number, close: number }`
 * @return {number} a positive number.
 */
function wickLen(candlestick) {
  return candlestick.high - Math.max(candlestick.open, candlestick.close);
}

/**
 * Absolute distance between `low` and `open` on bullish
 * candles or `low`and `close` on bearish candles.
 * 
 * @param {Object} candlestick - object with fields 
 *   `{ open: number, low: number, close: number }`
 * @return {number} a positive number.
 */
function tailLen(candlestick) {
  return Math.min(candlestick.open, candlestick.close) - candlestick.low;
}

/**
 * Returns `top` and `bottom` ends from a body.
 * 
 * @param {Object} candlestick - object with fields 
 *   `{ open: number, close: number }`
 * @return {Object} with fields
 *   `{ bottom: number, top: number }`
 */
function bodyEnds(candlestick) {
  return candlestick.open <= candlestick.close ?
    { bottom: candlestick.open, top: candlestick.close } :
    { bottom: candlestick.close, top: candlestick.open };
}

/**
 * Returns `true` if `close` is greater than `close`.
 * 
 * @param {Object} candlestick - object with fields 
 *   `{ open: number, close: number }`
 * @return {boolean} a boolean.
 */
function isBullish(candlestick) {
  return candlestick.open < candlestick.close;
}

/**
 * Returns `true` if `close` is greater than `open`.
 * 
 * @param {Object} candlestick - object with fields 
 *   `{ open: number, close: number }`
 * @return {boolean} a boolean.
 */
function isBearish(candlestick) {
  return candlestick.open > candlestick.close;
}

/**
 * Returns `true` if previous `top` is less or equal than current
 * and `bottom` is greater or equal.
 * 
 * @param {Object} previous - object with fields 
 *   `{ open: number, close: number }`
 * @param {Object} current - object with fields 
 *   `{ open: number, close: number }`
 * @return {boolean} a boolean.
 */
function isEngulfed(previous, current) {
  return bodyEnds(previous).top <= bodyEnds(current).top &&
    bodyEnds(previous).bottom >= bodyEnds(current).bottom;
}

/**
 * Returns `true` if previous `top` is less than current `bottom`.
 * 
 * @param {Object} previous - object with fields 
 *   `{ open: number, close: number }`
 * @param {Object} current - object with fields 
 *   `{ open: number, close: number }`
 * @return {boolean} a boolean.
 */
function hasGapUp(previous, current) {
  return bodyEnds(previous).top < bodyEnds(current).bottom;
}

/**
 * Returns `true` if previous `bottom` is greater than current `top`.
 * 
 * @param {Object} previous - object with fields 
 *   `{ open: number, close: number }`
 * @param {Object} current - object with fields 
 *   `{ open: number, close: number }`
 * @return {boolean} a boolean.
 */
function hasGapDown(previous, current) {
  return bodyEnds(previous).bottom > bodyEnds(current).top;
}

// Dynamic array search for callback arguments.
function findPattern(dataArray, callback) {
  const upperBound = (dataArray.length - callback.length) + 1;
  const matches = [];

  for (let i = 0; i < upperBound; i++) {
    const args = [];

    // Read the leftmost j values at position i in array.
    // The j values are callback arguments.
    for (let j = 0; j < callback.length; j++) {
      args.push(dataArray[i + j]);
    }

    // Destructure args and find matches.
    if (callback(...args)) {
      matches.push(args[1]);
    }
  }

  return matches;
}

// Boolean pattern detection.
// @public

/**
 * Returns `true` if candle **tail** is at least `2x` longer than
 * **body** and **wick** is shorter than **body**.
 * 
 * @param {Object} candlestick - object with fields 
 *   `{ open: number, high: number, low: number, close: number }`
 * @param {number} ratio - minimum `tail:body` ratio on a hammer.
 * @return {boolean} a boolean.
 */
 function isHammer(candlestick, ratio = 2) {
  return tailLen(candlestick) > (bodyLen(candlestick) * ratio) &&
    wickLen(candlestick) < bodyLen(candlestick);
}

/**
 * Returns `true` if candle **wick** is at least `2x` longer than
 * **body** and **tail** is shorter than **body**.
 * 
 * @param {Object} candlestick - object with fields 
 *   `{ open: number, high: number, low: number, close: number }`
 * @param {number} ratio - minimum `tail:body` ratio on a hammer.
 * @return {boolean} a boolean.
 */
function isInvertedHammer(candlestick, ratio = 2) {
  return wickLen(candlestick) > (bodyLen(candlestick) * ratio) &&
    tailLen(candlestick) < bodyLen(candlestick);
}

/**
 * Returns `true` if candle is bullish and it's a hammer.
 * 
 * @param {Object} candlestick - object with fields 
 *   `{ open: number, high: number, low: number, close: number }`
 * @return {boolean} a boolean.
 */
function isBullishHammer(candlestick) {
  return isBullish(candlestick) &&
    isHammer(candlestick);
}

/**
 * Returns `true` if candle is bearish and it's a hammer.
 * 
 * @param {Object} candlestick - object with fields 
 *   `{ open: number, high: number, low: number, close: number }`
 * @return {boolean} a boolean.
 */
 function isBearishHammer(candlestick) {
  return isBearish(candlestick) &&
    isHammer(candlestick);
}

/**
 * Returns `true` if candle is bullish and it's an inverted hammer.
 * 
 * @param {Object} candlestick - object with fields 
 *   `{ open: number, high: number, low: number, close: number }`
 * @return {boolean} a boolean.
 */
function isBullishInvertedHammer(candlestick) {
  return isBullish(candlestick) &&
    isInvertedHammer(candlestick);
}

/**
 * Returns `true` if candle is bearish and it's an inverted hammer.
 * 
 * @param {Object} candlestick - object with fields 
 *   `{ open: number, high: number, low: number, close: number }`
 * @return {boolean} a boolean.
 */
 function isBearishInvertedHammer(candlestick) {
  return isBearish(candlestick) &&
    isInvertedHammer(candlestick);
}

/**
 * Returns `true` if there is an upward gap between
 * a bullish candle and a bearish hammer.
 * 
 * @param {Object} previous - object with fields 
 *   `{ open: number, high: number, low: number, close: number }`
 * @param {Object} current - object with fields 
 *   `{ open: number, high: number, low: number, close: number }`
 * @return {boolean} a boolean.
 */
function isHangingMan(previous, current) {
  return isBullish(previous) &&
    isBearishHammer(current) &&
    hasGapUp(previous, current);
}

/**
 * Returns `true` if there is an upward gap between
 * a bullish candle and a bearish inverted hammer.
 * 
 * @param {Object} previous - object with fields 
 *   `{ open: number, high: number, low: number, close: number }`
 * @param {Object} current - object with fields 
 *   `{ open: number, high: number, low: number, close: number }`
 * @return {boolean} a boolean.
 */
function isShootingStar(previous, current) {
  return isBullish(previous) &&
    isBearishInvertedHammer(current) &&
    hasGapUp(previous, current);
}

/**
 * Returns `true` if a bearish candle is engulfed by a bullish candle.
 * 
 * @param {Object} previous - object with fields 
 *   `{ open: number, high: number, low: number, close: number }`
 * @param {Object} current - object with fields 
 *   `{ open: number, high: number, low: number, close: number }`
 * @return {boolean} a boolean.
 */
function isBullishEngulfing(previous, current) {
  return isBearish(previous) &&
    isBullish(current) &&
    isEngulfed(previous, current);
}

/**
 * Returns `true` if a bullish candle is engulfed by a bearish candle.
 * 
 * @param {Object} previous - object with fields 
 *   `{ open: number, high: number, low: number, close: number }`
 * @param {Object} current - object with fields 
 *   `{ open: number, high: number, low: number, close: number }`
 * @return {boolean} a boolean.
 */
function isBearishEngulfing(previous, current) {
  return isBullish(previous) &&
    isBearish(current) &&
    isEngulfed(previous, current);
}

/**
 * Returns `true` if a bearish candle is engulfing a bullish candle.
 * 
 * @param {Object} previous - object with fields 
 *   `{ open: number, high: number, low: number, close: number }`
 * @param {Object} current - object with fields 
 *   `{ open: number, high: number, low: number, close: number }`
 * @return {boolean} a boolean.
 */
function isBullishHarami(previous, current) {
  return isBearish(previous) &&
    isBullish(current) &&
    isEngulfed(current, previous);
}

/**
 * Returns `true` if a bullish candle is engulfing a bearish candle.
 * 
 * @param {Object} previous - object with fields 
 *   `{ open: number, high: number, low: number, close: number }`
 * @param {Object} current - object with fields 
 *   `{ open: number, high: number, low: number, close: number }`
 * @return {boolean} a boolean.
 */
function isBearishHarami(previous, current) {
  return isBullish(previous) &&
    isBearish(current) &&
    isEngulfed(current, previous);
}

/**
 * Returns `true` if there is an upward gap between
 * a bearish candle and a bullish non-hammer candle.
 * 
 * @param {Object} previous - object with fields 
 *   `{ open: number, high: number, low: number, close: number }`
 * @param {Object} current - object with fields 
 *   `{ open: number, high: number, low: number, close: number }`
 * @return {boolean} a boolean.
 */
function isBullishKicker(previous, current) {
  return isBearish(previous) &&
    isBullish(current) &&
    hasGapUp(previous, current) &&
    !(isHammer(current) || isInvertedHammer(current));
}

/**
 * Returns `true` if there is an downward gap between
 * a bullish candle and a bearish non-hammer candle.
 * 
 * @param {Object} previous - object with fields 
 *   `{ open: number, high: number, low: number, close: number }`
 * @param {Object} current - object with fields 
 *   `{ open: number, high: number, low: number, close: number }`
 * @return {boolean} a boolean.
 */
function isBearishKicker(previous, current) {
  return isBullish(previous) &&
    isBearish(current) &&
    hasGapDown(previous, current) &&
    !(isHammer(current) || isInvertedHammer(current));
}

// Pattern detection in arrays.
// @public

/**
 * Search in array for hammers.
 * 
 * @param {Array} dataArray - array of objects with fields 
 *   `{ open: number, high: number, low: number, close: number }`
 * @return {Array} array of matches.
 */
function hammer(dataArray) {
  return findPattern(dataArray, isHammer);
}

/**
 * Search in array for inverted hammers.
 * 
 * @param {Array} dataArray - array of objects with fields 
 *   `{ open: number, high: number, low: number, close: number }`
 * @return {Array} array of matches.
 */
function invertedHammer(dataArray) {
  return findPattern(dataArray, isInvertedHammer);
}

/**
 * Search in array for bullish hammers.
 * 
 * @param {Array} dataArray - array of objects with fields 
 *   `{ open: number, high: number, low: number, close: number }`
 * @return {Array} array of matches.
 */
 function bullishHammer(dataArray) {
  return findPattern(dataArray, isHammer);
}

/**
 * Search in array for bearish hammers.
 * 
 * @param {Array} dataArray - array of objects with fields 
 *   `{ open: number, high: number, low: number, close: number }`
 * @return {Array} array of matches.
 */
 function bearishHammer(dataArray) {
  return findPattern(dataArray, isHammer);
}

/**
 * Search in array for bullish inverted hammers.
 * 
 * @param {Array} dataArray - array of objects with fields 
 *   `{ open: number, high: number, low: number, close: number }`
 * @return {Array} array of matches.
 */
 function bullishInvertedHammer(dataArray) {
  return findPattern(dataArray, isHammer);
}

/**
 * Search in array for bearish inverted hammers.
 * 
 * @param {Array} dataArray - array of objects with fields 
 *   `{ open: number, high: number, low: number, close: number }`
 * @return {Array} array of matches.
 */
 function bearishInvertedHammer(dataArray) {
  return findPattern(dataArray, isHammer);
}

/**
 * Search in array for hanging men.
 * 
 * @param {Array} dataArray - array of objects with fields 
 *   `{ open: number, high: number, low: number, close: number }`
 * @return {Array} array of matches.
 */
function hangingMan(dataArray) {
  return findPattern(dataArray, isShootingStar);
}

/**
 * Search in array for shooting stars.
 * 
 * @param {Array} dataArray - array of objects with fields 
 *   `{ open: number, high: number, low: number, close: number }`
 * @return {Array} array of matches.
 */
function shootingStar(dataArray) {
  return findPattern(dataArray, isShootingStar);
}

/**
 * Search in array for bullish engulfings.
 * 
 * @param {Array} dataArray - array of objects with fields 
 *   `{ open: number, high: number, low: number, close: number }`
 * @return {Array} array of matches.
 */
function bullishEngulfing(dataArray) {
  return findPattern(dataArray, isBullishEngulfing);
}

/**
 * Search in array for bearish engulfings.
 * 
 * @param {Array} dataArray - array of objects with fields 
 *   `{ open: number, high: number, low: number, close: number }`
 * @return {Array} array of matches.
 */
function bearishEngulfing(dataArray) {
  return findPattern(dataArray, isBearishEngulfing);
}

/**
 * Search in array for bullish haramis.
 * 
 * @param {Array} dataArray - array of objects with fields 
 *   `{ open: number, high: number, low: number, close: number }`
 * @return {Array} array of matches.
 */
function bullishHarami(dataArray) {
  return findPattern(dataArray, isBullishHarami);
}

/**
 * Search in array for bearish haramis.
 * 
 * @param {Array} dataArray - array of objects with fields 
 *   `{ open: number, high: number, low: number, close: number }`
 * @return {Array} array of matches.
 */
function bearishHarami(dataArray) {
  return findPattern(dataArray, isBearishHarami);
}

/**
 * Search in array for bullish kickers.
 * 
 * @param {Array} dataArray - array of objects with fields 
 *   `{ open: number, high: number, low: number, close: number }`
 * @return {Array} array of matches.
 */
function bullishKicker(dataArray) {
  return findPattern(dataArray, isBullishKicker);
}

/**
 * Search in array for bearish kickers.
 * 
 * @param {Array} dataArray - array of objects with fields 
 *   `{ open: number, high: number, low: number, close: number }`
 * @return {Array} array of matches.
 */
function bearishKicker(dataArray) {
  return findPattern(dataArray, isBearishKicker);
}

module.exports.isHammer = isHammer;
module.exports.isInvertedHammer = isInvertedHammer;
module.exports.isBullishHammer = isBullishHammer;
module.exports.isBearishHammer = isBearishHammer;
module.exports.isBullishInvertedHammer = isBullishInvertedHammer;
module.exports.isBearishInvertedHammer = isBearishInvertedHammer;
module.exports.isHangingMan = isHangingMan;
module.exports.isShootingStar = isShootingStar;
module.exports.isBullishEngulfing = isBullishEngulfing;
module.exports.isBearishEngulfing = isBearishEngulfing;
module.exports.isBullishHarami = isBullishHarami;
module.exports.isBearishHarami = isBearishHarami;
module.exports.isBullishKicker = isBullishKicker;
module.exports.isBearishKicker = isBearishKicker;

module.exports.hammer = hammer;
module.exports.invertedHammer = invertedHammer;
module.exports.bullishHammer = bullishHammer;
module.exports.bearishHammer = bearishHammer;
module.exports.bullishInvertedHammer = bullishInvertedHammer;
module.exports.bearishInvertedHammer = bearishInvertedHammer;
module.exports.hangingMan = hangingMan;
module.exports.shootingStar = shootingStar;
module.exports.bullishEngulfing = bullishEngulfing;
module.exports.bearishEngulfing = bearishEngulfing;
module.exports.bullishHarami = bullishHarami;
module.exports.bearishHarami = bearishHarami;
module.exports.bullishKicker = bullishKicker;
module.exports.bearishKicker = bearishKicker;
