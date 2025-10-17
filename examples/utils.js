/* eslint-disable no-console */
// Example usage of utils functions
const utils = require("candlestick").utils;

const candle = { open: 10, high: 15, low: 8, close: 14 };
console.log("bodyLen:", utils.bodyLen(candle));
console.log("wickLen:", utils.wickLen(candle));
console.log("tailLen:", utils.tailLen(candle));
console.log("isBullish:", utils.isBullish(candle));
console.log("isBearish:", utils.isBearish(candle));

const prev = { open: 10, high: 15, low: 8, close: 14 };
const curr = { open: 16, high: 18, low: 15, close: 15.2 };
console.log("hasGapUp:", utils.hasGapUp(prev, curr));
console.log("hasGapDown:", utils.hasGapDown(prev, curr));

// Use findPattern with a custom function
function bullishCandle(c) {
  return utils.isBullish(c);
}
const candles = [
  { open: 10, high: 15, low: 8, close: 14 }, // bullish
  { open: 14, high: 16, low: 13, close: 13.2 }, // bearish
  { open: 12, high: 16, low: 11, close: 12.5 }, // bullish
];
console.log(
  "findPattern (bullish):",
  utils.findPattern(candles, bullishCandle),
);
