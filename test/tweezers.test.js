const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  isTweezers,
  isTweezersTop,
  isTweezersBottom,
  tweezers,
  tweezersTop,
  tweezersBottom,
} = require("../src/tweezers.js");

describe("Tweezers", () => {
  describe("isTweezersTop", () => {
    it("detects valid tweezers top", () => {
      const first = { open: 40, high: 60, low: 39, close: 59 }; // Bullish
      const second = { open: 59, high: 60, low: 45, close: 46 }; // Bearish, matching high
      assert.equal(isTweezersTop(first, second), true);
    });

    it("rejects when highs do not match", () => {
      const first = { open: 40, high: 60, low: 39, close: 59 };
      const second = { open: 59, high: 65, low: 45, close: 46 }; // Different high
      assert.equal(isTweezersTop(first, second), false);
    });

    it("rejects when first candle is bearish", () => {
      const first = { open: 59, high: 60, low: 39, close: 40 }; // Bearish
      const second = { open: 59, high: 60, low: 45, close: 46 };
      assert.equal(isTweezersTop(first, second), false);
    });

    it("rejects when second candle is bullish", () => {
      const first = { open: 40, high: 60, low: 39, close: 59 };
      const second = { open: 46, high: 60, low: 45, close: 59 }; // Bullish
      assert.equal(isTweezersTop(first, second), false);
    });

    it("rejects when bodies are too small", () => {
      const first = { open: 49, high: 60, low: 39, close: 50 }; // Small body
      const second = { open: 51, high: 60, low: 45, close: 50 };
      assert.equal(isTweezersTop(first, second), false);
    });

    it("rejects when range is zero", () => {
      const first = { open: 50, high: 50, low: 50, close: 50 };
      const second = { open: 50, high: 50, low: 50, close: 50 };
      assert.equal(isTweezersTop(first, second), false);
    });
  });

  describe("isTweezersBottom", () => {
    it("detects valid tweezers bottom", () => {
      const first = { open: 59, high: 60, low: 40, close: 41 }; // Bearish
      const second = { open: 41, high: 55, low: 40, close: 54 }; // Bullish, matching low
      assert.equal(isTweezersBottom(first, second), true);
    });

    it("rejects when lows do not match", () => {
      const first = { open: 59, high: 60, low: 40, close: 41 };
      const second = { open: 41, high: 55, low: 35, close: 54 }; // Different low
      assert.equal(isTweezersBottom(first, second), false);
    });

    it("rejects when first candle is bullish", () => {
      const first = { open: 41, high: 60, low: 40, close: 59 }; // Bullish
      const second = { open: 41, high: 55, low: 40, close: 54 };
      assert.equal(isTweezersBottom(first, second), false);
    });

    it("rejects when second candle is bearish", () => {
      const first = { open: 59, high: 60, low: 40, close: 41 };
      const second = { open: 54, high: 55, low: 40, close: 41 }; // Bearish
      assert.equal(isTweezersBottom(first, second), false);
    });

    it("rejects when bodies are too small", () => {
      const first = { open: 50, high: 60, low: 40, close: 49 }; // Small body
      const second = { open: 50, high: 55, low: 40, close: 51 };
      assert.equal(isTweezersBottom(first, second), false);
    });
  });

  describe("isTweezers", () => {
    it("detects tweezers top", () => {
      const first = { open: 40, high: 60, low: 39, close: 59 };
      const second = { open: 59, high: 60, low: 45, close: 46 };
      assert.equal(isTweezers(first, second), true);
    });

    it("detects tweezers bottom", () => {
      const first = { open: 59, high: 60, low: 40, close: 41 };
      const second = { open: 41, high: 55, low: 40, close: 54 };
      assert.equal(isTweezers(first, second), true);
    });

    it("rejects when neither pattern matches", () => {
      const first = { open: 40, high: 60, low: 39, close: 59 };
      const second = { open: 59, high: 70, low: 55, close: 69 };
      assert.equal(isTweezers(first, second), false);
    });
  });

  describe("tweezersTop array detection", () => {
    it("finds tweezers top patterns in array", () => {
      const candles = [
        { open: 40, high: 60, low: 39, close: 59 }, // 0
        { open: 59, high: 60, low: 45, close: 46 }, // 1 - Tweezers top at index 0
        { open: 45, high: 55, low: 44, close: 54 }, // 2
      ];
      assert.deepStrictEqual(tweezersTop(candles), [0]);
    });

    it("returns empty array when no tweezers top found", () => {
      const candles = [
        { open: 40, high: 60, low: 39, close: 59 },
        { open: 59, high: 70, low: 55, close: 69 },
      ];
      assert.deepStrictEqual(tweezersTop(candles), []);
    });
  });

  describe("tweezersBottom array detection", () => {
    it("finds tweezers bottom patterns in array", () => {
      const candles = [
        { open: 59, high: 60, low: 40, close: 41 }, // 0
        { open: 41, high: 55, low: 40, close: 54 }, // 1 - Tweezers bottom at index 0
        { open: 54, high: 65, low: 53, close: 64 }, // 2
      ];
      assert.deepStrictEqual(tweezersBottom(candles), [0]);
    });

    it("returns empty array when no tweezers bottom found", () => {
      const candles = [
        { open: 59, high: 60, low: 40, close: 41 },
        { open: 41, high: 55, low: 30, close: 54 }, // Different low
      ];
      assert.deepStrictEqual(tweezersBottom(candles), []);
    });
  });

  describe("tweezers array detection", () => {
    it("finds both tweezers top and bottom in array", () => {
      const candles = [
        { open: 40, high: 60, low: 39, close: 59 }, // 0
        { open: 59, high: 60, low: 45, close: 46 }, // 1 - Top at 0
        { open: 59, high: 60, low: 40, close: 41 }, // 2
        { open: 41, high: 55, low: 40, close: 54 }, // 3 - Bottom at 2
      ];
      assert.deepStrictEqual(tweezers(candles), [0, 2]);
    });

    it("returns empty array when no tweezers found", () => {
      const candles = [
        { open: 40, high: 60, low: 39, close: 59 },
        { open: 59, high: 70, low: 50, close: 69 },
      ];
      assert.deepStrictEqual(tweezers(candles), []);
    });
  });
});
