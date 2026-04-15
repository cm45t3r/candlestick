const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  isThreeBlackCrows,
  threeBlackCrows,
} = require("../src/threeBlackCrows.js");

describe("threeBlackCrows", () => {
  it("isThreeBlackCrows: detects a valid pattern", () => {
    // Three consecutive bearish candles, each opening within previous body, closing lower
    const first = { open: 30, high: 31, low: 20, close: 21 };
    const second = { open: 26, high: 27, low: 16, close: 17 };
    const third = { open: 22, high: 23, low: 12, close: 13 };
    assert.equal(isThreeBlackCrows(first, second, third), true);
  });

  it("isThreeBlackCrows: rejects when any candle is bullish", () => {
    const first = { open: 30, high: 31, low: 20, close: 21 };
    const second = { open: 17, high: 27, low: 16, close: 26 }; // Bullish
    const third = { open: 22, high: 23, low: 12, close: 13 };
    assert.equal(isThreeBlackCrows(first, second, third), false);
  });

  it("isThreeBlackCrows: rejects when candles do not close progressively lower", () => {
    const first = { open: 30, high: 31, low: 20, close: 21 };
    const second = { open: 26, high: 27, low: 16, close: 17 };
    const third = { open: 22, high: 23, low: 12, close: 18 }; // Closes higher than second
    assert.equal(isThreeBlackCrows(first, second, third), false);
  });

  it("isThreeBlackCrows: rejects when second candle does not open within first body", () => {
    const first = { open: 30, high: 31, low: 20, close: 21 };
    const second = { open: 31, high: 32, low: 16, close: 17 }; // Opens outside first body
    const third = { open: 22, high: 23, low: 12, close: 13 };
    assert.equal(isThreeBlackCrows(first, second, third), false);
  });

  it("isThreeBlackCrows: rejects when third candle does not open within second body", () => {
    const first = { open: 30, high: 31, low: 20, close: 21 };
    const second = { open: 26, high: 27, low: 16, close: 17 };
    const third = { open: 27, high: 28, low: 12, close: 13 }; // Opens outside second body
    assert.equal(isThreeBlackCrows(first, second, third), false);
  });

  it("isThreeBlackCrows: rejects when lower shadows are too large", () => {
    const first = { open: 30, high: 31, low: 10, close: 21 }; // Large tail
    const second = { open: 26, high: 27, low: 16, close: 17 };
    const third = { open: 22, high: 23, low: 12, close: 13 };
    assert.equal(isThreeBlackCrows(first, second, third), false);
  });

  it("threeBlackCrows: finds patterns in array", () => {
    const arr = [
      { open: 30, high: 31, low: 20, close: 21 }, // 0
      { open: 26, high: 27, low: 16, close: 17 }, // 1
      { open: 22, high: 23, low: 12, close: 13 }, // 2 - Pattern at index 0
      { open: 10, high: 15, low: 9, close: 14 }, // 3
    ];
    assert.deepStrictEqual(threeBlackCrows(arr), [0]);
  });

  it("threeBlackCrows: returns empty array when no pattern found", () => {
    const arr = [
      { open: 30, high: 31, low: 20, close: 21 },
      { open: 17, high: 27, low: 16, close: 26 }, // Bullish
      { open: 22, high: 23, low: 12, close: 13 },
    ];
    assert.deepStrictEqual(threeBlackCrows(arr), []);
  });

  it("rejects if second candle has zero range", () => {
    const candles = [
      { open: 30, high: 31, low: 20, close: 21 }, // bearish
      { open: 25, high: 25, low: 25, close: 25 }, // zero range
      { open: 22, high: 23, low: 12, close: 13 },
    ];

    assert.equal(isThreeBlackCrows(candles[0], candles[1], candles[2]), false);
  });

  it("rejects if second close is not lower than first close", () => {
    const candles = [
      { open: 30, high: 31, low: 20, close: 21 }, // bearish
      { open: 26, high: 27, low: 16, close: 22 }, // close >= first close
      { open: 22, high: 23, low: 12, close: 13 },
    ];

    assert.equal(isThreeBlackCrows(candles[0], candles[1], candles[2]), false);
  });

  it("rejects if candles have large lower shadows", () => {
    const candles = [
      { open: 30, high: 31, low: 20, close: 21 }, // valid
      { open: 26, high: 27, low: 10, close: 17 }, // large tail (16 vs body 9)
      { open: 22, high: 23, low: 12, close: 13 }, // valid
    ];

    assert.equal(isThreeBlackCrows(candles[0], candles[1], candles[2]), false);
  });

  it("rejects when second candle has large lower shadow (c1 passes, c2 fails)", () => {
    // c1 and c2 pass body check (>= 60% of range) but c2's tail > 30% of body
    const first = { open: 30, high: 30.5, low: 20, close: 21 }; // body=9, tail=1, ok
    const second = { open: 26, high: 26.5, low: 14, close: 17 }; // body=9, range=12.5, tail=3 > 2.7
    const third = { open: 22, high: 22.5, low: 12, close: 13 }; // body=9, tail=1, ok
    assert.equal(isThreeBlackCrows(first, second, third), false);
  });

  it("rejects when third candle has large lower shadow (c1 and c2 pass, c3 fails)", () => {
    const first = { open: 30, high: 30.5, low: 20, close: 21 }; // body=9, tail=1, ok
    const second = { open: 26, high: 26.5, low: 17, close: 17.5 }; // body=8.5, tail=0.5, ok
    const third = { open: 22, high: 22.5, low: 10, close: 13 }; // body=9, range=12.5, tail=3 > 2.7
    assert.equal(isThreeBlackCrows(first, second, third), false);
  });
});
