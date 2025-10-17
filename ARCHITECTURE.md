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
├── src/                    # Source code
│   ├── candlestick.js     # Main entry point (aggregates all patterns)
│   ├── utils.js           # Utility functions (bodyLen, wickLen, etc.)
│   ├── hammer.js          # Hammer pattern detection
│   ├── invertedHammer.js  # Inverted Hammer pattern detection
│   ├── doji.js            # Doji pattern detection
│   ├── engulfing.js       # Engulfing pattern detection
│   ├── harami.js          # Harami pattern detection
│   ├── kicker.js          # Kicker pattern detection
│   ├── reversal.js        # Reversal patterns (Hanging Man, Shooting Star)
│   └── patternChain.js    # Multi-pattern detection
├── test/                   # Unit tests (one file per module)
├── types/                  # TypeScript definitions
├── examples/               # Usage examples (excluded from npm package)
└── index.js               # Package entry point

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
- **precomputeCandleProps**: Cache calculations for performance
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
  const candles = precomputeCandleProps(dataArray);
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

- Pre-computes candle properties once
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

The `precomputeCandleProps()` function calculates all common properties once:

- Body length
- Wick/tail lengths
- Bullish/bearish flags
- Body ends

This is especially important for `patternChain()` which runs multiple detectors.

### 2. Lazy Pre-computation

Individual pattern functions check if properties are already computed:

```javascript
function isHammer(candlestick) {
  let c = candlestick;
  if (c.bodyLen === undefined) {
    c = precomputeCandleProps([candlestick])[0];
  }
  // ... use precomputed properties
}
```

### 3. Generic Search Utility

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

### ESM Support

Current implementation uses CommonJS. Future versions may:

- Add dual CommonJS/ESM builds
- Use conditional exports in package.json
- Provide tree-shakeable ESM modules

### Plugin System

A plugin API would allow users to:

- Register custom patterns
- Add pre/post-processing hooks
- Extend pattern metadata

### Streaming API

For real-time data processing:

- Incremental pattern detection
- Sliding window approach
- Memory-efficient for continuous data streams

### WebAssembly

For ultra-high performance:

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
