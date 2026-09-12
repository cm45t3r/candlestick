/* eslint-disable no-console */
const { describe, it, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");

describe("CLI Output Functions", () => {
  let originalLog, originalError, originalExit;
  let logs = [];
  let errors = [];

  beforeEach(() => {
    // Mock console.log and console.error
    logs = [];
    errors = [];
    originalLog = console.log;
    originalError = console.error;
    originalExit = process.exit;

    console.log = (...args) => logs.push(args.join(" "));
    console.error = (...args) => errors.push(args.join(" "));
    process.exit = () => {
      /* mock exit */
    };
  });

  afterEach(() => {
    console.log = originalLog;
    console.error = originalError;
    process.exit = originalExit;
  });

  it("outputs results in table format", () => {
    // Import CLI module
    const cli = require("../cli/index.js");

    const testData = [
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
    };

    const results = cli.processData(testData, args);

    // Actually call outputTable
    cli.outputTable(results);

    // Verify console.log was called
    assert.ok(logs.length > 0);
  });

  it("keeps table borders aligned when a pattern name is wider than the column", () => {
    const cli = require("../cli/index.js");

    cli.outputTable([
      { index: 0, pattern: "bearishInvertedHammer" },
      { index: 1, pattern: "doji" },
    ]);

    const box = logs.filter((line) => /^[┌├└│]/.test(line.trim()));
    assert.equal(box.length, 6, "expected 3 rules, a header and 2 data rows");

    const widths = new Set(box.map((line) => [...line.trim()].length));
    assert.equal(widths.size, 1, `border widths differ: ${[...widths]}`);

    const longRow = box.find((line) => line.includes("bearishInvertedHammer"));
    assert.ok(longRow.trim().endsWith("│"), "long row must close its border");
  });

  it("populates the metadata columns for table and csv without --metadata", () => {
    const cli = require("../cli/index.js");

    const testData = [
      { open: 50, high: 51, low: 40, close: 41 },
      { open: 38, high: 48, low: 37, close: 47 },
    ];
    const baseArgs = {
      patterns: null,
      confidence: 0,
      type: null,
      direction: null,
      validate: false,
      metadata: false,
    };

    for (const output of ["table", "csv"]) {
      const results = cli.processData(testData, { ...baseArgs, output });
      assert.ok(results.length > 0, `no patterns detected for ${output}`);
      for (const r of results) {
        assert.ok(r.metadata, `${output}: missing metadata on ${r.pattern}`);
        assert.ok(r.metadata.type, `${output}: missing type`);
        assert.equal(typeof r.metadata.confidence, "number");
      }
    }

    // The CSV header must keep its six fixed columns, in order.
    logs = [];
    cli.outputCSV(cli.processData(testData, { ...baseArgs, output: "csv" }));
    assert.equal(
      logs[0],
      "index,pattern,type,direction,confidence,strength",
      "CSV column contract changed",
    );
    assert.ok(
      logs.slice(1).every((line) => line.split(",").length === 6),
      "every CSV row must have six fields",
    );
  });

  it("leaves json output untouched unless --metadata is passed", () => {
    const cli = require("../cli/index.js");

    const testData = [
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
      output: "json",
    };

    const plain = cli.processData(testData, args);
    assert.ok(plain.length > 0);
    assert.ok(
      plain.every((r) => r.metadata === undefined),
      "json must not gain metadata implicitly",
    );

    const enriched = cli.processData(testData, { ...args, metadata: true });
    assert.ok(enriched.every((r) => r.metadata));
  });

  it('reads stdin both when the path is omitted and when it is "-"', () => {
    const cli = require("../cli/index.js");
    const fs = require("node:fs");

    const payload = '[{"open":1,"high":2,"low":0,"close":1.5}]';
    const real = fs.readFileSync;
    const seen = [];
    fs.readFileSync = (fd) => {
      seen.push(fd);
      return payload;
    };

    try {
      // Both spellings must read fd 0 and parse it as JSON. "-" used to read
      // stdin correctly and then die on "Unsupported file format: ".
      for (const path of [null, "-"]) {
        const data = cli.readInput(path);
        assert.equal(data.length, 1);
        assert.equal(data[0].open, 1);
      }
    } finally {
      fs.readFileSync = real;
    }

    assert.deepEqual(seen, [0, 0], "both calls must read file descriptor 0");
  });

  it("outputs results in CSV format", () => {
    const cli = require("../cli/index.js");

    const testData = [
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
    };

    const results = cli.processData(testData, args);

    // Actually call outputCSV
    cli.outputCSV(results);

    // Verify console.log was called
    assert.ok(logs.length > 0);
    // First line should be the header
    assert.ok(logs[0].includes("index"));
  });

  it("outputs results in JSON format", () => {
    const cli = require("../cli/index.js");

    const testData = [
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
    };

    const results = cli.processData(testData, args);

    // Actually call outputJSON
    cli.outputJSON(results);

    // Verify console.log was called
    assert.ok(logs.length > 0);
  });

  it("handles stdin input", () => {
    // Test that processData works with data from stdin
    const testData = [
      { open: 100, high: 110, low: 95, close: 105 },
      { open: 105, high: 115, low: 100, close: 110 },
    ];

    const cli = require("../cli/index.js");
    const results = cli.processData(testData, {
      patterns: null,
      confidence: 0,
      type: null,
      direction: null,
      validate: false,
      metadata: false,
    });

    assert.ok(Array.isArray(results));
  });

  it("validates input data when requested", () => {
    const cli = require("../cli/index.js");

    const invalidData = [
      { open: 10, high: 5, low: 15, close: 12 }, // Invalid: high < low
    ];

    assert.throws(() => {
      cli.processData(invalidData, {
        patterns: null,
        confidence: 0,
        type: null,
        direction: null,
        validate: true,
        metadata: false,
      });
    }, /Invalid OHLC data/);
  });

  it("processes specific patterns", () => {
    const cli = require("../cli/index.js");

    const testData = [
      { open: 50, high: 51, low: 40, close: 41 },
      { open: 38, high: 48, low: 37, close: 47 },
    ];

    const results = cli.processData(testData, {
      patterns: "hammer,piercingLine",
      confidence: 0,
      type: null,
      direction: null,
      validate: false,
      metadata: true,
    });

    assert.ok(Array.isArray(results));
  });

  it("filters by minimum confidence", () => {
    const cli = require("../cli/index.js");

    const testData = [
      { open: 50, high: 51, low: 40, close: 41 },
      { open: 38, high: 48, low: 37, close: 47 },
      { open: 40, high: 50, low: 39, close: 49 },
      { open: 52, high: 53, low: 42, close: 43 },
    ];

    const results = cli.processData(testData, {
      patterns: null,
      confidence: 0.8,
      type: null,
      direction: null,
      validate: false,
      metadata: true,
    });

    // All results should have confidence >= 0.8
    results.forEach((r) => {
      if (r.metadata) {
        assert.ok(r.metadata.confidence >= 0.8);
      }
    });
  });

  it("filters by pattern type", () => {
    const cli = require("../cli/index.js");

    const testData = [
      { open: 50, high: 51, low: 40, close: 41 },
      { open: 38, high: 48, low: 37, close: 47 },
      { open: 40, high: 50, low: 39, close: 49 },
      { open: 52, high: 53, low: 42, close: 43 },
    ];

    const results = cli.processData(testData, {
      patterns: null,
      confidence: 0,
      type: "reversal",
      direction: null,
      validate: false,
      metadata: true,
    });

    // All results should be reversal type
    results.forEach((r) => {
      if (r.metadata) {
        assert.equal(r.metadata.type, "reversal");
      }
    });
  });

  it("filters by direction", () => {
    const cli = require("../cli/index.js");

    const testData = [
      { open: 50, high: 51, low: 40, close: 41 },
      { open: 38, high: 48, low: 37, close: 47 },
      { open: 40, high: 50, low: 39, close: 49 },
      { open: 52, high: 53, low: 42, close: 43 },
    ];

    const results = cli.processData(testData, {
      patterns: null,
      confidence: 0,
      type: null,
      direction: "bullish",
      validate: false,
      metadata: true,
    });

    // All results should be bullish
    results.forEach((r) => {
      if (r.metadata) {
        assert.equal(r.metadata.direction, "bullish");
      }
    });
  });

  it("handles empty results gracefully", () => {
    const cli = require("../cli/index.js");

    const testData = [
      { open: 100, high: 100, low: 100, close: 100 }, // No patterns
    ];

    const results = cli.processData(testData, {
      patterns: "nonexistent",
      confidence: 0,
      type: null,
      direction: null,
      validate: false,
      metadata: false,
    });

    assert.ok(Array.isArray(results));

    // Test table output with empty results
    cli.outputTable(results);
    assert.ok(logs.length > 0);
    assert.ok(logs[0].includes("No patterns"));
  });
});
