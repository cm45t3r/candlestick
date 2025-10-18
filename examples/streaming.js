// Example: Using Streaming API for large datasets

const candlestick = require("../index.js");

// Generate large dataset
function generateLargeDataset(size) {
  const data = [];
  let price = 100;

  for (let i = 0; i < size; i++) {
    const volatility = 5;
    const change = (Math.random() - 0.5) * volatility;
    price += change;

    const high = price + Math.random() * 2;
    const low = price - Math.random() * 2;
    const close = price + (Math.random() - 0.5) * 1;

    data.push({
      open: price,
      high: Math.max(price, close, high),
      low: Math.min(price, close, low),
      close: close,
    });
  }

  return data;
}

console.log("=== Streaming API Demo ===\n");

// Example 1: Using createStream with callbacks
console.log("1. Streaming with callbacks:");

const matches = [];
const stream = candlestick.streaming.createStream({
  patterns: ["hammer", "doji", "marubozu"],
  chunkSize: 1000,
  onMatch: (match) => {
    matches.push(match);
  },
  onProgress: (progress) => {
    if (progress.complete) {
      console.log(
        `   ✓ Processing complete: ${progress.processed} candles processed`,
      );
    }
  },
  enrichMetadata: true,
});

// Generate and process large dataset
const data = generateLargeDataset(10000);

console.log(`   Processing ${data.length} candles...`);

// Process in chunks
const chunkSize = 2500;
for (let i = 0; i < data.length; i += chunkSize) {
  const chunk = data.slice(i, i + chunkSize);
  stream.process(chunk);
}

const summary = stream.end();

console.log(`   Found ${matches.length} patterns`);
console.log(`   Patterns detected: ${summary.patternsDetected}`);
console.log(`   Total processed: ${summary.totalProcessed}\n`);

// Show sample matches
if (matches.length > 0) {
  console.log("   Sample matches:");
  matches.slice(0, 3).forEach((m) => {
    console.log(
      `     - ${m.pattern} at index ${m.index} (confidence: ${m.metadata?.confidence || "N/A"})`,
    );
  });
}

// Example 2: Using processLargeDataset helper
console.log("\n2. Using processLargeDataset helper:");

const data2 = generateLargeDataset(5000);
console.log(`   Processing ${data2.length} candles...`);

const results = candlestick.streaming.processLargeDataset(data2, {
  patterns: null, // All patterns
  chunkSize: 1000,
  enrichMetadata: true,
});

console.log(`   Found ${results.length} total patterns`);

// Group by pattern type
const byPattern = {};
results.forEach((r) => {
  byPattern[r.pattern] = (byPattern[r.pattern] || 0) + 1;
});

console.log("\n   Patterns breakdown:");
Object.entries(byPattern)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5)
  .forEach(([pattern, count]) => {
    console.log(`     - ${pattern}: ${count}`);
  });

// Example 3: Memory comparison
console.log("\n3. Memory efficiency demo:");

const largeData = generateLargeDataset(50000);

console.log(`   Dataset: ${largeData.length} candles`);

// Regular patternChain (loads all in memory)
console.log("\n   Regular patternChain:");
const memBefore = process.memoryUsage().heapUsed / 1024 / 1024;
const regularResults = candlestick.patternChain(
  largeData,
  candlestick.allPatterns.slice(0, 5),
);
const memAfter = process.memoryUsage().heapUsed / 1024 / 1024;
console.log(`     Memory delta: ${(memAfter - memBefore).toFixed(2)} MB`);
console.log(`     Matches found: ${regularResults.length}`);

// Streaming approach
console.log("\n   Streaming approach:");
const memBefore2 = process.memoryUsage().heapUsed / 1024 / 1024;
const streamResults = candlestick.streaming.processLargeDataset(largeData, {
  patterns: candlestick.allPatterns.slice(0, 5).map((p) => p.name),
  chunkSize: 1000,
});
const memAfter2 = process.memoryUsage().heapUsed / 1024 / 1024;
console.log(`     Memory delta: ${(memAfter2 - memBefore2).toFixed(2)} MB`);
console.log(`     Matches found: ${streamResults.length}`);

console.log(
  "\n   Memory savings: ~",
  ((1 - (memAfter2 - memBefore2) / (memAfter - memBefore)) * 100).toFixed(1),
  "%",
);

console.log("\n=== Demo Complete ===");
