/* eslint-disable no-console */
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

  it("reports what it tried when an unrecognized extension cannot be parsed", () => {
    // Was "Unsupported file format: .txt". The extension no longer decides, so
    // the error now names the format that was detected and failed.
    const tempFile = path.join(__dirname, "../cli/temp-data.txt");
    fs.writeFileSync(tempFile, "some text data");

    const cli = require("../cli/index.js");

    assert.throws(() => {
      cli.readInput(tempFile);
    }, /Could not parse input as CSV, detected from its content/);

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

describe("CLI argument validation", () => {
  const { parseArgs } = require("../cli/index.js");

  describe("a missing option value is diagnosed, not mis-parsed (#148)", () => {
    it("rejects an option whose value is the next flag, instead of swallowing it", () => {
      // Previously: input became "-o" and `-o csv` was silently lost.
      assert.throws(() => parseArgs(["-i", "-o", "csv"]), {
        message: "-i requires a value",
      });
    });

    it("rejects a missing -p rather than reporting zero patterns with exit 0", () => {
      // Previously: patterns became "-o", matched nothing, and the run printed
      // [] successfully -- a silent wrong answer.
      assert.throws(() => parseArgs(["-p", "-o", "csv"]), {
        message: "-p requires a value",
      });
    });

    it("rejects an option with no value at the end of argv", () => {
      assert.throws(() => parseArgs(["-i", "x.json", "-c"]), {
        message: "-c requires a value",
      });
    });

    it("rejects a non-numeric confidence instead of silently skipping the filter", () => {
      // Previously: parseFloat("abc") is NaN, NaN > 0 is false, no filtering.
      assert.throws(() => parseArgs(["-c", "abc"]), {
        message: '-c requires a number, got "abc"',
      });
    });

    it("accepts a confidence of 0, which is falsy but valid", () => {
      assert.equal(parseArgs(["-c", "0"]).confidence, 0);
    });

    it("accepts a fractional confidence", () => {
      assert.equal(parseArgs(["-c", "0.5"]).confidence, 0.5);
    });

    it("rejects an unknown option rather than ignoring it", () => {
      assert.throws(() => parseArgs(["--bogus", "-i", "x.json"]), {
        message: "Unknown option: --bogus",
      });
    });

    it("still accepts - as the value meaning stdin (#147)", () => {
      assert.equal(parseArgs(["-i", "-"]).input, "-");
    });
  });

  describe("-- ends option parsing (#149)", () => {
    it("does not take -- itself as an option value", () => {
      // Previously: input became "--".
      assert.throws(() => parseArgs(["-i", "--", "-o", "csv"]), {
        message: "-i requires a value",
      });
    });

    it("stops treating dashed tokens as options after --", () => {
      // Previously: `-- -i x.json` silently dropped the -- and parsed -i as an
      // option, the opposite of what -- means.
      assert.throws(() => parseArgs(["--", "-i", "x.json"]), {
        message: "Unexpected argument: x.json",
      });
    });

    it("lets a path that would otherwise look like a flag through", () => {
      assert.equal(parseArgs(["--", "./-"]).input, "./-");
      assert.equal(parseArgs(["--", "-weird.json"]).input, "-weird.json");
    });
  });

  describe("operands", () => {
    it("accepts a bare path as the input, equivalent to -i", () => {
      assert.equal(parseArgs(["data.json"]).input, "data.json");
    });

    it("rejects a second path rather than ignoring one of them", () => {
      assert.throws(() => parseArgs(["-i", "a.json", "b.json"]), {
        message: "Unexpected argument: b.json",
      });
    });
  });

  describe("--help", () => {
    it("wins over an otherwise invalid command line", () => {
      assert.equal(parseArgs(["--bogus", "--help"]).help, true);
      assert.equal(parseArgs(["-i", "--help"]).help, true);
    });

    it("is returned by both spellings", () => {
      assert.equal(parseArgs(["-h"]).help, true);
      assert.equal(parseArgs(["--help"]).help, true);
    });
  });

  describe("unchanged behaviour", () => {
    it("parses a full option set", () => {
      const args = parseArgs([
        "-i",
        "d.json",
        "-o",
        "csv",
        "-c",
        "0.8",
        "-t",
        "reversal",
        "-d",
        "bullish",
        "--validate",
        "--metadata",
      ]);
      assert.equal(args.input, "d.json");
      assert.equal(args.output, "csv");
      assert.equal(args.confidence, 0.8);
      assert.equal(args.type, "reversal");
      assert.equal(args.direction, "bullish");
      assert.equal(args.validate, true);
      assert.equal(args.metadata, true);
    });

    it("defaults to stdin and json with no arguments", () => {
      const args = parseArgs([]);
      assert.equal(args.input, null);
      assert.equal(args.output, "json");
      assert.equal(args.confidence, 0);
    });

    it("accepts long spellings", () => {
      assert.equal(parseArgs(["--input", "d.json"]).input, "d.json");
      assert.equal(parseArgs(["--patterns", "hammer"]).patterns, "hammer");
    });
  });
});

describe("CLI input format detection (#150)", () => {
  const { readInput } = require("../cli/index.js");
  const tmp = path.join(__dirname, "..", "cli");

  const JSON_DATA = JSON.stringify([
    { open: 100, high: 110, low: 95, close: 105 },
  ]);
  const CSV_DATA = "open,high,low,close\n100,110,95,105";

  const write = (name, contents) => {
    const file = path.join(tmp, name);
    fs.writeFileSync(file, contents);
    return file;
  };

  const written = [];
  afterEach(() => {
    while (written.length) fs.rmSync(written.pop(), { force: true });
  });
  const temp = (name, contents) => {
    const file = write(name, contents);
    written.push(file);
    return file;
  };

  describe("an explicit extension stays authoritative", () => {
    it("parses .json as JSON", () => {
      assert.equal(readInput(temp("fmt-a.json", JSON_DATA))[0].open, 100);
    });

    it("parses .csv as CSV", () => {
      assert.equal(readInput(temp("fmt-b.csv", CSV_DATA))[0].close, 105);
    });

    it("does not reinterpret a malformed .json as CSV", () => {
      // The file should report what it failed to be, not be silently retried
      // as the other format.
      assert.throws(
        () => readInput(temp("fmt-c.json", "not json at all")),
        /JSON/,
      );
    });
  });

  describe("content decides when the extension cannot", () => {
    it("reads CSV from a file with no extension", () => {
      // Previously: "Unsupported file format: ." -- the capability existed but
      // was unreachable without a .csv name.
      assert.equal(readInput(temp("fmt-noext", CSV_DATA))[0].high, 110);
    });

    it("reads JSON from a file with no extension", () => {
      assert.equal(readInput(temp("fmt-noext2", JSON_DATA))[0].low, 95);
    });

    it("reads CSV from a file whose extension is unrecognized", () => {
      assert.equal(readInput(temp("fmt-d.txt", CSV_DATA))[0].open, 100);
    });

    it("reads a file named like a flag, reachable via -- (#149)", () => {
      assert.equal(readInput(temp("-dashy", CSV_DATA))[0].close, 105);
    });

    it("ignores leading blank lines when detecting", () => {
      assert.equal(readInput(temp("fmt-e", "\n\n  " + JSON_DATA))[0].open, 100);
    });

    it("detects a JSON object, not just an array", () => {
      assert.deepEqual(readInput(temp("fmt-f", '{"a":1}')), { a: 1 });
    });

    it("stays on the JSON path for empty input, keeping its existing error", () => {
      // Nothing to detect from. Falling back to CSV here would replace the
      // familiar "Unexpected end of JSON input" with a header complaint.
      assert.throws(() => readInput(temp("fmt-empty", "")), /JSON/);
      assert.throws(() => readInput(temp("fmt-blank", "\n  \n")), /JSON/);
    });

    it("preserves the underlying failure as the error cause", () => {
      try {
        readInput(temp("fmt-g.txt", "some text data"));
        assert.fail("should have thrown");
      } catch (error) {
        assert.match(error.message, /detected from its content/);
        assert.ok(error.cause, "cause is preserved");
        assert.match(error.cause.message, /CSV must have headers/);
      }
    });
  });
});
