# Plugin API Documentation

The Candlestick library provides a plugin system that allows you to register and use custom pattern detection functions alongside the built-in patterns.

## Overview

The plugin system enables you to:

- Register custom candlestick patterns
- Use custom patterns with `patternChain`
- Add metadata to your patterns (type, confidence, etc.)
- Manage the lifecycle of custom patterns

## Quick Start

```javascript
const candlestick = require('candlestick');

// Register a custom pattern
candlestick.plugins.registerPattern({
  name: 'myCustomPattern',
  fn: (dataArray) => {
    // Your pattern detection logic here
    const results = [];
    for (let i = 0; i < dataArray.length; i++) {
      if (/* pattern condition */) {
        results.push(i);
      }
    }
    return results;
  },
  paramCount: 1,
  metadata: {
    type: 'reversal',
    confidence: 0.85,
    description: 'My custom reversal pattern'
  }
});

// Use the custom pattern
const data = [/* OHLC data */];
const customPattern = candlestick.plugins.getPattern('myCustomPattern');
const results = candlestick.patternChain(data, [customPattern]);
```

## API Reference

### `registerPattern(plugin)`

Register a new custom pattern.

**Parameters:**

- `plugin` (Object): Pattern configuration
  - `name` (string, required): Unique identifier for the pattern
  - `fn` (function, required): Detection function that processes OHLC data
  - `paramCount` (number, optional): Number of candles the pattern uses (default: 1)
  - `metadata` (object, optional): Additional pattern information

**Returns:** Pattern definition object

**Throws:** Error if pattern name already exists or configuration is invalid

**Example:**

```javascript
candlestick.plugins.registerPattern({
  name: "bigRedCandle",
  fn: (dataArray) => {
    return dataArray
      .map((candle, index) => {
        const range = candle.high - candle.low;
        const bodyLen = Math.abs(candle.open - candle.close);
        const isBearish = candle.open > candle.close;
        // Big body and bearish
        return isBearish && bodyLen > range * 0.8 ? index : -1;
      })
      .filter((idx) => idx !== -1);
  },
  paramCount: 1,
  metadata: { type: "continuation", confidence: 0.7 },
});
```

### `unregisterPattern(name)`

Remove a registered custom pattern.

**Parameters:**

- `name` (string): Pattern name to remove

**Returns:** `true` if pattern was removed, `false` if it didn't exist

**Example:**

```javascript
const removed = candlestick.plugins.unregisterPattern("myCustomPattern");
console.log(removed); // true or false
```

### `getPattern(name)`

Retrieve a registered custom pattern by name.

**Parameters:**

- `name` (string): Pattern name

**Returns:** Pattern definition object or `undefined`

**Example:**

```javascript
const pattern = candlestick.plugins.getPattern("myCustomPattern");
if (pattern) {
  console.log(pattern.metadata);
}
```

### `getAllCustomPatterns()`

Get all registered custom patterns.

**Returns:** Array of pattern definition objects

**Example:**

```javascript
const allPatterns = candlestick.plugins.getAllCustomPatterns();
console.log(`Total custom patterns: ${allPatterns.length}`);
```

### `clearAllPatterns()`

Remove all registered custom patterns.

**Example:**

```javascript
candlestick.plugins.clearAllPatterns();
```

### `hasPattern(name)`

Check if a pattern is registered.

**Parameters:**

- `name` (string): Pattern name

**Returns:** `true` if pattern exists, `false` otherwise

**Example:**

```javascript
if (candlestick.plugins.hasPattern("myPattern")) {
  console.log("Pattern exists");
}
```

### `getPatternCount()`

Get the number of registered custom patterns.

**Returns:** Number of patterns

**Example:**

```javascript
const count = candlestick.plugins.getPatternCount();
console.log(`${count} custom patterns registered`);
```

## Pattern Detection Function

Your custom pattern detection function should follow this signature:

### Single-Candle Patterns

```javascript
function detectPattern(dataArray) {
  const results = [];
  for (let i = 0; i < dataArray.length; i++) {
    const candle = dataArray[i];
    if (/* your pattern logic */) {
      results.push(i);
    }
  }
  return results;
}
```

### Multi-Candle Patterns

For patterns that span multiple candles, set `paramCount` appropriately:

```javascript
function detectTwoCandlePattern(dataArray) {
  const results = [];
  for (let i = 0; i < dataArray.length - 1; i++) {
    const prev = dataArray[i];
    const curr = dataArray[i + 1];
    if (/* your pattern logic using prev and curr */) {
      results.push(i);
    }
  }
  return results;
}

candlestick.plugins.registerPattern({
  name: 'myTwoCandlePattern',
  fn: detectTwoCandlePattern,
  paramCount: 2
});
```

## Using Custom Patterns with patternChain

Once registered, custom patterns can be used with the `patternChain` function:

```javascript
// Get custom pattern(s)
const customPattern1 = candlestick.plugins.getPattern("pattern1");
const customPattern2 = candlestick.plugins.getPattern("pattern2");

// Combine with built-in patterns
const patternsToDetect = [
  ...candlestick.allPatterns,
  customPattern1,
  customPattern2,
];

// Run detection
const results = candlestick.patternChain(data, patternsToDetect);
```

## Best Practices

### 1. Use Descriptive Names

```javascript
// Good
registerPattern({ name: 'longWhiteBody', fn: ... });

// Avoid
registerPattern({ name: 'lwb', fn: ... });
```

### 2. Add Metadata

```javascript
registerPattern({
  name: "strongBullishReversal",
  fn: detectPattern,
  metadata: {
    type: "reversal",
    direction: "bullish",
    confidence: 0.8,
    description: "Strong bullish reversal pattern",
    author: "Your Name",
    version: "1.0.0",
  },
});
```

### 3. Handle Edge Cases

```javascript
function detectPattern(dataArray) {
  if (!dataArray || dataArray.length === 0) {
    return [];
  }

  // Your logic here
  const results = [];
  for (let i = 0; i < dataArray.length; i++) {
    const candle = dataArray[i];
    if (!candle || typeof candle.open !== "number") {
      continue;
    }
    // Pattern detection
  }
  return results;
}
```

### 4. Use Precomputed Properties

If your pattern uses the same calculations as built-in patterns, leverage precomputed properties:

```javascript
const { precomputeCandleProps } = candlestick.utils;

function detectPattern(dataArray) {
  const candles = precomputeCandleProps(dataArray);
  return candles
    .map((c, i) => {
      // Use c.bodyLen, c.wickLen, c.tailLen, etc.
      return c.bodyLen > c.wickLen * 2 ? i : -1;
    })
    .filter((idx) => idx !== -1);
}
```

### 5. Test Your Patterns

Always test custom patterns before using them in production:

```javascript
const testData = [
  { open: 10, high: 15, low: 9, close: 14 },
  { open: 14, high: 16, low: 13, close: 15 },
  // ... more test data
];

registerPattern({ name: "testPattern", fn: myDetectionFunction });
const pattern = candlestick.plugins.getPattern("testPattern");
const results = pattern.fn(testData);
console.log("Pattern found at indices:", results);
```

## Examples

### Example 1: Big Body Pattern

Detects candles where the body is at least 80% of the entire range:

```javascript
candlestick.plugins.registerPattern({
  name: "bigBody",
  fn: (dataArray) => {
    const { precomputeCandleProps } = candlestick.utils;
    const candles = precomputeCandleProps(dataArray);
    return candles
      .map((c, i) => {
        const range = c.high - c.low;
        return range > 0 && c.bodyLen >= range * 0.8 ? i : -1;
      })
      .filter((idx) => idx !== -1);
  },
  metadata: { type: "continuation", confidence: 0.6 },
});
```

### Example 2: Gap Pattern

Detects gaps between consecutive candles:

```javascript
candlestick.plugins.registerPattern({
  name: "gap",
  fn: (dataArray) => {
    const results = [];
    for (let i = 1; i < dataArray.length; i++) {
      const prev = dataArray[i - 1];
      const curr = dataArray[i];
      // Gap up or gap down
      if (prev.high < curr.low || prev.low > curr.high) {
        results.push(i - 1);
      }
    }
    return results;
  },
  paramCount: 2,
  metadata: { type: "continuation", confidence: 0.7 },
});
```

### Example 3: Volume-Based Pattern

If your data includes volume, you can create volume-based patterns:

```javascript
candlestick.plugins.registerPattern({
  name: "highVolumeCandle",
  fn: (dataArray) => {
    if (!dataArray[0].volume) return []; // No volume data

    // Calculate average volume
    const avgVolume =
      dataArray.reduce((sum, c) => sum + (c.volume || 0), 0) / dataArray.length;

    return dataArray
      .map((c, i) => (c.volume > avgVolume * 2 ? i : -1))
      .filter((idx) => idx !== -1);
  },
  metadata: { type: "indicator", confidence: 0.75 },
});
```

## Limitations

- Maximum `paramCount` is 10
- Pattern names must be unique
- Detection functions must return an array of indices
- Cannot override built-in patterns (they're in a separate namespace)

## TypeScript Support

TypeScript definitions for the plugin system are included in `types/index.d.ts`.

```typescript
import { plugins } from 'candlestick';

interface MyMetadata {
  type: 'reversal' | 'continuation';
  confidence: number;
}

plugins.registerPattern({
  name: 'myPattern',
  fn: (dataArray: OHLC[]) => number[],
  paramCount: 1,
  metadata: { type: 'reversal', confidence: 0.8 } as MyMetadata
});
```

## Contributing

If you've created useful custom patterns, consider contributing them to the library! See [CONTRIBUTING.md](../CONTRIBUTING.md) for details.
