# Working on candlestick

Zero-dependency JavaScript library for candlestick pattern detection in OHLC data.

## How work is specified

**GitHub issues are the spec.** There is no separate spec directory. A good issue
here states the problem, shows observed behaviour against expected (a table of
inputs to outputs where it helps), and names the acceptance criteria. Issues
[#148](https://github.com/cm45t3r/candlestick/issues/148),
[#149](https://github.com/cm45t3r/candlestick/issues/149) and
[#150](https://github.com/cm45t3r/candlestick/issues/150) are the pattern to follow.

Every change lands through a pull request, including documentation. CI runs the
full suite on Node 20, 22, 24 and 26 across Linux, Windows and macOS.

## Commands

```bash
npm test              # node --test, the full suite
npm run coverage      # c8 report
npm run lint          # eslint
npm run format        # prettier --write
npm run bench         # full benchmark suite
npm run bench:readme  # regenerate the README benchmark table in place
```

`npm run lint && npm test` runs automatically before publish via `prepublishOnly`.

## Layout

Flat, one module per concern. No feature folders, no nested packages.

| Path                              | What                                                                                                                       |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `src/*.js`                        | one file per pattern, plus `utils`, `trend`, `volatility`, `streaming`, `patternChain`, `patternMetadata`, `pluginManager` |
| `src/candlestick.js`              | aggregator; `index.js` proxies to it for CJS                                                                               |
| `src/index.mjs`                   | ESM entry                                                                                                                  |
| `types/index.d.ts`                | TypeScript definitions, hand-maintained                                                                                    |
| `cli/index.js`, `bin/candlestick` | the CLI                                                                                                                    |
| `test/`                           | mirrors `src/` one-to-one                                                                                                  |
| `docs/`                           | ARCHITECTURE, PATTERNS, CLI_GUIDE, PLUGIN_API, ROADMAP                                                                     |

## Conventions that are easy to get wrong

**Published claims must be measured, and say where the measurement came from.**
The README benchmark table records its date, Node version and hardware. A figure
without provenance has twice been wrong here: an unsubstantiated "~70% memory
reduction" ([#135](https://github.com/cm45t3r/candlestick/issues/135)) and an
install size that changed every time it was written, because this README ships
inside the package it measures
([#159](https://github.com/cm45t3r/candlestick/pull/159)). Prefer a badge or a
regeneration script over a number typed by hand.

**Do not claim tree-shaking.** The ESM entry destructures the CommonJS namespace
at runtime, so a bundle of one pattern is the same size as a bundle of all of
them. Tracked in [#155](https://github.com/cm45t3r/candlestick/issues/155).

**Branch coverage is not deterministic.** `fast-check` seeds differ per run and
reach different branches, so the figure moves by a tenth of a point between runs.
Line and function coverage are stable; do not publish a branch decimal.

**`ROADMAP.md` carries corrections.** When a released claim turns out to be wrong,
the entry keeps what was claimed and appends the correction rather than quietly
rewriting history.

## Releasing

1. Bump `package.json`, promote the roadmap's `Unreleased` section to the version.
2. Merge, then tag `vX.Y.Z` on `main`. Release Automation generates the changelog
   and creates the GitHub release.
3. Publish with `npm publish`. It is a manual step: the account requires an OTP,
   and the tag trigger in `npm-publish.yml` is disabled because `NPM_TOKEN` is
   expired. The header of that workflow records what restoring it needs
   (Trusted Publishing on npmjs.com, npm >= 11.5.1, dropping `NODE_AUTH_TOKEN`).

Note that `v2.1.0` exists as a tag and GitHub release but never reached npm — the
publish failed and `2.2.0` was released instead, deliberately leaving the gap.
