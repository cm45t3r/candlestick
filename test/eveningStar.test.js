const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { isEveningStar, eveningStar } = require("../src/eveningStar.js");

describe("eveningStar", () => {
  it("isEveningStar: detects a valid evening star", () => {
    // Bullish candle, small star that gaps up, bearish candle closing below midpoint
    const first = { open: 40, high: 50, low: 39, close: 49 }; // Bullish
    const second = { open: 50.5, high: 51, low: 50, close: 50.5 }; // Small body, gaps up
    const third = { open: 50, high: 50.5, low: 42, close: 43 }; // Bearish, closes below midpoint (44.5)
    assert.equal(isEveningStar(first, second, third), true);
  });

  it("isEveningStar: rejects when first candle is not bullish", () => {
    const first = { open: 49, high: 50, low: 39, close: 40 }; // Bearish
    const second = { open: 50.5, high: 51, low: 50, close: 50.5 };
    const third = { open: 50, high: 50.5, low: 42, close: 43 };
    assert.equal(isEveningStar(first, second, third), false);
  });

  it("isEveningStar: rejects when second candle does not gap up", () => {
    const first = { open: 40, high: 50, low: 39, close: 49 };
    const second = { open: 48, high: 49, low: 47, close: 48 }; // No gap up
    const third = { open: 48, high: 50, low: 42, close: 43 };
    assert.equal(isEveningStar(first, second, third), false);
  });

  it("isEveningStar: rejects when third candle is not bearish", () => {
    const first = { open: 40, high: 50, low: 39, close: 49 };
    const second = { open: 50.5, high: 51, low: 50, close: 50.5 };
    const third = { open: 43, high: 50.5, low: 42, close: 50 }; // Bullish
    assert.equal(isEveningStar(first, second, third), false);
  });

  it("isEveningStar: rejects when third candle does not close below midpoint", () => {
    const first = { open: 40, high: 50, low: 39, close: 49 };
    const second = { open: 50.5, high: 51, low: 50, close: 50.5 };
    const third = { open: 50, high: 50.5, low: 46, close: 47 }; // Closes above midpoint (44.5)
    assert.equal(isEveningStar(first, second, third), false);
  });

  it("eveningStar: finds evening stars in array", () => {
    const arr = [
      { open: 40, high: 50, low: 39, close: 49 }, // 0
      { open: 50.5, high: 51, low: 50, close: 50.5 }, // 1
      { open: 50, high: 50.5, low: 42, close: 43 }, // 2 - Evening star at index 0
      { open: 10, high: 15, low: 9, close: 14 }, // 3
    ];
    assert.deepStrictEqual(eveningStar(arr), [0]);
  });

  it("eveningStar: returns empty array when no pattern found", () => {
    const arr = [
      { open: 49, high: 50, low: 39, close: 40 }, // Bearish (not bullish)
      { open: 50.5, high: 51, low: 50, close: 50.5 },
      { open: 50, high: 50.5, low: 42, close: 43 },
    ];
    assert.deepStrictEqual(eveningStar(arr), []);
  });

  it("rejects if third candle has zero range", () => {
    const candles = [
      { open: 100, high: 110, low: 99, close: 109 }, // bullish
      { open: 110, high: 111, low: 109, close: 110.5 }, // small star
      { open: 100, high: 100, low: 100, close: 100 }, // zero range
    ];

    assert.equal(isEveningStar(candles[0], candles[1], candles[2]), false);
  });
});
