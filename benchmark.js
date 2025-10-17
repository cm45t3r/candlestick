/* eslint-disable no-console */
/* eslint-env node */
/* global performance */
const { hammer } = require("./src/hammer.js");
const { precomputeCandleProps } = require("./src/utils.js");
const { patternChain, allPatterns } = require("./src/patternChain.js");

function generateCandles(n) {
  return Array.from({ length: n }, () => {
    const open = 50 + Math.random() * 50;
    const close = 50 + Math.random() * 50;
    const high = Math.max(open, close) + Math.random() * 10;
    const low = Math.min(open, close) - Math.random() * 10;
    return { open, high, low, close };
  });
}

function runBenchmark(size, name) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`Benchmark: ${name} (N=${size.toLocaleString()})`);
  console.log("=".repeat(60));

  const candles = generateCandles(size);
  const startMem = process.memoryUsage().heapUsed;

  // Precomputation benchmark
  const precomputeStart = performance.now();
  const precomputed = precomputeCandleProps(candles);
  const precomputeEnd = performance.now();
  const precomputeTime = precomputeEnd - precomputeStart;

  // Single pattern benchmark (hammer)
  const hammerPrecomputeStart = performance.now();
  const hammerResultsPrecomputed = hammer(precomputed);
  const hammerPrecomputeEnd = performance.now();
  const hammerPrecomputeTime = hammerPrecomputeEnd - hammerPrecomputeStart;

  const hammerRawStart = performance.now();
  hammer(candles);
  const hammerRawEnd = performance.now();
  const hammerRawTime = hammerRawEnd - hammerRawStart;

  // Pattern chain benchmark
  const chainPrecomputeStart = performance.now();
  const chainResultsPrecomputed = patternChain(precomputed, allPatterns);
  const chainPrecomputeEnd = performance.now();
  const chainPrecomputeTime = chainPrecomputeEnd - chainPrecomputeStart;

  const chainRawStart = performance.now();
  patternChain(candles, allPatterns);
  const chainRawEnd = performance.now();
  const chainRawTime = chainRawEnd - chainRawStart;

  const endMem = process.memoryUsage().heapUsed;
  const memDelta = ((endMem - startMem) / 1024 / 1024).toFixed(2);

  // Results
  console.log("\nPrecomputation:");
  console.log(`  Time: ${precomputeTime.toFixed(2)} ms`);
  console.log(
    `  Throughput: ${((size / precomputeTime) * 1000).toFixed(0)} candles/sec`,
  );

  console.log("\nHammer Pattern (single pattern):");
  console.log(`  With precompute: ${hammerPrecomputeTime.toFixed(2)} ms`);
  console.log(`  Without precompute: ${hammerRawTime.toFixed(2)} ms`);
  console.log(
    `  Speedup: ${(hammerRawTime / hammerPrecomputeTime).toFixed(2)}x`,
  );
  console.log(`  Matches found: ${hammerResultsPrecomputed.length}`);
  console.log(
    `  Throughput: ${((size / hammerPrecomputeTime) * 1000).toFixed(0)} candles/sec`,
  );

  console.log("\nPattern Chain (all patterns):");
  console.log(`  Patterns tested: ${allPatterns.length}`);
  console.log(`  With precompute: ${chainPrecomputeTime.toFixed(2)} ms`);
  console.log(`  Without precompute: ${chainRawTime.toFixed(2)} ms`);
  console.log(`  Speedup: ${(chainRawTime / chainPrecomputeTime).toFixed(2)}x`);
  console.log(`  Total matches found: ${chainResultsPrecomputed.length}`);
  console.log(
    `  Throughput: ${((size / chainPrecomputeTime) * 1000).toFixed(0)} candles/sec`,
  );
  console.log(
    `  Patterns per second: ${(((size * allPatterns.length) / chainPrecomputeTime) * 1000).toFixed(0)}`,
  );

  console.log("\nMemory:");
  console.log(`  Delta: ${memDelta} MB`);
  console.log(`  Per candle: ${((memDelta * 1024) / size).toFixed(2)} KB`);

  return {
    size,
    precomputeTime,
    hammerPrecomputeTime,
    hammerRawTime,
    chainPrecomputeTime,
    chainRawTime,
    hammerMatches: hammerResultsPrecomputed.length,
    chainMatches: chainResultsPrecomputed.length,
    memDelta: parseFloat(memDelta),
  };
}

// Main benchmark execution
console.log("Candlestick Pattern Detection Benchmark");
console.log("========================================");
console.log(`Node.js version: ${process.version}`);
console.log(`Platform: ${process.platform} ${process.arch}`);
console.log(
  `CPUs: ${require("os").cpus().length}x ${require("os").cpus()[0].model}`,
);

const sizes = [100, 1_000, 10_000, 100_000, 1_000_000];
const results = [];

for (const size of sizes) {
  const result = runBenchmark(
    size,
    `Dataset ${sizes.indexOf(size) + 1}/${sizes.length}`,
  );
  results.push(result);
}

// Summary table
console.log("\n" + "=".repeat(60));
console.log("SUMMARY TABLE");
console.log("=".repeat(60));
console.log(
  "\n| Size | Hammer (ms) | Chain (ms) | Chain Speed (candles/s) | Memory (MB) |",
);
console.log(
  "|------|-------------|------------|------------------------|-------------|",
);
for (const r of results) {
  const sizeStr = r.size.toLocaleString().padEnd(12);
  const hammerStr = r.hammerPrecomputeTime.toFixed(2).padEnd(11);
  const chainStr = r.chainPrecomputeTime.toFixed(2).padEnd(10);
  const speedStr = ((r.size / r.chainPrecomputeTime) * 1000)
    .toFixed(0)
    .padEnd(22);
  const memStr = r.memDelta.toFixed(2).padEnd(11);
  console.log(
    `| ${sizeStr} | ${hammerStr} | ${chainStr} | ${speedStr} | ${memStr} |`,
  );
}

console.log("\nBenchmark completed successfully! ✓");
