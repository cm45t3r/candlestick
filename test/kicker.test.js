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
});
