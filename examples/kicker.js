/* eslint-disable no-console */
// Example usage of kicker pattern detection
const { isBullishKicker, isBearishKicker, bullishKicker, bearishKicker } = require('candlestick');

const prev = { open: 15, high: 16, low: 10, close: 10 }; // bearish
const curr = { open: 12, high: 18, low: 12, close: 17 }; // bullish kicker (gap up)
console.log('isBullishKicker:', isBullishKicker(prev, curr));
console.log('isBearishKicker:', isBearishKicker(curr, prev));

const candles = [
  { open: 15, high: 16, low: 10, close: 10 }, // bearish
  { open: 12, high: 18, low: 12, close: 17 }, // bullish kicker
  { open: 18, high: 20, low: 17, close: 19 }, // not kicker
  { open: 19, high: 21, low: 18, close: 18.5 }, // bearish kicker
  { open: 17, high: 18, low: 16, close: 16.5 }, // not kicker
];
console.log('bullishKicker indices:', bullishKicker(candles));
console.log('bearishKicker indices:', bearishKicker(candles)); 