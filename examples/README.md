# Candlestick Examples

This directory contains runnable examples for each pattern module and utility in the Candlestick library.

## How to Run

1. Install dependencies in the project root:

   ```bash
   npm install
   ```

2. Run any CommonJS example:

   ```bash
   node examples/hammer.js
   node examples/patternChain.js
   node examples/newPatterns.js
   ```

3. Run ESM example:
   ```bash
   node examples/esm-example.mjs
   ```

## Available Examples

### Single Candle Patterns

- `hammer.js` — Hammer pattern detection (single and series)
- `invertedHammer.js` — Inverted Hammer pattern detection
- `doji.js` — Doji pattern detection

### Two Candle Patterns

- `engulfing.js` — Engulfing pattern detection (bullish/bearish)
- `harami.js` — Harami pattern detection (bullish/bearish)
- `kicker.js` — Kicker pattern detection (bullish/bearish)
- `reversal.js` — Reversal patterns: Hanging Man, Shooting Star

### Multi-Pattern Detection

- `patternChain.js` — Multi-pattern detection with patternChain API
- `newPatterns.js` — New 3-candle patterns (Morning/Evening Star, Three Soldiers/Crows)
- `esm-example.mjs` — ESM module syntax example (import/export)

### Utilities

- `utils.js` — Utility functions: bodyLen, wickLen, tailLen, isBullish, isBearish, hasGapUp, hasGapDown, findPattern

## Notes

- These examples are for demonstration and learning purposes.
- The `examples/` directory is **excluded from npm packages** but included in the repository for reference.
- You can copy, modify, or extend these examples for your own use cases.

---

For more information, see the main [README.md](../README.md).
