/* eslint-disable no-console */
/* eslint-env node */
const { hammer } = require('./src/hammer.js');
const { precomputeCandleProps } = require('./src/utils.js');
const { patternChain, allPatterns } = require('./src/patternChain.js');

function printMemory(label) {
  const mem = process.memoryUsage();
  console.log(`${label} Memory: RSS ${(mem.rss / 1024 / 1024).toFixed(1)} MB, Heap ${(mem.heapUsed / 1024 / 1024).toFixed(1)} MB`);
}

// Generate a large array of random candles
const N = 1_000_000;
const candles = Array.from({ length: N }, () => ({
  open: Math.random() * 100,
  high: Math.random() * 100 + 10,
  low: Math.random() * 100,
  close: Math.random() * 100,
}));

printMemory('Initial');

// Hammer benchmark (single pattern)
const precomputed = precomputeCandleProps(candles);
printMemory('After precompute');
const t0 = Date.now();
hammer(precomputed);
const t1 = Date.now();
printMemory('After hammer (precompute)');
const t2 = Date.now();
hammer(candles);
const t3 = Date.now();
printMemory('After hammer (no precompute)');

console.log(`\nHammer detection (N=${N}):`);
console.log(`  With precompute: ${t1 - t0} ms`);
console.log(`  Without precompute: ${t3 - t2} ms`);

// patternChain benchmark (multi-pattern)
const t4 = Date.now();
patternChain(precomputed, allPatterns);
const t5 = Date.now();
printMemory('After patternChain (precompute)');
const t6 = Date.now();
patternChain(candles, allPatterns);
const t7 = Date.now();
printMemory('After patternChain (no precompute)');

console.log(`\npatternChain (allPatterns, N=${N}):`);
console.log(`  With precompute: ${t5 - t4} ms`);
console.log(`  Without precompute: ${t7 - t6} ms`); 