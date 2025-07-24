/* eslint-disable no-console */
// Example usage of engulfing pattern detection
const { isBullishEngulfing, isBearishEngulfing, bullishEngulfing, bearishEngulfing } = require('candlestick');

const prev = { open: 15, high: 16, low: 10, close: 10 }; // bearish
const curr = { open: 10, high: 20, low: 9, close: 19 }; // bullish, engulfs previous
console.log('isBullishEngulfing:', isBullishEngulfing(prev, curr));
console.log('isBearishEngulfing:', isBearishEngulfing(curr, prev));

const candles = [
  { open: 15, high: 16, low: 10, close: 10 }, // bearish
  { open: 10, high: 20, low: 9, close: 19 }, // bullish, engulfs previous
  { open: 20, high: 25, low: 19, close: 24 }, // not engulfing
  { open: 24, high: 26, low: 23, close: 22 }, // bearish, engulfs previous
  { open: 22, high: 23, low: 21, close: 21 }, // not engulfing
];
console.log('bullishEngulfing indices:', bullishEngulfing(candles));
console.log('bearishEngulfing indices:', bearishEngulfing(candles)); 