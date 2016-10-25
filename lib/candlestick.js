/*
 * Copyright (C) 2016-Present Trendz.
 * MIT Licence.
 */

function find(array, callback) {
    const found = [];

    for (let i = 0; i < array.length - 1; i++) {
        const prev = array[i];
        const curr = array[i + 1];

        if (callback(prev, curr)) {
            found.push(curr);
        }
    }

    return found;
}

/**
 * @function module:candlestick#isBullishKicker.
 *
 * @param {Object} prev - Previous OHLC.
 * @param {Object} curr - Current OHLC.
 * @return {Boolean} true if found, false otherwise.
 * @public
 */
function isBullishKicker(prev, curr) {
    return prev.open > prev.close && // bearish
           curr.open < curr.close && // bullish
           prev.open < curr.open; // gap in-between
}

/**
 * @function module:candlestick#isBearishKicker.
 *
 * @param {Object} prev - Previous OHLC.
 * @param {Object} curr - Current OHLC.
 * @return {Boolean} true if found, false otherwise.
 * @public
 */
function isBearishKicker(prev, curr) {
    return prev.open < prev.close && // bullish
           curr.open > curr.close && // bearish
           prev.open > curr.open; // gap in-between
}

/**
 * @function module:candlestick#isShootingStar.
 *
 * @param {Object} prev - Previous OHLC.
 * @param {Object} curr - Current OHLC.
 * @return {Boolean} true if found, false otherwise.
 * @public
 */
function isShootingStar(prev, curr) {
    return prev.open < prev.close && // bullish
           curr.open > curr.close && // bearish
           prev.close < curr.close && // gap in-between
           curr.high - curr.close > 2 * (curr.open - curr.close) && // long upper stick
           curr.open - curr.close > curr.close - curr.low; // small lower stick
}

/**
 * @function module:candlestick#bullishKicker.
 *
 * @param {Array} array - Array of OHLCs.
 * @return {Array} of OHLCs where pattern occurs.
 * @public
 */
function bullishKicker(array) {
    return find(array, isBullishKicker);
}

/**
 * @function module:candlestick#bearishKicker.
 *
 * @param {Array} array - Array of OHLCs.
 * @return {Array} of OHLCs where pattern occurs.
 * @public
 */
function bearishKicker(array) {
    return find(array, isBearishKicker);
}

/**
 * @function module:candlestick#shootingStar.
 *
 * @param {Array} array - Array of OHLCs.
 * @return {Array} of OHLCs where pattern occurs.
 * @public
 */
function shootingStar(array) {
    return find(array, isShootingStar);
}

module.exports.isBullishKicker = isBullishKicker;
module.exports.isBearishKicker = isBearishKicker;
module.exports.isShootingStar = isShootingStar;
module.exports.bullishKicker = bullishKicker;
module.exports.bearishKicker = bearishKicker;
module.exports.shootingStar = shootingStar;
