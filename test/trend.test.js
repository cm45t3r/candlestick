const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  pctChangeSeries,
  smaSlopeSeries,
  emaSlopeSeries,
} = require("../src/trend.js");

// Hand-derived fixture (closes = [10, 11, 12, 11, 13, 14]).
const candles = [
  { close: 10 },
  { close: 11 },
  { close: 12 },
  { close: 11 },
  { close: 13 },
  { close: 14 },
];

describe("trend", () => {
  it("pctChangeSeries: NaN before enough history, matches manual calculation", () => {
    const result = pctChangeSeries(candles, 2);
    assert.equal(Number.isNaN(result[0]), true);
    assert.equal(Number.isNaN(result[1]), true);
    assert.ok(Math.abs(result[2] - 0.2) < 1e-12); // (12-10)/10
    assert.ok(Math.abs(result[3] - 0) < 1e-12); // (11-11)/11
    assert.ok(Math.abs(result[4] - 0.08333333333333333) < 1e-12); // (13-12)/12
    assert.ok(Math.abs(result[5] - 0.2727272727272727) < 1e-12); // (14-11)/11
  });

  it("smaSlopeSeries: NaN before enough history (needs one extra candle beyond the SMA window), matches manual calculation", () => {
    const result = smaSlopeSeries(candles, 2);
    assert.equal(Number.isNaN(result[0]), true);
    assert.equal(Number.isNaN(result[1]), true);
    assert.equal(Number.isNaN(result[2]), true);
    assert.ok(Math.abs(result[3] - 0) < 1e-12);
    assert.ok(Math.abs(result[4] - 0.043478260869565216) < 1e-12);
    assert.ok(Math.abs(result[5] - 0.125) < 1e-12);
  });

  it("emaSlopeSeries: NaN before the seed is available, matches manual calculation", () => {
    const result = emaSlopeSeries(candles, 2);
    assert.equal(Number.isNaN(result[0]), true);
    assert.equal(Number.isNaN(result[1]), true);
    assert.ok(Math.abs(result[2] - 0.09523809523809523) < 1e-9);
    assert.ok(Math.abs(result[3] - -0.028985507246376708) < 1e-9);
    assert.ok(Math.abs(result[4] - 0.10945273631840788) < 1e-9);
    assert.ok(Math.abs(result[5] - 0.08669656203288478) < 1e-9);
  });

  it("all series have the same length as the input", () => {
    assert.equal(pctChangeSeries(candles, 2).length, candles.length);
    assert.equal(smaSlopeSeries(candles, 2).length, candles.length);
    assert.equal(emaSlopeSeries(candles, 2).length, candles.length);
  });

  it("uses the default period (10) when not specified", () => {
    const longCandles = Array.from({ length: 15 }, (_, i) => ({
      close: 100 + i,
    }));
    assert.equal(Number.isNaN(pctChangeSeries(longCandles)[9]), true);
    assert.equal(
      Number.isNaN(pctChangeSeries(longCandles)[10]),
      false,
      "pctChangeSeries default period should produce a value by index 10",
    );
  });
});
