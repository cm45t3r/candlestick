# Changelog

## [Unreleased]

**Bug fixes:**

- fix(utils): pass explicit `paramCount` to `findPattern` so patterns with default/rest parameters are detected correctly instead of silently scanning zero candles. Fixes [\#87](https://github.com/cm45t3r/candlestick/issues/87)
- fix(streaming): compose caller-supplied `onMatch` with internal collector in `processLargeDataset` so both receive every match instead of the caller's callback being dropped. Fixes [\#86](https://github.com/cm45t3r/candlestick/issues/86)
- fix(utils): propagate `strict` flag through `precomputeCandleProps` to detect NaN geometry (non-finite `bodyLen`/`wickLen`/`tailLen`) at the precomputation boundary. Fixes [\#85](https://github.com/cm45t3r/candlestick/issues/85)
- fix(utils): strengthen `ensurePrecomputed` guard — check `Number.isFinite(bodyLen)` instead of bare truthiness so a cached `bodyLen: 0` (e.g., doji) no longer triggers redundant recomputation. Fixes [\#84](https://github.com/cm45t3r/candlestick/issues/84)
- fix(streaming): wrap `processLargeDataset` chunk loop in `try/finally` so `stream.end()` is always called and the final buffer is always flushed even when a chunk throws. Fixes [\#83](https://github.com/cm45t3r/candlestick/issues/83)
- fix(streaming): throw on non-integer or non-positive `chunkSize` to prevent an infinite processing loop. Fixes [\#82](https://github.com/cm45t3r/candlestick/issues/82)
- fix(streaming): move buffer/offset/totalProcessed state updates before `onMatch` callbacks so a throwing callback does not leave the stream in a corrupt state. Fixes [\#81](https://github.com/cm45t3r/candlestick/issues/81)

**Performance improvements:**

- perf(patternChain): eliminate up to 29x redundant `precomputeCandleProps` calls. Added `ensurePrecomputed()` to `src/utils.js`; all 29 series functions and `patternChain` now use it instead of unconditionally re-precomputing. Result: ~2x speedup on raw input, ~2.6x on pre-enriched input at 10k candles. Fixes [\#80](https://github.com/cm45t3r/candlestick/issues/80)
- perf(streaming): replace `buffer.concat()` with a `for...of` push loop in `src/streaming.js`. `concat` allocated a new array on every `process()` call — up to 8x slower in tick-by-tick usage. `push(...chunk)` is unsafe for chunks >~100k elements (V8 stack limit), so `for...of` is used instead. Fixes [\#75](https://github.com/cm45t3r/candlestick/issues/75)

**Refactoring:**

- refactor(utils): `precomputeCandleProps` now delegates to the existing utility functions (`bodyLen`, `wickLen`, `tailLen`, `isBullish`, `isBearish`, `bodyEnds`) instead of duplicating their math inline. Eliminates silent divergence risk if any formula changes. Fixes [\#76](https://github.com/cm45t3r/candlestick/issues/76)

**Maintenance:**

- chore(deps): replaced `"latest"` with explicit semver ranges for all devDependencies in `package.json`. Fixes [\#77](https://github.com/cm45t3r/candlestick/issues/77)
- chore(security): resolved moderate `brace-expansion` DoS vulnerability (GHSA-jxxr-4gwj-5jf2) in transitive devDependency path via eslint. Fixes [\#78](https://github.com/cm45t3r/candlestick/issues/78)
- test(integration): plugin singleton cleanup now guarded by `afterEach` so the global `Map` is always cleared even when a test throws before reaching `clearAllPatterns()`. Addresses [\#79](https://github.com/cm45t3r/candlestick/issues/79)

## [v1.2.0](https://github.com/cm45t3r/candlestick/tree/v1.2.0) (2025-10-18)

[Full Changelog](https://github.com/cm45t3r/candlestick/compare/v1.1.0...v1.2.0)

**New features:**

- 3 new candlestick patterns: Marubozu, Spinning Top, Tweezers Top/Bottom
- Streaming API (`streaming.createStream`, `streaming.processLargeDataset`) for large datasets with ~70% memory reduction
- Property-based testing with fast-check (1000+ generated OHLC scenarios per invariant)
- Test suite expanded to 306 tests (99.75% line coverage, 97.63% branch coverage)
- Benchmark suite enhanced with throughput metrics (59K+ candles/sec)

**Merged pull requests:**

- chore\(actions\): bump actions/stale from 9 to 10 [\#36](https://github.com/cm45t3r/candlestick/pull/36) ([dependabot[bot]](https://github.com/apps/dependabot))

## [v1.1.0](https://github.com/cm45t3r/candlestick/tree/v1.1.0) (2025-10-17)

[Full Changelog](https://github.com/cm45t3r/candlestick/compare/v1.0.2...v1.1.0)

**New features:**

- 6 new candlestick patterns: Morning Star, Evening Star, Three White Soldiers, Three Black Crows, Piercing Line, Dark Cloud Cover
- Dual CommonJS/ESM export via `package.json` conditional exports (`src/index.mjs`)
- Full TypeScript definitions in `types/index.d.ts` with IntelliSense support
- Plugin system (`plugins.registerPattern`) for user-defined custom patterns
- Data validation system (`validateOHLC`, `validateOHLCArray`) with structural and relational checks
- Pattern metadata system (confidence scores, strength indicators, type and direction classification)
- CLI tool (`candlestick` binary) for CSV/JSON file analysis with multiple output formats

**Merged pull requests:**

- chore\(deps\): bump @eslint/js from 9.32.0 to 9.33.0 [\#27](https://github.com/cm45t3r/candlestick/pull/27) ([dependabot[bot]](https://github.com/apps/dependabot))
- chore\(deps\): bump eslint from 9.31.0 to 9.32.0 [\#25](https://github.com/cm45t3r/candlestick/pull/25) ([dependabot[bot]](https://github.com/apps/dependabot))

## [v1.0.2](https://github.com/cm45t3r/candlestick/tree/v1.0.2) (2025-07-25)

[Full Changelog](https://github.com/cm45t3r/candlestick/compare/v1.0.1...v1.0.2)

**Merged pull requests:**

- chore\(actions\): bump actions/first-interaction from 1 to 2 [\#23](https://github.com/cm45t3r/candlestick/pull/23) ([dependabot[bot]](https://github.com/apps/dependabot))
- chore\(actions\): bump actions/checkout from 3 to 4 [\#22](https://github.com/cm45t3r/candlestick/pull/22) ([dependabot[bot]](https://github.com/apps/dependabot))
- chore\(actions\): bump actions/setup-node from 3 to 4 [\#21](https://github.com/cm45t3r/candlestick/pull/21) ([dependabot[bot]](https://github.com/apps/dependabot))
- chore\(actions\): bump heinrichreimer/github-changelog-generator-action from 2.3 to 2.4 [\#20](https://github.com/cm45t3r/candlestick/pull/20) ([dependabot[bot]](https://github.com/apps/dependabot))
- chore\(actions\): bump github/codeql-action from 2 to 3 [\#19](https://github.com/cm45t3r/candlestick/pull/19) ([dependabot[bot]](https://github.com/apps/dependabot))

## [v1.0.1](https://github.com/cm45t3r/candlestick/tree/v1.0.1) (2025-07-24)

[Full Changelog](https://github.com/cm45t3r/candlestick/compare/0.0.7...v1.0.1)

**Implemented enhancements:**

- Should detect Doji patterns. [\#11](https://github.com/cm45t3r/candlestick/issues/11)
- Cannot chain the patterns [\#2](https://github.com/cm45t3r/candlestick/issues/2)

## [0.0.7](https://github.com/cm45t3r/candlestick/tree/0.0.7) (2024-04-02)

[Full Changelog](https://github.com/cm45t3r/candlestick/compare/a8cff9de972b7541edcd76156d8d3b43c896813b...0.0.7)

**Fixed bugs:**

- Some Patterns return undefined [\#12](https://github.com/cm45t3r/candlestick/issues/12)
- Merge Conflicts in Your Package.json [\#5](https://github.com/cm45t3r/candlestick/issues/5)
- isEngulfed function [\#3](https://github.com/cm45t3r/candlestick/issues/3)
- Non installation fix & possible script error on test? [\#1](https://github.com/cm45t3r/candlestick/issues/1)

**Merged pull requests:**

- chore\(deps\): bump glob-parent from 5.1.1 to 5.1.2 [\#8](https://github.com/cm45t3r/candlestick/pull/8) ([dependabot[bot]](https://github.com/apps/dependabot))
- \[Snyk\] Fix for 1 vulnerable dependencies [\#4](https://github.com/cm45t3r/candlestick/pull/4) ([snyk-bot](https://github.com/snyk-bot))

\* _This Changelog was automatically generated by [github_changelog_generator](https://github.com/github-changelog-generator/github-changelog-generator)_
