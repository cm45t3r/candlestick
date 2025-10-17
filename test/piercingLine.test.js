const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { isPiercingLine, piercingLine } = require("../src/piercingLine.js");

describe("piercingLine", () => {
  it("isPiercingLine: detects a valid piercing line", () => {
    // Bearish candle, then bullish that opens below low and closes above midpoint
    const first = { open: 50, high: 51, low: 40, close: 41 }; // Bearish, midpoint = 45.5
    const second = { open: 38, high: 48, low: 37, close: 47 }; // Bullish, opens < 40, closes > 45.5, < 50
    assert.equal(isPiercingLine(first, second), true);
  });

  it("isPiercingLine: rejects when first candle is not bearish", () => {
    const first = { open: 41, high: 51, low: 40, close: 50 }; // Bullish
    const second = { open: 38, high: 48, low: 37, close: 47 };
    assert.equal(isPiercingLine(first, second), false);
  });

  it("isPiercingLine: rejects when second candle is not bullish", () => {
    const first = { open: 50, high: 51, low: 40, close: 41 };
    const second = { open: 47, high: 48, low: 37, close: 38 }; // Bearish
    assert.equal(isPiercingLine(first, second), false);
  });

  it("isPiercingLine: rejects when second does not open below first low", () => {
    const first = { open: 50, high: 51, low: 40, close: 41 };
    const second = { open: 41, high: 48, low: 40, close: 47 }; // Opens at first's low
    assert.equal(isPiercingLine(first, second), false);
  });

  it("isPiercingLine: rejects when second does not close above midpoint", () => {
    const first = { open: 50, high: 51, low: 40, close: 41 }; // Midpoint = 45.5
    const second = { open: 38, high: 45, low: 37, close: 44 }; // Closes below midpoint
    assert.equal(isPiercingLine(first, second), false);
  });

  it("isPiercingLine: rejects when second closes above first open", () => {
    const first = { open: 50, high: 51, low: 40, close: 41 };
    const second = { open: 38, high: 52, low: 37, close: 51 }; // Closes above first open
    assert.equal(isPiercingLine(first, second), false);
  });

  it("piercingLine: finds patterns in array", () => {
    const arr = [
      { open: 50, high: 51, low: 40, close: 41 }, // 0
      { open: 38, high: 48, low: 37, close: 47 }, // 1 - Piercing line at index 0
      { open: 47, high: 50, low: 46, close: 49 }, // 2
    ];
    assert.deepStrictEqual(piercingLine(arr), [0]);
  });

  it("piercingLine: returns empty array when no pattern found", () => {
    const arr = [
      { open: 41, high: 51, low: 40, close: 50 }, // Bullish (not bearish)
      { open: 38, high: 48, low: 37, close: 47 },
    ];
    assert.deepStrictEqual(piercingLine(arr), []);
  });

  it("rejects if second candle has zero range", () => {
    const candles = [
      { open: 100, high: 105, low: 95, close: 96 }, // bearish
      { open: 100, high: 100, low: 100, close: 100 }, // zero range
    ];

    assert.equal(isPiercingLine(candles[0], candles[1]), false);
  });
});
