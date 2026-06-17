# Architecture

This document describes the architecture and design decisions of the Candlestick library.

## Overview

Candlestick is a modular JavaScript library for detecting candlestick patterns in OHLC (Open, High, Low, Close) data. It's designed with simplicity, performance, and extensibility in mind.

## Design Principles

1. **Modularity**: Each pattern is implemented in its own module for easy maintenance and extension
2. **Consistency**: All pattern functions follow the same API conventions
3. **Performance**: Pre-computation and caching strategies minimize redundant calculations
4. **Zero Dependencies**: Pure JavaScript implementation with no native dependencies
5. **Type Safety**: TypeScript definitions for better developer experience

## Directory Structure

```
candlestick/
├── src/                      # Source code
│   ├── candlestick.js        # Main entry point (aggregates all patterns)
│   ├── index.mjs             # ESM re-export surface
│   ├── utils.js              # Utility functions (bodyLen, wickLen, etc.)
│   ├── patternChain.js       # Multi-pattern detection + allPatterns registry
│   ├── patternMetadata.js    # Pattern confidence and strength metadata
│   ├── pluginManager.js      # Plugin system for custom patterns
│   ├── streaming.js          # Chunk-based streaming processor
│   ├── hammer.js             # Hammer pattern detection
│   ├── invertedHammer.js     # Inverted Hammer pattern detection
│   ├── doji.js               # Doji pattern detection
│   ├── marubozu.js           # Marubozu pattern detection
│   ├── spinningTop.js        # Spinning Top pattern detection
│   ├── engulfing.js          # Engulfing pattern detection
│   ├── harami.js             # Harami pattern detection
│   ├── kicker.js             # Kicker pattern detection
│   ├── reversal.js           # Reversal patterns (Hanging Man, Shooting Star)
│   ├── piercingLine.js       # Piercing Line pattern detection
│   ├── darkCloudCover.js     # Dark Cloud Cover pattern detection
│   ├── tweezers.js           # Tweezers Top/Bottom pattern detection
│   ├── morningStar.js        # Morning Star pattern detection
│   ├── eveningStar.js        # Evening Star pattern detection
│   ├── threeWhiteSoldiers.js # Three White Soldiers pattern detection
│   └── threeBlackCrows.js    # Three Black Crows pattern detection
├── test/                     # Unit tests (one file per module)
├── types/                    # TypeScript definitions
├── cli/                      # CLI implementation
├── bin/                      # CLI entry point
├── examples/                 # Usage examples (excluded from npm package)
└── index.js                  # Package entry point (CJS proxy to src/candlestick.js)

```

## Core Components

### 1. Utility Functions (`src/utils.js`)

Provides low-level utilities for candlestick calculations:

- **bodyLen**: Distance between open and close
- **wickLen**: Upper shadow length
- **tailLen**: Lower shadow length
- **bodyEnds**: Top and bottom of candle body
- **isBullish/isBearish**: Determine candle direction
- **hasGapUp/hasGapDown**: Detect gaps between candles
- **isEngulfed**: Check if one body engulfs another
- **precomputeCandleProps**: Compute and attach derived properties (bodyLen, wickLen, etc.) to each candle
- **ensurePrecomputed**: Return the input unchanged if already enriched, otherwise delegate to `precomputeCandleProps`
- **validateOHLC**: Validate OHLC data structure and relationships
- **findPattern**: Generic pattern search utility

### 2. Pattern Modules

Each pattern module exports:

1. **Boolean detection functions**: Test a single candle or pair (e.g., `isHammer`, `isBullishHammer`)
2. **Array detection functions**: Find all occurrences in a series (e.g., `hammer`, `bullishHammer`)

Pattern modules follow this structure:

```javascript
// Pattern detection logic
function isPattern(candlestick) {
  /* ... */
}
function isBullishPattern(candlestick) {
  /* ... */
}
function isBearishPattern(candlestick) {
  /* ... */
}

// Array search
function pattern(dataArray) {
  const candles = ensurePrecomputed(dataArray);
  return findPattern(candles, isPattern);
}

module.exports = {
  isPattern,
  isBullishPattern,
  isBearishPattern,
  pattern,
  bullishPattern,
  bearishPattern,
};
```

### 3. Pattern Chain (`src/patternChain.js`)

Enables efficient multi-pattern detection:

- Calls `ensurePrecomputed()` on the input — enriches raw data at most once, and skips precomputation entirely when the caller has already enriched the array
- Runs multiple pattern detectors in a single pass
- Returns structured results with pattern name, index, and matched candles
- Supports custom pattern lists

### 4. Main Entry Point (`src/candlestick.js`)

Aggregates all pattern modules and exports a unified API.

## Data Flow

```
User Input (OHLC array)
    ↓
[Optional] validateOHLCArray()
    ↓
precomputeCandleProps()
    ↓
Pattern Detection Functions
    ↓
Results (indices or PatternMatch objects)
```

## Performance Optimizations

### 1. Pre-computation

`precomputeCandleProps()` enriches each candle object with derived fields computed once:

- Body length (`bodyLen`)
- Wick / tail lengths (`wickLen`, `tailLen`)
- Bullish / bearish flags (`isBullish`, `isBearish`)
- Body endpoints (`bodyEnds`)

All field values are delegated to the named utility functions in `src/utils.js` — formulas live in a single place, so a change to `wickLen()` propagates automatically.

### 2. `ensurePrecomputed` — Idempotent Pre-computation

`ensurePrecomputed(dataArray)` checks whether the first element already has `bodyLen` set. If it does, the array is returned as-is; otherwise `precomputeCandleProps` runs. This makes pre-computation safe to call from multiple layers (pattern function, patternChain, user code) without redundant work.

Before this function was introduced, a `patternChain` call over 29 patterns triggered 30 separate precompute passes on the same data (one in `patternChain`, one inside each pattern function). With `ensurePrecomputed`, the total is at most 1 regardless of how many patterns run.

```javascript
// Each series function delegates to ensurePrecomputed:
function hammer(dataArray) {
  const candles = ensurePrecomputed(dataArray);
  return findPattern(candles, isHammer);
}
```

### 3. Streaming Buffer Efficiency

The streaming API (`src/streaming.js`) accumulates chunks using a `for...of` push loop:

```javascript
for (const candle of chunk) buffer.push(candle);
```

`Array.concat()` was used previously but allocates a new array on every `process()` call. In tick-by-tick usage this caused up to 8x more GC pressure. `push(...chunk)` is equivalent performance-wise but throws `RangeError` for chunks larger than ~100k elements (V8 argument-count limit), so the `for...of` form is used instead.

### 4. Generic Search Utility

The `findPattern()` function provides a reusable search algorithm that works with any pattern function, reducing code duplication.

## Pattern Implementation Guidelines

When adding a new pattern:

1. **Create a new module** in `src/` (e.g., `src/newPattern.js`)
2. **Implement detection functions**:
   - `isNewPattern(candle)` for single-candle patterns
   - `isNewPattern(prev, curr)` for two-candle patterns
   - `isNewPattern(c1, c2, c3)` for three-candle patterns
3. **Implement array functions**:
   - Use `precomputeCandleProps()` for efficiency
   - Use `findPattern()` utility for consistency
4. **Add tests** in `test/newPattern.test.js`
5. **Export functions** from the module
6. **Register in `src/candlestick.js`**
7. **Add to `src/patternChain.js` allPatterns array**
8. **Update TypeScript definitions** in `types/index.d.ts`

## Testing Strategy

- **Unit tests**: Each module has comprehensive unit tests
- **Edge cases**: Invalid data, boundary conditions, equal OHLC values
- **Validation**: Separate tests for data validation functions
- **Coverage**: Target 100% code coverage
- **CI/CD**: Tests run on multiple Node versions and OS platforms

## API Design Philosophy

### Consistency

All pattern functions follow these conventions:

- Single/pair detection: `isPattern(candle[, candle2])`
- Array detection: `pattern(dataArray)`
- Variants: `isBullishPattern`, `bearishPattern`, etc.

### Flexibility

- Functions accept raw OHLC or pre-computed objects
- Validation can be strict (throw errors) or lenient (return false)
- Pattern chain accepts custom pattern lists

### Non-mutation

The library never modifies input data. Pre-computation returns new objects with additional properties.

## Future Considerations

### WebAssembly

For ultra-high performance scenarios:

- Port critical functions to WASM
- Maintain JS fallback for compatibility

## Dependencies

**Runtime**: None (zero dependencies)

**Development**:

- ESLint: Code linting
- Prettier: Code formatting
- c8: Test coverage
- Node.js test runner: Testing

This minimal dependency approach ensures:

- Small package size
- No security vulnerabilities from dependencies
- Easy maintenance
- Universal compatibility
