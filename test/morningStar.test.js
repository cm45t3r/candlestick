const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { isMorningStar, morningStar } = require("../src/morningStar.js");

describe("morningStar", () => {
  it("isMorningStar: detects a valid morning star", () => {
    // Bearish candle, small star that gaps down, bullish candle closing above midpoint
    const first = { open: 50, high: 51, low: 40, close: 41 }; // Bearish, body = 9, range = 11
    const second = { open: 38.75, high: 40, low: 38, close: 38.25 }; // Small body = 0.5, range = 2, 0.5/2 = 0.25 < 0.3
    const third = { open: 39, high: 48, low: 38.5, close: 47 }; // Bullish, closes above midpoint (45.5)
    assert.equal(isMorningStar(first, second, third), true);
  });

  it("isMorningStar: rejects when first candle is not bearish", () => {
    const first = { open: 40, high: 51, low: 40, close: 50 }; // Bullish
    const second = { open: 39, high: 39.5, low: 38, close: 38.5 };
    const third = { open: 39, high: 48, low: 38.5, close: 47 };
    assert.equal(isMorningStar(first, second, third), false);
  });

  it("isMorningStar: rejects when second candle does not gap down", () => {
    const first = { open: 50, high: 51, low: 40, close: 41 };
    const second = { open: 42, high: 43, low: 41.5, close: 41.6 }; // No gap down, small body
    const third = { open: 42, high: 48, low: 41, close: 47 };
    assert.equal(isMorningStar(first, second, third), false);
  });

  it("isMorningStar: rejects when third candle is not bullish", () => {
    const first = { open: 50, high: 51, low: 40, close: 41 };
    const second = { open: 38.75, high: 40, low: 38, close: 38.25 };
    const third = { open: 47, high: 48, low: 38.5, close: 39 }; // Bearish
    assert.equal(isMorningStar(first, second, third), false);
  });

  it("isMorningStar: rejects when third candle does not close above midpoint", () => {
    const first = { open: 50, high: 51, low: 40, close: 41 };
    const second = { open: 38.75, high: 40, low: 38, close: 38.25 };
    const third = { open: 39, high: 44, low: 38.5, close: 43 }; // Closes below midpoint (45.5)
    assert.equal(isMorningStar(first, second, third), false);
  });

  it("morningStar: finds morning stars in array", () => {
    const arr = [
      { open: 50, high: 51, low: 40, close: 41 }, // 0
      { open: 38.75, high: 40, low: 38, close: 38.25 }, // 1
      { open: 39, high: 48, low: 38.5, close: 47 }, // 2 - Morning star at index 0
      { open: 10, high: 15, low: 9, close: 14 }, // 3
    ];
    assert.deepStrictEqual(morningStar(arr), [0]);
  });

  it("morningStar: returns empty array when no pattern found", () => {
    const arr = [
      { open: 40, high: 51, low: 40, close: 50 }, // Bullish (not bearish)
      { open: 39, high: 39.5, low: 38, close: 38.5 },
      { open: 39, high: 48, low: 38.5, close: 47 },
    ];
    assert.deepStrictEqual(morningStar(arr), []);
  });

  it("rejects if third candle has zero range", () => {
    const candles = [
      { open: 100, high: 101, low: 90, close: 91 }, // bearish
      { open: 90, high: 91, low: 89, close: 89.5 }, // small star
      { open: 100, high: 100, low: 100, close: 100 }, // zero range
    ];

    assert.equal(isMorningStar(candles[0], candles[1], candles[2]), false);
  });
});
