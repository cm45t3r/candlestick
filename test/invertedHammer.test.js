const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const invertedHammer = require("../src/invertedHammer.js");

describe("invertedHammer", () => {
  it("isInvertedHammer: detects an inverted hammer", () => {
    const candle = { open: 10, high: 20, low: 9, close: 11 };
    assert.equal(invertedHammer.isInvertedHammer(candle), true);
  });
  it("isInvertedHammer: rejects non-inverted hammer", () => {
    const candle = { open: 10, high: 12, low: 9, close: 11 };
    assert.equal(invertedHammer.isInvertedHammer(candle), false);
  });
  it("isBullishInvertedHammer: detects bullish inverted hammer", () => {
    const candle = { open: 10, high: 20, low: 9, close: 12 };
    assert.equal(invertedHammer.isBullishInvertedHammer(candle), true);
  });
  it("isBearishInvertedHammer: detects bearish inverted hammer", () => {
    const candle = { open: 12, high: 20, low: 9, close: 10 };
    assert.equal(invertedHammer.isBearishInvertedHammer(candle), true);
  });
  it("invertedHammer: finds inverted hammers in array", () => {
    const arr = [
      { open: 10, high: 20, low: 9, close: 11 }, // inverted hammer
      { open: 10, high: 12, low: 9, close: 11 }, // not inverted hammer
      { open: 12, high: 20, low: 9, close: 10 }, // inverted hammer
    ];
    assert.deepStrictEqual(invertedHammer.invertedHammer(arr), [0, 2]);
  });
  it("bullishInvertedHammer: finds bullish inverted hammers in array", () => {
    const arr = [
      { open: 10, high: 20, low: 9, close: 12 }, // bullish inverted hammer
      { open: 12, high: 20, low: 9, close: 10 }, // bearish inverted hammer
    ];
    assert.deepStrictEqual(invertedHammer.bullishInvertedHammer(arr), [0]);
  });
  it("bearishInvertedHammer: finds bearish inverted hammers in array", () => {
    const arr = [
      { open: 10, high: 20, low: 9, close: 12 }, // bullish inverted hammer
      { open: 12, high: 20, low: 9, close: 10 }, // bearish inverted hammer
    ];
    assert.deepStrictEqual(invertedHammer.bearishInvertedHammer(arr), [1]);
  });
});
