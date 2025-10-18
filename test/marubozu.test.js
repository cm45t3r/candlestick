const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  isMarubozu,
  isBullishMarubozu,
  isBearishMarubozu,
  marubozu,
  bullishMarubozu,
  bearishMarubozu,
} = require("../src/marubozu.js");

describe("Marubozu", () => {
  describe("isMarubozu", () => {
    it("detects bullish marubozu", () => {
      const candle = { open: 10, high: 20, low: 10, close: 20 };
      assert.equal(isMarubozu(candle), true);
    });

    it("detects bearish marubozu", () => {
      const candle = { open: 20, high: 20, low: 10, close: 10 };
      assert.equal(isMarubozu(candle), true);
    });

    it("rejects candle with small body", () => {
      const candle = { open: 15, high: 20, low: 10, close: 16 };
      assert.equal(isMarubozu(candle), false);
    });

    it("rejects candle with large upper shadow", () => {
      const candle = { open: 10, high: 22, low: 10, close: 20 };
      assert.equal(isMarubozu(candle), false);
    });

    it("rejects candle with large lower shadow", () => {
      const candle = { open: 10, high: 20, low: 8, close: 20 };
      assert.equal(isMarubozu(candle), false);
    });

    it("rejects candle with zero range", () => {
      const candle = { open: 10, high: 10, low: 10, close: 10 };
      assert.equal(isMarubozu(candle), false);
    });

    it("accepts candle with minimal shadows within threshold", () => {
      const candle = { open: 10, high: 20.5, low: 9.5, close: 20 };
      assert.equal(isMarubozu(candle), true);
    });
  });

  describe("isBullishMarubozu", () => {
    it("detects valid bullish marubozu", () => {
      const candle = { open: 10, high: 20, low: 10, close: 20 };
      assert.equal(isBullishMarubozu(candle), true);
    });

    it("rejects bearish candle", () => {
      const candle = { open: 20, high: 20, low: 10, close: 10 };
      assert.equal(isBullishMarubozu(candle), false);
    });

    it("rejects bullish candle with large shadows", () => {
      const candle = { open: 10, high: 22, low: 8, close: 20 };
      assert.equal(isBullishMarubozu(candle), false);
    });
  });

  describe("isBearishMarubozu", () => {
    it("detects valid bearish marubozu", () => {
      const candle = { open: 20, high: 20, low: 10, close: 10 };
      assert.equal(isBearishMarubozu(candle), true);
    });

    it("rejects bullish candle", () => {
      const candle = { open: 10, high: 20, low: 10, close: 20 };
      assert.equal(isBearishMarubozu(candle), false);
    });

    it("rejects bearish candle with large shadows", () => {
      const candle = { open: 20, high: 22, low: 8, close: 10 };
      assert.equal(isBearishMarubozu(candle), false);
    });
  });

  describe("marubozu array detection", () => {
    it("finds marubozu patterns in array", () => {
      const candles = [
        { open: 10, high: 20, low: 10, close: 20 }, // Bullish marubozu at 0
        { open: 15, high: 20, low: 10, close: 16 }, // Not marubozu
        { open: 30, high: 30, low: 20, close: 20 }, // Bearish marubozu at 2
      ];
      assert.deepStrictEqual(marubozu(candles), [0, 2]);
    });

    it("returns empty array when no pattern found", () => {
      const candles = [
        { open: 15, high: 20, low: 10, close: 16 },
        { open: 14, high: 20, low: 10, close: 13 },
      ];
      assert.deepStrictEqual(marubozu(candles), []);
    });
  });

  describe("bullishMarubozu array detection", () => {
    it("finds only bullish marubozu patterns", () => {
      const candles = [
        { open: 10, high: 20, low: 10, close: 20 }, // Bullish at 0
        { open: 30, high: 30, low: 20, close: 20 }, // Bearish (skipped)
        { open: 40, high: 50, low: 40, close: 50 }, // Bullish at 2
      ];
      assert.deepStrictEqual(bullishMarubozu(candles), [0, 2]);
    });

    it("returns empty array when no bullish marubozu found", () => {
      const candles = [
        { open: 30, high: 30, low: 20, close: 20 },
        { open: 15, high: 20, low: 10, close: 16 },
      ];
      assert.deepStrictEqual(bullishMarubozu(candles), []);
    });
  });

  describe("bearishMarubozu array detection", () => {
    it("finds only bearish marubozu patterns", () => {
      const candles = [
        { open: 20, high: 20, low: 10, close: 10 }, // Bearish at 0
        { open: 10, high: 20, low: 10, close: 20 }, // Bullish (skipped)
        { open: 50, high: 50, low: 40, close: 40 }, // Bearish at 2
      ];
      assert.deepStrictEqual(bearishMarubozu(candles), [0, 2]);
    });

    it("returns empty array when no bearish marubozu found", () => {
      const candles = [
        { open: 10, high: 20, low: 10, close: 20 },
        { open: 15, high: 20, low: 10, close: 16 },
      ];
      assert.deepStrictEqual(bearishMarubozu(candles), []);
    });
  });
});
