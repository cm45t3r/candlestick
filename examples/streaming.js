/* eslint-disable no-console */
// Example: Using Streaming API for large datasets

const candlestick = require("candlestick");

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

console.log(`   Found ${matches.length} pattern occurrences`);
console.log(`   Pattern types monitored: ${summary.patternsDetected}`);
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
//
// The saving comes from never holding the whole dataset resident, so a fair
// demonstration has to:
//   (a) exceed the 100K candles the README scopes the claim to;
//   (b) generate the streaming input chunk by chunk — an array you build up
//       front is resident whether or not you stream it;
//   (c) count matches instead of collecting them, since retaining all output
//       costs more than the input it saves;
//   (d) compare *live* heap after a forced GC, not raw heapUsed, which is
//       mostly uncollected garbage.
// Run with `node --expose-gc`; without it the numbers move with GC timing.
console.log("\n3. Memory efficiency demo:");

const MEMO_SIZE = 200_000;
const MEMO_CHUNK = 1000;
const MEMO_PATTERNS = candlestick.allPatterns.slice(0, 5);
const MEMO_NAMES = MEMO_PATTERNS.map((p) => p.name);

// Deterministic feed: both paths see the identical candle sequence, so the
// match counts below should agree exactly. They are the proof that the two
// measurements describe the same work.
function makeFeed(seed) {
  let state = seed;
  let price = 100;
  const rand = () => {
    state = (state * 1103515245 + 12345) % 2147483648;
    return state / 2147483648;
  };
  return function next(count) {
    const out = [];
    for (let i = 0; i < count; i++) {
      price += (rand() - 0.5) * 5;
      const close = price + (rand() - 0.5);
      out.push({
        open: price,
        high: Math.max(price, close) + rand() * 2,
        low: Math.min(price, close) - rand() * 2,
        close,
      });
    }
    return out;
  };
}

// Live heap: what is still reachable after a collection, i.e. what the
// approach actually requires resident.
function liveHeapMb() {
  if (global.gc) global.gc();
  return process.memoryUsage().heapUsed / 1024 / 1024;
}

// Without --expose-gc a sample can land after a collection the previous one
// missed, making a delta negative. Floor it at zero rather than printing a
// nonsensical figure.
function delta(now, base) {
  return Math.max(0, now - base);
}

console.log(`   Dataset: ${MEMO_SIZE.toLocaleString()} candles`);
if (!global.gc) {
  console.log("   (run with `node --expose-gc` for stable measurements)");
}

// Batch: the whole dataset must exist as one array before detection starts,
// and every match comes back at once. Both are alive when we sample.
console.log("\n   Regular patternChain:");
const batchBase = liveHeapMb();
let batchMatches;
let batchLive;
{
  const feed = makeFeed(42);
  const all = feed(MEMO_SIZE);
  const found = candlestick.patternChain(all, MEMO_PATTERNS);
  batchLive = delta(liveHeapMb(), batchBase); // all + found still referenced here
  batchMatches = found.length;
}

console.log(`     Live heap: ${batchLive.toFixed(2)} MB`);
console.log(`     Matches found: ${batchMatches}`);

// Streaming: candles are produced a chunk at a time and dropped once
// processed, and matches are counted as they arrive. Sampled mid-run, where
// the stream is carrying its buffer and everything else is garbage.
console.log("\n   Streaming approach:");
const streamBase = liveHeapMb();
let streamMatches = 0;
let streamLive = 0;
const memoStream = candlestick.streaming.createStream({
  patterns: MEMO_NAMES,
  chunkSize: MEMO_CHUNK,
  onMatch: () => {
    streamMatches++;
  },
});
const streamFeed = makeFeed(42);
for (let i = 0; i < MEMO_SIZE; i += MEMO_CHUNK) {
  memoStream.process(streamFeed(Math.min(MEMO_CHUNK, MEMO_SIZE - i)));
  if (i === Math.floor(MEMO_SIZE / 2 / MEMO_CHUNK) * MEMO_CHUNK) {
    streamLive = delta(liveHeapMb(), streamBase);
  }
}
memoStream.end();

console.log(`     Live heap: ${streamLive.toFixed(2)} MB`);
console.log(`     Matches found: ${streamMatches}`);

const savings = batchLive > 0 ? (1 - streamLive / batchLive) * 100 : 0;
console.log(
  `\n   Memory savings: ~${Math.min(99.9, Math.max(0, savings)).toFixed(1)}%` +
    ` (${batchMatches === streamMatches ? "identical" : "DIFFERING"} match counts)` +
    (global.gc ? "" : " — approximate, no --expose-gc"),
);
console.log(
  "   Streaming memory is bounded by chunkSize, so the gap widens with dataset size.",
);

console.log("\n=== Demo Complete ===");
