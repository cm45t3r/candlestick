---
title: "The Hammer and the Hanging Man Are the Same Candle"
description: >-
  Two candlestick patterns with identical geometry and opposite meanings, and
  what it took to tell them apart in a pattern detection library.
date: 2026-09-14
---

A hammer is a small body with a long lower wick. It's a *bullish* reversal signal.

A hanging man is a small body with a long lower wick. It's a *bearish* reversal signal.

Geometrically, they are the same candle. Nothing about the shape distinguishes them. The only thing that separates a buy signal from a sell signal is what happened *before* it: a hammer means something after a downtrend, a hanging man after an uptrend.

Most pattern detection libraries will hand you both matches on the same candle and leave you to sort it out. That's the problem I spent most of my time on in [`candlestick`](https://github.com/cm45t3r/candlestick), and it's the one worth writing about.

## Why a static confidence score is worse than none

The tempting fix is to attach a reliability number to each pattern — hammer is 0.7, doji is 0.4, and so on. I shipped exactly that, and it was a mistake.

A fixed score is context-blind by construction. The same hammer geometry is a strong signal after a sustained decline and nearly worthless in the middle of a rally, but a static 0.7 reports both identically. It reads as precision while carrying no information. The `confidence` field is still there, marked `@deprecated`, because removing it outright would break callers — but nothing in the library encourages its use any more.

What replaced it measures the actual preceding trend and scores how well each match fits the context that pattern requires:

```js
const { patternChain, allPatterns, metadata } = require("candlestick");

const matches = patternChain(data, allPatterns, {
  trendContext: { trendMethod: "sma-slope", trendPeriod: 10 },
});

// 11: hangingMan     trendContext: "uptrend"  contextFit: 1.00
// 12: hammer         trendContext: "uptrend"  contextFit: 0.41
// 12: bearishHammer  trendContext: "uptrend"  contextFit: 0.41
```

Same uptrend, same long-lower-wick geometry, and the library tells you which reading the context supports. `metadata.enrichWithMetadata` folds that into an `effectiveConfidence` of `confidence × contextFit`: the hammer drops to 0.29, because a bullish reversal signal in the middle of an uptrend isn't worth much.

Passing `resolveConflicts: true` goes further and drops the weaker side of a same-candle, opposite-direction conflict outright. Built-in trend methods are `sma-slope` (default), `ema-slope` and `pct-change`, and you can supply your own `externalTrend` series or a `trendFn` callback if you already have a better regime model.

One implementation detail worth knowing: multi-candle patterns anchor their `index` at the *first* candle of the formation, while single-candle patterns anchor at the candle itself. In the output above, that's why `hangingMan` reports at 11 and `hammer` at 12 for what is visually the same pair. Conflict resolution operates per anchor index, so overlapping formations of different lengths are surfaced rather than silently merged.

## The rest of the design

The trend-context work is the interesting part, but a few other decisions shaped the library enough to be worth naming.

**A consistent, dual-mode API.** Every pattern ships two functions: a boolean check for a single candle or pair (`isHammer(candle)`), and an array scanner that returns match indices (`hammer(dataArray)`). Learn the shape once and you know it for all 18 patterns — 29 variants once you count the bullish/bearish splits.

**Pattern chaining instead of pattern-by-pattern loops.** `patternChain(data, allPatterns)` scans for everything in a single pass and returns a normalized list of `{ index, pattern, match }` results, rather than making you run each detector separately over the same data. Pass your own list instead of `allPatterns` if you only care about a subset.

**TypeScript wasn't bolted on.** Full definitions ship in `types/index.d.ts`, so `OHLC` and `PatternMatch` give you real IntelliSense instead of `any`. The package dual-exports ESM and CommonJS, so `import` and `require` both work without a shim.

**A plugin system, because hardcoded pattern lists are a dead end.** `plugins.registerPattern()` lets you define your own detection function, attach metadata — type, direction, expected trend context — and drop it into `patternChain` alongside the built-ins. Custom patterns get the same treatment as shipped ones, including trend context.

**Gaps measured against volatility, not against zero.** The same context problem shows up
in a second place. A kicker is defined by a gap between two candle bodies — but "any nonzero
gap" treats a $0.30 move on a $210 stock as a signal, when it's indistinguishable from noise.
Passing `minGapVol` requires the gap to clear a volatility-relative threshold instead, using
ATR, standard deviation of returns, or a series you supply yourself. It's opt-in: omit it and
the original behaviour is preserved exactly.

It's the same argument as the hammer. Geometry alone will happily report a pattern that the
surrounding data says is meaningless.

**Validation that fails loudly.** `validateOHLC` and `validateOHLCArray` throw on malformed data instead of letting a missing `high` field silently produce wrong results three functions downstream.

## What "zero dependencies" is actually worth

This is the claim every library makes and few quantify, so here is the whole install:

| | candlestick 2.2.0 |
| --- | --- |
| Published tarball | 42.5 kB |
| Unpacked on disk | 170.6 kB |
| Runtime dependencies | 0 (0 transitive) |
| Native build step | none |

The kilobytes are the least interesting column. The one that matters is the last.

Several established libraries in this space are bindings to TA-Lib or Tulip — C libraries with decades of history and far more indicators than I'll ever ship. The tradeoff is that installing them compiles a native addon: `node-gyp`, a toolchain, Python, and a build that can fail differently on every platform in your matrix. If you've ever watched a CI job go red on Windows only, you know the shape of it.

For reference, measured with `npm view <pkg> dist.unpackedSize`:

| Package | Unpacked | Runtime deps | Native build |
| --- | --- | --- | --- |
| **candlestick** | **171 kB** | **0** | no |
| tulind | 233 kB | 4 | **yes** |
| indicatorts | 563 kB | 0 | no |
| trading-signals | 574 kB | 0 | no |
| technicalindicators | 5.1 MB | 1 | no |
| talib | 27.6 MB | 1 | **yes** |

*(Figures as of September 2026 — they'll drift as those projects release.)*

This isn't a claim that `candlestick` replaces TA-Lib. It doesn't; TA-Lib does far more. It's a claim about a narrower job: if what you need is candlestick pattern detection specifically, you can have it as plain JavaScript that installs identically on Linux, Windows and macOS, with nothing to compile and no supply-chain surface you didn't ask for.

One thing I won't claim: the package is not usefully tree-shakeable today. The ESM entry re-exports the CommonJS module by destructuring it at runtime, which is opaque to a bundler's static analysis, so importing one pattern currently pulls in the same code as importing all of them. It's [tracked as a known defect](https://github.com/cm45t3r/candlestick/issues/155) rather than papered over. At 7.8 kB minified and gzipped for the whole library, it isn't urgent — but `sideEffects: false` in the manifest is currently writing a cheque the entry point doesn't cash.

## Streaming, and where the savings actually come from

Once you're past a few hundred thousand candles, holding the whole series in memory while running pattern checks over it stops being free. `createStream` takes candles in configurable chunks and fires an `onMatch` callback per hit, so you can drive it from a file or a socket without ever materializing the full array.

Measured on 200,000 candles with five patterns: **41.9 MB live heap for `patternChain` against 0.2 MB for the stream** — producing the same 61,866 matches in both cases.

That's a much larger reduction than I used to claim for this API, and I want to be precise about why, because the number is easy to misread. Resident memory is bounded by `chunkSize` instead of scaling with the dataset. The saving is not the streaming machinery — it's *never holding the whole dataset*.

Two conditions are doing all the work, and both are easy to lose by accident:

- **Consume matches in `onMatch` rather than collecting them.** Pushing every match into an array puts the result set straight back into memory, and at high match counts that dominates whatever the buffering saved.
- **Feed the stream incrementally.** Passing `process()` slices of an array you already built in memory saves you nothing at all. The win comes from a generator, a file read, or a socket.

Streaming a pre-built array is a no-op dressed up as an optimization. Worth stating plainly, because it's the mistake I'd expect most people to make first.

## There's a CLI, too

Not everything needs to be a `require`. A fair amount of this work is exploratory — you have a
CSV, you want to know what's in it, and writing a script first is friction.

```bash
npx candlestick -i data.csv --patterns hammer,doji --output table
cat data.json | candlestick --output csv --confidence 0.8
```

It reads CSV or JSON from a file or stdin, filters by pattern, minimum confidence, type
(reversal / continuation / neutral) or direction, and prints JSON, CSV, or a formatted table.
Table and CSV output always carry the pattern metadata — type, direction, confidence,
strength — so the columns are never empty.

It's the same detection code the library exposes, so whatever you confirm at the terminal is
what you'll get in your program.

## Proving it works

Design decisions are cheap to write about and expensive to get right, so the test suite does the real talking: **450 tests across 97 suites, 99.94% line coverage, 100% function coverage, and branch coverage a hair over 99%.** Property-based tests via `fast-check` generate randomized OHLC scenarios per invariant, which is how most of the interesting edge cases surfaced — hand-written examples tend to test the cases you already thought of.

That randomness is also why I won't quote a branch-coverage decimal: the generated cases reach slightly different branches on every run, so the figure moves between 99.1% and 99.3% run to run. A precise number there would be one nobody could reproduce, including me.

CI runs the full suite on Node 20, 22, 24 and 26 across Linux, Windows and macOS.

Throughput for the full 29-pattern chain, measured 2026-09-11 on Node v24.21.0, Intel Core i7-9750H, 16 GB RAM, macOS 26.6:

| Candles | Chain time | Throughput |
| --- | --- | --- |
| 1,000 | 2.7 ms | 370K candles/s |
| 10,000 | 21.1 ms | 474K candles/s |
| 100,000 | 227.1 ms | 440K candles/s |
| 1,000,000 | 2,436.9 ms | 410K candles/s |

Single-run figures on one machine — treat them as an order of magnitude, not a guarantee. `npm run bench` reproduces them on your own hardware, which is the only number that should matter to you.

## Nine years, and what's next

The package has been on npm since 2016. The trend-context work is recent; a lot of the rest is the accumulated result of using it, finding it wrong, and fixing it — which is why the roadmap carries corrections to claims earlier versions made, including a memory figure that turned out to be unsubstantiated.

Next up: visual examples for each pattern (they're text-only descriptions today), a few more multi-candle formations, and the tree-shaking fix above. If there's a pattern you rely on that isn't covered, [issues and PRs are open](https://github.com/cm45t3r/candlestick/issues).

```bash
npm install candlestick
```

Requires Node.js >= 20.

---

## A quick aside: hardware wallets

*Disclosure: the link below is an affiliate link. I earn a commission if you buy through it, at no extra cost to you. It doesn't change what the library does or what I've written above.*

A caveat before the recommendation: this is a detour from the topic. If you're here for OHLC tooling and don't hold crypto, skip it — nothing below is about the library.

Some of the people running this library are analyzing crypto markets rather than equities, and if you're holding assets rather than just charting them, a hardware wallet is the baseline I'd suggest over leaving anything on an exchange. I use **[OneKey](https://onekey.so/r/KFTH04)** — open-source firmware, an EAL6+ certified secure element, and backing from Coinbase Ventures and Dragonfly. Worth a look if you don't already have cold storage sorted.

---

*The full source, docs and examples are on [GitHub](https://github.com/cm45t3r/candlestick). A video walkthrough of the trend-context design is in progress — I'll link it here when it's up.*
