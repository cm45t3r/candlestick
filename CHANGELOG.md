# Changelog

## [Unreleased]
- Major refactor: fully modularized all pattern logic into separate files.
- Added `patternChain` API for multi-pattern scanning in a single pass.
- Added and improved JSDoc for all exported functions.
- Improved and expanded test suite; 100% coverage for all modules.
- Refactored entrypoint for clean exports and tree-shaking.
- Added benchmarking and memory profiling scripts.
- Modernized and expanded README with usage, API, and pattern documentation.
- Improved code quality, linting, and formatting (ESLint flat config, Prettier).

## 0.0.7 / 2024-04-02
* Fix index.js copyright.
* Remove useless properties in .eslintcr and add `object-curly-spacing` exception rule.
* Fix linting errors.
* Update package keywords and increment version.
* Optimize private function `findPattern` to make it more performant.

## 0.0.6 / 2024-03-31
* Remove optional param `ratio` from hammer functions causing bad results.
* Fix `bullishHammer`, `bearishHammer`, `bullishInvertedHammer`, `bearishInvertedHammer`, and `hangingMan` functions.
* Bugfix [#1](https://github.com/cm45t3r/candlestick/issues/1).

## 0.0.5 / 2022-04-28
* Dependencies upgrade.
* Add google eslint ruleset.
* Add nyc coverage to test script.
* Fix spacing and style.
* Add jsdoc to functions.
* Add bullish and bearish hammers (inverted and non-inverted).
* Add optional `ratio` param to hammers.
* Fix kickers to exclude hammers.
* Fix candle wrapping on engulfings.

## 0.0.4 / 2021-01-12
* Bugfixes [1](https://github.com/cm45t3r/candlestick/issues/1) and [5](https://github.com/cm45t3r/candlestick/issues/5)
* Update [README.md](https://github.com/cm45t3r/candlestick/blob/master/README.md)

## 0.0.3 / 2016-10-25
* Shooting star support added.
* Examples updated.

## 0.0.2 / 2016-10-24
* Fixed accidental lib and test folder exclusion on npm package.

## 0.0.1 / 2016-10-22
* Initial release 