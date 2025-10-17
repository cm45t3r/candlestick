const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { validateOHLC, validateOHLCArray } = require("../src/utils.js");

describe("validateOHLC", () => {
  it("validates a correct OHLC object", () => {
    const candle = { open: 10, high: 15, low: 8, close: 12 };
    assert.equal(validateOHLC(candle), true);
  });

  it("throws error for missing fields", () => {
    const candle = { open: 10, high: 15, close: 12 };
    assert.throws(() => validateOHLC(candle), {
      message: /Missing required field: low/,
    });
  });

  it("returns false for missing fields when throwError is false", () => {
    const candle = { open: 10, high: 15, close: 12 };
    assert.equal(validateOHLC(candle, false), false);
  });

  it("throws error for non-number fields", () => {
    const candle = { open: "10", high: 15, low: 8, close: 12 };
    assert.throws(() => validateOHLC(candle), {
      message: /Field open must be a number/,
    });
  });

  it("throws error for non-finite numbers", () => {
    const candle = { open: 10, high: Infinity, low: 8, close: 12 };
    assert.throws(() => validateOHLC(candle), {
      message: /Field high must be a finite number/,
    });
  });

  it("throws error when high < low", () => {
    const candle = { open: 10, high: 8, low: 15, close: 12 };
    assert.throws(() => validateOHLC(candle), {
      message: /High .* must be >= Low/,
    });
  });

  it("throws error when high < open", () => {
    const candle = { open: 20, high: 15, low: 8, close: 12 };
    assert.throws(() => validateOHLC(candle), {
      message: /High .* must be >= Open/,
    });
  });

  it("throws error when high < close", () => {
    const candle = { open: 10, high: 11, low: 8, close: 12 };
    assert.throws(() => validateOHLC(candle), {
      message: /High .* must be >= Close/,
    });
  });

  it("throws error when low > open", () => {
    const candle = { open: 8, high: 15, low: 10, close: 12 };
    assert.throws(() => validateOHLC(candle), {
      message: /Low .* must be <= Open/,
    });
  });

  it("throws error when low > close", () => {
    const candle = { open: 10, high: 15, low: 13, close: 12 };
    assert.throws(() => validateOHLC(candle), {
      message: /Low .* must be <= Close/,
    });
  });

  it("throws error for null candle", () => {
    assert.throws(() => validateOHLC(null), {
      message: /Candle must be an object/,
    });
  });

  it("throws error for non-object candle", () => {
    assert.throws(() => validateOHLC("not an object"), {
      message: /Candle must be an object/,
    });
  });

  it("validates candle with equal OHLC values", () => {
    const candle = { open: 10, high: 10, low: 10, close: 10 };
    assert.equal(validateOHLC(candle), true);
  });
});

describe("validateOHLCArray", () => {
  it("validates an array of correct OHLC objects", () => {
    const candles = [
      { open: 10, high: 15, low: 8, close: 12 },
      { open: 12, high: 16, low: 11, close: 14 },
    ];
    assert.equal(validateOHLCArray(candles), true);
  });

  it("throws error for non-array input", () => {
    assert.throws(() => validateOHLCArray("not an array"), {
      message: /Data must be an array/,
    });
  });

  it("returns false for non-array when throwError is false", () => {
    assert.equal(validateOHLCArray("not an array", false), false);
  });

  it("throws error for empty array", () => {
    assert.throws(() => validateOHLCArray([]), {
      message: /Data array cannot be empty/,
    });
  });

  it("throws error for invalid candle in array with index", () => {
    const candles = [
      { open: 10, high: 15, low: 8, close: 12 },
      { open: 12, high: 16, low: 20, close: 14 }, // invalid
    ];
    assert.throws(() => validateOHLCArray(candles), {
      message: /Invalid candle at index 1/,
    });
  });

  it("returns false for invalid array when throwError is false", () => {
    const candles = [
      { open: 10, high: 15, low: 8, close: 12 },
      { open: 12, high: 16, low: 20, close: 14 }, // invalid
    ];
    assert.equal(validateOHLCArray(candles, false), false);
  });

  it("validates array with single candle", () => {
    const candles = [{ open: 10, high: 15, low: 8, close: 12 }];
    assert.equal(validateOHLCArray(candles), true);
  });

  it("returns false for empty array when throwError is false", () => {
    const emptyArray = [];
    assert.equal(validateOHLCArray(emptyArray, false), false);
  });

  it("catches and returns false for invalid candle exception when throwError is false", () => {
    const candles = [
      { open: 10, high: 15, low: 8, close: 12 },
      { open: "invalid", high: 15, low: 8, close: 12 }, // invalid type
    ];
    assert.equal(validateOHLCArray(candles, false), false);
  });

  it("catches validation error in loop when throwError is false", () => {
    // This test specifically targets the catch block in validateOHLCArray
    const candles = [
      { open: 10, high: 15, low: 8, close: 12 },
      null, // This will cause validateOHLC to throw
    ];
    assert.equal(validateOHLCArray(candles, false), false);
  });
});
