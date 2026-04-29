// ESM Example - Modern import syntax
// Covers: named imports, patternChain, utils, metadata, streaming, plugins
import {
  hammer,
  doji,
  patternChain,
  allPatterns,
  morningStar,
  piercingLine,
  utils,
  metadata,
  streaming,
  plugins,
} from "candlestick";

const { validateOHLC, precomputeCandleProps } = utils;
const { enrichWithMetadata, filterByConfidence } = metadata;
const { createStream } = streaming;
const { registerPattern, getPattern, clearAllPatterns } = plugins;

console.log("=".repeat(60));
console.log("ESM Example — Modern JavaScript Modules");
console.log("=".repeat(60));

// Sample data with date field to show extra-field pass-through
const data = [
  { date: "2024-01-01", open: 10, high: 20, low: 9, close: 19 },
  { date: "2024-01-02", open: 19, high: 21, low: 18, close: 20 },
  { date: "2024-01-03", open: 50, high: 51, low: 40, close: 41 }, // Bearish
  { date: "2024-01-04", open: 38.75, high: 40, low: 38, close: 38.25 }, // Small star
  { date: "2024-01-05", open: 39, high: 48, low: 38.5, close: 47 }, // Morning Star
];

// --- 1. Named Imports -------------------------------------------------------
console.log("\n1. Named Imports");
console.log("─".repeat(40));
const hammerResults = hammer(data);
console.log("hammer() indices:", hammerResults);
const dojiResults = doji(data);
console.log("doji()   indices:", dojiResults);

// --- 2. patternChain --------------------------------------------------------
console.log("\n2. patternChain (all patterns)");
console.log("─".repeat(40));
const chainResults = patternChain(data, allPatterns);
console.log(`${chainResults.length} pattern occurrences`);
chainResults.forEach((r) => console.log(`  [${r.index}] ${r.pattern}`));

// --- 3. Utils ---------------------------------------------------------------
console.log("\n3. Utils");
console.log("─".repeat(40));
validateOHLC(data[0]); // throws on invalid
console.log("✓ validateOHLC passed");

const precomputed = precomputeCandleProps(data);
console.log(`precomputed[0].date preserved: ${precomputed[0].date}`);
console.log(`precomputed[0].bodyLen:        ${precomputed[0].bodyLen}`);

// --- 4. New Patterns --------------------------------------------------------
console.log("\n4. Multi-candle patterns (named imports)");
console.log("─".repeat(40));
console.log("morningStar() indices:", morningStar(data));

const piercingData = [
  { open: 50, high: 51, low: 40, close: 41 },
  { open: 38, high: 48, low: 37, close: 47 },
];
console.log("piercingLine() indices:", piercingLine(piercingData));

// --- 5. Metadata ------------------------------------------------------------
console.log("\n5. Metadata");
console.log("─".repeat(40));
const enriched = enrichWithMetadata(chainResults);
const highConf = filterByConfidence(enriched, 0.8);
console.log(`Total matches:     ${enriched.length}`);
console.log(`High-conf (>=0.8): ${highConf.length}`);
highConf.forEach((r) =>
  console.log(
    `  ${r.pattern.padEnd(20)} conf: ${r.metadata.confidence}  ${r.metadata.direction}`,
  ),
);

// --- 6. Streaming -----------------------------------------------------------
console.log("\n6. Streaming");
console.log("─".repeat(40));
const matches = [];
const stream = createStream({
  patterns: ["hammer", "doji", "morningStar"],
  chunkSize: 3,
  onMatch: (m) => matches.push(m),
});
stream.process(data);
const summary = stream.end();
console.log(`totalProcessed:   ${summary.totalProcessed}`);
console.log(`patternsDetected: ${summary.patternsDetected}`);
console.log(`matches found:    ${matches.length}`);

// --- 7. Plugins -------------------------------------------------------------
console.log("\n7. Plugins");
console.log("─".repeat(40));
clearAllPatterns();

registerPattern({
  name: "esmBigBody",
  fn: (arr) =>
    arr.reduce((hits, c, i) => {
      const range = c.high - c.low;
      if (range > 0 && Math.abs(c.close - c.open) / range >= 0.8) hits.push(i);
      return hits;
    }, []),
  paramCount: 1,
  metadata: { type: "continuation", confidence: 0.7 },
});

const customPat = getPattern("esmBigBody");
const customResults = patternChain(data, [customPat]);
console.log(`esmBigBody hits: ${customResults.length}`);
customResults.forEach((r) => console.log(`  [${r.index}] ${r.pattern}`));

clearAllPatterns();

// --- 8. Named vs default import consistency ---------------------------------
console.log("\n8. Named vs default import consistency");
console.log("─".repeat(40));
import("candlestick").then((mod) => {
  const defaultHammer = mod.default?.hammer ?? mod.hammer;
  const namedResult = hammer(data);
  const defaultResult = defaultHammer(data);
  const same = JSON.stringify(namedResult) === JSON.stringify(defaultResult);
  console.log(`hammer() same via named/default: ${same}`);

  console.log("\n" + "=".repeat(60));
  console.log("ESM Module System Working ✓");
  console.log("=".repeat(60));
});
