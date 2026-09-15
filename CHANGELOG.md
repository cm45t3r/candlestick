# Changelog

## [v3.0.0](https://github.com/cm45t3r/candlestick/tree/v3.0.0) (2026-09-15)

[Full Changelog](https://github.com/cm45t3r/candlestick/compare/v2.2.0...v3.0.0)

**Implemented enhancements:**

- enhancement\(cli\): CSV cannot be piped — stdin is always parsed as JSON [\#150](https://github.com/cm45t3r/candlestick/issues/150)

**Fixed bugs:**

- bug\(esm\): the ESM entry is not tree-shakeable — importing one pattern pulls in the whole library [\#155](https://github.com/cm45t3r/candlestick/issues/155)
- bug\(cli\): "--" is not honoured as end-of-options [\#149](https://github.com/cm45t3r/candlestick/issues/149)
- bug\(cli\): parseArgs swallows the next flag when an option value is missing [\#148](https://github.com/cm45t3r/candlestick/issues/148)

**Closed issues:**

- Decide when to drop Node 20 \(EOL since 2026-04-30\) [\#146](https://github.com/cm45t3r/candlestick/issues/146)

**Merged pull requests:**

- chore\(release\): v3.0.0 [\#166](https://github.com/cm45t3r/candlestick/pull/166) ([cm45t3r](https://github.com/cm45t3r))
- chore!: require Node.js \>= 22 [\#165](https://github.com/cm45t3r/candlestick/pull/165) ([cm45t3r](https://github.com/cm45t3r))
- fix\(esm\): make the ESM entry tree-shakeable [\#164](https://github.com/cm45t3r/candlestick/pull/164) ([cm45t3r](https://github.com/cm45t3r))
- fix\(cli\): detect the input format from content when the extension cannot [\#163](https://github.com/cm45t3r/candlestick/pull/163) ([cm45t3r](https://github.com/cm45t3r))
- fix\(cli\): diagnose missing option values and honour "--" [\#162](https://github.com/cm45t3r/candlestick/pull/162) ([cm45t3r](https://github.com/cm45t3r))
- chore: remove the Kiro spec tooling [\#161](https://github.com/cm45t3r/candlestick/pull/161) ([cm45t3r](https://github.com/cm45t3r))
- docs: source the size badge from npm instead of bundlephobia [\#160](https://github.com/cm45t3r/candlestick/pull/160) ([cm45t3r](https://github.com/cm45t3r))
- docs: stop printing an install size that printing changes [\#159](https://github.com/cm45t3r/candlestick/pull/159) ([cm45t3r](https://github.com/cm45t3r))
- docs: link the blog, and stop the footprint figures chasing themselves [\#158](https://github.com/cm45t3r/candlestick/pull/158) ([cm45t3r](https://github.com/cm45t3r))
- chore\(npm\): prune the keyword list from 21 to 15 [\#157](https://github.com/cm45t3r/candlestick/pull/157) ([cm45t3r](https://github.com/cm45t3r))
- docs: lead with the install footprint, drop the decorative badges [\#156](https://github.com/cm45t3r/candlestick/pull/156) ([cm45t3r](https://github.com/cm45t3r))

## [v2.2.0](https://github.com/cm45t3r/candlestick/tree/v2.2.0) (2026-09-14)

[Full Changelog](https://github.com/cm45t3r/candlestick/compare/v2.1.0...v2.2.0)

**Fixed bugs:**

- docs: README benchmark table is stale and understates current performance [\#136](https://github.com/cm45t3r/candlestick/issues/136)
- docs: streaming example contradicts the ~70% memory reduction claim [\#135](https://github.com/cm45t3r/candlestick/issues/135)
- chore: generated CHANGELOG.md always fails prettier format:check [\#130](https://github.com/cm45t3r/candlestick/issues/130)
- ci: Publish to GitHub Packages cannot work for an unscoped package name [\#129](https://github.com/cm45t3r/candlestick/issues/129)
- chore: .nvmrc pins Node 18 while engines and docs require \>= 20 [\#123](https://github.com/cm45t3r/candlestick/issues/123)

**Closed issues:**

- CLI: Type/Confidence/Strength are empty unless --metadata is passed [\#141](https://github.com/cm45t3r/candlestick/issues/141)

**Merged pull requests:**

- chore\(release\): v2.2.0 [\#154](https://github.com/cm45t3r/candlestick/pull/154) ([cm45t3r](https://github.com/cm45t3r))
- chore\(deps\): bump eslint from 10.9.1 to 10.10.0 [\#153](https://github.com/cm45t3r/candlestick/pull/153) ([dependabot[bot]](https://github.com/apps/dependabot))
- chore\(deps\): bump fast-check from 4.9.0 to 4.10.0 [\#152](https://github.com/cm45t3r/candlestick/pull/152) ([dependabot[bot]](https://github.com/apps/dependabot))
- docs: reconcile the docs with everything resolved since v2.1.0 [\#151](https://github.com/cm45t3r/candlestick/pull/151) ([cm45t3r](https://github.com/cm45t3r))
- fix\(cli\): honour "-" as stdin when picking the parser [\#147](https://github.com/cm45t3r/candlestick/pull/147) ([cm45t3r](https://github.com/cm45t3r))
- ci: test on node 26 as well [\#145](https://github.com/cm45t3r/candlestick/pull/145) ([cm45t3r](https://github.com/cm45t3r))
- test: cover the first-candle shadow guards in the three-candle patterns [\#144](https://github.com/cm45t3r/candlestick/pull/144) ([cm45t3r](https://github.com/cm45t3r))
- chore\(deps\): bump c8 to 12 so coverage runs on node 26 [\#143](https://github.com/cm45t3r/candlestick/pull/143) ([cm45t3r](https://github.com/cm45t3r))
- feat\(cli\): always include metadata in table and csv output [\#142](https://github.com/cm45t3r/candlestick/pull/142) ([cm45t3r](https://github.com/cm45t3r))
- fix\(cli\): size table columns to their content [\#140](https://github.com/cm45t3r/candlestick/pull/140) ([cm45t3r](https://github.com/cm45t3r))
- docs: refresh the README benchmark table and record where it came from [\#139](https://github.com/cm45t3r/candlestick/pull/139) ([cm45t3r](https://github.com/cm45t3r))
- docs\(streaming\): measure the memory claim honestly in the example [\#138](https://github.com/cm45t3r/candlestick/pull/138) ([cm45t3r](https://github.com/cm45t3r))
- chore: silence no-console in update-bench like its peers [\#137](https://github.com/cm45t3r/candlestick/pull/137) ([cm45t3r](https://github.com/cm45t3r))
- chore: exclude the generated CHANGELOG from prettier [\#134](https://github.com/cm45t3r/candlestick/pull/134) ([cm45t3r](https://github.com/cm45t3r))
- ci: remove the GitHub Packages publish workflow [\#133](https://github.com/cm45t3r/candlestick/pull/133) ([cm45t3r](https://github.com/cm45t3r))
- ci: run CodeQL on main, not the non-existent master branch [\#132](https://github.com/cm45t3r/candlestick/pull/132) ([cm45t3r](https://github.com/cm45t3r))
- chore: pin .nvmrc to Node 20 to match engines [\#131](https://github.com/cm45t3r/candlestick/pull/131) ([cm45t3r](https://github.com/cm45t3r))
- fix\(scripts\): run the benchmark without a shell in update-bench [\#128](https://github.com/cm45t3r/candlestick/pull/128) ([cm45t3r](https://github.com/cm45t3r))

## [v2.1.0](https://github.com/cm45t3r/candlestick/tree/v2.1.0) (2026-09-11)

[Full Changelog](https://github.com/cm45t3r/candlestick/compare/archive/feat-trend-context-confidence...v2.1.0)

**Implemented enhancements:**

- feature: trend-context-aware pattern confidence \(and deprecate static confidence field\) [\#95](https://github.com/cm45t3r/candlestick/issues/95)

**Fixed bugs:**

- streaming: chunkSize below maxPatternSize hangs or silently drops candles [\#121](https://github.com/cm45t3r/candlestick/issues/121)
- streaming: end\(\) is not idempotent and totalProcessed double-counts overlap candles [\#119](https://github.com/cm45t3r/candlestick/issues/119)
- benchmark: runStreamBenchmark ignores its chunkSize parameter, labels misreport the measurement [\#118](https://github.com/cm45t3r/candlestick/issues/118)
- streaming: chunkSize below maxPatternSize hangs or silently corrupts output [\#117](https://github.com/cm45t3r/candlestick/issues/117)
- streaming: duplicate matches emitted at chunk boundaries for patterns shorter than maxPatternSize [\#115](https://github.com/cm45t3r/candlestick/issues/115)

**Merged pull requests:**

- ci: publish on tag push instead of release creation [\#127](https://github.com/cm45t3r/candlestick/pull/127) ([cm45t3r](https://github.com/cm45t3r))
- chore\(release\): 2.1.0 [\#126](https://github.com/cm45t3r/candlestick/pull/126) ([cm45t3r](https://github.com/cm45t3r))
- fix\(benchmark\): separate feed size from chunkSize in the streaming benchmark [\#125](https://github.com/cm45t3r/candlestick/pull/125) ([cm45t3r](https://github.com/cm45t3r))
- ci: test on Node 24.x and document the supported matrix [\#124](https://github.com/cm45t3r/candlestick/pull/124) ([cm45t3r](https://github.com/cm45t3r))
- fix\(streaming\): reject chunkSize below the longest active pattern [\#122](https://github.com/cm45t3r/candlestick/pull/122) ([cm45t3r](https://github.com/cm45t3r))
- fix\(streaming\): make end\(\) idempotent and count totalProcessed exactly [\#120](https://github.com/cm45t3r/candlestick/pull/120) ([cm45t3r](https://github.com/cm45t3r))
- fix\(streaming\): drop duplicate matches at chunk boundaries [\#116](https://github.com/cm45t3r/candlestick/pull/116) ([cm45t3r](https://github.com/cm45t3r))
- chore\(deps\): bump brace-expansion [\#114](https://github.com/cm45t3r/candlestick/pull/114) ([dependabot[bot]](https://github.com/apps/dependabot))
- chore\(deps\): bump @eslint/eslintrc from 3.3.6 to 3.3.7 [\#113](https://github.com/cm45t3r/candlestick/pull/113) ([dependabot[bot]](https://github.com/apps/dependabot))
- chore\(deps\): bump @humanfs/node from 0.16.6 to 0.16.8 [\#112](https://github.com/cm45t3r/candlestick/pull/112) ([dependabot[bot]](https://github.com/apps/dependabot))
- chore\(deps\): bump eslint from 10.7.0 to 10.9.1 [\#111](https://github.com/cm45t3r/candlestick/pull/111) ([dependabot[bot]](https://github.com/apps/dependabot))
- chore\(deps\): bump js-yaml from 4.3.0 to 4.3.1 [\#109](https://github.com/cm45t3r/candlestick/pull/109) ([dependabot[bot]](https://github.com/apps/dependabot))
- chore\(actions\): bump actions/stale from 10 to 11 [\#108](https://github.com/cm45t3r/candlestick/pull/108) ([dependabot[bot]](https://github.com/apps/dependabot))
- chore\(deps\): bump prettier from 3.9.5 to 3.9.6 [\#107](https://github.com/cm45t3r/candlestick/pull/107) ([dependabot[bot]](https://github.com/apps/dependabot))
- chore\(deps\): bump @eslint/eslintrc from 3.3.5 to 3.3.6 [\#103](https://github.com/cm45t3r/candlestick/pull/103) ([dependabot[bot]](https://github.com/apps/dependabot))
- chore\(deps\): bump prettier from 3.9.4 to 3.9.5 [\#102](https://github.com/cm45t3r/candlestick/pull/102) ([dependabot[bot]](https://github.com/apps/dependabot))
- chore\(deps\): bump eslint from 10.6.0 to 10.7.0 [\#101](https://github.com/cm45t3r/candlestick/pull/101) ([dependabot[bot]](https://github.com/apps/dependabot))
- chore\(deps\): bump fast-check from 4.8.0 to 4.9.0 [\#100](https://github.com/cm45t3r/candlestick/pull/100) ([dependabot[bot]](https://github.com/apps/dependabot))
- feat\(patternChain\): trend-context-aware confidence, deprecate static confidence [\#99](https://github.com/cm45t3r/candlestick/pull/99) ([cm45t3r](https://github.com/cm45t3r))
- feat\(kicker\): configurable, pluggable volatility-based gap significance threshold [\#98](https://github.com/cm45t3r/candlestick/pull/98) ([cm45t3r](https://github.com/cm45t3r))

## [archive/feat-trend-context-confidence](https://github.com/cm45t3r/candlestick/tree/archive/feat-trend-context-confidence) (2026-07-17)

[Full Changelog](https://github.com/cm45t3r/candlestick/compare/v2.0.2...archive/feat-trend-context-confidence)

**Implemented enhancements:**

- Chore: extract shared method/external-series/callback resolution helper for \#95 and \#96 [\#97](https://github.com/cm45t3r/candlestick/issues/97)
- Feature: configurable, pluggable volatility-based gap significance threshold for kicker\(\) \(ATR/stddev/percentile/external\) [\#96](https://github.com/cm45t3r/candlestick/issues/96)

## [v2.0.2](https://github.com/cm45t3r/candlestick/tree/v2.0.2) (2026-07-10)

[Full Changelog](https://github.com/cm45t3r/candlestick/compare/v2.0.1...v2.0.2)

**Merged pull requests:**

- chore\(deps\): bump prettier from 3.8.4 to 3.9.4 [\#94](https://github.com/cm45t3r/candlestick/pull/94) ([dependabot[bot]](https://github.com/apps/dependabot))
- chore\(deps\): bump eslint from 10.5.0 to 10.6.0 [\#93](https://github.com/cm45t3r/candlestick/pull/93) ([dependabot[bot]](https://github.com/apps/dependabot))
- chore\(actions\): bump actions/checkout from 5 to 7 [\#91](https://github.com/cm45t3r/candlestick/pull/91) ([dependabot[bot]](https://github.com/apps/dependabot))

## [v2.0.1](https://github.com/cm45t3r/candlestick/tree/v2.0.1) (2026-06-17)

[Full Changelog](https://github.com/cm45t3r/candlestick/compare/v2.0.0...v2.0.1)

## [v2.0.0](https://github.com/cm45t3r/candlestick/tree/v2.0.0) (2026-06-17)

[Full Changelog](https://github.com/cm45t3r/candlestick/compare/v1.2.0...v2.0.0)

**Implemented enhancements:**

- perf\(patternChain\): precomputeCandleProps called N\_patterns+1 times per run [\#80](https://github.com/cm45t3r/candlestick/issues/80)
- refactor\(plugins\): module-level singleton Map leaks state across tests and process lifetime [\#79](https://github.com/cm45t3r/candlestick/issues/79)
- refactor\(utils\): precomputeCandleProps duplicates logic from utility functions [\#76](https://github.com/cm45t3r/candlestick/issues/76)
- perf\(streaming\): buffer.concat\(\) in hot loop creates unnecessary allocations [\#75](https://github.com/cm45t3r/candlestick/issues/75)

**Fixed bugs:**

- bug\(utils\): findPattern relies on Function.length for arity, breaks with default parameters [\#87](https://github.com/cm45t3r/candlestick/issues/87)
- bug\(streaming\): processLargeDataset silently discards caller's onMatch callback [\#86](https://github.com/cm45t3r/candlestick/issues/86)
- bug\(utils\): precomputeCandleProps silently produces NaN for malformed candle fields [\#85](https://github.com/cm45t3r/candlestick/issues/85)
- bug\(utils\): ensurePrecomputed false-positive when input data has a bodyLen field [\#84](https://github.com/cm45t3r/candlestick/issues/84)
- bug\(streaming\): processLargeDataset loses buffered data and skips final progress callback on error [\#83](https://github.com/cm45t3r/candlestick/issues/83)
- bug\(streaming\): chunkSize \<= 0 causes infinite loop in process\(\) [\#82](https://github.com/cm45t3r/candlestick/issues/82)
- bug\(streaming\): onMatch callback throw corrupts stream state permanently [\#81](https://github.com/cm45t3r/candlestick/issues/81)
- bug\(streaming\): empty patternFns causes maxPatternSize = -Infinity [\#74](https://github.com/cm45t3r/candlestick/issues/74)
- isEngulfed with faulty equality logic [\#60](https://github.com/cm45t3r/candlestick/issues/60)

**Closed issues:**

- chore\(security\): fix moderate vulnerability in brace-expansion \(transitive via eslint\) [\#78](https://github.com/cm45t3r/candlestick/issues/78)
- chore\(deps\): pin devDependencies to explicit semver ranges instead of "latest" [\#77](https://github.com/cm45t3r/candlestick/issues/77)

**Merged pull requests:**

- chore\(deps\): bump js-yaml from 4.1.1 to 4.2.0 [\#90](https://github.com/cm45t3r/candlestick/pull/90) ([dependabot[bot]](https://github.com/apps/dependabot))
- chore\(deps\): bump prettier from 3.8.3 to 3.8.4 [\#89](https://github.com/cm45t3r/candlestick/pull/89) ([dependabot[bot]](https://github.com/apps/dependabot))
- chore\(deps\): bump eslint from 10.4.1 to 10.5.0 [\#88](https://github.com/cm45t3r/candlestick/pull/88) ([dependabot[bot]](https://github.com/apps/dependabot))
- chore\(deps\): bump prettier from 3.6.2 to 3.8.2 [\#66](https://github.com/cm45t3r/candlestick/pull/66) ([dependabot[bot]](https://github.com/apps/dependabot))
- chore\(deps\): bump eslint from 9.38.0 to 10.2.0 [\#65](https://github.com/cm45t3r/candlestick/pull/65) ([dependabot[bot]](https://github.com/apps/dependabot))
- chore\(deps\): bump @eslint/eslintrc from 3.3.1 to 3.3.5 [\#64](https://github.com/cm45t3r/candlestick/pull/64) ([dependabot[bot]](https://github.com/apps/dependabot))
- chore\(deps\): bump fast-check from 4.3.0 to 4.6.0 [\#63](https://github.com/cm45t3r/candlestick/pull/63) ([dependabot[bot]](https://github.com/apps/dependabot))

## [v1.2.0](https://github.com/cm45t3r/candlestick/tree/v1.2.0) (2025-10-18)

[Full Changelog](https://github.com/cm45t3r/candlestick/compare/v1.1.0...v1.2.0)

**Merged pull requests:**

- chore\(actions\): bump actions/stale from 9 to 10 [\#36](https://github.com/cm45t3r/candlestick/pull/36) ([dependabot[bot]](https://github.com/apps/dependabot))

## [v1.1.0](https://github.com/cm45t3r/candlestick/tree/v1.1.0) (2025-10-17)

[Full Changelog](https://github.com/cm45t3r/candlestick/compare/v1.0.2...v1.1.0)

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

[Full Changelog](https://github.com/cm45t3r/candlestick/compare/v1.0.0...v1.0.1)

## [v1.0.0](https://github.com/cm45t3r/candlestick/tree/v1.0.0) (2025-07-24)

[Full Changelog](https://github.com/cm45t3r/candlestick/compare/0.0.7...v1.0.0)

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



\* *This Changelog was automatically generated by [github_changelog_generator](https://github.com/github-changelog-generator/github-changelog-generator)*
