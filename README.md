# Candlestick

[![Node.js CI workflow](https://github.com/cm45t3r/candlestick/actions/workflows/node.js.yml/badge.svg)](https://github.com/cm45t3r/candlestick/actions/workflows/node.js.yml)
[![npm](https://img.shields.io/npm/v/candlestick.svg)](https://www.npmjs.com/package/candlestick)
[![npm downloads](https://img.shields.io/npm/dm/candlestick.svg)](https://www.npmjs.com/package/candlestick)
[![Coverage Status](https://coveralls.io/repos/github/cm45t3r/candlestick/badge.svg?branch=main)](https://coveralls.io/github/cm45t3r/candlestick?branch=main)
[![ESLint](https://img.shields.io/badge/code%20style-eslint-brightgreen.svg)](https://eslint.org/)
[![code style: prettier](https://img.shields.io/badge/code%20style-prettier-ff69b4.svg?style=flat)](https://prettier.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/cm45t3r/candlestick/pulls)
[![Contributors](https://img.shields.io/github/contributors/cm45t3r/candlestick.svg)](https://github.com/cm45t3r/candlestick/graphs/contributors)

A modern, modular JavaScript library for candlestick pattern detection. Detects classic reversal and continuation patterns in OHLC data, with a clean API and no native dependencies.

---

## Table of Contents
- [Why Candlestick?](#why-candlestick)
- [Features](#features)
- [Quick Start](#quick-start)
- [Usage](#usage)
- [Pattern Detection Functions](#pattern-detection-functions)
- [High-Level Pattern Chaining](#high-level-pattern-chaining)
- [Pattern Descriptions](#pattern-descriptions)
- [Examples](#examples)
- [Full Example Files](#full-example-files)
- [Linting & Formatting](#linting--formatting)
- [Running Tests](#running-tests)
- [Contributing](#contributing)
- [Changelog](#changelog)
- [Roadmap](#roadmap)
- [Code of Conduct](#code-of-conduct)
- [License](#license)

---

## Why Candlestick?
- **No native dependencies**: 100% JavaScript, works everywhere Node.js runs.
- **Modular**: Each pattern is its own module, easy to extend or customize.
- **Consistent API**: All pattern functions use a standard interface.
- **Pattern Chaining**: Scan for multiple patterns in a single pass.
- **Comprehensive Test Suite**: Each pattern and utility is unit tested.
- **Modern Tooling**: Uses ESLint (flat config) and Prettier for code quality and formatting.
- **Actively Maintained**: See [ROADMAP.md](./ROADMAP.md) and [CHANGELOG.md](./CHANGELOG.md).

---

## Features
- Modular pattern logic
- Consistent, easy-to-use API
- Pattern chaining for multi-pattern scans
- 100% test coverage, CI/CD ready
- Modern code style and documentation

---

## Quick Start

```bash
npm install candlestick
```

```js
const { isHammer, hammer, patternChain } = require('candlestick');

const candle = { open: 10, high: 15, low: 8, close: 14 };
console.log(isHammer(candle)); // true or false

const candles = [/* array of OHLC objects */];
console.log(hammer(candles)); // [indices]

const results = patternChain(candles);
console.log(results); // [{ index, pattern, match }]
```

---

## Usage

### Importing

```js
// Import all patterns (CommonJS)
const candlestick = require('candlestick');

// Or import only what you need (recommended for tree-shaking in ESM)
const { isHammer, hammer, patternChain } = require('candlestick');
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

---

## Pattern Detection Functions

### Boolean (Single/Pair) Detection
- `isHammer(candle)`
- `isBullishHammer(candle)` / `isBearishHammer(candle)`
- `isInvertedHammer(candle)`
- `isBullishInvertedHammer(candle)` / `isBearishInvertedHammer(candle)`
- `isDoji(candle)`
- `isBullishEngulfing(prev, curr)` / `isBearishEngulfing(prev, curr)`
- `isBullishHarami(prev, curr)` / `isBearishHarami(prev, curr)`
- `isBullishKicker(prev, curr)` / `isBearishKicker(prev, curr)`
- `isHangingMan(prev, curr)`
- `isShootingStar(prev, curr)`

### Array (Series) Detection
- `hammer(dataArray)` / `bullishHammer(dataArray)` / `bearishHammer(dataArray)`
- `invertedHammer(dataArray)` / `bullishInvertedHammer(dataArray)` / `bearishInvertedHammer(dataArray)`
- `doji(dataArray)`
- `bullishEngulfing(dataArray)` / `bearishEngulfing(dataArray)`
- `bullishHarami(dataArray)` / `bearishHarami(dataArray)`
- `bullishKicker(dataArray)` / `bearishKicker(dataArray)`
- `hangingMan(dataArray)` / `shootingStar(dataArray)`

All array functions return an array of indices where the pattern occurs.

---

## High-Level Pattern Chaining

Scan a series for multiple patterns in one pass:

```js
const { patternChain, allPatterns } = require('candlestick');

const matches = patternChain(dataArray, allPatterns);
// matches: [
//   { index: 3, pattern: 'hammer', match: [candleObj] },
//   { index: 7, pattern: 'bullishEngulfing', match: [candleObj, candleObj] },
//   ...
// ]
```

You can also pass a custom list of patterns:
```js
const matches = patternChain(dataArray, [
  { name: 'doji', fn: candlestick.doji },
  { name: 'bullishEngulfing', fn: candlestick.bullishEngulfing, paramCount: 2 },
]);
```

> **Multi-candle patterns:** Patterns like Engulfing, Harami, Kicker, Hanging Man, and Shooting Star span two candles. The `match` array in the result will contain both candles (length 2), thanks to the `paramCount` property. Single-candle patterns return a single-element array.

---

## Pattern Descriptions

- **Hammer**: Small body near the top (body < 1/3 of range), long lower shadow (tail ≥ 2× body), small upper shadow. Signals possible bullish reversal.
- **Inverted Hammer**: Small body near the bottom, long upper shadow (wick ≥ 2× body), small lower shadow. Bullish reversal signal.
- **Doji**: Very small body (body < 10% of range), open ≈ close. Indicates indecision. Candle must have range (high > low).
- **Engulfing**: Second candle's body fully engulfs the previous (body range covers previous body). Bullish or bearish.
- **Harami**: Second candle's body is inside the previous (body range within previous body). Bullish or bearish.
- **Kicker**: Strong reversal with a gap and opposite color. Bullish or bearish.
- **Hanging Man**: Bullish candle followed by a bearish hammer with a gap up. Bearish reversal.
- **Shooting Star**: Bullish candle followed by a bearish inverted hammer with a gap up. Bearish reversal.

> **Note:** The library does not mutate your input data. All pattern functions return new objects with precomputed properties (e.g., `bodyLen`, `wickLen`, etc.) as needed. If you plan to run many pattern detectors on the same data, you can precompute properties once using `precomputeCandleProps` from the utilities for better performance.

---

## Examples

### Boolean Detection
```js
const { isBullishKicker, isBearishKicker } = require('candlestick');

const prev = { open: 40.18, high: 41.03, low: 40.09, close: 40.86 };
const curr = { open: 39.61, high: 39.35, low: 38.71, close: 38.92 };

console.log(isBullishKicker(prev, curr)); // false
console.log(isBearishKicker(prev, curr)); // true
```

### Finding Patterns in Series
```js
const { shootingStar } = require('candlestick');

const data = [
  { open: 29.01, high: 29.03, low: 28.56, close: 28.64 },
  // ...
];

console.log(shootingStar(data)); // [index, ...]
```

### Pattern Chaining
```js
const { patternChain, allPatterns } = require('candlestick');
const matches = patternChain(data, allPatterns);
console.log(matches);
// [ { index: 3, pattern: 'hammer', match: [Object] }, ... ]
```

---

## Full Example Files

See the [`examples/`](./examples/) directory for runnable, copy-pasteable usage of every pattern and utility:

- [`examples/hammer.js`](./examples/hammer.js) — Hammer pattern detection
- [`examples/invertedHammer.js`](./examples/invertedHammer.js) — Inverted Hammer pattern detection
- [`examples/doji.js`](./examples/doji.js) — Doji pattern detection
- [`examples/engulfing.js`](./examples/engulfing.js) — Engulfing pattern detection
- [`examples/harami.js`](./examples/harami.js) — Harami pattern detection
- [`examples/kicker.js`](./examples/kicker.js) — Kicker pattern detection
- [`examples/reversal.js`](./examples/reversal.js) — Hanging Man and Shooting Star
- [`examples/patternChain.js`](./examples/patternChain.js) — Multi-pattern detection with patternChain
- [`examples/utils.js`](./examples/utils.js) — Utility functions: bodyLen, wickLen, tailLen, isBullish, isBearish, hasGapUp, hasGapDown, findPattern

See [`examples/README.md`](./examples/README.md) for more details and instructions.

---

## Linting & Formatting
- **ESLint**: Modern flat config (`eslint.config.js`)
- **Prettier**: For code formatting
- Run `npm run lint` and `npm run format` (if configured)

---

## Running Tests

```bash
npm test
```

---

## Contributing

- Please open [issues](https://github.com/cm45t3r/candlestick/issues) or [pull requests](https://github.com/cm45t3r/candlestick/pulls) for bugs, features, or questions.
- Add tests for new patterns or utilities.
- Follow the code style enforced by ESLint and Prettier.
- See [CONTRIBUTING.md](./CONTRIBUTING.md) for full guidelines.

---

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for release history and major changes.

---

## FAQ

**Q: Why is my pattern not detected?**
- Ensure your candle objects have all required fields (`open`, `high`, `low`, `close`).
- Check that the pattern’s technical thresholds are met (see Pattern Descriptions above).
- The library does not check for trend context (e.g., uptrend/downtrend) — it only looks at candle shapes.

**Q: Does this library mutate my data?**
- No. All computations are done on copies; your input data is never changed.

**Q: Can I use this with TypeScript?**
- The library is written in JS, but JSDoc comments provide some type hints. TypeScript support is planned (see ROADMAP.md).

**Q: Are there visual examples of patterns?**
- Not yet, but this is planned (see ROADMAP.md). For now, see the pattern descriptions and links to external resources.

---

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for planned features and future directions.

---

## Code of Conduct

See [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) for community standards and enforcement.

---

## License

MIT. See [LICENSE](./LICENSE).
