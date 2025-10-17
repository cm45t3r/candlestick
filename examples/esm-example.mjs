// ESM Example - Modern import syntax
import {
  hammer,
  patternChain,
  allPatterns,
  morningStar,
  piercingLine,
  utils,
} from "../src/index.mjs";

console.log("=".repeat(60));
console.log("ESM Example - Modern JavaScript Modules");
console.log("=".repeat(60));

// Sample data
const data = [
  { open: 10, high: 20, low: 9, close: 19 },
  { open: 19, high: 21, low: 18, close: 20 },
  { open: 50, high: 51, low: 40, close: 41 }, // Bearish
  { open: 38.75, high: 40, low: 38, close: 38.25 }, // Small star
  { open: 39, high: 48, low: 38.5, close: 47 }, // Morning Star pattern
];

console.log("\n1. Using Named Imports");
console.log("----------------------");
const hammerResults = hammer(data);
console.log("Hammer patterns found:", hammerResults);

console.log("\n2. Using Pattern Chain");
console.log("----------------------");
const chainResults = patternChain(data, allPatterns);
console.log(`Total patterns detected: ${chainResults.length}`);
chainResults.forEach((r) => {
  console.log(`  - ${r.pattern} at index ${r.index}`);
});

console.log("\n3. Using Utilities");
console.log("------------------");
const { validateOHLC } = utils;
try {
  validateOHLC(data[0]);
  console.log("✓ First candle is valid");
} catch (error) {
  console.error("✗ Validation failed:", error.message);
}

console.log("\n4. New Patterns");
console.log("---------------");
const morningStarResults = morningStar(data);
console.log("Morning Star patterns:", morningStarResults);

const piercingLineData = [
  { open: 50, high: 51, low: 40, close: 41 },
  { open: 38, high: 48, low: 37, close: 47 },
];
const piercingLineResults = piercingLine(piercingLineData);
console.log("Piercing Line patterns:", piercingLineResults);

console.log("\n" + "=".repeat(60));
console.log("ESM Module System Working! ✓");
console.log("=".repeat(60));
