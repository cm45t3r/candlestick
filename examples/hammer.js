/* eslint-disable no-console */
// Example usage of hammer pattern detection
const {
  isHammer,
  hammer,
  isBullishHammer,
  isBearishHammer,
  bullishHammer,
  bearishHammer,
} = require("candlestick");

const single = { open: 10, high: 15, low: 8, close: 14 };
console.log("isHammer:", isHammer(single));
console.log("isBullishHammer:", isBullishHammer(single));
console.log("isBearishHammer:", isBearishHammer(single));

const candles = [
  { open: 10, high: 15, low: 8, close: 14 }, // bullish hammer
  { open: 14, high: 16, low: 13, close: 13.2 }, // bearish hammer
  { open: 12, high: 16, low: 11, close: 12.5 }, // not a hammer
];
console.log("hammer indices:", hammer(candles));
console.log("bullishHammer indices:", bullishHammer(candles));
console.log("bearishHammer indices:", bearishHammer(candles));
