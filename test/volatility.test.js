const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  atrSeries,
  stddevSeries,
  percentileSeries,
} = require("../src/volatility.js");

// Hand-derived fixture (see PR description for the manual computation):
// TR = [NaN, 3, 2, 3]; period=2 rolling mean = [NaN, NaN, 2.5, 2.5]; ATR% = ATR / close.
// returns = [NaN, 0.1, 0, 0.0909...]; period=2 rolling stddev = [NaN, NaN, 0.05, 0.04545...].
// |returns| period=2 rolling 0.9-quantile (linear interpolation) = [NaN, NaN, 0.09, 0.08181...].
const candles = [
  { open: 10, high: 11, low: 9, close: 10 },
  { open: 10, high: 12, low: 9, close: 11 },
  { open: 11, high: 12, low: 10, close: 11 },
  { open: 11, high: 13, low: 10, close: 12 },
];

describe("volatility", () => {
  it("atrSeries: NaN before enough history, ATR expressed as a fraction of close", () => {
    const result = atrSeries(candles, 2);
    assert.equal(Number.isNaN(result[0]), true);
    assert.equal(Number.isNaN(result[1]), true);
    assert.ok(Math.abs(result[2] - 0.22727272727272727) < 1e-12);
    assert.ok(Math.abs(result[3] - 0.20833333333333334) < 1e-12);
  });

  it("stddevSeries: NaN before enough history, matches manual variance calculation", () => {
    const result = stddevSeries(candles, 2);
    assert.equal(Number.isNaN(result[0]), true);
    assert.equal(Number.isNaN(result[1]), true);
    assert.ok(Math.abs(result[2] - 0.05) < 1e-12);
    assert.ok(Math.abs(result[3] - 0.045454545454545456) < 1e-12);
  });

  it("percentileSeries: NaN before enough history, matches manual quantile interpolation", () => {
    const result = percentileSeries(candles, 2, 0.9);
    assert.equal(Number.isNaN(result[0]), true);
    assert.equal(Number.isNaN(result[1]), true);
    assert.ok(Math.abs(result[2] - 0.09) < 1e-12);
    assert.ok(Math.abs(result[3] - 0.08181818181818182) < 1e-12);
  });

  it("percentileSeries: defaults to the 90th percentile when not specified", () => {
    const withDefault = percentileSeries(candles, 2);
    const explicit = percentileSeries(candles, 2, 0.9);
    assert.deepStrictEqual(withDefault, explicit);
  });

  it("percentileSeries: quantile=1 (max) and quantile=0 (min) hit the exact-index branch, no interpolation", () => {
    // position = quantile * (window.length - 1) is an integer for both 0 and 1,
    // exercising the `lower === upper` short-circuit instead of linear interpolation.
    const max = percentileSeries(candles, 2, 1);
    assert.ok(Math.abs(max[2] - 0.1) < 1e-12);
    assert.ok(Math.abs(max[3] - 0.09090909090909091) < 1e-12);

    const min = percentileSeries(candles, 2, 0);
    assert.equal(min[2], 0);
    assert.equal(min[3], 0);
  });

  it("all series have the same length as the input", () => {
    assert.equal(atrSeries(candles, 2).length, candles.length);
    assert.equal(stddevSeries(candles, 2).length, candles.length);
    assert.equal(percentileSeries(candles, 2).length, candles.length);
  });
});
