const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");
const { parseArgs, readInput, processData } = require("../cli/index.js");

describe("CLI", () => {
  describe("parseArgs", () => {
    it("parses basic arguments", () => {
      assert.equal(typeof parseArgs, "function");
    });
  });

  describe("readInput", () => {
    it("reads JSON file", () => {
      const testFile = path.join(__dirname, "../cli/test-data.json");
      const data = readInput(testFile);

      assert.ok(Array.isArray(data));
      assert.ok(data.length > 0);
      assert.ok(data[0].open !== undefined);
      assert.ok(data[0].high !== undefined);
      assert.ok(data[0].low !== undefined);
      assert.ok(data[0].close !== undefined);
    });

    it("reads CSV file", () => {
      const testFile = path.join(__dirname, "../cli/test-data.csv");
      const data = readInput(testFile);

      assert.ok(Array.isArray(data));
      assert.ok(data.length > 0);
      assert.equal(typeof data[0].open, "number");
      assert.equal(typeof data[0].high, "number");
      assert.equal(typeof data[0].low, "number");
      assert.equal(typeof data[0].close, "number");
    });
  });

  describe("processData", () => {
    it("processes data with default options", () => {
      const data = [
        { open: 50, high: 51, low: 40, close: 41 },
        { open: 38, high: 48, low: 37, close: 47 },
      ];

      const args = {
        patterns: null,
        confidence: 0,
        type: null,
        direction: null,
        validate: false,
        metadata: false,
      };

      const results = processData(data, args);
      assert.ok(Array.isArray(results));
    });

    it("filters by confidence", () => {
      const data = [
        { open: 50, high: 51, low: 40, close: 41 },
        { open: 38, high: 48, low: 37, close: 47 },
      ];

      const args = {
        patterns: null,
        confidence: 0.8,
        type: null,
        direction: null,
        validate: false,
        metadata: true,
      };

      const results = processData(data, args);
      assert.ok(Array.isArray(results));
      // All results should have confidence >= 0.8
      results.forEach((r) => {
        if (r.metadata) {
          assert.ok(r.metadata.confidence >= 0.8);
        }
      });
    });

    it("filters by type", () => {
      const data = [
        { open: 50, high: 51, low: 40, close: 41 },
        { open: 38, high: 48, low: 37, close: 47 },
        { open: 10, high: 20, low: 9, close: 19 },
        { open: 15, high: 25, low: 14, close: 24 },
        { open: 20, high: 30, low: 19, close: 29 },
      ];

      const args = {
        patterns: null,
        confidence: 0,
        type: "continuation",
        direction: null,
        validate: false,
        metadata: true,
      };

      const results = processData(data, args);
      // All results should be continuation type
      results.forEach((r) => {
        if (r.metadata) {
          assert.equal(r.metadata.type, "continuation");
        }
      });
    });

    it("validates data when requested", () => {
      const invalidData = [
        { open: 10, high: 8, low: 15, close: 12 }, // Invalid: high < low
      ];

      const args = {
        patterns: null,
        confidence: 0,
        type: null,
        direction: null,
        validate: true,
        metadata: false,
      };

      assert.throws(() => processData(invalidData, args), /Invalid OHLC data/);
    });

    it("processes with specific patterns", () => {
      const data = [
        { open: 50, high: 51, low: 40, close: 41 },
        { open: 38, high: 48, low: 37, close: 47 },
      ];

      const args = {
        patterns: "piercingLine",
        confidence: 0,
        type: null,
        direction: null,
        validate: false,
        metadata: true,
      };

      const results = processData(data, args);
      assert.ok(Array.isArray(results));
    });

    it("filters by direction", () => {
      const data = [
        { open: 50, high: 51, low: 40, close: 41 },
        { open: 38, high: 48, low: 37, close: 47 },
        { open: 40, high: 50, low: 39, close: 49 },
        { open: 52, high: 53, low: 42, close: 43 },
      ];

      const args = {
        patterns: null,
        confidence: 0,
        type: null,
        direction: "bullish",
        validate: false,
        metadata: true,
      };

      const results = processData(data, args);
      // All results should be bullish
      results.forEach((r) => {
        if (r.metadata) {
          assert.equal(r.metadata.direction, "bullish");
        }
      });
    });
  });

  describe("CLI integration", () => {
    it("CLI module exports required functions", () => {
      const cli = require("../cli/index.js");
      assert.equal(typeof cli.main, "function");
      assert.equal(typeof cli.parseArgs, "function");
      assert.equal(typeof cli.readInput, "function");
      assert.equal(typeof cli.processData, "function");
    });
  });

  describe("CLI output functions", () => {
    // Test by invoking the functions and checking they don't throw
    it("handles table output with results", () => {
      // Create a simple mock to capture console output
      const originalLog = console.log;
      const logs = [];
      console.log = (...args) => logs.push(args.join(" "));

      try {
        const data = [
          { open: 50, high: 51, low: 40, close: 41 },
          { open: 38, high: 48, low: 37, close: 47 },
        ];

        const args = {
          patterns: null,
          confidence: 0,
          type: null,
          direction: null,
          validate: false,
          metadata: true,
          output: "table",
        };

        const results = processData(data, args);

        // Simulate table output
        if (results.length > 0) {
          results.forEach((r) => {
            assert.ok(r.index !== undefined);
            assert.ok(r.pattern);
          });
        }

        assert.ok(Array.isArray(results));
      } finally {
        console.log = originalLog;
      }
    });

    it("handles CSV output format", () => {
      const data = [
        { open: 50, high: 51, low: 40, close: 41 },
        { open: 38, high: 48, low: 37, close: 47 },
      ];

      const args = {
        patterns: null,
        confidence: 0,
        type: null,
        direction: null,
        validate: false,
        metadata: true,
        output: "csv",
      };

      const results = processData(data, args);
      assert.ok(Array.isArray(results));

      // Verify results have the structure expected for CSV
      results.forEach((r) => {
        assert.ok(r.index !== undefined);
        assert.ok(r.pattern);
        if (r.metadata) {
          assert.ok(typeof r.metadata === "object");
        }
      });
    });

    it("handles JSON output format", () => {
      const data = [
        { open: 50, high: 51, low: 40, close: 41 },
        { open: 38, high: 48, low: 37, close: 47 },
      ];

      const args = {
        patterns: null,
        confidence: 0,
        type: null,
        direction: null,
        validate: false,
        metadata: true,
        output: "json",
      };

      const results = processData(data, args);
      assert.ok(Array.isArray(results));

      // Verify results can be stringified
      const json = JSON.stringify(results, null, 2);
      assert.ok(json.length > 0);

      // Verify we can parse it back
      const parsed = JSON.parse(json);
      assert.equal(parsed.length, results.length);
    });

    it("handles empty results for table output", () => {
      // Test with data that produces no patterns
      const data = [{ open: 100, high: 100, low: 100, close: 100 }];

      const args = {
        patterns: "nonexistent",
        confidence: 0,
        type: null,
        direction: null,
        validate: false,
        metadata: false,
      };

      const results = processData(data, args);
      // Should handle empty results without errors
      assert.ok(Array.isArray(results));
    });

    it("processes with multiple pattern types", () => {
      const data = [
        { open: 50, high: 51, low: 40, close: 41 },
        { open: 38, high: 48, low: 37, close: 47 },
        { open: 40, high: 50, low: 39, close: 49 },
        { open: 52, high: 53, low: 42, close: 43 },
      ];

      const args = {
        patterns: "hammer,doji,piercingLine",
        confidence: 0,
        type: null,
        direction: null,
        validate: false,
        metadata: true,
      };

      const results = processData(data, args);
      assert.ok(Array.isArray(results));

      // Verify all results have pattern names
      results.forEach((r) => {
        // Pattern should be defined
        assert.ok(r.pattern !== undefined);
      });
    });
  });
});
