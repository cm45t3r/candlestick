const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const doji = require("../src/doji.js");

describe("doji", () => {
  it("isDoji: detects a doji", () => {
    const candle = { open: 10, high: 15, low: 10, close: 10.4 };
    assert.equal(doji.isDoji(candle), true);
  });
  it("isDoji: rejects non-doji", () => {
    const candle = { open: 10, high: 15, low: 10, close: 13 };
    assert.equal(doji.isDoji(candle), false);
  });
  it("doji: finds dojis in array", () => {
    const arr = [
      { open: 10, high: 15, low: 10, close: 10.4 }, // doji
      { open: 10, high: 15, low: 10, close: 13 }, // not doji
      { open: 12, high: 13, low: 12, close: 12.05 }, // doji
    ];
    assert.deepStrictEqual(doji.doji(arr), [0, 2]);
  });
});
