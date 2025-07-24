# Candlestick

![Node.js CI workflow](https://github.com/cm45t3r/candlestick/actions/workflows/node.js.yml/badge.svg)
[![npm version](https://badge.fury.io/js/candlestick.svg)](https://badge.fury.io/js/candlestick)

A modern, modular JavaScript library for candlestick pattern detection. Detects classic reversal and continuation patterns in OHLC data, with a clean API and no native dependencies.

---

## Features
- **Modular**: Each pattern is its own module, easy to extend or customize.
- **Consistent API**: All pattern functions use a standard interface.
- **Pattern Chaining**: Scan for multiple patterns in a single pass.
- **Comprehensive Test Suite**: Each pattern and utility is unit tested.
- **Modern Tooling**: Uses ESLint (flat config) and Prettier for code quality and formatting.

---

## Installation

```bash
npm install candlestick
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

---

## Pattern Descriptions

- **Hammer**: Small body near the top, long lower shadow. Signals possible bullish reversal.
- **Inverted Hammer**: Small body near the bottom, long upper shadow. Bullish reversal signal.
- **Doji**: Very small body, open ≈ close. Indicates indecision.
- **Engulfing**: Second candle's body fully engulfs the previous. Bullish or bearish.
- **Harami**: Second candle's body is inside the previous. Bullish or bearish.
- **Kicker**: Strong reversal with a gap and opposite color. Bullish or bearish.
- **Hanging Man**: Bullish candle followed by a bearish hammer with a gap up. Bearish reversal.
- **Shooting Star**: Bullish candle followed by a bearish inverted hammer with a gap up. Bearish reversal.

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

---

## License

MIT. See [LICENSE](./LICENSE).
