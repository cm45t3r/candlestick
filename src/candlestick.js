/*
 * Copyright (C) 2016-Present Trendz.
 * MIT Licence.
 */

/**
 Make sure objects below comprise the following fields:
 {
    open: Number,
    high: Number,
    low: Number,
    close: Number
 }*/

function bodyLen(candlestick) {
    return Math.abs(candlestick.open - candlestick.close);
}

function wickLen(candlestick) {
    return candlestick.high - Math.max(candlestick.open, candlestick.close);
}

function tailLen(candlestick) {
    return Math.min(candlestick.open, candlestick.close) - candlestick.low;
}

function isBullish(candlestick) {
    return candlestick.open < candlestick.close;
}

function isBearish(candlestick) {
    return candlestick.open > candlestick.close;
}

function isHammerLike(candlestick) {
    return tailLen(candlestick) > (bodyLen(candlestick) * 2) &&
           wickLen(candlestick) < bodyLen(candlestick);
}

function isInvertedHammerLike(candlestick) {
    return wickLen(candlestick) > (bodyLen(candlestick) * 2) &&
           tailLen(candlestick) < bodyLen(candlestick);
}

function isEngulfed(shortest, longest) {
    return bodyLen(shortest) < bodyLen(longest);
}

function isGap(lowest, upmost) {
    return Math.max(lowest.open, lowest.close) < Math.min(upmost.open, upmost.close);
}

function isGapUp(previous, current) {
    return isGap(previous, current);
}

function isGapDown(previous, current) {
    return isGap(current, previous);
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

function isHammer(candlestick) {
    return isBullish(candlestick) &&
           isHammerLike(candlestick);
}

function isInvertedHammer(candlestick) {
    return isBearish(candlestick) &&
           isInvertedHammerLike(candlestick);
}

function isHangingMan(previous, current) {
    return isBullish(previous) &&
           isBearish(current) &&
           isGapUp(previous, current) &&
           isHammerLike(current);
}

function isShootingStar(previous, current) {
    return isBullish(previous) &&
           isBearish(current) &&
           isGapUp(previous, current) &&
           isInvertedHammerLike(current);
}

function isBullishEngulfing(previous, current) {
    return isBearish(previous) &&
           isBullish(current) &&
           isEngulfed(previous, current);
}

function isBearishEngulfing(previous, current) {
    return isBullish(previous) &&
           isBearish(current) &&
           isEngulfed(previous, current);
}

function isBullishHarami(previous, current) {
    return isBearish(previous) &&
           isBullish(current) &&
           isEngulfed(current, previous);
}

function isBearishHarami(previous, current) {
    return isBullish(previous) &&
           isBearish(current) &&
           isEngulfed(current, previous);
}

function isBullishKicker(previous, current) {
    return isBearish(previous) &&
           isBullish(current) &&
           isGapUp(previous, current);
}

function isBearishKicker(previous, current) {
    return isBullish(previous) &&
           isBearish(current) &&
           isGapDown(previous, current);
}

// Pattern detection in arrays.
// @public

function hammer(dataArray) {
    return findPattern(dataArray, isHammer);
}

function invertedHammer(dataArray) {
    return findPattern(dataArray, isInvertedHammer);
}

function hangingMan(dataArray) {
    return findPattern(dataArray, isShootingStar);
}

function shootingStar(dataArray) {
    return findPattern(dataArray, isShootingStar);
}

function bullishEngulfing(dataArray) {
    return findPattern(dataArray, isBullishEngulfing);
}

function bearishEngulfing(dataArray) {
    return findPattern(dataArray, isBearishEngulfing);
}

function bullishHarami(dataArray) {
    return findPattern(dataArray, isBullishHarami);
}

function bearishHarami(dataArray) {
    return findPattern(dataArray, isBearishHarami);
}

function bullishKicker(dataArray) {
    return findPattern(dataArray, isBullishKicker);
}

function bearishKicker(dataArray) {
    return findPattern(dataArray, isBearishKicker);
}

module.exports.isHammer = isHammer;
module.exports.isInvertedHammer = isInvertedHammer;
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
module.exports.hangingMan = hangingMan;
module.exports.shootingStar = shootingStar;
module.exports.bullishEngulfing = bullishEngulfing;
module.exports.bearishEngulfing = bearishEngulfing;
module.exports.bullishHarami = bullishHarami;
module.exports.bearishHarami = bearishHarami;
module.exports.bullishKicker = bullishKicker;
module.exports.bearishKicker = bearishKicker;
