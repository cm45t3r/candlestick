const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  isThreeWhiteSoldiers,
  threeWhiteSoldiers,
} = require("../src/threeWhiteSoldiers.js");

describe("threeWhiteSoldiers", () => {
  it("isThreeWhiteSoldiers: detects a valid pattern", () => {
    // Three consecutive bullish candles, each opening within previous body, closing higher
    const first = { open: 10, high: 20, low: 9, close: 19 };
    const second = { open: 15, high: 25, low: 14, close: 24 };
    const third = { open: 20, high: 30, low: 19, close: 29 };
    assert.equal(isThreeWhiteSoldiers(first, second, third), true);
  });

  it("isThreeWhiteSoldiers: rejects when any candle is bearish", () => {
    const first = { open: 10, high: 20, low: 9, close: 19 };
    const second = { open: 24, high: 25, low: 14, close: 15 }; // Bearish
    const third = { open: 20, high: 30, low: 19, close: 29 };
    assert.equal(isThreeWhiteSoldiers(first, second, third), false);
  });

  it("isThreeWhiteSoldiers: rejects when candles do not close progressively higher", () => {
    const first = { open: 10, high: 20, low: 9, close: 19 };
    const second = { open: 15, high: 25, low: 14, close: 24 };
    const third = { open: 20, high: 30, low: 19, close: 23 }; // Closes lower than second
    assert.equal(isThreeWhiteSoldiers(first, second, third), false);
  });

  it("isThreeWhiteSoldiers: rejects when second candle does not open within first body", () => {
    const first = { open: 10, high: 20, low: 9, close: 19 };
    const second = { open: 20, high: 30, low: 19, close: 29 }; // Opens outside first body
    const third = { open: 25, high: 35, low: 24, close: 34 };
    assert.equal(isThreeWhiteSoldiers(first, second, third), false);
  });

  it("isThreeWhiteSoldiers: rejects when third candle does not open within second body", () => {
    const first = { open: 10, high: 20, low: 9, close: 19 };
    const second = { open: 15, high: 25, low: 14, close: 24 };
    const third = { open: 25, high: 35, low: 24, close: 34 }; // Opens outside second body
    assert.equal(isThreeWhiteSoldiers(first, second, third), false);
  });

  it("isThreeWhiteSoldiers: rejects when upper shadows are too large", () => {
    const first = { open: 10, high: 25, low: 9, close: 19 }; // Large wick
    const second = { open: 15, high: 25, low: 14, close: 24 };
    const third = { open: 20, high: 30, low: 19, close: 29 };
    assert.equal(isThreeWhiteSoldiers(first, second, third), false);
  });

  it("threeWhiteSoldiers: finds patterns in array", () => {
    const arr = [
      { open: 10, high: 20, low: 9, close: 19 }, // 0
      { open: 15, high: 25, low: 14, close: 24 }, // 1
      { open: 20, high: 30, low: 19, close: 29 }, // 2 - Pattern at index 0
      { open: 30, high: 35, low: 29, close: 34 }, // 3
    ];
    assert.deepStrictEqual(threeWhiteSoldiers(arr), [0]);
  });

  it("threeWhiteSoldiers: returns empty array when no pattern found", () => {
    const arr = [
      { open: 10, high: 20, low: 9, close: 19 },
      { open: 24, high: 25, low: 14, close: 15 }, // Bearish
      { open: 20, high: 30, low: 19, close: 29 },
    ];
    assert.deepStrictEqual(threeWhiteSoldiers(arr), []);
  });

  it("rejects if second candle has zero range", () => {
    const candles = [
      { open: 10, high: 20, low: 9, close: 19 }, // bullish
      { open: 15, high: 15, low: 15, close: 15 }, // zero range
      { open: 20, high: 30, low: 19, close: 29 },
    ];

    assert.equal(
      isThreeWhiteSoldiers(candles[0], candles[1], candles[2]),
      false,
    );
  });

  it("rejects if candles have large upper shadows", () => {
    const candles = [
      { open: 10, high: 20, low: 9, close: 19 }, // valid
      { open: 15, high: 35, low: 14, close: 24 }, // large wick (11 vs body 9)
      { open: 20, high: 30, low: 19, close: 29 }, // valid
    ];

    assert.equal(
      isThreeWhiteSoldiers(candles[0], candles[1], candles[2]),
      false,
    );
  });
});
