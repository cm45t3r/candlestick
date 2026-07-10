window.BENCHMARK_DATA = {
  "lastUpdate": 1783722529010,
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
      }
    ]
  }
}