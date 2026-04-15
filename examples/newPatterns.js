/* eslint-disable no-console */
// Example usage of new 3-candle patterns

const {
  morningStar,
  eveningStar,
  threeWhiteSoldiers,
  threeBlackCrows,
  isPiercingLine,
  piercingLine,
  isDarkCloudCover,
  darkCloudCover,
  patternChain,
  allPatterns,
} = require("candlestick");

console.log("=".repeat(60));
console.log("New Candlestick Patterns - Examples");
console.log("=".repeat(60));

// Sample market data
const bullishTrendData = [
  { open: 50, high: 51, low: 40, close: 41 }, // 0: Bearish
  { open: 38.75, high: 40, low: 38, close: 38.25 }, // 1: Small star
  { open: 39, high: 48, low: 38.5, close: 47 }, // 2: Bullish - MORNING STAR at index 0
  { open: 47, high: 55, low: 46, close: 54 }, // 3: Continuing bullish
];

const bearishTrendData = [
  { open: 40, high: 50, low: 39, close: 49 }, // 0: Bullish
  { open: 50.5, high: 51, low: 50, close: 50.5 }, // 1: Small star
  { open: 50, high: 50.5, low: 42, close: 43 }, // 2: Bearish - EVENING STAR at index 0
  { open: 43, high: 44, low: 35, close: 36 }, // 3: Continuing bearish
];

const strongBullishData = [
  { open: 10, high: 20, low: 9, close: 19 }, // 0
  { open: 15, high: 25, low: 14, close: 24 }, // 1
  { open: 20, high: 30, low: 19, close: 29 }, // 2: THREE WHITE SOLDIERS at index 0
  { open: 30, high: 35, low: 29, close: 34 }, // 3
];

const strongBearishData = [
  { open: 30, high: 31, low: 20, close: 21 }, // 0
  { open: 26, high: 27, low: 16, close: 17 }, // 1
  { open: 22, high: 23, low: 12, close: 13 }, // 2: THREE BLACK CROWS at index 0
  { open: 13, high: 14, low: 8, close: 9 }, // 3
];

// Morning Star Example
console.log("\n1. Morning Star (Bullish Reversal)");
console.log("-----------------------------------");
const morningStarResults = morningStar(bullishTrendData);
console.log("Pattern found at indices:", morningStarResults);
console.log("Interpretation: Potential bullish reversal after downtrend");

// Evening Star Example
console.log("\n2. Evening Star (Bearish Reversal)");
console.log("-----------------------------------");
const eveningStarResults = eveningStar(bearishTrendData);
console.log("Pattern found at indices:", eveningStarResults);
console.log("Interpretation: Potential bearish reversal after uptrend");

// Three White Soldiers Example
console.log("\n3. Three White Soldiers (Bullish Continuation)");
console.log("-----------------------------------------------");
const whiteSoldiersResults = threeWhiteSoldiers(strongBullishData);
console.log("Pattern found at indices:", whiteSoldiersResults);
console.log("Interpretation: Strong bullish momentum");

// Three Black Crows Example
console.log("\n4. Three Black Crows (Bearish Continuation)");
console.log("--------------------------------------------");
const blackCrowsResults = threeBlackCrows(strongBearishData);
console.log("Pattern found at indices:", blackCrowsResults);
console.log("Interpretation: Strong bearish momentum");

// Piercing Line Example
console.log("\n5. Piercing Line (Bullish Reversal)");
console.log("-------------------------------------");
const piercingLineData = [
  { open: 50, high: 51, low: 40, close: 41 }, // bearish, body > 50%
  { open: 39, high: 48, low: 37, close: 47 }, // bullish, opens below first's low, closes above midpoint
];
console.log(
  "isPiercingLine:",
  isPiercingLine(piercingLineData[0], piercingLineData[1]),
);
console.log("piercingLine indices:", piercingLine(piercingLineData));
console.log("Interpretation: Bullish reversal — second candle pierces into bearish body");

// Dark Cloud Cover Example
console.log("\n6. Dark Cloud Cover (Bearish Reversal)");
console.log("----------------------------------------");
const darkCloudData = [
  { open: 40, high: 50, low: 39, close: 49 }, // bullish, body > 50%
  { open: 51, high: 52, low: 42, close: 43 }, // bearish, opens above first's high, closes below midpoint
];
console.log(
  "isDarkCloudCover:",
  isDarkCloudCover(darkCloudData[0], darkCloudData[1]),
);
console.log("darkCloudCover indices:", darkCloudCover(darkCloudData));
console.log("Interpretation: Bearish reversal — dark cloud covers the bullish candle");

// Pattern Chain with All Patterns
console.log("\n7. Pattern Chain (All Patterns Including New Ones)");
console.log("--------------------------------------------------");
const allData = [
  ...bullishTrendData,
  ...bearishTrendData,
  ...strongBullishData,
  ...strongBearishData,
];

const chainResults = patternChain(allData, allPatterns);
console.log(`Total patterns detected: ${chainResults.length}`);
console.log("\nDetected patterns:");
chainResults.forEach((result) => {
  console.log(`  - ${result.pattern} at index ${result.index}`);
});

// Filter by specific pattern types
console.log("\n8. Filter Results by Pattern Type");
console.log("----------------------------------");
const reversalPatterns = chainResults.filter((r) =>
  [
    "morningStar",
    "eveningStar",
    "hangingMan",
    "shootingStar",
    "piercingLine",
    "darkCloudCover",
  ].includes(r.pattern),
);
console.log("Reversal patterns:", reversalPatterns.length);
reversalPatterns.forEach((r) =>
  console.log(`  - ${r.pattern} at index ${r.index}`),
);

const continuationPatterns = chainResults.filter((r) =>
  ["threeWhiteSoldiers", "threeBlackCrows"].includes(r.pattern),
);
console.log("Continuation patterns:", continuationPatterns.length);
continuationPatterns.forEach((r) =>
  console.log(`  - ${r.pattern} at index ${r.index}`),
);

console.log("\n" + "=".repeat(60));
console.log("Pattern Detection Complete");
console.log("=".repeat(60));
