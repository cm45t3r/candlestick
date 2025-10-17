/* eslint-disable no-console */
// Example usage of inverted hammer pattern detection
const {
  isInvertedHammer,
  invertedHammer,
  isBullishInvertedHammer,
  isBearishInvertedHammer,
  bullishInvertedHammer,
  bearishInvertedHammer,
} = require("candlestick");

const single = { open: 10, high: 18, low: 9, close: 11 };
console.log("isInvertedHammer:", isInvertedHammer(single));
console.log("isBullishInvertedHammer:", isBullishInvertedHammer(single));
console.log("isBearishInvertedHammer:", isBearishInvertedHammer(single));

const candles = [
  { open: 10, high: 18, low: 9, close: 11 }, // bullish inverted hammer
  { open: 12, high: 20, low: 11, close: 10.5 }, // bearish inverted hammer
  { open: 14, high: 16, low: 13, close: 15 }, // not an inverted hammer
];
console.log("invertedHammer indices:", invertedHammer(candles));
console.log("bullishInvertedHammer indices:", bullishInvertedHammer(candles));
console.log("bearishInvertedHammer indices:", bearishInvertedHammer(candles));
