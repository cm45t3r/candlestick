const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  applyTrendContext,
  resolveTrendSeries,
  filterConflicts,
} = require("../src/trendContext.js");
const { precomputeCandleProps } = require("../src/utils.js");

// Clean, steady uptrend (~5-6%/candle for 6 candles), then the exact
// hammer/hangingMan-shaped candle used in #95's worked example: candles[7]
// (bullish) + candles[8] (small body near the top, long lower shadow, gap
// up) form `hangingMan` (index 7, spans [7,8]); candles[8] alone also
// qualifies as `hammer` (index 8) — the real-world contradiction #95 documents.
const candles = precomputeCandleProps([
  { open: 100, high: 101, low: 99, close: 100 },
  { open: 100, high: 106, low: 99, close: 105 },
  { open: 105, high: 111, low: 104, close: 110 },
  { open: 110, high: 117, low: 109, close: 116 },
  { open: 116, high: 123, low: 115, close: 122 },
  { open: 122, high: 130, low: 121, close: 128 },
  { open: 128, high: 136, low: 127, close: 134 },
  { open: 134, high: 137, low: 132, close: 136 },
  { open: 140, high: 141, low: 133, close: 138 },
]);

describe("resolveTrendSeries", () => {
  it("defaults to sma-slope when no trendMethod is given", () => {
    const withDefault = resolveTrendSeries(candles, { trendPeriod: 3 });
    const explicit = resolveTrendSeries(candles, {
      trendMethod: "sma-slope",
      trendPeriod: 3,
    });
    assert.deepStrictEqual(withDefault, explicit);
  });

  it("supports ema-slope and pct-change by name", () => {
    assert.doesNotThrow(() =>
      resolveTrendSeries(candles, { trendMethod: "ema-slope", trendPeriod: 3 }),
    );
    assert.doesNotThrow(() =>
      resolveTrendSeries(candles, {
        trendMethod: "pct-change",
        trendPeriod: 3,
      }),
    );
  });

  it("externalTrend takes precedence over trendMethod", () => {
    const external = candles.map(() => 0.5);
    const result = resolveTrendSeries(candles, {
      trendMethod: "sma-slope",
      externalTrend: external,
    });
    assert.deepStrictEqual(result, external);
  });
});

describe("applyTrendContext", () => {
  const baseResults = () => [
    { index: 7, pattern: "hangingMan", match: candles.slice(7, 9) },
    { index: 8, pattern: "hammer", match: candles.slice(8, 9) },
  ];

  it("attaches a higher contextFit to hangingMan than to hammer in a clear uptrend", () => {
    const results = applyTrendContext(candles, baseResults(), {
      trendMethod: "sma-slope",
      trendPeriod: 3,
      contextSensitivity: 10,
    });
    const hangingMan = results.find((r) => r.pattern === "hangingMan");
    const hammer = results.find((r) => r.pattern === "hammer");

    assert.equal(hangingMan.trendContext, "uptrend");
    assert.equal(hammer.trendContext, "uptrend");
    assert.ok(
      hangingMan.contextFit > 0.5,
      "hangingMan should score above neutral",
    );
    assert.ok(hammer.contextFit < 0.5, "hammer should score below neutral");
    assert.ok(hangingMan.contextFit > hammer.contextFit);
  });

  it("leaves trendContext undefined for a match at index 0 (no preceding candle to measure)", () => {
    const results = applyTrendContext(
      candles,
      [{ index: 0, pattern: "hammer", match: candles.slice(0, 1) }],
      { trendMethod: "sma-slope", trendPeriod: 3 },
    );
    assert.equal(results[0].trendContext, undefined);
    assert.equal(results[0].contextFit, 1); // fails safe: no penalty when unmeasurable
  });

  it("labels a declining series as a downtrend", () => {
    const decliningCandles = precomputeCandleProps([
      { open: 138, high: 141, low: 133, close: 136 },
      { open: 134, high: 137, low: 127, close: 130 },
      { open: 130, high: 133, low: 121, close: 124 },
      { open: 124, high: 128, low: 115, close: 118 },
      { open: 118, high: 122, low: 109, close: 112 },
    ]);
    const results = applyTrendContext(
      decliningCandles,
      [{ index: 4, pattern: "hammer", match: decliningCandles.slice(4, 5) }],
      { trendMethod: "sma-slope", trendPeriod: 2 },
    );
    assert.equal(results[0].trendContext, "downtrend");
  });

  it('labels a flat (no-change) series as "sideways"', () => {
    const flatCandles = precomputeCandleProps([
      { open: 100, high: 101, low: 99, close: 100 },
      { open: 100, high: 101, low: 99, close: 100 },
      { open: 100, high: 101, low: 99, close: 100 },
    ]);
    const results = applyTrendContext(
      flatCandles,
      [{ index: 2, pattern: "hammer", match: flatCandles.slice(2, 3) }],
      { trendMethod: "pct-change", trendPeriod: 1 },
    );
    assert.equal(results[0].trendContext, "sideways");
  });

  it("resolveConflicts (default false) keeps both sides of a same-candle, opposite-direction conflict", () => {
    const results = applyTrendContext(candles, baseResults(), {
      trendMethod: "sma-slope",
      trendPeriod: 3,
      contextSensitivity: 10,
    });
    assert.equal(results.length, 2);
  });

  it("resolveConflicts: true drops the lower-contextFit side of the conflict", () => {
    const results = applyTrendContext(candles, baseResults(), {
      trendMethod: "sma-slope",
      trendPeriod: 3,
      contextSensitivity: 10,
      resolveConflicts: true,
    });
    assert.deepStrictEqual(
      results.map((r) => r.pattern),
      ["hangingMan"],
    );
  });
});

describe("filterConflicts", () => {
  it("keeps both matches when they don't share any candle", () => {
    const results = [
      { index: 0, pattern: "hammer", match: [{}], contextFit: 0.9 },
      { index: 5, pattern: "hangingMan", match: [{}, {}], contextFit: 0.1 },
    ];
    assert.deepStrictEqual(filterConflicts(results), results);
  });

  it("keeps both matches when they share the same direction", () => {
    // bullishHammer and bullishMarubozu are both "bullish" direction;
    // overlap alone shouldn't trigger a drop.
    const results = [
      { index: 3, pattern: "bullishHammer", match: [{}], contextFit: 0.9 },
      { index: 3, pattern: "bullishMarubozu", match: [{}], contextFit: 0.2 },
    ];
    assert.deepStrictEqual(filterConflicts(results), results);
  });

  it("keeps both matches on an exact contextFit tie", () => {
    const results = [
      { index: 3, pattern: "hammer", match: [{}], contextFit: 0.5 },
      { index: 2, pattern: "hangingMan", match: [{}, {}], contextFit: 0.5 },
    ];
    assert.deepStrictEqual(filterConflicts(results), results);
  });

  it("ignores neutral-direction patterns entirely (never conflict)", () => {
    const results = [
      { index: 3, pattern: "doji", match: [{}], contextFit: 0.9 },
      { index: 3, pattern: "hammer", match: [{}], contextFit: 0.1 },
    ];
    assert.deepStrictEqual(filterConflicts(results), results);
  });

  it("drops the FIRST match when the second (later) one has the higher contextFit", () => {
    // Regression check for the `b.contextFit > a.contextFit` branch: order
    // in the results array must not determine which side survives, only
    // contextFit should.
    const weakHammer = {
      index: 5,
      pattern: "hammer",
      match: [{}],
      contextFit: 0.2,
    };
    const strongHangingMan = {
      index: 4,
      pattern: "hangingMan",
      match: [{}, {}],
      contextFit: 0.8,
    };
    const results = [weakHammer, strongHangingMan];
    assert.deepStrictEqual(filterConflicts(results), [strongHangingMan]);
  });

  it("keeps both matches when the second pattern has no known metadata", () => {
    const results = [
      { index: 3, pattern: "hammer", match: [{}], contextFit: 0.9 },
      {
        index: 3,
        pattern: "totallyUnknownPattern",
        match: [{}],
        contextFit: 0.1,
      },
    ];
    assert.deepStrictEqual(filterConflicts(results), results);
  });
});
