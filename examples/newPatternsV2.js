// Example: Using new patterns from v1.2.0 (Marubozu, Spinning Top, Tweezers)

const candlestick = require("../index.js");

// Sample OHLC data
const data = [
  // Bullish Marubozu - strong buying with minimal shadows
  { open: 100, high: 120, low: 100, close: 120 },

  // Spinning Top - indecision
  { open: 120, high: 130, low: 110, close: 122 },

  // Normal candle
  { open: 122, high: 128, low: 118, close: 125 },

  // Bearish Marubozu - strong selling
  { open: 125, high: 125, low: 105, close: 105 },

  // Tweezers Bottom setup - first bearish
  { open: 110, high: 115, low: 100, close: 102 },

  // Tweezers Bottom - matching low, bullish reversal
  { open: 102, high: 120, low: 100, close: 118 },
];

console.log("=== New Patterns Demo (v1.2.0) ===\n");

// 1. Marubozu Detection
console.log("1. Marubozu Patterns:");
console.log("  - All Marubozu:", candlestick.marubozu(data));
console.log("  - Bullish:", candlestick.bullishMarubozu(data));
console.log("  - Bearish:", candlestick.bearishMarubozu(data));

// Test single candle
console.log(
  "\n  First candle is Bullish Marubozu:",
  candlestick.isBullishMarubozu(data[0]),
);

// 2. Spinning Top Detection
console.log("\n2. Spinning Top Patterns:");
console.log("  - All Spinning Tops:", candlestick.spinningTop(data));
console.log("  - Bullish:", candlestick.bullishSpinningTop(data));

console.log(
  "\n  Second candle is Spinning Top:",
  candlestick.isSpinningTop(data[1]),
);

// 3. Tweezers Detection
console.log("\n3. Tweezers Patterns:");
console.log("  - Tweezers Top:", candlestick.tweezersTop(data));
console.log("  - Tweezers Bottom:", candlestick.tweezersBottom(data));
console.log("  - All Tweezers:", candlestick.tweezers(data));

// Test pair
if (data.length >= 6) {
  console.log(
    "\n  Candles 4-5 form Tweezers Bottom:",
    candlestick.isTweezersBottom(data[4], data[5]),
  );
}

// 4. Pattern Chain with New Patterns
console.log("\n4. Pattern Chain (all patterns):");
const allResults = candlestick.patternChain(data, candlestick.allPatterns);
console.log(`  Found ${allResults.length} total patterns`);

// Filter for new patterns only
const newPatterns = allResults.filter((r) =>
  [
    "marubozu",
    "bullishMarubozu",
    "bearishMarubozu",
    "spinningTop",
    "tweezersBottom",
  ].includes(r.pattern),
);
console.log("\n  New patterns found:");
newPatterns.forEach((r) => {
  console.log(`    - ${r.pattern} at index ${r.index}`);
});

// 5. With Metadata
console.log("\n5. New Patterns with Metadata:");
const enriched = candlestick.metadata.enrichWithMetadata(newPatterns);
enriched.forEach((r) => {
  console.log(`\n  ${r.pattern} (index ${r.index}):`);
  console.log(`    Confidence: ${r.metadata.confidence}`);
  console.log(`    Type: ${r.metadata.type}`);
  console.log(`    Strength: ${r.metadata.strength}`);
  console.log(`    Direction: ${r.metadata.direction}`);
});

console.log("\n=== Demo Complete ===");
