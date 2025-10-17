/* eslint-disable no-console */
// Example usage of doji pattern detection
const { isDoji, doji } = require("candlestick");

const single = { open: 10, high: 15, low: 10, close: 10.05 };
console.log("isDoji:", isDoji(single));

const candles = [
  { open: 10, high: 15, low: 10, close: 10.05 }, // doji
  { open: 12, high: 16, low: 11, close: 15 }, // not a doji
  { open: 14, high: 16, low: 13, close: 14.1 }, // doji
];
console.log("doji indices:", doji(candles));
