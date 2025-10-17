const { describe, it, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const {
  registerPattern,
  unregisterPattern,
  getPattern,
  getAllCustomPatterns,
  clearAllPatterns,
  hasPattern,
  getPatternCount,
} = require("../src/pluginManager.js");

describe("pluginManager", () => {
  beforeEach(() => {
    // Clear all patterns before each test
    clearAllPatterns();
  });

  describe("registerPattern", () => {
    it("registers a valid pattern", () => {
      const plugin = {
        name: "customPattern",
        fn: (candle) => candle.open === candle.close,
        paramCount: 1,
        metadata: { type: "reversal", confidence: 0.8 },
      };

      const result = registerPattern(plugin);

      assert.equal(result.name, "customPattern");
      assert.equal(typeof result.fn, "function");
      assert.equal(result.paramCount, 1);
      assert.deepStrictEqual(result.metadata, {
        type: "reversal",
        confidence: 0.8,
      });
    });

    it("registers pattern with default paramCount", () => {
      const plugin = {
        name: "simplePattern",
        fn: () => true,
      };

      const result = registerPattern(plugin);
      assert.equal(result.paramCount, 1);
    });

    it("registers pattern with empty metadata", () => {
      const plugin = {
        name: "noMetadata",
        fn: () => true,
      };

      const result = registerPattern(plugin);
      assert.deepStrictEqual(result.metadata, {});
    });

    it("throws error for null plugin", () => {
      assert.throws(() => registerPattern(null), {
        message: /Plugin must be an object/,
      });
    });

    it("throws error for missing name", () => {
      assert.throws(() => registerPattern({ fn: () => true }), {
        message: /Plugin must have a valid name/,
      });
    });

    it("throws error for missing fn", () => {
      assert.throws(() => registerPattern({ name: "test" }), {
        message: /Plugin must have a valid detection function/,
      });
    });

    it("throws error for duplicate pattern name", () => {
      const plugin = { name: "duplicate", fn: () => true };
      registerPattern(plugin);

      assert.throws(() => registerPattern(plugin), {
        message: /Pattern "duplicate" is already registered/,
      });
    });

    it("throws error for invalid paramCount", () => {
      assert.throws(
        () =>
          registerPattern({
            name: "invalid",
            fn: () => true,
            paramCount: 0,
          }),
        {
          message: /paramCount must be a number between 1 and 10/,
        },
      );

      assert.throws(
        () =>
          registerPattern({
            name: "invalid2",
            fn: () => true,
            paramCount: 11,
          }),
        {
          message: /paramCount must be a number between 1 and 10/,
        },
      );
    });
  });

  describe("unregisterPattern", () => {
    it("removes a registered pattern", () => {
      registerPattern({ name: "toRemove", fn: () => true });
      assert.equal(hasPattern("toRemove"), true);

      const result = unregisterPattern("toRemove");
      assert.equal(result, true);
      assert.equal(hasPattern("toRemove"), false);
    });

    it("returns false for non-existent pattern", () => {
      const result = unregisterPattern("doesNotExist");
      assert.equal(result, false);
    });
  });

  describe("getPattern", () => {
    it("retrieves a registered pattern", () => {
      const plugin = { name: "retrieve", fn: () => true };
      registerPattern(plugin);

      const result = getPattern("retrieve");
      assert.equal(result.name, "retrieve");
    });

    it("returns undefined for non-existent pattern", () => {
      const result = getPattern("doesNotExist");
      assert.equal(result, undefined);
    });
  });

  describe("getAllCustomPatterns", () => {
    it("returns empty array when no patterns registered", () => {
      const result = getAllCustomPatterns();
      assert.deepStrictEqual(result, []);
    });

    it("returns all registered patterns", () => {
      registerPattern({ name: "pattern1", fn: () => true });
      registerPattern({ name: "pattern2", fn: () => false });

      const result = getAllCustomPatterns();
      assert.equal(result.length, 2);
      assert.equal(result[0].name, "pattern1");
      assert.equal(result[1].name, "pattern2");
    });
  });

  describe("clearAllPatterns", () => {
    it("removes all registered patterns", () => {
      registerPattern({ name: "pattern1", fn: () => true });
      registerPattern({ name: "pattern2", fn: () => false });
      assert.equal(getPatternCount(), 2);

      clearAllPatterns();
      assert.equal(getPatternCount(), 0);
    });
  });

  describe("hasPattern", () => {
    it("returns true for registered pattern", () => {
      registerPattern({ name: "exists", fn: () => true });
      assert.equal(hasPattern("exists"), true);
    });

    it("returns false for non-existent pattern", () => {
      assert.equal(hasPattern("doesNotExist"), false);
    });
  });

  describe("getPatternCount", () => {
    it("returns 0 when no patterns registered", () => {
      assert.equal(getPatternCount(), 0);
    });

    it("returns correct count", () => {
      registerPattern({ name: "pattern1", fn: () => true });
      assert.equal(getPatternCount(), 1);

      registerPattern({ name: "pattern2", fn: () => true });
      assert.equal(getPatternCount(), 2);
    });
  });

  describe("integration test", () => {
    it("custom pattern works with patternChain", () => {
      const { patternChain } = require("../src/patternChain.js");

      // Register a simple custom pattern (detects when open === close)
      registerPattern({
        name: "customDoji",
        fn: (dataArray) => {
          const results = [];
          for (let i = 0; i < dataArray.length; i++) {
            if (dataArray[i].open === dataArray[i].close) {
              results.push(i);
            }
          }
          return results;
        },
        paramCount: 1,
        metadata: { type: "neutral", confidence: 0.9 },
      });

      const customPattern = getPattern("customDoji");
      const data = [
        { open: 10, high: 12, low: 9, close: 10 }, // Doji (open === close)
        { open: 11, high: 13, low: 10, close: 12 },
      ];

      const results = patternChain(data, [customPattern]);
      assert.equal(results.length, 1);
      assert.equal(results[0].index, 0);
      assert.equal(results[0].pattern, "customDoji");
    });
  });
});
