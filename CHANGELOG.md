# Changelog

## [v1.1.0](https://github.com/cm45t3r/candlestick/tree/v1.1.0) (2025-10-17)

[Full Changelog](https://github.com/cm45t3r/candlestick/compare/v1.0.2...v1.1.0)

### 🎯 Major Features

**New Patterns (6 total):**

- feat: Add Morning Star pattern (3-candle bullish reversal)
- feat: Add Evening Star pattern (3-candle bearish reversal)
- feat: Add Three White Soldiers pattern (3-candle bullish continuation)
- feat: Add Three Black Crows pattern (3-candle bearish continuation)
- feat: Add Piercing Line pattern (2-candle bullish reversal)
- feat: Add Dark Cloud Cover pattern (2-candle bearish reversal)

**Module Systems:**

- feat: Add ESM support with dual CommonJS/ESM exports
- feat: Conditional exports in package.json for modern bundlers
- feat: Tree-shaking support for optimal bundle sizes

**TypeScript:**

- feat: Add complete TypeScript definitions (types/index.d.ts)
- feat: Full IntelliSense support for all functions and patterns
- feat: Type-safe interfaces for OHLC, PatternMatch, and plugins

**Plugin System:**

- feat: Add plugin system for custom pattern registration
- feat: Plugin API with metadata support (type, confidence, etc.)
- feat: Integration with patternChain for custom patterns

**Data Validation:**

- feat: Add validateOHLC() for single candle validation
- feat: Add validateOHLCArray() for array validation
- feat: Comprehensive OHLC relationship validation
- feat: Descriptive error messages with context

**Pattern Metadata:**

- feat: Add confidence scores to all patterns (0-1 scale)
- feat: Add pattern type classification (reversal/continuation/neutral)
- feat: Add pattern strength indicators (weak/moderate/strong)
- feat: Add direction metadata (bullish/bearish/neutral)
- feat: Functions to filter, sort, and enrich results with metadata

**CLI Tool:**

- feat: Command-line interface for pattern detection
- feat: Support for JSON and CSV input files
- feat: Multiple output formats (JSON, table, CSV)
- feat: Stdin/stdout pipeline support
- feat: Pattern filtering by confidence, type, and direction
- feat: Data validation from command line

### 📈 Improvements

**Testing:**

- test: Add 144 new tests (80 → 224 tests)
- test: Increase coverage to 99.66% global, 96.90% branches, 100% functions (was ~80%)
- test: Add integration test suite (10 E2E tests)
- test: Add validation test suite (20 tests)
- test: Add plugin system tests (20 tests)
- test: Add metadata system tests (10 tests)
- test: Add CLI tests (10 tests)

**Performance:**

- perf: Enhanced benchmark suite with multiple dataset sizes
- perf: Performance metrics and throughput calculations
- perf: Memory usage tracking

**Documentation:**

- docs: Add ARCHITECTURE.md with detailed design documentation
- docs: Add PLUGIN_API.md with plugin system guide
- docs: Add CLI_GUIDE.md with CLI tool documentation
- docs: Add DOCUMENTATION_INDEX.md master index
- docs: Update README.md with ESM examples, metadata, and CLI
- docs: Expand FAQ section
- docs: Update CONTRIBUTING.md with pattern implementation guide
- docs: Update ROADMAP.md with completed items marked

**Configuration:**

- chore: Add .editorconfig for consistent code style
- chore: Add .nvmrc specifying Node.js 18
- chore: Update ESLint config to support .mjs files
- chore: Add new npm scripts (test:watch, lint:fix, bench)

### 📊 Statistics

- **Patterns:** 8 → 16 (+100%)
- **Tests:** ~80 → 224 (+180%)
- **Coverage:** ~80% → 99.66% global (+24.6%)
- **Documentation:** 3 → 12 files (+300%)
- **CLI Commands:** 0 → 1 (candlestick)
- **Examples:** 9 → 12 (+33%)

### 🔧 Technical Details

**Package.json updates:**

```json
{
  "exports": {
    ".": {
      "import": "./src/index.mjs",
      "require": "./index.js",
      "types": "./types/index.d.ts"
    }
  },
  "module": "src/index.mjs",
  "types": "types/index.d.ts"
}
```

**New modules:**

- src/morningStar.js + test
- src/eveningStar.js + test
- src/threeWhiteSoldiers.js + test
- src/threeBlackCrows.js + test
- src/piercingLine.js + test
- src/darkCloudCover.js + test
- src/pluginManager.js + test
- src/index.mjs (ESM wrapper)
- types/index.d.ts

### ⚠️ Breaking Changes

**None.** This release is 100% backwards compatible.

### 🙏 Acknowledgments

Special thanks to all contributors and users who provided feedback.

---

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
