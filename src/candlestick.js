/*
 * Copyright (C) 2016-present cm45t3r.
 * MIT License.
 */

const { bodyLen, wickLen, tailLen, bodyEnds, isBullish, isBearish, findPattern, hasGapUp, hasGapDown } = require('./utils.js');
const { isDoji, doji } = require('./doji.js');

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
 * Returns `true` if candle **tail** is at least `2x` longer than
 * **body** and **wick** is shorter than **body**.
 *
 * @param {Object} candlestick - object with fields
 *   `{ open: number, high: number, low: number, close: number }`
 * @return {boolean} a boolean.
 */
function isHammer(candlestick) {
  return tailLen(candlestick) > (bodyLen(candlestick) * 2) &&
    wickLen(candlestick) < bodyLen(candlestick);
}

/**
 * Returns `true` if candle **wick** is at least `2x` longer than
 * **body** and **tail** is shorter than **body**.
 *
 * @param {Object} candlestick - object with fields
 *   `{ open: number, high: number, low: number, close: number }`
 * @return {boolean} a boolean.
 */
function isInvertedHammer(candlestick) {
  return wickLen(candlestick) > (bodyLen(candlestick) * 2) &&
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
 * Search for a pattern within array that matches the condition
 *  specified by the callback function.
 *
 * @param {Array} dataArray - array of objects with fields
 *  `{ open: number, high: number, low: number, close: number }`
 * @param {Function} callback - function to evaluate the pattern.
 *  **Remarks:** optional parameters are not took into account.
 * @return {Array} containing the indices where the pattern is found.
 * @private
 */
function findPattern(dataArray, callback) {
  const paramCount = callback.length;
  const upperBound = dataArray.length - paramCount;
  const results = [];

  for (let i = 0; i <= upperBound; i++) {
    const values = [];

    for (let j = 0; j < paramCount; j++) {
      values.push(dataArray[i + j]);
    }

    if (callback(...values)) {
      results.push(i);
    }
  }

  return results;
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

const { isHammer, isBullishHammer, isBearishHammer, hammer, bullishHammer, bearishHammer } = require('./hammer.js');
const { isInvertedHammer, isBullishInvertedHammer, isBearishInvertedHammer, invertedHammer, bullishInvertedHammer, bearishInvertedHammer } = require('./invertedHammer.js');
const { isEngulfed, isBullishEngulfing, isBearishEngulfing, bullishEngulfing, bearishEngulfing } = require('./engulfing.js');
const { isBullishHarami, isBearishHarami, bullishHarami, bearishHarami } = require('./harami.js');
const { isBullishKicker, isBearishKicker, bullishKicker, bearishKicker } = require('./kicker.js');
const { isHangingMan, isShootingStar, hangingMan, shootingStar } = require('./reversal.js');

/**
 * Returns `true` if the candlestick is an Inverted Hammer (also known as Inverted Pinbar).
 * @param {Object} candlestick - { open, high, low, close }
 * @returns {boolean} True if the candle is an Inverted Hammer/Pinbar.
 */
module.exports.isInvertedHammer = isInvertedHammer;
/**
 * Returns `true` if the candlestick is a Bullish Inverted Hammer.
 * @param {Object} candlestick - { open, high, low, close }
 * @returns {boolean} True if the candle is a Bullish Inverted Hammer.
 */
module.exports.isBullishInvertedHammer = isBullishInvertedHammer;
/**
 * Returns `true` if the candlestick is a Bearish Inverted Hammer.
 * @param {Object} candlestick - { open, high, low, close }
 * @returns {boolean} True if the candle is a Bearish Inverted Hammer.
 */
module.exports.isBearishInvertedHammer = isBearishInvertedHammer;
/**
 * Returns `true` if the previous candle and current candle form a Hanging Man pattern.
 * @param {Object} previous - { open, high, low, close }
 * @param {Object} current - { open, high, low, close }
 * @returns {boolean} True if the pattern is a Hanging Man.
 */
module.exports.isHangingMan = isHangingMan;
/**
 * Returns `true` if the previous candle and current candle form a Shooting Star pattern.
 * @param {Object} previous - { open, high, low, close }
 * @param {Object} current - { open, high, low, close }
 * @returns {boolean} True if the pattern is a Shooting Star.
 */
module.exports.isShootingStar = isShootingStar;
/**
 * Returns `true` if the previous and current candles form a Bullish Engulfing pattern.
 * @param {Object} previous - { open, high, low, close }
 * @param {Object} current - { open, high, low, close }
 * @returns {boolean} True if the pattern is a Bullish Engulfing.
 */
module.exports.isBullishEngulfing = isBullishEngulfing;
/**
 * Returns `true` if the previous and current candles form a Bearish Engulfing pattern.
 * @param {Object} previous - { open, high, low, close }
 * @param {Object} current - { open, high, low, close }
 * @returns {boolean} True if the pattern is a Bearish Engulfing.
 */
module.exports.isBearishEngulfing = isBearishEngulfing;
/**
 * Returns `true` if the previous and current candles form a Bullish Harami pattern.
 * @param {Object} previous - { open, high, low, close }
 * @param {Object} current - { open, high, low, close }
 * @returns {boolean} True if the pattern is a Bullish Harami.
 */
module.exports.isBullishHarami = isBullishHarami;
/**
 * Returns `true` if the previous and current candles form a Bearish Harami pattern.
 * @param {Object} previous - { open, high, low, close }
 * @param {Object} current - { open, high, low, close }
 * @returns {boolean} True if the pattern is a Bearish Harami.
 */
module.exports.isBearishHarami = isBearishHarami;
/**
 * Returns `true` if the previous and current candles form a Bullish Kicker pattern.
 * @param {Object} previous - { open, high, low, close }
 * @param {Object} current - { open, high, low, close }
 * @returns {boolean} True if the pattern is a Bullish Kicker.
 */
module.exports.isBullishKicker = isBullishKicker;
/**
 * Returns `true` if the previous and current candles form a Bearish Kicker pattern.
 * @param {Object} previous - { open, high, low, close }
 * @param {Object} current - { open, high, low, close }
 * @returns {boolean} True if the pattern is a Bearish Kicker.
 */
module.exports.isBearishKicker = isBearishKicker;
/**
 * Returns `true` if the candlestick is a Doji.
 * @param {Object} candlestick - { open, high, low, close }
 * @returns {boolean} True if the candle is a Doji.
 */
module.exports.isDoji = isDoji;
/**
 * Returns the Doji candlestick.
 * @param {Object} candlestick - { open, high, low, close }
 * @returns {Object} The Doji candlestick.
 */
module.exports.doji = doji;

/**
 * Finds all Inverted Hammer (Pinbar) patterns in a series.
 * @param {Array<Object>} dataArray - Array of candlesticks { open, high, low, close }
 * @returns {Array<number>} Indices where the Inverted Hammer pattern is found.
 */
module.exports.invertedHammer = invertedHammer;
/**
 * Finds all Bullish Inverted Hammer patterns in a series.
 * @param {Array<Object>} dataArray - Array of candlesticks { open, high, low, close }
 * @returns {Array<number>} Indices where the Bullish Inverted Hammer pattern is found.
 */
module.exports.bullishInvertedHammer = bullishInvertedHammer;
/**
 * Finds all Bearish Inverted Hammer patterns in a series.
 * @param {Array<Object>} dataArray - Array of candlesticks { open, high, low, close }
 * @returns {Array<number>} Indices where the Bearish Inverted Hammer pattern is found.
 */
module.exports.bearishInvertedHammer = bearishInvertedHammer;
/**
 * Finds all Hanging Man patterns in a series.
 * @param {Array<Object>} dataArray - Array of candlesticks { open, high, low, close }
 * @returns {Array<number>} Indices where the Hanging Man pattern is found.
 */
module.exports.hangingMan = hangingMan;
/**
 * Finds all Shooting Star patterns in a series.
 * @param {Array<Object>} dataArray - Array of candlesticks { open, high, low, close }
 * @returns {Array<number>} Indices where the Shooting Star pattern is found.
 */
module.exports.shootingStar = shootingStar;
/**
 * Finds all Bullish Engulfing patterns in a series.
 * @param {Array<Object>} dataArray - Array of candlesticks { open, high, low, close }
 * @returns {Array<number>} Indices where the Bullish Engulfing pattern is found.
 */
module.exports.bullishEngulfing = bullishEngulfing;
/**
 * Finds all Bearish Engulfing patterns in a series.
 * @param {Array<Object>} dataArray - Array of candlesticks { open, high, low, close }
 * @returns {Array<number>} Indices where the Bearish Engulfing pattern is found.
 */
module.exports.bearishEngulfing = bearishEngulfing;
/**
 * Finds all Bullish Harami patterns in a series.
 * @param {Array<Object>} dataArray - Array of candlesticks { open, high, low, close }
 * @returns {Array<number>} Indices where the Bullish Harami pattern is found.
 */
module.exports.bullishHarami = bullishHarami;
/**
 * Finds all Bearish Harami patterns in a series.
 * @param {Array<Object>} dataArray - Array of candlesticks { open, high, low, close }
 * @returns {Array<number>} Indices where the Bearish Harami pattern is found.
 */
module.exports.bearishHarami = bearishHarami;
/**
 * Finds all Bullish Kicker patterns in a series.
 * @param {Array<Object>} dataArray - Array of candlesticks { open, high, low, close }
 * @returns {Array<number>} Indices where the Bullish Kicker pattern is found.
 */
module.exports.bullishKicker = bullishKicker;
/**
 * Finds all Bearish Kicker patterns in a series.
 * @param {Array<Object>} dataArray - Array of candlesticks { open, high, low, close }
 * @returns {Array<number>} Indices where the Bearish Kicker pattern is found.
 */
module.exports.bearishKicker = bearishKicker;
