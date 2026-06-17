# Candlestick

[![Node.js CI workflow](https://github.com/cm45t3r/candlestick/actions/workflows/node.js.yml/badge.svg)](https://github.com/cm45t3r/candlestick/actions/workflows/node.js.yml)
[![npm](https://img.shields.io/npm/v/candlestick.svg)](https://www.npmjs.com/package/candlestick)
[![npm downloads](https://img.shields.io/npm/dm/candlestick.svg)](https://www.npmjs.com/package/candlestick)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/candlestick)](https://bundlephobia.com/package/candlestick)
[![Coverage Status](https://coveralls.io/repos/github/cm45t3r/candlestick/badge.svg?branch=main)](https://coveralls.io/github/cm45t3r/candlestick?branch=main)
[![Socket Badge](https://socket.dev/api/badge/npm/package/candlestick)](https://socket.dev/npm/package/candlestick)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/cm45t3r/candlestick/pulls)

A modern, modular JavaScript library for [candlestick pattern](https://en.wikipedia.org/wiki/Candlestick_chart) detection. Detects classic reversal and continuation patterns in OHLC (Open, High, Low, Close) price data, with a clean API and no native dependencies.

- 18 candlestick patterns, 29 variants across single, two, and three-candle formations
- ESM & CommonJS dual export with full TypeScript definitions
- Streaming API for massive datasets (~70% memory reduction)
- Plugin system for custom patterns, data validation, pattern metadata
- Comprehensive test suite with high coverage (run `npm test` and `npm run coverage`)
- Zero runtime dependencies

> **Requires Node.js >= 20**

---

## Table of Contents

- [Quick Start](#quick-start)
- [Usage](#usage)
- [Pattern Detection Functions](#pattern-detection-functions)
- [High-Level Pattern Chaining](#high-level-pattern-chaining)
- [Examples](#examples)
- [Full Example Files](#full-example-files)
- [Performance](#performance)
- [Development](#development)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [Upgrading from v1.x](#upgrading-from-v1x)
- [FAQ](#faq)
- [Changelog](#changelog)
- [Roadmap](#roadmap)
- [Code of Conduct](#code-of-conduct)
- [License](#license)

---

## Quick Start

### Installation

```bash
npm install candlestick
```

### CommonJS (Node.js)

```js
const { isHammer, hammer, patternChain, allPatterns } = require("candlestick");

// Check single candle (small body in upper third, long lower shadow, tiny upper shadow)
const candle = { open: 14, high: 15, low: 8, close: 14.5 };
console.log(isHammer(candle)); // true

// Find patterns in series
const candles = [
  { open: 14, high: 15, low: 8, close: 14.5 },
  { open: 13, high: 18, low: 13, close: 13.2 },
  { open: 12, high: 12.5, low: 7, close: 12.1 },
];
console.log(hammer(candles)); // [ 0, 2 ]

// Detect all patterns at once
const results = patternChain(candles, allPatterns);
console.log(results); // [{ index, pattern, match }]
```

### ESM (Modern JavaScript)

```js
import { isHammer, hammer, patternChain, allPatterns } from "candlestick";

const candles = [
  { open: 14, high: 15, low: 8, close: 14.5 },
  { open: 13, high: 18, low: 13, close: 13.2 },
  { open: 12, high: 12.5, low: 7, close: 12.1 },
];
const results = patternChain(candles, allPatterns);
console.log(results);
```

### TypeScript

```typescript
import { OHLC, PatternMatch, patternChain, allPatterns } from "candlestick";

const candles: OHLC[] = [
  { open: 10, high: 15, low: 8, close: 12 },
  { open: 12, high: 16, low: 11, close: 14 },
];

const results: PatternMatch[] = patternChain(candles, allPatterns);
// Full IntelliSense support ✓
```

---

## Usage

### Importing

**CommonJS (Node.js):**

```js
// Import all patterns
const candlestick = require("candlestick");

// Or import only what you need
const { isHammer, hammer, patternChain } = require("candlestick");
```

**ESM (Modern JavaScript):**

```js
// Import all patterns
import candlestick from "candlestick";

// Or import only what you need (recommended for tree-shaking)
import { isHammer, hammer, patternChain } from "candlestick";
```

### OHLC Format

All functions expect objects with at least:

```js
{
  open: Number,
  high: Number,
  low: Number,
  close: Number
}
```

Extra fields (`date`, `volume`, etc.) are **preserved unchanged** and passed through to every `match` result, so you can attach any metadata you need:

```js
const data = [
  {
    date: "2024-01-06",
    open: 41490,
    high: 41500,
    low: 39200,
    close: 41500,
    volume: 61000,
  },
  // ...
];

const results = patternChain(data, allPatterns);
console.log(results[0].match[0].date); // "2024-01-06"
console.log(results[0].match[0].volume); // 61000
```

---

## Pattern Detection Functions

### Boolean (Single/Pair) Detection — returns `boolean`

**Single candle:**

- `isHammer(candle)` / `isBullishHammer(candle)` / `isBearishHammer(candle)`
- `isInvertedHammer(candle)` / `isBullishInvertedHammer(candle)` / `isBearishInvertedHammer(candle)`
- `isDoji(candle)`
- `isMarubozu(candle)` / `isBullishMarubozu(candle)` / `isBearishMarubozu(candle)`
- `isSpinningTop(candle)` / `isBullishSpinningTop(candle)` / `isBearishSpinningTop(candle)`

**Two candles:**

- `isBullishEngulfing(prev, curr)` / `isBearishEngulfing(prev, curr)`
- `isBullishHarami(prev, curr)` / `isBearishHarami(prev, curr)`
- `isBullishKicker(prev, curr)` / `isBearishKicker(prev, curr)`
- `isHangingMan(prev, curr)` / `isShootingStar(prev, curr)`
- `isPiercingLine(prev, curr)` / `isDarkCloudCover(prev, curr)`
- `isTweezers(prev, curr)` / `isTweezersTop(prev, curr)` / `isTweezersBottom(prev, curr)`

**Three candles:**

- `isMorningStar(c1, c2, c3)` / `isEveningStar(c1, c2, c3)`
- `isThreeWhiteSoldiers(c1, c2, c3)` / `isThreeBlackCrows(c1, c2, c3)`

### Array (Series) Detection — returns `number[]` (indices)

**Single candle:**

- `hammer(dataArray)` / `bullishHammer(dataArray)` / `bearishHammer(dataArray)`
- `invertedHammer(dataArray)` / `bullishInvertedHammer(dataArray)` / `bearishInvertedHammer(dataArray)`
- `doji(dataArray)`
- `marubozu(dataArray)` / `bullishMarubozu(dataArray)` / `bearishMarubozu(dataArray)`
- `spinningTop(dataArray)` / `bullishSpinningTop(dataArray)` / `bearishSpinningTop(dataArray)`

**Two candles:**

- `bullishEngulfing(dataArray)` / `bearishEngulfing(dataArray)`
- `bullishHarami(dataArray)` / `bearishHarami(dataArray)`
- `bullishKicker(dataArray)` / `bearishKicker(dataArray)`
- `hangingMan(dataArray)` / `shootingStar(dataArray)`
- `piercingLine(dataArray)` / `darkCloudCover(dataArray)`
- `tweezers(dataArray)` / `tweezersTop(dataArray)` / `tweezersBottom(dataArray)`

**Three candles:**

- `morningStar(dataArray)` / `eveningStar(dataArray)`
- `threeWhiteSoldiers(dataArray)` / `threeBlackCrows(dataArray)`

---

## High-Level Pattern Chaining

Scan a series for multiple patterns in one pass:

```js
const { patternChain, allPatterns } = require("candlestick");

const matches = patternChain(dataArray, allPatterns);
// matches: [
//   { index: 3, pattern: 'hammer', match: [candleObj] },
//   { index: 7, pattern: 'bullishEngulfing', match: [candleObj, candleObj] },
//   ...
// ]
```

You can also pass a custom list of patterns:

```js
const { patternChain, doji, bullishEngulfing } = require("candlestick");

const matches = patternChain(dataArray, [
  { name: "doji", fn: doji },
  { name: "bullishEngulfing", fn: bullishEngulfing, paramCount: 2 },
]);
```

### Strict Mode

Pass `{ strict: true }` to throw on invalid OHLC data instead of silently skipping:

```js
patternChain(dataArray, allPatterns, { strict: true });
// throws if any candle has high < low, NaN fields, etc.
```

> **Multi-candle patterns:** Two-candle patterns (Engulfing, Harami, Kicker, Hanging Man, Shooting Star, Piercing Line, Dark Cloud Cover, Tweezers Top/Bottom) return a `match` array with 2 candles. Three-candle patterns (Morning Star, Evening Star, Three White Soldiers, Three Black Crows) return 3. Single-candle patterns return 1. This is driven by the `paramCount` property on each pattern definition.

---

## Pattern Descriptions

The library detects 18 patterns across 29 variants:

| Category | Patterns |
|---|---|
| **Single candle** | Hammer, Inverted Hammer, Doji, Marubozu, Spinning Top |
| **Two candle** | Engulfing, Harami, Kicker, Hanging Man, Shooting Star, Piercing Line, Dark Cloud Cover, Tweezers Top/Bottom |
| **Three candle** | Morning Star, Evening Star, Three White Soldiers, Three Black Crows |

Each pattern includes bullish/bearish variants where applicable. For detailed descriptions with detection thresholds, see [docs/PATTERNS.md](./docs/PATTERNS.md).

> **Note:** The library does not mutate your input data. Pattern functions return arrays of indices; `precomputeCandleProps` returns new enriched candle objects. When calling multiple pattern functions on the same raw array, precompute once for better performance (see [Performance](#performance)). `patternChain` handles this internally.

---

## Examples

### Boolean Detection

```js
const { isBullishKicker, isBearishKicker } = require("candlestick");

// Bullish candle, then bearish candle gapping down → bearish kicker
const prev = { open: 40, high: 41, low: 39.5, close: 40.8 };
const curr = { open: 39.5, high: 39.8, low: 38.5, close: 38.9 };

console.log(isBullishKicker(prev, curr)); // false
console.log(isBearishKicker(prev, curr)); // true
```

### Finding Patterns in Series

```js
const { shootingStar } = require("candlestick");

const data = [
  { open: 29.01, high: 29.03, low: 28.56, close: 28.64 },
  // ...
];

console.log(shootingStar(data)); // [index, ...]
```

### Pattern Chaining

```js
const { patternChain, allPatterns } = require("candlestick");
const matches = patternChain(data, allPatterns);
console.log(matches);
// [ { index: 3, pattern: 'hammer', match: [Object] }, ... ]
```

### Streaming API

For processing very large datasets efficiently with reduced memory usage:

```js
const { streaming } = require("candlestick");

// Option 1: Using createStream with callbacks
const stream = streaming.createStream({
  patterns: ["hammer", "doji", "marubozu"],
  chunkSize: 1000,
  onMatch: (match) => console.log(match),
  enrichMetadata: true,
});

// Process data in chunks
for (const chunk of dataChunks) {
  stream.process(chunk);
}
stream.end();

// Option 2: Simple helper for large datasets
const results = streaming.processLargeDataset(largeData, {
  patterns: null, // all patterns
  chunkSize: 1000,
  enrichMetadata: true,
});
```

**Benefits:** Reduces memory usage by ~70% for datasets > 100K candles

### Data Validation

```js
const { validateOHLC, validateOHLCArray } = require("candlestick").utils;

// Validate single candle
try {
  validateOHLC({ open: 10, high: 15, low: 8, close: 12 });
  console.log("Valid candle ✓");
} catch (error) {
  console.error("Invalid:", error.message);
}

// Validate array of candles
validateOHLCArray(candles); // throws on invalid data
```

### Plugin System

```js
const { plugins, patternChain } = require('candlestick');

// Register custom pattern
plugins.registerPattern({
  name: 'myCustomPattern',
  fn: (dataArray) => {
    return dataArray
      .map((c, i) => (c.close > c.open && c.close === c.high) ? i : -1)
      .filter(idx => idx !== -1);
  },
  paramCount: 1,
  metadata: { type: 'reversal', confidence: 0.85 }
});

// Use with patternChain
const customPattern = plugins.getPattern('myCustomPattern');
const results = patternChain(data, [customPattern]);
```

For more details on the plugin system, see [docs/PLUGIN_API.md](./docs/PLUGIN_API.md).

### CLI Tool

Detect patterns from command line:

```bash
# Install globally
npm install -g candlestick

# Detect patterns in JSON file
candlestick -i data.json --output table --metadata

# Filter by confidence
candlestick -i data.csv --confidence 0.85 --output csv

# Bullish reversals only
candlestick -i data.json --type reversal --direction bullish

# Use with pipes
cat data.json | candlestick --output table
```

For complete CLI documentation, see [docs/CLI_GUIDE.md](./docs/CLI_GUIDE.md).

---

## Full Example Files

See the [`examples/`](./examples/) directory for runnable, copy-pasteable usage of every pattern and utility:

**Single Candle Patterns:**

- [`examples/hammer.js`](./examples/hammer.js) — Hammer pattern detection
- [`examples/invertedHammer.js`](./examples/invertedHammer.js) — Inverted Hammer pattern detection
- [`examples/doji.js`](./examples/doji.js) — Doji pattern detection

**Two Candle Patterns:**

- [`examples/engulfing.js`](./examples/engulfing.js) — Engulfing pattern detection
- [`examples/harami.js`](./examples/harami.js) — Harami pattern detection
- [`examples/kicker.js`](./examples/kicker.js) — Kicker pattern detection
- [`examples/reversal.js`](./examples/reversal.js) — Hanging Man and Shooting Star

**Multi-Pattern Detection:**

- [`examples/patternChain.js`](./examples/patternChain.js) — Multi-pattern detection with patternChain
- [`examples/newPatterns.js`](./examples/newPatterns.js) — Morning/Evening Star, Three Soldiers/Crows, Piercing Line, Dark Cloud Cover
- [`examples/newPatternsV2.js`](./examples/newPatternsV2.js) — Marubozu, Spinning Top, Tweezers
- [`examples/streaming.js`](./examples/streaming.js) — Streaming API for large datasets
- [`examples/esm-example.mjs`](./examples/esm-example.mjs) — ESM module syntax example
- [`examples/metadata.js`](./examples/metadata.js) — Pattern metadata, filtering, and sorting

**Utilities:**

- [`examples/utils.js`](./examples/utils.js) — Utility functions: bodyLen, wickLen, tailLen, isBullish, isBearish, hasGapUp, hasGapDown, findPattern
- [`examples/real-data.js`](./examples/real-data.js) — Real market data with date/volume fields, precomputeCandleProps, gap detection, and frequency breakdown

See [`examples/README.md`](./examples/README.md) for more details and instructions.

---

## Performance

<!-- BENCH:START -->
| Dataset Size | Pattern Chain (ms) | Throughput (candles/sec) | Memory (MB) |
|---|---|---|---|
| 1,000 | 5.2 | 194K | 1.9 |
| 10,000 | 23.2 | 431K | 17.2 |
| 100,000 | 253.8 | 394K | 114.4 |
| 1,000,000 | 2016.2 | 496K | 969.7 |
<!-- BENCH:END -->

When calling multiple pattern functions on the same dataset, use `precomputeCandleProps` to avoid redundant work:

```js
const { hammer, doji, utils } = require("candlestick");

const precomputed = utils.precomputeCandleProps(data);
const hammers = hammer(precomputed);
const dojis = doji(precomputed);
```

`patternChain` handles this internally — no manual call needed there.

Run `npm run bench` for full benchmark results on your hardware. The numbers above were measured on the maintainer's machine and may vary.

---

## Development

```bash
npm test              # run 347 tests
npm run test:watch    # watch mode
npm run coverage      # coverage report (c8)
npm run lint          # eslint
npm run format        # prettier
npm run bench         # benchmark suite
```

---

## Architecture

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for an overview of the library's design and module structure.

---

## Contributing

- Please open [issues](https://github.com/cm45t3r/candlestick/issues) or [pull requests](https://github.com/cm45t3r/candlestick/pulls) for bugs, features, or questions.
- Add tests for new patterns or utilities.
- Follow the code style enforced by ESLint and Prettier.
- Run `npm run lint` and `npm run format` before submitting.
- See [CONTRIBUTING.md](./CONTRIBUTING.md) for full guidelines.

---

## Upgrading from v1.x

v2.0.0 is a breaking release. Required changes:

1. **Node.js >= 20 required.** Node 18 reached EOL on 2025-04-30 and is no longer supported. Update your runtime and CI matrix.

2. **Error cause chain in `validateOHLCArray`.** Re-thrown errors now include `{ cause: originalError }`. If you inspect error objects (e.g., `error instanceof` checks or `error.message` parsing), be aware that the original error is now available via `error.cause`.

No API changes — all pattern functions, exports, and types remain the same.

---

## FAQ

**Q: Why is my pattern not detected?**

Ensure your candle objects have all required fields (`open`, `high`, `low`, `close`). Check that the pattern's technical thresholds are met (see [Pattern Descriptions](#pattern-descriptions)). The library does not check for trend context (e.g., uptrend/downtrend) — it only looks at candle shapes.

**Q: Does this work in the browser?**

The core library is pure JavaScript with no Node.js-specific APIs, so it works in any bundler (webpack, Vite, esbuild, etc.). The `candlestick/cli` subpath is Node-only and is excluded from browser builds automatically via the `"node"` export condition.

**Q: Does this library mutate my data?**

No. All computations are done on copies; your input data is never changed.

**Q: Can I use this with TypeScript?**

Yes. The library includes complete TypeScript definitions in `types/index.d.ts`. Full type safety and IntelliSense support available.

**Q: How do I add a custom pattern?**

Use the plugin system — call `plugins.registerPattern()` with your detection function, then pass it to `patternChain`. See the [Plugin System](#plugin-system) example or [docs/PLUGIN_API.md](./docs/PLUGIN_API.md).

**Q: What's the performance with 1M candles?**

Pattern chain across all 29 variants processes 1M candles in ~2.3 seconds (438K candles/sec). Single-pattern detection (e.g., `hammer`) reaches 12.4M candles/sec. See [Performance](#performance) for the full table.

**Q: Are there visual examples of patterns?**

Not yet, but this is planned (see [ROADMAP.md](./docs/ROADMAP.md)). For now, see the [Pattern Descriptions](#pattern-descriptions) section.

---

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for full release history.

---

## Roadmap

See [ROADMAP.md](./docs/ROADMAP.md) for planned features and future directions.

---

## Code of Conduct

See [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) for community standards and enforcement.

---

## License

MIT. See [LICENSE](./LICENSE).
