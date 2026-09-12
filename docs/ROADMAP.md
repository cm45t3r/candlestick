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

### Unreleased

CLI output and project-tooling fixes on top of v2.1.0.

**Observable when using the CLI:**

- `table` and `csv` output now always populate the type, direction, confidence
  and strength columns, with no `--metadata` flag required.
- Table columns widen to their content, so long pattern names no longer break
  the box borders.
- `-i -` is honoured as stdin, matching the behaviour of omitting `-i`.

**All changes:**

- feat(cli): always include metadata in `table` and `csv` output, so their fixed
  columns are never empty ([#141](https://github.com/cm45t3r/candlestick/issues/141))
- fix(cli): honour `-` as stdin when picking the parser; `-i -` previously read
  stdin and then failed with `Unsupported file format: .`
  ([#147](https://github.com/cm45t3r/candlestick/pull/147))
- fix(cli): size table columns to their content ([#140](https://github.com/cm45t3r/candlestick/pull/140))
- fix(scripts): run the benchmark without a shell in `update-bench`, and format
  the README through Prettier after regenerating the table
  ([#128](https://github.com/cm45t3r/candlestick/pull/128))
- docs(cli): document `-` as an explicit stdin path in `--help` and the CLI
  guide, and note that piped input is parsed as JSON ([#147](https://github.com/cm45t3r/candlestick/pull/147))
- docs: refresh the README benchmark table and record the date, Node version and
  hardware it came from ([#136](https://github.com/cm45t3r/candlestick/issues/136))
- docs(streaming): replace the unsupported "~70% memory reduction" claim with a
  measured comparison ([#135](https://github.com/cm45t3r/candlestick/issues/135))
- docs(contributing): pin the `.nvmrc` floor to 20.19 and explain the
  `EBADENGINE` warning ([#143](https://github.com/cm45t3r/candlestick/pull/143))
- ci: test on Node 26.x; CI matrix is now 20.x / 22.x / 24.x / 26.x across
  Linux, Windows and macOS ([#145](https://github.com/cm45t3r/candlestick/pull/145))
- ci: remove the GitHub Packages publish workflow, which could not work for an
  unscoped package name ([#129](https://github.com/cm45t3r/candlestick/issues/129))
- ci: run CodeQL on `main` instead of the non-existent `master` branch
  ([#132](https://github.com/cm45t3r/candlestick/pull/132))
- chore: pin `.nvmrc` to Node 20 to match `engines` ([#123](https://github.com/cm45t3r/candlestick/issues/123))
- chore: exclude the generated `CHANGELOG.md` from Prettier
  ([#130](https://github.com/cm45t3r/candlestick/issues/130))
- chore: silence `no-console` in `update-bench` like its peers
  ([#137](https://github.com/cm45t3r/candlestick/pull/137))
- chore(deps): bump `c8` to 12 so coverage runs on Node 26
  ([#143](https://github.com/cm45t3r/candlestick/pull/143))
- test: cover the first-candle shadow guards in the three-candle patterns
  ([#144](https://github.com/cm45t3r/candlestick/pull/144))
- test: cover the stdin branch of `readInput` and `validateOHLCArray`'s catch,
  taking `src/utils.js` to 100% statements and branches ([#147](https://github.com/cm45t3r/candlestick/pull/147))

Known gaps, tracked for a later release: [#148](https://github.com/cm45t3r/candlestick/issues/148) (`parseArgs`
swallows the next flag when an option value is missing), [#149](https://github.com/cm45t3r/candlestick/issues/149)
(`--` is not honoured as end-of-options) and [#150](https://github.com/cm45t3r/candlestick/issues/150) (CSV cannot
be piped; stdin is always parsed as JSON).

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
  <br>_Correction: the ~70% figure was never substantiated and is kept here only
  as the record of what v1.2.0 claimed. The reduction measured later is far
  larger — 41.9 MB to 0.2 MB on 200,000 candles — because resident memory is
  bounded by `chunkSize` rather than the dataset. See the README streaming
  section ([#135](https://github.com/cm45t3r/candlestick/issues/135))._
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
