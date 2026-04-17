# Candlestick Roadmap

This roadmap outlines planned features and future directions for the Candlestick project. Community feedback and contributions are welcome!

---

## Planned

### Visualization

- Provide example scripts or integrations for plotting detected patterns
- SVG/Canvas visual representations of patterns

### Integrations

- Adapters for popular charting libraries (e.g., TradingView, Plotly)
- Example integrations with charting frameworks

### Long-Term / Stretch Goals

- **WebAssembly (WASM) Port** — Ultra-fast browser or cross-language usage
- **Machine Learning** — Pattern recognition using ML for fuzzy/novel patterns
- **Live Data Streaming** — Real-time pattern detection for live feeds
- **Mobile Support** — Example apps or SDKs for mobile platforms

---

## Completed

### v1.2.0 (2025-10-18)

- 3 new patterns: Marubozu (1-candle), Spinning Top (1-candle), Tweezers Top/Bottom (2-candle)
- Streaming API (`streaming.createStream`, `streaming.processLargeDataset`) with ~70% memory reduction
- Property-based testing with fast-check (1000+ generated OHLC scenarios)
- Test suite: 306 tests, 99.75% line coverage, 97.63% branch coverage
- Benchmark suite with throughput metrics (59K+ candles/sec)

### v1.1.0 (2025-10-17)

- 6 new patterns: Morning Star, Evening Star, Three White Soldiers, Three Black Crows, Piercing Line, Dark Cloud Cover
- Dual CommonJS/ESM export via `package.json` conditional exports
- TypeScript definitions in `types/index.d.ts` with full IntelliSense support
- Plugin system (`plugins.registerPattern`) for user-defined custom patterns
- Data validation system (`validateOHLC`, `validateOHLCArray`)
- Pattern metadata: confidence scores, strength indicators, type and direction classification
- CLI tool (`candlestick` binary) for CSV/JSON analysis with JSON, table, and CSV output

### v1.0.x (2024–2025)

- Pattern chaining: multi-pattern detection in a single pass
- Doji pattern detection
- Pre-computation performance optimization (`precomputeCandleProps`)
- CI/CD across Node.js 18, 20, 22 on Ubuntu, Windows, and macOS

---

## Community

Suggestions and contributions are always welcome. Open an [issue](https://github.com/cm45t3r/candlestick/issues) or [pull request](https://github.com/cm45t3r/candlestick/pulls) to discuss ideas.

---

_This roadmap is a living document._
