const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const reversal = require("../src/reversal.js");

describe("reversal", () => {
  it("isHangingMan: detects hanging man", () => {
    // Hanging man: previous bullish, current bearish hammer, clear upward gap
    const prev = { open: 28, high: 30, low: 25, close: 29.5 };
    const curr = { open: 32, high: 33, low: 20, close: 28 }; // open > prev.high
    assert.equal(reversal.isHangingMan(prev, curr), true);
  });
  it("isShootingStar: detects shooting star", () => {
    // Shooting star: previous bullish, current bearish inverted hammer, clear upward gap
    const prev = { open: 28, high: 30, low: 25, close: 29.5 };
    // Inverted hammer: bearish, body in lower third, long upper shadow, small lower shadow
    const curr = { open: 60, high: 90, low: 49, close: 50 }; // open > close, open > prev.high
    assert.equal(reversal.isShootingStar(prev, curr), true);
  });
  it("hangingMan: finds hanging men in array", () => {
    const arr = [
      { open: 28, high: 30, low: 25, close: 29.5 },
      { open: 32, high: 33, low: 20, close: 28 }, // hanging man
      { open: 28, high: 30, low: 25, close: 29.5 },
      { open: 60, high: 90, low: 49, close: 50 },
    ];
    assert.deepStrictEqual(reversal.hangingMan(arr), [0]);
  });
  it("shootingStar: finds shooting stars in array", () => {
    const arr = [
      { open: 28, high: 30, low: 25, close: 29.5 },
      { open: 60, high: 90, low: 49, close: 50 }, // shooting star
      { open: 28, high: 30, low: 25, close: 29.5 },
      { open: 32, high: 33, low: 20, close: 28 },
    ];
    assert.deepStrictEqual(reversal.shootingStar(arr), [0]);
  });
});
