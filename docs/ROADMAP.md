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

### v2.1.0 (2026-09-11)

Streaming correctness release. Three changes are observable through the public
API — see "Upgrading to v2.1" in the README before updating.

- fix(streaming): drop duplicate matches at chunk boundaries for patterns shorter than `maxPatternSize` ([#115](https://github.com/cm45t3r/candlestick/issues/115))
- fix(streaming): make `end()` idempotent and count `totalProcessed` exactly ([#119](https://github.com/cm45t3r/candlestick/issues/119))
- fix(streaming): reject `chunkSize` below the longest active pattern, which previously hung or silently corrupted output ([#117](https://github.com/cm45t3r/candlestick/issues/117))
- fix(benchmark): separate feed size from `chunkSize` in the streaming benchmark ([#118](https://github.com/cm45t3r/candlestick/issues/118))
- fix(cli): derive the banner version from `package.json` instead of hardcoding it
- ci: test on Node 24.x; CI matrix is now 20.x / 22.x / 24.x across Linux, Windows and macOS

### v2.0.2 (2026-07-10)

- chore(deps): bump `prettier` from 3.8.4 to 3.9.4
- chore(deps): bump `eslint` from 10.5.0 to 10.6.0
- chore(actions): bump `actions/checkout` from v5 to v7
- style: apply Prettier formatting across the whole repository
- ci: fix `Benchmark` workflow gh-pages branch bootstrap (git identity, branch switch-back, manual dispatch)

### v2.0.1 (2026-06-17)

- fix(package): scope `./cli` export to `"node"` condition for bundler compatibility
- chore(ci): bump `actions/checkout` from v4 to v5

### v2.0.0 (2026-06-17)

- **BREAKING:** Drop Node.js 18 support, require Node.js >= 20 (Node 18 EOL 2025-04-30)
- Upgrade `@eslint/js` to v10, `c8` to v11
- CI matrix updated to Node.js 20.x and 22.x
- Error chain preservation (`{ cause }`) in `validateOHLCArray`

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
- CI/CD across Node.js 20, 22 on Ubuntu, Windows, and macOS

---

## Community

Suggestions and contributions are always welcome. Open an [issue](https://github.com/cm45t3r/candlestick/issues) or [pull request](https://github.com/cm45t3r/candlestick/pulls) to discuss ideas.

---

_This roadmap is a living document._
