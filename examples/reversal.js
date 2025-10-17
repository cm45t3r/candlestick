/* eslint-disable no-console */
// Example usage of reversal pattern detection
const {
  isHangingMan,
  isShootingStar,
  hangingMan,
  shootingStar,
} = require("candlestick");

const prev = { open: 10, high: 15, low: 8, close: 14 }; // bullish
const curr = { open: 16, high: 18, low: 15, close: 15.2 }; // bearish hammer, gap up
console.log("isHangingMan:", isHangingMan(prev, curr));
console.log("isShootingStar:", isShootingStar(prev, curr));

const candles = [
  { open: 10, high: 15, low: 8, close: 14 }, // bullish
  { open: 16, high: 18, low: 15, close: 15.2 }, // hanging man
  { open: 15, high: 20, low: 14, close: 19 }, // bullish
  { open: 21, high: 22, low: 20, close: 20.1 }, // shooting star
  { open: 19, high: 21, low: 18, close: 20 }, // not reversal
];
console.log("hangingMan indices:", hangingMan(candles));
console.log("shootingStar indices:", shootingStar(candles));
