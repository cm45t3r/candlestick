window.BENCHMARK_DATA = {
  "lastUpdate": 1789100725024,
  "repoUrl": "https://github.com/cm45t3r/candlestick",
  "entries": {
    "Benchmark": [
      {
        "commit": {
          "author": {
            "email": "cm45t3r@gmail.com",
            "name": "cm45t3r",
            "username": "cm45t3r"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "952c4231476e4340e66006fb85282c668c9a7c2d",
          "message": "feat(kicker): configurable, pluggable volatility-based gap significance threshold (#98)\n\n* feat(kicker): add configurable, pluggable volatility-based gap threshold\n\nKicker detection previously treated any nonzero gap between candle bodies\nas significant, producing matches on economically meaningless gaps (e.g.\n$0.30 on a $210 stock, reported with the same static 0.9 confidence as a\nmulti-dollar news gap).\n\nAdds an opt-in `minGapVol` threshold to `bullishKicker`/`bearishKicker`/\n`isBullishKicker`/`isBearishKicker`, measured against a configurable\nvolatility unit:\n\n- `volMethod: \"atr\" | \"stddev\" | \"percentile\"` — built-in measures\n  (src/volatility.js), all expressed as a fraction of price so they're\n  comparable across price levels.\n- `volMethod: \"fixed-pct\"` — flat percentage of previous close, no\n  lookback/history required.\n- `externalVolatility` / `volatilityFn` — escape hatches for callers who\n  already have a more advanced volatility model (e.g. GARCH fit\n  externally); this package does not implement GARCH itself.\n\nAlso extracts `src/seriesResolver.js`, a small internal helper that\nresolves a per-candle series from (callback > precomputed array > named\nbuilt-in method), shared plumbing intended for reuse by the trend-context\nproposal in #95.\n\nFully backward compatible: `minGapVol` defaults to `0`, preserving the\nexact pre-existing behavior when omitted.\n\nCloses #96. Implements the shared helper proposed in #97.\n\nCo-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_01XRBitjqZyuWGbSXjYKivE2\n\n* test(kicker): cover the atr/percentile array-level paths and bearishKicker's minGapVol branch\n\nCI coverage on the previous commit showed kicker.js at 93.14% stmts /\n88.88% funcs (below this repo's 99%+/100% targets), missing:\n- the percentile builtin wrapper inside resolveVolatilitySeries\n- bearishKicker's entire minGapVol > 0 branch (only bullishKicker's was\n  exercised)\n- any real volMethod: \"atr\"/\"percentile\" resolution through the\n  array-level path (prior tests only used explicit `volatility`,\n  `externalVolatility`, `volatilityFn`, or \"fixed-pct\")\n\nAdds targeted tests for all of the above, each with hand-verified\nexpected values cross-checked against atrSeries/percentileSeries output.\n\nCo-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_01XRBitjqZyuWGbSXjYKivE2\n\n* test(volatility): cover rollingQuantile's exact-index branch\n\nCI coverage showed volatility.js at 97.22% branch (line 67: the\n`lower === upper` short-circuit in rollingQuantile was never hit, since\nthe existing tests only used quantile=0.9 with period=2, which always\nlands between two window indices).\n\nquantile=1 and quantile=0 both produce an integer `position` for any\nwindow size, exercising the exact-index path instead of interpolation.\n\nCo-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_01XRBitjqZyuWGbSXjYKivE2\n\n---------\n\nCo-authored-by: Claude Sonnet 5 <noreply@anthropic.com>",
          "timestamp": "2026-07-10T17:28:29-05:00",
          "tree_id": "33b6dbb7499a07a715b2b6116f148830794f452f",
          "url": "https://github.com/cm45t3r/candlestick/commit/952c4231476e4340e66006fb85282c668c9a7c2d"
        },
        "date": 1783722528618,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Pattern Chain 100",
            "value": 2.9,
            "unit": "ms"
          },
          {
            "name": "Hammer 100",
            "value": 0.24,
            "unit": "ms"
          },
          {
            "name": "Memory 100",
            "value": 0.28,
            "unit": "MB"
          },
          {
            "name": "Pattern Chain 1,000",
            "value": 4.4,
            "unit": "ms"
          },
          {
            "name": "Hammer 1,000",
            "value": 0.52,
            "unit": "ms"
          },
          {
            "name": "Memory 1,000",
            "value": 1.85,
            "unit": "MB"
          },
          {
            "name": "Pattern Chain 10,000",
            "value": 30.8,
            "unit": "ms"
          },
          {
            "name": "Hammer 10,000",
            "value": 4.94,
            "unit": "ms"
          },
          {
            "name": "Memory 10,000",
            "value": 21.83,
            "unit": "MB"
          },
          {
            "name": "Pattern Chain 100,000",
            "value": 201.4,
            "unit": "ms"
          },
          {
            "name": "Hammer 100,000",
            "value": 9.27,
            "unit": "ms"
          },
          {
            "name": "Memory 100,000",
            "value": 98.38,
            "unit": "MB"
          },
          {
            "name": "Pattern Chain 1,000,000",
            "value": 1665.3,
            "unit": "ms"
          },
          {
            "name": "Hammer 1,000,000",
            "value": 50.16,
            "unit": "ms"
          },
          {
            "name": "Memory 1,000,000",
            "value": 675.94,
            "unit": "MB"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "cm45t3r@gmail.com",
            "name": "cm45t3r",
            "username": "cm45t3r"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6056dbfc0d0df7138ab703dea29076607adde0be",
          "message": "feat(patternChain): trend-context-aware confidence, deprecate static confidence (#99)\n\n* feat(patternChain): trend-context-aware confidence, deprecate static confidence\n\nPattern functions are evaluated independently with no shared trend\ncontext. On real data (AAPL, 2025-07-22/23) this lets the identical\ncandle qualify as both `hammer` (bullish reversal, expects a preceding\ndowntrend) and `hangingMan` (bearish reversal, expects a preceding\nuptrend) — opposite signals on the same shape, disambiguated only by\ncontext. Each pattern's static `confidence` also can't distinguish a\ntextbook occurrence from a marginal one.\n\nAdds an opt-in `trendContext` option to `patternChain`:\n\n- `trendMethod: \"sma-slope\" | \"ema-slope\" | \"pct-change\"` — built-in\n  trend measures (src/trend.js), signed fractions comparable across\n  price levels.\n- `externalTrend` / `trendFn` — escape hatches for callers with a more\n  advanced trend/regime model, mirroring #96/#97's design for\n  volatility (this package implements neither GARCH nor an HMM itself).\n- Each match derives its expected preceding-trend direction from its\n  existing `type`+`direction` metadata (src/contextFit.js):\n  reversal patterns expect the OPPOSITE trend, continuation patterns\n  expect the SAME trend, neutral patterns expect nothing. This is the\n  exact rule that resolves the hammer/hangingMan contradiction above.\n- Results carry `trendContext` (a coarse label) and `contextFit` (0-1).\n  `enrichWithMetadata` additionally computes `effectiveConfidence`\n  (`confidence * contextFit`) — the trend-aware alternative to the\n  now-deprecated static `confidence` (kept for backward compatibility,\n  marked `@deprecated` in JSDoc/types, not scheduled for removal before\n  a major version).\n- `resolveConflicts: true` optionally drops the lower-`contextFit` side\n  of a same-candle, opposite-direction conflict (default: surface both).\n\nReuses `src/seriesResolver.js` (#97) for the method/external/callback\nresolution, same precedence as #96's volatility option.\n\nFully backward compatible: omitting `trendContext` preserves\n`patternChain`'s exact pre-existing result shape and the static\n`confidence` field is unchanged.\n\nCloses #95.\n\nCo-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_01XRBitjqZyuWGbSXjYKivE2\n\n* test(trendContext,contextFit): cover remaining branches found via CI coverage\n\nCI coverage on the previous commit showed two real gaps introduced by\nthis PR:\n- contextFit.js 98.57%/95% stmts/branch (line 32): the final `return 0`\n  fallback in expectedTrendDirection, reachable only for a non-neutral\n  direction paired with a type that's neither \"reversal\" nor\n  \"continuation\" — not a combination in today's patternMetadata, but the\n  function shouldn't silently assume it can never happen.\n- trendContext.js 97.84%/90.9% stmts/branch (lines 86-87, 122): the\n  `b.contextFit > a.contextFit` branch in filterConflicts (only the\n  opposite ordering, `a > b`, was exercised) and the \"downtrend\" label\n  branch in applyTrendContext (all prior fixtures used a clean uptrend).\n\nAdds targeted tests for both.\n\nCo-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_01XRBitjqZyuWGbSXjYKivE2\n\n* test(trendContext): cover the remaining sideways/unknown-metadata branches\n\nSecond coverage pass: after fixing the first round of gaps,\ntrendContext.js was still at 94.59% branch (lines 79, 123):\n- line 79: the `!metaB` half of filterConflicts' guard clause (only the\n  \"known pattern, neutral direction\" half was exercised, via doji).\n- line 123: the \"sideways\" trendContext label (all prior fixtures used\n  a clear up or down trend, never a flat/zero-change one).\n\nAdds targeted tests for both.\n\nCo-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_01XRBitjqZyuWGbSXjYKivE2\n\n* perf(benchmark): reduce single-sample noise causing false regression alerts\n\nSingle performance.now() samples on shared CI runners were noisy enough\nto trip PR #99's benchmark alert (up to 4x) despite no actual code-path\nchange in the measured functions. Warm up once then take the median of\n5 timed runs per metric, and loosen alert-threshold to 150% as an\nadditional buffer.\n\nCo-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>\n\n* fix(benchmark): decouple memory measurement from timed-median loop\n\nThe warm-up + 5x timed-median loop added for time measurements was\nrunning before endMem was sampled, inflating the heap delta with\ngarbage from the repeated executions and triggering a spurious\nMemory performance alert (up to 4.4x) on PR #99. Memory is now\nmeasured around a single dedicated pass, independent of the timing\nloop.\n\nCo-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>\n\n* ci(benchmark): always comment benchmark summary, not just on alert\n\nKeeps a single persistent PR comment with the current-vs-previous\ncomparison table on every run, independent of the alert comment\n(which only updates when a new regression alert fires).\n\nCo-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>\n\n* ci(benchmark): add friendly header to benchmark summary comment\n\ngithub-action-benchmark's comment format is fixed (no input to\ncustomize it), so a follow-up step patches the same PR review via\ngh api using the workflow's own GITHUB_TOKEN, prepending a\nreassuring line before the comparison table.\n\nCo-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>\n\n* debug(benchmark): add progress markers to isolate 404 in comment-header step\n\nThe prior version's PATCH failed with an unattributed 404 with no\nway to tell which of the three gh api calls caused it.\n\nCo-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>\n\n* ci(benchmark): post friendly status as a separate PR comment\n\nEditing the github-action-benchmark review directly isn't possible:\nGitHub's PATCH /pulls/{n}/reviews/{id} 404s on reviews authored by\nthe Actions bot token, even from the same workflow run that created\nthem (confirmed: list/get on that review works, only PATCH fails).\n\nInstead, post/update our own plain issue comment (fully editable,\nno such restriction), worded based on whether this run's SHA\nappears in a fresh Alert comment.\n\nCo-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>\n\n* fix(benchmark): gh api --jq takes an expression, not jq CLI flags\n\n--arg is a jq CLI flag; gh api's --jq only accepts the filter\nexpression itself. Interpolate the SHA directly instead (safe: it's\na git commit SHA, not untrusted input).\n\nCo-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>\n\n* fix(benchmark): use -F (raw field) so gh api reads the @file body\n\n-f treats @file as a literal string in this gh version; only -F\n(--raw-field) resolves the @filename magic value into the file's\ncontents. Confirmed empirically against the live PR.\n\nCo-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>\n\n* fix(benchmark): embed the comparison table in the status comment itself\n\nThe status comment claimed a table appeared \"below\" it, but the\ntable lived in a separate PR review (github-action-benchmark's own\nSummary comment), which reads confusingly out of context. Fetch and\ninline that table directly instead of just referencing it.\n\nCo-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>\n\n---------\n\nCo-authored-by: Claude Sonnet 5 <noreply@anthropic.com>",
          "timestamp": "2026-07-16T22:21:17-05:00",
          "tree_id": "92d5c3c0b4482cb678370f22144f99c2e4b7a31f",
          "url": "https://github.com/cm45t3r/candlestick/commit/6056dbfc0d0df7138ab703dea29076607adde0be"
        },
        "date": 1784258530581,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Pattern Chain 100",
            "value": 0.4,
            "unit": "ms"
          },
          {
            "name": "Hammer 100",
            "value": 0.01,
            "unit": "ms"
          },
          {
            "name": "Memory 100",
            "value": 0.11,
            "unit": "MB"
          },
          {
            "name": "Pattern Chain 1,000",
            "value": 1.6,
            "unit": "ms"
          },
          {
            "name": "Hammer 1,000",
            "value": 0.05,
            "unit": "ms"
          },
          {
            "name": "Memory 1,000",
            "value": 0.73,
            "unit": "MB"
          },
          {
            "name": "Pattern Chain 10,000",
            "value": 12.2,
            "unit": "ms"
          },
          {
            "name": "Hammer 10,000",
            "value": 0.26,
            "unit": "ms"
          },
          {
            "name": "Memory 10,000",
            "value": 7.04,
            "unit": "MB"
          },
          {
            "name": "Pattern Chain 100,000",
            "value": 140.8,
            "unit": "ms"
          },
          {
            "name": "Hammer 100,000",
            "value": 3.2,
            "unit": "ms"
          },
          {
            "name": "Memory 100,000",
            "value": 72.18,
            "unit": "MB"
          },
          {
            "name": "Pattern Chain 1,000,000",
            "value": 1665.2,
            "unit": "ms"
          },
          {
            "name": "Hammer 1,000,000",
            "value": 39.39,
            "unit": "ms"
          },
          {
            "name": "Memory 1,000,000",
            "value": 520.68,
            "unit": "MB"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "cm45t3r@gmail.com",
            "name": "cm45t3r",
            "username": "cm45t3r"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "91c9c8479808361bb301421cfe20a888c33902fb",
          "message": "fix(streaming): drop duplicate matches at chunk boundaries (#116)\n\n* fix(streaming): drop duplicate matches at chunk boundaries\n\nThe carry-over overlap between chunks is sized by `maxPatternSize` (3, from\nthe three-candle formations), so shorter patterns anchored in that carried\nregion were re-detected and emitted again by the next chunk.\n\nMeasured over 200K synthetic candles at chunkSize 1000, streaming emitted\n228,820 matches against batch's 228,381 — 439 duplicates (0.192%), 429 from\nsingle-candle patterns and 10 from two-candle ones, with zero missed and\nzero spurious matches. The rate held at 100K, 500K and 1M candles.\n\nGate emission per pattern by its own paramCount: in a non-first chunk a\npattern of size k at local index i is a repeat when i < maxPatternSize - k.\nThree-candle patterns are unaffected, which is why the overlap was correct\nfor them and wrong for everything else.\n\nAdd equivalence tests asserting streaming output matches batch patternChain\nexactly across chunk sizes, unaligned feed sizes, and datasets that never\nfill a chunk — the gap that let this through, since the existing streaming\ntests never compared against patternChain over multiple chunks.\n\nFixes #115\n\nCo-Authored-By: Claude Opus 5 <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_01HbetnffFVko1XWFJcVdbWd\n\n* refactor(streaming): enforce paramCount invariant instead of silent fallback\n\nDerive maxPatternSize from the paramCount map so the default is expressed\nonce, and drop the `|| 1` guards entirely. They were unreachable: the 29\nbuilt-ins all declare paramCount, and plugins.registerPattern() normalizes\na missing one to 1 and validates the range, so no pattern object reaching\ncreateStream can lack it.\n\nReplacing dead defensive code with an asserted contract also removes the\nfailure mode it was hiding — a pattern without paramCount would have made\nmaxPatternSize NaN and silently failed every boundary comparison open,\nrather than being caught.\n\nstreaming.js branch coverage 97.61% -> 100%; overall 99.10% -> 99.23%.\n\nCo-Authored-By: Claude Opus 5 <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_01HbetnffFVko1XWFJcVdbWd\n\n---------\n\nCo-authored-by: Claude Opus 5 <noreply@anthropic.com>",
          "timestamp": "2026-09-08T15:50:54-05:00",
          "tree_id": "e152a4963382b2a75301559c86a2e17a6398ebc4",
          "url": "https://github.com/cm45t3r/candlestick/commit/91c9c8479808361bb301421cfe20a888c33902fb"
        },
        "date": 1788900716569,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Pattern Chain 100",
            "value": 0.3,
            "unit": "ms"
          },
          {
            "name": "Hammer 100",
            "value": 0.01,
            "unit": "ms"
          },
          {
            "name": "Memory 100",
            "value": 0.1,
            "unit": "MB"
          },
          {
            "name": "Pattern Chain 1,000",
            "value": 1.1,
            "unit": "ms"
          },
          {
            "name": "Hammer 1,000",
            "value": 0.1,
            "unit": "ms"
          },
          {
            "name": "Memory 1,000",
            "value": 0.22,
            "unit": "MB"
          },
          {
            "name": "Pattern Chain 10,000",
            "value": 8.5,
            "unit": "ms"
          },
          {
            "name": "Hammer 10,000",
            "value": 0.22,
            "unit": "ms"
          },
          {
            "name": "Memory 10,000",
            "value": 8.1,
            "unit": "MB"
          },
          {
            "name": "Pattern Chain 100,000",
            "value": 123.8,
            "unit": "ms"
          },
          {
            "name": "Hammer 100,000",
            "value": 3.38,
            "unit": "ms"
          },
          {
            "name": "Memory 100,000",
            "value": 78.5,
            "unit": "MB"
          },
          {
            "name": "Pattern Chain 1,000,000",
            "value": 1217.8,
            "unit": "ms"
          },
          {
            "name": "Hammer 1,000,000",
            "value": 28.27,
            "unit": "ms"
          },
          {
            "name": "Memory 1,000,000",
            "value": 1004.3,
            "unit": "MB"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "cm45t3r@gmail.com",
            "name": "cm45t3r",
            "username": "cm45t3r"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fc6da7cdc0aa755203717f64981fe8b75b0dff77",
          "message": "Merge pull request #120 from cm45t3r/fix/streaming-end-idempotency\n\nfix(streaming): make end() idempotent and count totalProcessed exactly",
          "timestamp": "2026-09-10T22:09:44-05:00",
          "tree_id": "408db34af7741b70562ebdd65808d2e44f1a00f9",
          "url": "https://github.com/cm45t3r/candlestick/commit/fc6da7cdc0aa755203717f64981fe8b75b0dff77"
        },
        "date": 1789096245886,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Pattern Chain 100",
            "value": 0.4,
            "unit": "ms"
          },
          {
            "name": "Hammer 100",
            "value": 0.01,
            "unit": "ms"
          },
          {
            "name": "Memory 100",
            "value": 0.08,
            "unit": "MB"
          },
          {
            "name": "Pattern Chain 1,000",
            "value": 1.6,
            "unit": "ms"
          },
          {
            "name": "Hammer 1,000",
            "value": 0.05,
            "unit": "ms"
          },
          {
            "name": "Memory 1,000",
            "value": 0.69,
            "unit": "MB"
          },
          {
            "name": "Pattern Chain 10,000",
            "value": 12.9,
            "unit": "ms"
          },
          {
            "name": "Hammer 10,000",
            "value": 0.26,
            "unit": "ms"
          },
          {
            "name": "Memory 10,000",
            "value": 6.76,
            "unit": "MB"
          },
          {
            "name": "Pattern Chain 100,000",
            "value": 148.2,
            "unit": "ms"
          },
          {
            "name": "Hammer 100,000",
            "value": 3.12,
            "unit": "ms"
          },
          {
            "name": "Memory 100,000",
            "value": 67.6,
            "unit": "MB"
          },
          {
            "name": "Pattern Chain 1,000,000",
            "value": 1991,
            "unit": "ms"
          },
          {
            "name": "Hammer 1,000,000",
            "value": 47.62,
            "unit": "ms"
          },
          {
            "name": "Memory 1,000,000",
            "value": 1114.32,
            "unit": "MB"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "cm45t3r@gmail.com",
            "name": "cm45t3r",
            "username": "cm45t3r"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "db12a4245bc99b1172d92adf292613c69729502e",
          "message": "Merge pull request #122 from cm45t3r/fix/streaming-chunksize-validation\n\nfix(streaming): reject chunkSize below the longest active pattern",
          "timestamp": "2026-09-10T23:09:13-05:00",
          "tree_id": "dc76cfbcda7e026d19d45db8d3142ac994a83d60",
          "url": "https://github.com/cm45t3r/candlestick/commit/db12a4245bc99b1172d92adf292613c69729502e"
        },
        "date": 1789099817613,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Pattern Chain 100",
            "value": 0.5,
            "unit": "ms"
          },
          {
            "name": "Hammer 100",
            "value": 0.01,
            "unit": "ms"
          },
          {
            "name": "Memory 100",
            "value": 0.13,
            "unit": "MB"
          },
          {
            "name": "Pattern Chain 1,000",
            "value": 1.9,
            "unit": "ms"
          },
          {
            "name": "Hammer 1,000",
            "value": 0.05,
            "unit": "ms"
          },
          {
            "name": "Memory 1,000",
            "value": 0.1,
            "unit": "MB"
          },
          {
            "name": "Pattern Chain 10,000",
            "value": 13.1,
            "unit": "ms"
          },
          {
            "name": "Hammer 10,000",
            "value": 0.29,
            "unit": "ms"
          },
          {
            "name": "Memory 10,000",
            "value": 9.7,
            "unit": "MB"
          },
          {
            "name": "Pattern Chain 100,000",
            "value": 145.8,
            "unit": "ms"
          },
          {
            "name": "Hammer 100,000",
            "value": 3.7,
            "unit": "ms"
          },
          {
            "name": "Memory 100,000",
            "value": 63.86,
            "unit": "MB"
          },
          {
            "name": "Pattern Chain 1,000,000",
            "value": 1951.2,
            "unit": "ms"
          },
          {
            "name": "Hammer 1,000,000",
            "value": 45.62,
            "unit": "ms"
          },
          {
            "name": "Memory 1,000,000",
            "value": 582.38,
            "unit": "MB"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "cm45t3r@gmail.com",
            "name": "cm45t3r",
            "username": "cm45t3r"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "8ff93b5ba42e2eb3b3dae36cea683f0e1257b746",
          "message": "Merge pull request #125 from cm45t3r/fix/benchmark-chunksize\n\nfix(benchmark): separate feed size from chunkSize in the streaming benchmark",
          "timestamp": "2026-09-10T23:24:20-05:00",
          "tree_id": "5fb4b55d646a40718602397ffa47b0c5ed5332e4",
          "url": "https://github.com/cm45t3r/candlestick/commit/8ff93b5ba42e2eb3b3dae36cea683f0e1257b746"
        },
        "date": 1789100724050,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Pattern Chain 100",
            "value": 0.4,
            "unit": "ms"
          },
          {
            "name": "Hammer 100",
            "value": 0.03,
            "unit": "ms"
          },
          {
            "name": "Memory 100",
            "value": 0.1,
            "unit": "MB"
          },
          {
            "name": "Pattern Chain 1,000",
            "value": 1.8,
            "unit": "ms"
          },
          {
            "name": "Hammer 1,000",
            "value": 0.05,
            "unit": "ms"
          },
          {
            "name": "Memory 1,000",
            "value": 0.07,
            "unit": "MB"
          },
          {
            "name": "Pattern Chain 10,000",
            "value": 14.6,
            "unit": "ms"
          },
          {
            "name": "Hammer 10,000",
            "value": 0.28,
            "unit": "ms"
          },
          {
            "name": "Memory 10,000",
            "value": 17.53,
            "unit": "MB"
          },
          {
            "name": "Pattern Chain 100,000",
            "value": 169.7,
            "unit": "ms"
          },
          {
            "name": "Hammer 100,000",
            "value": 3.56,
            "unit": "ms"
          },
          {
            "name": "Memory 100,000",
            "value": 73.79,
            "unit": "MB"
          },
          {
            "name": "Pattern Chain 1,000,000",
            "value": 1761.3,
            "unit": "ms"
          },
          {
            "name": "Hammer 1,000,000",
            "value": 58.82,
            "unit": "ms"
          },
          {
            "name": "Memory 1,000,000",
            "value": 1114.3,
            "unit": "MB"
          }
        ]
      }
    ]
  }
}