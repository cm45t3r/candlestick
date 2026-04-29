/* eslint-disable no-console */
// Example: Pattern detection on realistic market data with date field
//
// Demonstrates:
//  - Extra fields (date, volume) pass through match results unchanged
//  - precomputeCandleProps for running many patterns efficiently
//  - Gap detection across a full series
//  - Frequency breakdown of detected patterns

const {
  patternChain,
  allPatterns,
  utils: { precomputeCandleProps, hasGapUp, hasGapDown, bodyLen },
  metadata: { enrichWithMetadata, filterByConfidence, filterByType },
} = require("candlestick");

// Realistic BTC-like daily data (open, high, low, close, date, volume)
// Extra fields (date, volume) are preserved in match results.
const data = [
  {
    date: "2024-01-01",
    open: 42000,
    high: 42500,
    low: 41800,
    close: 42200,
    volume: 18200,
  },
  {
    date: "2024-01-02",
    open: 42200,
    high: 43100,
    low: 42000,
    close: 42900,
    volume: 22400,
  },
  {
    date: "2024-01-03",
    open: 42900,
    high: 43800,
    low: 42700,
    close: 43500,
    volume: 31000,
  },
  {
    date: "2024-01-04",
    open: 43500,
    high: 44200,
    low: 43200,
    close: 43800,
    volume: 27800,
  },
  {
    date: "2024-01-05",
    open: 43800,
    high: 44000,
    low: 41200,
    close: 41300,
    volume: 45000,
  }, // bearish
  {
    date: "2024-01-06",
    open: 41200,
    high: 46000,
    low: 40900,
    close: 45800,
    volume: 61000,
  }, // bullish engulfing
  {
    date: "2024-01-07",
    open: 45800,
    high: 46200,
    low: 45600,
    close: 45900,
    volume: 19000,
  },
  {
    date: "2024-01-08",
    open: 45900,
    high: 46100,
    low: 45700,
    close: 45700,
    volume: 16000,
  }, // doji-ish
  {
    date: "2024-01-09",
    open: 45700,
    high: 46500,
    low: 45600,
    close: 46300,
    volume: 24000,
  },
  {
    date: "2024-01-10",
    open: 46300,
    high: 47000,
    low: 46100,
    close: 46900,
    volume: 28000,
  },
  {
    date: "2024-01-11",
    open: 46900,
    high: 47200,
    low: 46800,
    close: 47100,
    volume: 14000,
  },
  {
    date: "2024-01-12",
    open: 47100,
    high: 47100,
    low: 44000,
    close: 44100,
    volume: 52000,
  }, // hammer
  {
    date: "2024-01-13",
    open: 44100,
    high: 48500,
    low: 43900,
    close: 48200,
    volume: 67000,
  }, // bullish engulfing
  {
    date: "2024-01-14",
    open: 48200,
    high: 49000,
    low: 48000,
    close: 48700,
    volume: 31000,
  },
  {
    date: "2024-01-15",
    open: 48700,
    high: 49100,
    low: 48500,
    close: 48600,
    volume: 20000,
  },
];

console.log("═".repeat(60));
console.log("  Real-Data Example");
console.log("═".repeat(60));

// --- 1. precomputeCandleProps -----------------------------------------------
// When running many patterns on the same dataset, precompute once.
// Computed props (bodyLen, wickLen, tailLen, isBullish, isBearish, bodyEnds)
// are attached to each candle; extra fields (date, volume) are preserved.

const precomputed = precomputeCandleProps(data);

console.log("\n=== 1. precomputeCandleProps ===");
console.log("  Run this once, then pass to any number of pattern functions.");
console.log(`  date field intact on first candle: ${precomputed[0].date}`);
console.log(`  volume field intact on first candle: ${precomputed[0].volume}`);
console.log(`  bodyLen computed: ${bodyLen(precomputed[0]).toFixed(2)}`);

// --- 2. patternChain on precomputed data ------------------------------------

const results = patternChain(precomputed, allPatterns);

console.log("\n=== 2. patternChain (all patterns) ===");
console.log(`  ${results.length} occurrences across ${data.length} candles\n`);

results.forEach((r) => {
  const candle = r.match[0];
  const dateStr = candle.date ?? "—";
  console.log(`  [${String(r.index).padStart(2)}] ${dateStr}  ${r.pattern}`);
});

// --- 3. Extra fields pass through match results ------------------------------

console.log("\n=== 3. Extra fields in match results ===");
results.slice(0, 3).forEach((r) => {
  const c = r.match[0];
  console.log(`  ${r.pattern}: date=${c.date}  volume=${c.volume}`);
});

// --- 4. Metadata + confidence filter ----------------------------------------

const enriched = enrichWithMetadata(results);
const strong = filterByConfidence(enriched, 0.8);
const reversals = filterByType(enriched, "reversal");

console.log("\n=== 4. Metadata filters ===");
console.log(`  All matches:          ${enriched.length}`);
console.log(`  Confidence >= 0.8:    ${strong.length}`);
console.log(`  Reversal patterns:    ${reversals.length}`);

if (strong.length > 0) {
  console.log("\n  Strong matches:");
  strong.forEach((r) => {
    console.log(
      `    ${r.pattern.padEnd(22)} conf: ${r.metadata.confidence}  ${r.metadata.direction}`,
    );
  });
}

// --- 5. Gap detection across the series -------------------------------------

console.log("\n=== 5. Gap detection ===");
for (let i = 1; i < precomputed.length; i++) {
  const prev = precomputed[i - 1];
  const curr = precomputed[i];
  if (hasGapUp(prev, curr)) {
    console.log(
      `  Gap UP   between [${i - 1}] ${prev.date} and [${i}] ${curr.date}`,
    );
  } else if (hasGapDown(prev, curr)) {
    console.log(
      `  Gap DOWN between [${i - 1}] ${prev.date} and [${i}] ${curr.date}`,
    );
  }
}

// --- 6. Pattern frequency breakdown -----------------------------------------

console.log("\n=== 6. Pattern frequency ===");
const freq = {};
for (const r of results) {
  freq[r.pattern] = (freq[r.pattern] || 0) + 1;
}
Object.entries(freq)
  .sort((a, b) => b[1] - a[1])
  .forEach(([name, count]) => {
    console.log(`  ${name.padEnd(24)} ${count}`);
  });

console.log("\n" + "═".repeat(60));
console.log("  Done.");
console.log("═".repeat(60));
