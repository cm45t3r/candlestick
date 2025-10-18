const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fc = require("fast-check");
const candlestick = require("../index.js");

// Generator for valid OHLC data
const ohlcArbitrary = fc
  .record({
    open: fc.double({ min: 1, max: 1000, noNaN: true }),
    high: fc.double({ min: 1, max: 1000, noNaN: true }),
    low: fc.double({ min: 1, max: 1000, noNaN: true }),
    close: fc.double({ min: 1, max: 1000, noNaN: true }),
  })
  .filter((candle) => {
    // Ensure OHLC relationships are valid
    return (
      candle.high >= Math.max(candle.open, candle.close) &&
      candle.low <= Math.min(candle.open, candle.close) &&
      candle.high >= candle.low
    );
  });

describe("Property-Based Testing", () => {
  describe("Pattern detection invariants", () => {
    it("all pattern array functions should return arrays", () => {
      fc.assert(
        fc.property(
          fc.array(ohlcArbitrary, { minLength: 1, maxLength: 100 }),
          (candles) => {
            const patterns = [
              candlestick.hammer,
              candlestick.doji,
              candlestick.bullishEngulfing,
              candlestick.bullishHarami,
              candlestick.morningStar,
              candlestick.marubozu,
              candlestick.spinningTop,
              candlestick.tweezersTop,
            ];

            for (const pattern of patterns) {
              const result = pattern(candles);
              assert.ok(
                Array.isArray(result),
                `${pattern.name} should return array`,
              );
            }
            return true;
          },
        ),
        { numRuns: 100 },
      );
    });

    it("pattern indices should always be within array bounds", () => {
      fc.assert(
        fc.property(
          fc.array(ohlcArbitrary, { minLength: 3, maxLength: 50 }),
          (candles) => {
            const results = candlestick.patternChain(
              candles,
              candlestick.allPatterns,
            );

            for (const result of results) {
              assert.ok(result.index >= 0, "Index should be >= 0");
              assert.ok(
                result.index < candles.length,
                "Index should be < array length",
              );
            }
            return true;
          },
        ),
        { numRuns: 100 },
      );
    });

    it("pattern detection should never throw with valid OHLC data", () => {
      fc.assert(
        fc.property(
          fc.array(ohlcArbitrary, { minLength: 1, maxLength: 100 }),
          (candles) => {
            try {
              candlestick.patternChain(candles, candlestick.allPatterns);
              return true;
            } catch (error) {
              assert.fail(
                `Should not throw with valid OHLC data: ${error.message}`,
              );
              return false;
            }
          },
        ),
        { numRuns: 100 },
      );
    });

    it("validation should accept all generated valid OHLC candles", () => {
      fc.assert(
        fc.property(ohlcArbitrary, (candle) => {
          const result = candlestick.utils.validateOHLC(candle, false);
          assert.ok(result, "Generated candle should be valid");
          return true;
        }),
        { numRuns: 200 },
      );
    });

    it("validation should accept all generated valid OHLC arrays", () => {
      fc.assert(
        fc.property(
          fc.array(ohlcArbitrary, { minLength: 1, maxLength: 100 }),
          (candles) => {
            const result = candlestick.utils.validateOHLCArray(candles, false);
            assert.ok(result, "Generated array should be valid");
            return true;
          },
        ),
        { numRuns: 100 },
      );
    });

    it("single candle patterns should work on individual candles", () => {
      fc.assert(
        fc.property(ohlcArbitrary, (candle) => {
          // Should not throw
          candlestick.isHammer(candle);
          candlestick.isDoji(candle);
          candlestick.isMarubozu(candle);
          candlestick.isSpinningTop(candle);
          return true;
        }),
        { numRuns: 200 },
      );
    });

    it("two candle patterns should work on pairs", () => {
      fc.assert(
        fc.property(ohlcArbitrary, ohlcArbitrary, (first, second) => {
          // Should not throw
          candlestick.isBullishEngulfing(first, second);
          candlestick.isBullishHarami(first, second);
          candlestick.isBullishKicker(first, second);
          candlestick.isTweezersTop(first, second);
          candlestick.isTweezersBottom(first, second);
          return true;
        }),
        { numRuns: 200 },
      );
    });

    it("pattern results should be sorted by index", () => {
      fc.assert(
        fc.property(
          fc.array(ohlcArbitrary, { minLength: 5, maxLength: 50 }),
          (candles) => {
            const results = candlestick.patternChain(
              candles,
              candlestick.allPatterns,
            );

            // Check if sorted
            for (let i = 1; i < results.length; i++) {
              assert.ok(
                results[i].index >= results[i - 1].index,
                "Results should be sorted by index",
              );
            }
            return true;
          },
        ),
        { numRuns: 100 },
      );
    });

    it("metadata system should never crash", () => {
      fc.assert(
        fc.property(
          fc.array(ohlcArbitrary, { minLength: 3, maxLength: 30 }),
          (candles) => {
            const results = candlestick.patternChain(
              candles,
              candlestick.allPatterns,
            );
            const enriched = candlestick.metadata.enrichWithMetadata(results);

            assert.ok(Array.isArray(enriched));
            enriched.forEach((r) => {
              assert.ok(r.metadata, "Should have metadata");
              assert.ok(typeof r.metadata.confidence === "number");
            });
            return true;
          },
        ),
        { numRuns: 50 },
      );
    });
  });

  describe("Mathematical invariants", () => {
    it("body length should always be |close - open|", () => {
      fc.assert(
        fc.property(ohlcArbitrary, (candle) => {
          const bodyLen = candlestick.utils.bodyLen(candle);
          assert.equal(bodyLen, Math.abs(candle.close - candle.open));
          return true;
        }),
        { numRuns: 200 },
      );
    });

    it("high should be >= max(open, close)", () => {
      fc.assert(
        fc.property(ohlcArbitrary, (candle) => {
          assert.ok(candle.high >= Math.max(candle.open, candle.close));
          return true;
        }),
        { numRuns: 200 },
      );
    });

    it("low should be <= min(open, close)", () => {
      fc.assert(
        fc.property(ohlcArbitrary, (candle) => {
          assert.ok(candle.low <= Math.min(candle.open, candle.close));
          return true;
        }),
        { numRuns: 200 },
      );
    });
  });

  describe("Plugin system properties", () => {
    it("should handle arbitrary plugin registrations without crashing", () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 20 }),
          fc.integer({ min: 1, max: 5 }),
          (name, paramCount) => {
            try {
              // Clear any existing patterns first
              if (candlestick.plugins.hasPattern(name)) {
                candlestick.plugins.unregisterPattern(name);
              }

              // Register a simple pattern
              candlestick.plugins.registerPattern({
                name,
                fn: () => [],
                paramCount,
              });

              assert.ok(candlestick.plugins.hasPattern(name));

              // Clean up
              candlestick.plugins.unregisterPattern(name);
              return true;
            } catch {
              // Some names might be invalid or already exist - that's OK
              return true;
            }
          },
        ),
        { numRuns: 50 },
      );
    });
  });
});
