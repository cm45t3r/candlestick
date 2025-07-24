# Candlestick Examples

This directory contains runnable examples for each pattern module and utility in the Candlestick library.

## How to Run

1. Install dependencies in the project root:
   ```bash
   npm install
   ```
2. Run any example file with Node.js:
   ```bash
   node examples/hammer.js
   node examples/doji.js
   # ...etc.
   ```

## Available Examples

- `hammer.js` — Hammer pattern detection (single and series)
- `invertedHammer.js` — Inverted Hammer pattern detection
- `doji.js` — Doji pattern detection
- `engulfing.js` — Engulfing pattern detection (bullish/bearish)
- `harami.js` — Harami pattern detection (bullish/bearish)
- `kicker.js` — Kicker pattern detection (bullish/bearish)
- `reversal.js` — Reversal patterns: Hanging Man, Shooting Star
- `patternChain.js` — Multi-pattern detection with patternChain API
- `utils.js` — Utility functions: bodyLen, wickLen, tailLen, isBullish, isBearish, hasGapUp, hasGapDown, findPattern

## Notes

- These examples are for demonstration and learning purposes.
- The `examples/` directory is **excluded from npm packages** but included in the repository for reference.
- You can copy, modify, or extend these examples for your own use cases.

---

For more information, see the main [README.md](../README.md). 