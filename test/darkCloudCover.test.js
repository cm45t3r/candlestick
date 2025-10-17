const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  isDarkCloudCover,
  darkCloudCover,
} = require("../src/darkCloudCover.js");

describe("darkCloudCover", () => {
  it("isDarkCloudCover: detects a valid dark cloud cover", () => {
    // Bullish candle, then bearish that opens above high and closes below midpoint
    const first = { open: 40, high: 50, low: 39, close: 49 }; // Bullish, midpoint = 44.5
    const second = { open: 52, high: 53, low: 42, close: 43 }; // Bearish, opens > 50, closes < 44.5, > 40
    assert.equal(isDarkCloudCover(first, second), true);
  });

  it("isDarkCloudCover: rejects when first candle is not bullish", () => {
    const first = { open: 49, high: 50, low: 39, close: 40 }; // Bearish
    const second = { open: 52, high: 53, low: 42, close: 43 };
    assert.equal(isDarkCloudCover(first, second), false);
  });

  it("isDarkCloudCover: rejects when second candle is not bearish", () => {
    const first = { open: 40, high: 50, low: 39, close: 49 };
    const second = { open: 43, high: 53, low: 42, close: 52 }; // Bullish
    assert.equal(isDarkCloudCover(first, second), false);
  });

  it("isDarkCloudCover: rejects when second does not open above first high", () => {
    const first = { open: 40, high: 50, low: 39, close: 49 };
    const second = { open: 49, high: 53, low: 42, close: 43 }; // Opens at first's high
    assert.equal(isDarkCloudCover(first, second), false);
  });

  it("isDarkCloudCover: rejects when second does not close below midpoint", () => {
    const first = { open: 40, high: 50, low: 39, close: 49 }; // Midpoint = 44.5
    const second = { open: 52, high: 53, low: 46, close: 47 }; // Closes above midpoint
    assert.equal(isDarkCloudCover(first, second), false);
  });

  it("isDarkCloudCover: rejects when second closes below first open", () => {
    const first = { open: 40, high: 50, low: 39, close: 49 };
    const second = { open: 52, high: 53, low: 38, close: 39 }; // Closes below first open
    assert.equal(isDarkCloudCover(first, second), false);
  });

  it("darkCloudCover: finds patterns in array", () => {
    const arr = [
      { open: 40, high: 50, low: 39, close: 49 }, // 0
      { open: 52, high: 53, low: 42, close: 43 }, // 1 - Dark cloud cover at index 0
      { open: 43, high: 45, low: 41, close: 42 }, // 2
    ];
    assert.deepStrictEqual(darkCloudCover(arr), [0]);
  });

  it("darkCloudCover: returns empty array when no pattern found", () => {
    const arr = [
      { open: 49, high: 50, low: 39, close: 40 }, // Bearish (not bullish)
      { open: 52, high: 53, low: 42, close: 43 },
    ];
    assert.deepStrictEqual(darkCloudCover(arr), []);
  });
});
