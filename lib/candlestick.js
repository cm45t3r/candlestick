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
    return prev.open > prev.close &&
           curr.open < curr.close &&
           prev.open < curr.open;
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
    return prev.open < prev.close &&
           curr.open > curr.close &&
           prev.open > curr.open;
}

/**
 * @function module:candlestick#findBullishKicker.
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

module.exports.isBullishKicker = isBullishKicker;
module.exports.isBearishKicker = isBearishKicker;
module.exports.bullishKicker = bullishKicker;
module.exports.bearishKicker = bearishKicker;
