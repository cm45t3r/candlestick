const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  isSpinningTop,
  isBullishSpinningTop,
  isBearishSpinningTop,
  spinningTop,
  bullishSpinningTop,
  bearishSpinningTop,
} = require("../src/spinningTop.js");

describe("Spinning Top", () => {
  describe("isSpinningTop", () => {
    it("detects valid spinning top with small body", () => {
      const candle = { open: 50, high: 60, low: 40, close: 52 };
      assert.equal(isSpinningTop(candle), true);
    });

    it("detects spinning top with bearish close", () => {
      const candle = { open: 52, high: 60, low: 40, close: 50 };
      assert.equal(isSpinningTop(candle), true);
    });

    it("rejects candle with large body", () => {
      const candle = { open: 45, high: 60, low: 40, close: 58 };
      assert.equal(isSpinningTop(candle), false);
    });

    it("rejects candle with short upper shadow", () => {
      const candle = { open: 50, high: 52, low: 40, close: 51 };
      assert.equal(isSpinningTop(candle), false);
    });

    it("rejects candle with short lower shadow", () => {
      const candle = { open: 50, high: 60, low: 48, close: 52 };
      assert.equal(isSpinningTop(candle), false);
    });

    it("rejects candle with zero range", () => {
      const candle = { open: 50, high: 50, low: 50, close: 50 };
      assert.equal(isSpinningTop(candle), false);
    });

    it("accepts spinning top with equal shadows", () => {
      const candle = { open: 50, high: 55, low: 45, close: 51 };
      assert.equal(isSpinningTop(candle), true);
    });
  });

  describe("isBullishSpinningTop", () => {
    it("detects valid bullish spinning top", () => {
      const candle = { open: 50, high: 60, low: 40, close: 52 };
      assert.equal(isBullishSpinningTop(candle), true);
    });

    it("rejects bearish spinning top", () => {
      const candle = { open: 52, high: 60, low: 40, close: 50 };
      assert.equal(isBullishSpinningTop(candle), false);
    });

    it("rejects bullish candle that is not spinning top", () => {
      const candle = { open: 45, high: 60, low: 40, close: 58 };
      assert.equal(isBullishSpinningTop(candle), false);
    });
  });

  describe("isBearishSpinningTop", () => {
    it("detects valid bearish spinning top", () => {
      const candle = { open: 52, high: 60, low: 40, close: 50 };
      assert.equal(isBearishSpinningTop(candle), true);
    });

    it("rejects bullish spinning top", () => {
      const candle = { open: 50, high: 60, low: 40, close: 52 };
      assert.equal(isBearishSpinningTop(candle), false);
    });

    it("rejects bearish candle that is not spinning top", () => {
      const candle = { open: 58, high: 60, low: 40, close: 45 };
      assert.equal(isBearishSpinningTop(candle), false);
    });
  });

  describe("spinningTop array detection", () => {
    it("finds spinning top patterns in array", () => {
      const candles = [
        { open: 50, high: 60, low: 40, close: 52 }, // Spinning top at 0
        { open: 45, high: 60, low: 40, close: 58 }, // Not spinning top
        { open: 102, high: 110, low: 90, close: 100 }, // Spinning top at 2
      ];
      assert.deepStrictEqual(spinningTop(candles), [0, 2]);
    });

    it("returns empty array when no pattern found", () => {
      const candles = [
        { open: 45, high: 60, low: 40, close: 58 },
        { open: 42, high: 60, low: 40, close: 56 },
      ];
      assert.deepStrictEqual(spinningTop(candles), []);
    });
  });

  describe("bullishSpinningTop array detection", () => {
    it("finds only bullish spinning tops", () => {
      const candles = [
        { open: 50, high: 60, low: 40, close: 52 }, // Bullish at 0
        { open: 52, high: 60, low: 40, close: 50 }, // Bearish (skipped)
        { open: 100, high: 110, low: 90, close: 102 }, // Bullish at 2
      ];
      assert.deepStrictEqual(bullishSpinningTop(candles), [0, 2]);
    });

    it("returns empty array when no bullish spinning top found", () => {
      const candles = [
        { open: 52, high: 60, low: 40, close: 50 },
        { open: 45, high: 60, low: 40, close: 58 },
      ];
      assert.deepStrictEqual(bullishSpinningTop(candles), []);
    });
  });

  describe("bearishSpinningTop array detection", () => {
    it("finds only bearish spinning tops", () => {
      const candles = [
        { open: 52, high: 60, low: 40, close: 50 }, // Bearish at 0
        { open: 50, high: 60, low: 40, close: 52 }, // Bullish (skipped)
        { open: 102, high: 110, low: 90, close: 100 }, // Bearish at 2
      ];
      assert.deepStrictEqual(bearishSpinningTop(candles), [0, 2]);
    });

    it("returns empty array when no bearish spinning top found", () => {
      const candles = [
        { open: 50, high: 60, low: 40, close: 52 },
        { open: 45, high: 60, low: 40, close: 58 },
      ];
      assert.deepStrictEqual(bearishSpinningTop(candles), []);
    });
  });
});
