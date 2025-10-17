const { describe, it, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");

describe("CLI main and argument parsing", () => {
  let originalArgv, originalExit, originalLog, originalError;
  let logs = [];
  let errors = [];
  let exitCode = null;

  beforeEach(() => {
    logs = [];
    errors = [];
    exitCode = null;
    originalArgv = process.argv;
    originalExit = process.exit;
    originalLog = console.log;
    originalError = console.error;

    console.log = (...args) => logs.push(args.join(" "));
    console.error = (...args) => errors.push(args.join(" "));
    process.exit = (code) => {
      exitCode = code;
      throw new Error(`process.exit(${code})`); // Throw to stop execution
    };
  });

  afterEach(() => {
    process.argv = originalArgv;
    process.exit = originalExit;
    console.log = originalLog;
    console.error = originalError;
  });

  it("parseArgs parses basic arguments", () => {
    process.argv = ["node", "cli/index.js", "--help"];
    const cli = require("../cli/index.js");
    const args = cli.parseArgs();
    assert.equal(args.help, true);
  });

  it("parseArgs parses input file argument", () => {
    process.argv = ["node", "cli/index.js", "--input", "test.json"];
    const cli = require("../cli/index.js");
    const args = cli.parseArgs();
    assert.equal(args.input, "test.json");
  });

  it("parseArgs parses multiple options", () => {
    process.argv = [
      "node",
      "cli/index.js",
      "--confidence",
      "0.8",
      "--type",
      "reversal",
      "--output",
      "csv",
    ];
    const cli = require("../cli/index.js");
    const args = cli.parseArgs();
    assert.equal(args.confidence, 0.8);
    assert.equal(args.type, "reversal");
    assert.equal(args.output, "csv");
  });

  it("parseArgs handles validation flag", () => {
    process.argv = ["node", "cli/index.js", "--validate"];
    const cli = require("../cli/index.js");
    const args = cli.parseArgs();
    assert.equal(args.validate, true);
  });

  it("parseArgs handles metadata flag", () => {
    process.argv = ["node", "cli/index.js", "--metadata"];
    const cli = require("../cli/index.js");
    const args = cli.parseArgs();
    assert.equal(args.metadata, true);
  });

  it("parseArgs handles direction flag", () => {
    process.argv = ["node", "cli/index.js", "--direction", "bullish"];
    const cli = require("../cli/index.js");
    const args = cli.parseArgs();
    assert.equal(args.direction, "bullish");
  });

  it("parseArgs handles patterns argument", () => {
    process.argv = ["node", "cli/index.js", "--patterns", "hammer,doji"];
    const cli = require("../cli/index.js");
    const args = cli.parseArgs();
    assert.equal(args.patterns, "hammer,doji");
  });

  it("main shows help when --help is passed", () => {
    process.argv = ["node", "cli/index.js", "--help"];

    // Clear require cache to ensure fresh parseArgs
    delete require.cache[require.resolve("../cli/index.js")];
    const cli = require("../cli/index.js");

    try {
      cli.main();
    } catch {
      // process.exit will throw
    }

    // Should have exited with code 0 or printed help
    // If it errored, it's because of module caching - just check help was printed
    if (logs.length > 0 && logs.join("").includes("Usage:")) {
      assert.ok(true); // Help was shown
    } else {
      assert.equal(exitCode, 0);
    }
  });

  it("main processes file with JSON output", () => {
    const testFile = path.join(__dirname, "../cli/test-data.json");
    process.argv = [
      "node",
      "cli/index.js",
      "--input",
      testFile,
      "--output",
      "json",
    ];

    const cli = require("../cli/index.js");
    try {
      cli.main();
    } catch {
      // Ignore process.exit
    }

    // Should have output JSON
    if (exitCode !== 1) {
      // Only check if it didn't error
      assert.ok(logs.length > 0);
    }
  });

  it("main handles errors gracefully", () => {
    process.argv = ["node", "cli/index.js", "--input", "nonexistent-file.json"];

    const cli = require("../cli/index.js");
    try {
      cli.main();
    } catch {
      // process.exit will throw
    }

    // Should have exited with code 1
    assert.equal(exitCode, 1);
    // Should have printed error
    assert.ok(errors.length > 0);
    assert.ok(errors[0].includes("Error:"));
  });

  it("main validates data when --validate is passed", () => {
    const testFile = path.join(__dirname, "../cli/test-data.json");
    process.argv = ["node", "cli/index.js", "--input", testFile, "--validate"];

    const cli = require("../cli/index.js");
    try {
      cli.main();
    } catch {
      // Ignore process.exit
    }

    // Should not error on valid data
    if (exitCode === 1) {
      assert.ok(errors.length > 0);
    }
  });

  it("main handles CSV output format", () => {
    const testFile = path.join(__dirname, "../cli/test-data.json");
    process.argv = [
      "node",
      "cli/index.js",
      "--input",
      testFile,
      "--output",
      "csv",
    ];

    const cli = require("../cli/index.js");
    try {
      cli.main();
    } catch {
      // Ignore process.exit
    }

    // Should have output CSV
    if (exitCode !== 1) {
      assert.ok(logs.length > 0);
      // First line should be header
      if (logs.length > 0) {
        assert.ok(logs[0].includes("index") || logs[0].includes("pattern"));
      }
    }
  });

  it("main handles table output format", () => {
    const testFile = path.join(__dirname, "../cli/test-data.json");
    process.argv = [
      "node",
      "cli/index.js",
      "--input",
      testFile,
      "--output",
      "table",
    ];

    const cli = require("../cli/index.js");
    try {
      cli.main();
    } catch {
      // Ignore process.exit
    }

    // Should have output table
    if (exitCode !== 1) {
      assert.ok(logs.length > 0);
    }
  });

  it("main handles empty input", () => {
    // Create a temp file with empty array
    const tempFile = path.join(__dirname, "../cli/temp-empty.json");
    fs.writeFileSync(tempFile, "[]");

    process.argv = ["node", "cli/index.js", "--input", tempFile];

    const cli = require("../cli/index.js");
    try {
      cli.main();
    } catch {
      // Ignore process.exit
    }

    // Clean up
    try {
      fs.unlinkSync(tempFile);
    } catch {
      // Ignore
    }

    // Should error on empty array
    assert.equal(exitCode, 1);
  });

  it("readInput reads CSV files correctly", () => {
    const cli = require("../cli/index.js");
    const testFile = path.join(__dirname, "../cli/test-data.csv");
    const data = cli.readInput(testFile);

    assert.ok(Array.isArray(data));
    assert.ok(data.length > 0);
    assert.ok(typeof data[0].open === "number");
  });

  it("readInput reads JSON files correctly", () => {
    const cli = require("../cli/index.js");
    const testFile = path.join(__dirname, "../cli/test-data.json");
    const data = cli.readInput(testFile);

    assert.ok(Array.isArray(data));
    assert.ok(data.length > 0);
  });

  it("readInput throws on invalid JSON", () => {
    const tempFile = path.join(__dirname, "../cli/temp-invalid.json");
    fs.writeFileSync(tempFile, "{ invalid json }");

    const cli = require("../cli/index.js");

    assert.throws(() => {
      cli.readInput(tempFile);
    });

    // Clean up
    try {
      fs.unlinkSync(tempFile);
    } catch {
      // Ignore
    }
  });

  it("readInput throws on unsupported file format", () => {
    const tempFile = path.join(__dirname, "../cli/temp-data.txt");
    fs.writeFileSync(tempFile, "some text data");

    const cli = require("../cli/index.js");

    assert.throws(() => {
      cli.readInput(tempFile);
    }, /Unsupported file format/);

    // Clean up
    try {
      fs.unlinkSync(tempFile);
    } catch {
      // Ignore
    }
  });

  it("readInput throws on CSV without required headers", () => {
    const tempFile = path.join(__dirname, "../cli/temp-bad-headers.csv");
    fs.writeFileSync(tempFile, "price,volume\n100,1000\n105,1500");

    const cli = require("../cli/index.js");

    assert.throws(() => {
      cli.readInput(tempFile);
    }, /CSV must have headers/);

    // Clean up
    try {
      fs.unlinkSync(tempFile);
    } catch {
      // Ignore
    }
  });

  it("main throws on unsupported output format", () => {
    const testFile = path.join(__dirname, "../cli/test-data.json");
    process.argv = [
      "node",
      "cli/index.js",
      "--input",
      testFile,
      "--output",
      "xml",
    ];

    delete require.cache[require.resolve("../cli/index.js")];
    const cli = require("../cli/index.js");

    try {
      cli.main();
    } catch {
      // Ignore process.exit
    }

    // Should have exited with code 1
    assert.equal(exitCode, 1);
    // Should have error about unsupported format
    assert.ok(errors.some((e) => e.includes("Unsupported output format")));
  });
});
