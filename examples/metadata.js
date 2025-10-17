/* eslint-disable no-console */
// Example: Using pattern metadata for confidence and filtering

const {
  patternChain,
  allPatterns,
  metadata: {
    enrichWithMetadata,
    filterByConfidence,
    filterByType,
    filterByDirection,
    sortByConfidence,
  },
} = require("../index.js");

console.log("=".repeat(60));
console.log("Pattern Metadata System - Examples");
console.log("=".repeat(60));

// Sample data with various patterns
const data = [
  { open: 50, high: 51, low: 40, close: 41 }, // 0
  { open: 38, high: 48, low: 37, close: 47 }, // 1: Piercing Line
  { open: 40, high: 50, low: 39, close: 49 }, // 2
  { open: 52, high: 53, low: 42, close: 43 }, // 3: Dark Cloud Cover
  { open: 50, high: 51, low: 40, close: 41 }, // 4
  { open: 38.75, high: 40, low: 38, close: 38.25 }, // 5
  { open: 39, high: 48, low: 38.5, close: 47 }, // 6: Morning Star
  { open: 10, high: 20, low: 9, close: 19 }, // 7
  { open: 15, high: 25, low: 14, close: 24 }, // 8
  { open: 20, high: 30, low: 19, close: 29 }, // 9: Three White Soldiers
];

console.log("\n1. Basic Pattern Detection");
console.log("─".repeat(60));
const results = patternChain(data, allPatterns);
console.log(`Patterns detected: ${results.length}`);

console.log("\n2. Enrich with Metadata");
console.log("─".repeat(60));
const enriched = enrichWithMetadata(results);
console.log(`Enriched results: ${enriched.length}`);
enriched.slice(0, 3).forEach((r) => {
  console.log(`  ${r.pattern}:`);
  console.log(`    - Type: ${r.metadata.type}`);
  console.log(`    - Direction: ${r.metadata.direction}`);
  console.log(`    - Confidence: ${r.metadata.confidence}`);
  console.log(`    - Strength: ${r.metadata.strength}`);
});

console.log("\n3. Filter by Confidence (>= 0.8)");
console.log("─".repeat(60));
const highConfidence = filterByConfidence(enriched, 0.8);
console.log(`High confidence patterns: ${highConfidence.length}`);
highConfidence.forEach((r) => {
  console.log(`  - ${r.pattern} (confidence: ${r.metadata.confidence})`);
});

console.log("\n4. Filter by Type (reversal)");
console.log("─".repeat(60));
const reversals = filterByType(enriched, "reversal");
console.log(`Reversal patterns: ${reversals.length}`);

console.log("\n5. Filter by Direction (bullish)");
console.log("─".repeat(60));
const bullish = filterByDirection(enriched, "bullish");
console.log(`Bullish patterns: ${bullish.length}`);
bullish.forEach((r) => {
  console.log(
    `  - ${r.pattern} (${r.metadata.strength}, ${r.metadata.confidence})`,
  );
});

console.log("\n6. Sort by Confidence");
console.log("─".repeat(60));
const sorted = sortByConfidence(enriched);
console.log("Top 5 by confidence:");
sorted.slice(0, 5).forEach((r, i) => {
  console.log(
    `  ${i + 1}. ${r.pattern} - ${r.metadata.confidence} (${r.metadata.strength})`,
  );
});

console.log("\n7. Combined Filters (Strong Bullish Reversals)");
console.log("─".repeat(60));
const strongBullishReversals = enriched
  .filter((r) => r.metadata.type === "reversal")
  .filter((r) => r.metadata.direction === "bullish")
  .filter((r) => r.metadata.confidence >= 0.85);
console.log(`Strong bullish reversals: ${strongBullishReversals.length}`);
strongBullishReversals.forEach((r) => {
  console.log(
    `  - ${r.pattern} at index ${r.index} (${r.metadata.confidence})`,
  );
});

console.log("\n" + "=".repeat(60));
console.log("Metadata System Complete ✓");
console.log("=".repeat(60));
