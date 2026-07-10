const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const kicker = require("../src/kicker.js");

describe("kicker", () => {
  it("isBullishKicker: detects bullish kicker", () => {
    const prev = { open: 12, high: 13, low: 10, close: 10 };
    const curr = { open: 15, high: 16, low: 9, close: 20 };
    assert.equal(kicker.isBullishKicker(prev, curr), true);
  });
  it("isBearishKicker: detects bearish kicker", () => {
    // Downward gap, bearish, not a hammer
    const prev = { open: 20, high: 25, low: 19, close: 24 };
    const curr = { open: 15, high: 16, low: 10, close: 11 };
    assert.equal(kicker.isBearishKicker(prev, curr), true);
  });
  it("bullishKicker: finds bullish kickers in array", () => {
    const arr = [
      { open: 12, high: 13, low: 10, close: 10 },
      { open: 15, high: 16, low: 9, close: 20 }, // bullish kicker
      { open: 20, high: 25, low: 19, close: 24 },
      { open: 15, high: 16, low: 10, close: 11 },
    ];
    assert.deepStrictEqual(kicker.bullishKicker(arr), [0]);
  });
  it("bearishKicker: finds bearish kickers in array", () => {
    const arr = [
      { open: 20, high: 25, low: 19, close: 24 },
      { open: 15, high: 16, low: 10, close: 11 }, // bearish kicker
      { open: 12, high: 13, low: 10, close: 10 },
      { open: 15, high: 16, low: 9, close: 20 },
    ];
    assert.deepStrictEqual(kicker.bearishKicker(arr), [0]);
  });

  describe("gap-significance threshold (minGapVol)", () => {
    // gapUpSizePct for this pair = (15 - 12) / 10 = 0.3 (30%)
    const bullishPrev = { open: 12, high: 13, low: 10, close: 10 };
    const bullishCurr = { open: 15, high: 16, low: 9, close: 20 };
    // gapDownSizePct for this pair = (20 - 15) / 24 = 0.2083... (~20.8%)
    const bearishPrev = { open: 20, high: 25, low: 19, close: 24 };
    const bearishCurr = { open: 15, high: 16, low: 10, close: 11 };

    it("minGapVol: 0 (default) preserves pre-existing behavior regardless of options", () => {
      assert.equal(kicker.isBullishKicker(bullishPrev, bullishCurr), true);
      assert.equal(
        kicker.isBullishKicker(bullishPrev, bullishCurr, { minGapVol: 0 }),
        true,
      );
    });

    it("isBullishKicker: an explicit `volatility` value is compared as gap >= minGapVol * volatility", () => {
      assert.equal(
        kicker.isBullishKicker(bullishPrev, bullishCurr, {
          minGapVol: 0.1,
          volatility: 1,
        }),
        true, // 0.3 >= 0.1 * 1
      );
      assert.equal(
        kicker.isBullishKicker(bullishPrev, bullishCurr, {
          minGapVol: 0.5,
          volatility: 1,
        }),
        false, // 0.3 < 0.5 * 1
      );
    });

    it("isBearishKicker: an explicit `volatility` value is compared as gap >= minGapVol * volatility", () => {
      assert.equal(
        kicker.isBearishKicker(bearishPrev, bearishCurr, {
          minGapVol: 0.1,
          volatility: 1,
        }),
        true, // 0.2083 >= 0.1 * 1
      );
      assert.equal(
        kicker.isBearishKicker(bearishPrev, bearishCurr, {
          minGapVol: 0.3,
          volatility: 1,
        }),
        false, // 0.2083 < 0.3 * 1
      );
    });

    it("fails safe (false) when a volatility-based method is requested but no volatility is resolvable", () => {
      assert.equal(
        kicker.isBullishKicker(bullishPrev, bullishCurr, { minGapVol: 0.1 }),
        false,
      );
    });

    it('volMethod: "fixed-pct" compares the gap directly against `minGapVol` as a fraction of previous close, no `volatility` needed', () => {
      assert.equal(
        kicker.isBullishKicker(bullishPrev, bullishCurr, {
          minGapVol: 0.25,
          volMethod: "fixed-pct",
        }),
        true, // 0.3 >= 0.25
      );
      assert.equal(
        kicker.isBullishKicker(bullishPrev, bullishCurr, {
          minGapVol: 0.35,
          volMethod: "fixed-pct",
        }),
        false, // 0.3 < 0.35
      );
    });

    describe("array-level filtering (bullishKicker/bearishKicker)", () => {
      // Two independent bullish-kicker candidates:
      // - index 0->1: gap of (100.3 - 100) / 99 ≈ 0.303% (small, "noise")
      // - index 2->3: gap of (104 - 101) / 99 ≈ 3.03% (large, "real")
      const candles = [
        { open: 100, high: 101, low: 99, close: 99 }, // 0: bearish
        { open: 100.3, high: 101.2, low: 100.1, close: 101 }, // 1: bullish, small gap
        { open: 101, high: 101.5, low: 98.5, close: 99 }, // 2: bearish
        { open: 104, high: 111, low: 103.5, close: 110 }, // 3: bullish, large gap
      ];

      it("with no threshold, both kickers are found (pre-existing behavior)", () => {
        assert.deepStrictEqual(kicker.bullishKicker(candles), [0, 2]);
      });

      it('volMethod: "fixed-pct" filters out the small gap but keeps the large one', () => {
        assert.deepStrictEqual(
          kicker.bullishKicker(candles, {
            minGapVol: 0.005, // 0.5%
            volMethod: "fixed-pct",
          }),
          [2],
        );
      });

      it('volMethod: "fixed-pct" with a low enough threshold keeps both', () => {
        assert.deepStrictEqual(
          kicker.bullishKicker(candles, {
            minGapVol: 0.001, // 0.1%
            volMethod: "fixed-pct",
          }),
          [0, 2],
        );
      });

      it('volMethod: "fixed-pct" with a high enough threshold keeps neither', () => {
        assert.deepStrictEqual(
          kicker.bullishKicker(candles, {
            minGapVol: 0.04, // 4%
            volMethod: "fixed-pct",
          }),
          [],
        );
      });

      it("externalVolatility supplies a precomputed per-candle series, taking precedence over volMethod", () => {
        const externalVolatility = candles.map(() => 0.001); // tiny volatility unit everywhere
        assert.deepStrictEqual(
          kicker.bullishKicker(candles, {
            minGapVol: 1, // gap >= 1 * 0.001 = 0.1%
            volMethod: "atr", // ignored: externalVolatility takes precedence
            externalVolatility,
          }),
          [0, 2],
        );
      });

      it("volatilityFn is invoked per candle and takes precedence over externalVolatility/volMethod", () => {
        const calls = [];
        const volatilityFn = (candlesArg, index) => {
          calls.push(index);
          return 0.001;
        };
        const result = kicker.bullishKicker(candles, {
          minGapVol: 1,
          externalVolatility: candles.map(() => 100), // would fail the threshold if used
          volatilityFn,
        });
        assert.deepStrictEqual(result, [0, 2]);
        assert.ok(calls.length > 0);
      });

      it("throws when externalVolatility length doesn't match the candle array", () => {
        assert.throws(() =>
          kicker.bullishKicker(candles, {
            minGapVol: 1,
            externalVolatility: [0.01, 0.01],
          }),
        );
      });
    });
  });
});
