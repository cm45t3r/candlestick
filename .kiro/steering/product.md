# Product Overview

`candlestick` is a zero-dependency JavaScript library for detecting candlestick patterns in OHLC (Open, High, Low, Close) financial data. It targets developers building trading tools, backtesting engines, and financial analysis systems for stocks, forex, and crypto.

## Core Capabilities

- **Pattern Detection**: 18 patterns (29 variants) covering single-candle, two-candle, and three-candle formations. Each pattern exposes a boolean `is*` checker and an array-scanning variant returning match indices.
- **Pattern Chaining**: `patternChain(candles, patterns)` scans a series for multiple patterns in a single pass, returning chronologically ordered `{ index, pattern, match }` results.
- **Streaming API**: `streaming.createStream()` and `streaming.processLargeDataset()` process large datasets in chunks with ~70% memory reduction versus full-array loading.
- **Plugin System**: `plugins.registerPattern()` lets consumers extend the library with custom pattern logic that integrates directly into `patternChain`.
- **Data Validation**: `validateOHLC` / `validateOHLCArray` enforce OHLC structural and relational integrity before analysis.

## Target Use Cases

- Scanning historical price series for reversal or continuation signals
- Building real-time or streaming chart-pattern alert systems
- Integrating pattern detection into backtesting frameworks
- CLI-driven CSV/JSON analysis without writing code

## Value Proposition

Pure JavaScript with no native dependencies — runs anywhere Node.js runs. The consistent, modular API (one module per pattern) makes the library easy to extend, tree-shake, and audit. Dual CJS/ESM exports and full TypeScript definitions provide compatibility across all modern JavaScript environments.

---
_Focus on patterns and purpose, not exhaustive feature lists_
