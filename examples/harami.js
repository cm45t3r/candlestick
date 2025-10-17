/* eslint-disable no-console */
// Example usage of harami pattern detection
const {
  isBullishHarami,
  isBearishHarami,
  bullishHarami,
  bearishHarami,
} = require("candlestick");

const prev = { open: 15, high: 16, low: 10, close: 10 }; // bearish
const curr = { open: 11, high: 15, low: 10.5, close: 14 }; // bullish, inside previous
console.log("isBullishHarami:", isBullishHarami(prev, curr));
console.log("isBearishHarami:", isBearishHarami(curr, prev));

const candles = [
  { open: 15, high: 16, low: 10, close: 10 }, // bearish
  { open: 11, high: 15, low: 10.5, close: 14 }, // bullish, inside previous
  { open: 14, high: 16, low: 13, close: 15 }, // not harami
  { open: 15, high: 17, low: 14, close: 14.5 }, // bearish, inside previous
  { open: 14.5, high: 15, low: 13, close: 13.5 }, // not harami
];
console.log("bullishHarami indices:", bullishHarami(candles));
console.log("bearishHarami indices:", bearishHarami(candles));
