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

// Bullish hammer: long lower shadow (tailLen >= 2x body), tiny upper shadow, body in upper third
const single = { open: 14, high: 15, low: 8, close: 14.5 };
console.log("isHammer:", isHammer(single));
console.log("isBullishHammer:", isBullishHammer(single));
console.log("isBearishHammer:", isBearishHammer(single));

const candles = [
  { open: 14, high: 15, low: 8, close: 14.5 }, // bullish hammer: tail=6, body=0.5, wick=0.5
  { open: 14, high: 14.3, low: 7, close: 13.5 }, // bearish hammer: tail=6.5, body=0.5, wick=0.3
  { open: 12, high: 16, low: 11, close: 12.5 }, // not a hammer: large upper shadow
];
console.log("hammer indices:", hammer(candles));
console.log("bullishHammer indices:", bullishHammer(candles));
console.log("bearishHammer indices:", bearishHammer(candles));
