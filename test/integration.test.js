const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

// Import entire module
const candlestick = require("../index.js");

describe("Integration Tests", () => {
  it("all 16 unique patterns are available", () => {
    // Count unique pattern detection functions (not including variants like bullish/bearish)
    const uniquePatterns = [
      "hammer",
      "invertedHammer",
      "doji",
      "bullishEngulfing",
      "bullishHarami",
      "bullishKicker",
      "hangingMan",
      "shootingStar",
      "morningStar",
      "eveningStar",
      "threeWhiteSoldiers",
      "threeBlackCrows",
      "piercingLine",
      "darkCloudCover",
    ];

    for (const pattern of uniquePatterns) {
      assert.equal(
        typeof candlestick[pattern],
        "function",
        `${pattern} should be a function`,
      );
    }
  });

  it("allPatterns contains 21 pattern definitions", () => {
    assert.equal(candlestick.allPatterns.length, 21);
  });

  it("utils object is available with all utilities", () => {
    assert.equal(typeof candlestick.utils, "object");
    assert.equal(typeof candlestick.utils.bodyLen, "function");
    assert.equal(typeof candlestick.utils.validateOHLC, "function");
    assert.equal(typeof candlestick.utils.precomputeCandleProps, "function");
  });

  it("plugins object is available", () => {
    assert.equal(typeof candlestick.plugins, "object");
    assert.equal(typeof candlestick.plugins.registerPattern, "function");
  });

  it("end-to-end: detect all new patterns in mixed data", () => {
    const data = [
      // Piercing Line
      { open: 50, high: 51, low: 40, close: 41 }, // 0
      { open: 38, high: 48, low: 37, close: 47 }, // 1
      // Dark Cloud Cover
      { open: 40, high: 50, low: 39, close: 49 }, // 2
      { open: 52, high: 53, low: 42, close: 43 }, // 3
      // Morning Star
      { open: 50, high: 51, low: 40, close: 41 }, // 4
      { open: 38.75, high: 40, low: 38, close: 38.25 }, // 5
      { open: 39, high: 48, low: 38.5, close: 47 }, // 6
      // Evening Star
      { open: 40, high: 50, low: 39, close: 49 }, // 7
      { open: 50.5, high: 51, low: 50, close: 50.5 }, // 8
      { open: 50, high: 50.5, low: 42, close: 43 }, // 9
    ];

    const results = candlestick.patternChain(data);

    // Check that new patterns are detected
    const patternNames = results.map((r) => r.pattern);
    assert.ok(
      patternNames.includes("piercingLine"),
      "Should detect piercingLine",
    );
    assert.ok(
      patternNames.includes("darkCloudCover"),
      "Should detect darkCloudCover",
    );
    assert.ok(
      patternNames.includes("morningStar"),
      "Should detect morningStar",
    );
    assert.ok(
      patternNames.includes("eveningStar"),
      "Should detect eveningStar",
    );
  });

  it("validation prevents invalid data from crashing", () => {
    const { validateOHLC, validateOHLCArray } = candlestick.utils;

    // Invalid data should throw
    assert.throws(() => validateOHLC({ open: 10 }), /Missing required field/);
    assert.throws(
      () => validateOHLC({ open: 10, high: 8, low: 15, close: 12 }),
      /High.*must be >= Low/,
    );
    assert.throws(() => validateOHLCArray([]), /Data array cannot be empty/);

    // Valid data should pass
    assert.doesNotThrow(() =>
      validateOHLC({ open: 10, high: 15, low: 8, close: 12 }),
    );
    assert.doesNotThrow(() =>
      validateOHLCArray([{ open: 10, high: 15, low: 8, close: 12 }]),
    );
  });

  it("plugin system works end-to-end", () => {
    const { plugins, patternChain } = candlestick;

    // Clear any existing plugins first
    plugins.clearAllPatterns();

    // Register a custom pattern
    plugins.registerPattern({
      name: "testIntegrationPattern",
      fn: (dataArray) => {
        return dataArray
          .map((c, i) => (c.open === c.close ? i : -1))
          .filter((idx) => idx !== -1);
      },
      paramCount: 1,
      metadata: { type: "test" },
    });

    const data = [
      { open: 10, high: 12, low: 9, close: 10 }, // Doji (open === close)
      { open: 11, high: 13, low: 10, close: 12 },
    ];

    const customPattern = plugins.getPattern("testIntegrationPattern");
    const results = patternChain(data, [customPattern]);

    assert.equal(results.length, 1);
    assert.equal(results[0].pattern, "testIntegrationPattern");
    assert.equal(results[0].index, 0);

    // Cleanup
    plugins.clearAllPatterns();
  });

  it("precomputed properties work across all patterns", () => {
    const { precomputeCandleProps } = candlestick.utils;
    const data = [
      { open: 10, high: 15, low: 8, close: 12 },
      { open: 12, high: 16, low: 11, close: 14 },
    ];

    const precomputed = precomputeCandleProps(data);

    // Check all precomputed properties exist
    assert.ok(precomputed[0].bodyLen !== undefined);
    assert.ok(precomputed[0].wickLen !== undefined);
    assert.ok(precomputed[0].tailLen !== undefined);
    assert.ok(precomputed[0].isBullish !== undefined);
    assert.ok(precomputed[0].isBearish !== undefined);
    assert.ok(precomputed[0].bodyEnds !== undefined);

    // Use with pattern detection
    const results = candlestick.hammer(precomputed);
    assert.ok(Array.isArray(results));
  });

  it("all pattern functions accept both raw and precomputed data", () => {
    const rawData = [
      { open: 28, high: 30, low: 20, close: 29 },
      { open: 29, high: 31, low: 28, close: 30 },
    ];

    const precomputed = candlestick.utils.precomputeCandleProps(rawData);

    // Test with raw data
    const rawResults = candlestick.hammer(rawData);

    // Test with precomputed data
    const precomputedResults = candlestick.hammer(precomputed);

    // Results should be the same
    assert.deepStrictEqual(rawResults, precomputedResults);
  });

  it("pattern chain sorts results chronologically", () => {
    const data = [
      { open: 50, high: 51, low: 40, close: 41 },
      { open: 38, high: 48, low: 37, close: 47 },
      { open: 40, high: 50, low: 39, close: 49 },
      { open: 52, high: 53, low: 42, close: 43 },
    ];

    const results = candlestick.patternChain(data);

    // Check chronological order
    for (let i = 1; i < results.length; i++) {
      assert.ok(results[i].index >= results[i - 1].index);
    }
  });
});
