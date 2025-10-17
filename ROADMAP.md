# Candlestick Roadmap

This roadmap outlines planned features, improvements, and possible future directions for the Candlestick project. Community feedback and contributions are welcome!

---

## Near-Term Goals

- **Release v1.1.0** ✅ COMPLETED
  - TypeScript definitions added
  - ESM support implemented
  - 6 new patterns added
  - Plugin system implemented
  - Data validation system added
- **Documentation** ✅ COMPLETED
  - ARCHITECTURE.md created
  - PLUGIN_API.md created
  - Examples updated (CommonJS + ESM)
  - FAQ expanded with TypeScript info
- **More Patterns** ✅ PARTIALLY COMPLETE
  - ✅ Morning Star / Evening Star (3 candles)
  - ✅ Three White Soldiers / Three Black Crows (3 candles)
  - ✅ Piercing Line / Dark Cloud Cover (2 candles)
  - 🔜 Marubozu (1 candle)
  - 🔜 Spinning Top (1 candle)
  - 🔜 Tweezers Top/Bottom (2 candles)
- **TypeScript Support** ✅ COMPLETED
  - TypeScript type definitions in `types/index.d.ts`
  - Full IntelliSense support
- **Performance** 🔄 IN PROGRESS
  - Precompute optimization implemented
  - Benchmark suite enhanced
  - 🔜 Batch/streaming APIs for very large datasets
  - 🔜 Further optimize memory usage
- **API Enhancements** ✅ PARTIALLY COMPLETE
  - ✅ Plugin system for user-defined patterns
  - ✅ Pattern validation
  - 🔜 Pattern metadata (confidence, strength)
- **Testing & CI** ✅ COMPLETED
  - 153 tests with 99.67% coverage (was ~80 tests, ~80% coverage)
  - Integration tests added
  - Tests run on multiple Node.js versions (18, 20, 22) and OS (Ubuntu, Windows, macOS)

---

## Medium-Term Goals

- **Visualization** 🔜 PLANNED
  - Provide example scripts or integrations for plotting detected patterns
  - SVG/Canvas visual representations of patterns
- **Integration** 🔜 PLANNED
  - Add adapters for popular charting libraries (e.g., TradingView, Plotly)
  - Example integrations with charting frameworks
- **CLI Tool** 🔜 PLANNED
  - Command-line interface for pattern detection on CSV/JSON data
  - Pipeline-friendly stdin/stdout processing
  - Multiple output formats (JSON, table, markdown)
- **Pattern Metadata** 🔜 PLANNED
  - Add confidence scores to pattern results
  - Pattern strength indicators
  - Reversal/continuation classification

---

## Long-Term / Stretch Goals

- **WebAssembly (WASM) Port**
  - For ultra-fast browser or cross-language usage
- **Machine Learning**
  - Pattern recognition using ML for fuzzy/novel patterns
- **Live Data Streaming**
  - Real-time pattern detection for live feeds
- **Mobile Support**
  - Example apps or SDKs for mobile platforms

---

## Community

- Encourage and review community PRs for new patterns and features
- Maintain high code quality and documentation standards
- Respond to issues and feature requests in a timely manner

---

_This roadmap is a living document. Suggestions and contributions are always welcome!_
