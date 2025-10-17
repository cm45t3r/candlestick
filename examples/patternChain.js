/* eslint-disable no-console */
// Example usage of patternChain for multi-pattern detection
const { patternChain, allPatterns } = require("candlestick");

const candles = [
  { open: 10, high: 15, low: 8, close: 14 }, // bullish hammer
  { open: 14, high: 16, low: 13, close: 13.2 }, // bearish hammer
  { open: 10, high: 15, low: 10, close: 10.05 }, // doji
  { open: 15, high: 16, low: 10, close: 10 }, // bearish
  { open: 10, high: 20, low: 9, close: 19 }, // bullish, engulfs previous
];

const results = patternChain(candles, allPatterns);
console.log("patternChain results:", results);

// Custom pattern example: bullish then bearish
function bullBear(a, b) {
  return a.open < a.close && b.open > b.close;
}
const customResults = patternChain(candles, [
  {
    name: "bullBear",
    fn: (arr) => require("candlestick").utils.findPattern(arr, bullBear),
    paramCount: 2,
  },
]);
console.log("custom patternChain results:", customResults);
