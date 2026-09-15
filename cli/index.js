#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require("fs");
const path = require("path");
const candlestick = require("../index.js");

const { version } = require("../package.json");
// Output formats with fixed metadata columns, which therefore always enrich.
const TABULAR_FORMATS = new Set(["table", "csv"]);

const BANNER_TITLE = `Candlestick Pattern Detection CLI v${version}`;
const BANNER_WIDTH = 62;
const BANNER_PAD = Math.max(0, BANNER_WIDTH - BANNER_TITLE.length);
const BANNER_LEFT = " ".repeat(Math.floor(BANNER_PAD / 2));
const BANNER_RIGHT = " ".repeat(Math.ceil(BANNER_PAD / 2));

const HELP_TEXT = `
╔${"═".repeat(BANNER_WIDTH)}╗
║${BANNER_LEFT}${BANNER_TITLE}${BANNER_RIGHT}║
╚${"═".repeat(BANNER_WIDTH)}╝

Usage: candlestick [options] [file]

Options:
  -i, --input <file>       Input CSV or JSON file with OHLC data
                           ("-", or omitted, reads from stdin)
  -o, --output <format>    Output format: json, table, csv (default: json)
  -p, --patterns <list>    Comma-separated pattern names (default: all)
  -c, --confidence <min>   Minimum confidence threshold 0-1 (default: 0)
  -t, --type <type>        Filter by type: reversal, continuation, neutral
  -d, --direction <dir>    Filter by direction: bullish, bearish, neutral
  --validate               Validate OHLC data before processing
  --metadata               Include pattern metadata in JSON output
                           (table and csv always include it)
  --help, -h               Show this help message
  --                       End of options; everything after is a file path,
                           for names that begin with a dash

Examples:
  candlestick -i data.json
  candlestick -i data.csv --patterns hammer,doji --output table
  candlestick -i data.json --confidence 0.8 --type reversal
  cat data.json | candlestick --output csv
  cat data.json | candlestick -i - --output csv
  candlestick -- -weird-name.json

Input Format:
  JSON: Array of {open, high, low, close} objects
  CSV:  Headers: open,high,low,close (first line)
  A .json or .csv extension picks the parser; otherwise it is detected
  from the first non-blank line, so both formats can be piped.

Supported Patterns (use exact names with --patterns):
  1-candle: hammer, bullishHammer, bearishHammer,
            invertedHammer, bullishInvertedHammer, bearishInvertedHammer,
            doji, marubozu, bullishMarubozu, bearishMarubozu,
            spinningTop, bullishSpinningTop, bearishSpinningTop
  2-candle: bullishEngulfing, bearishEngulfing,
            bullishHarami, bearishHarami,
            bullishKicker, bearishKicker,
            hangingMan, shootingStar,
            piercingLine, darkCloudCover,
            tweezersTop, tweezersBottom
  3-candle: morningStar, eveningStar, threeWhiteSoldiers, threeBlackCrows
`;

// Options that take a value, mapped to the key they set.
const VALUE_OPTIONS = new Map([
  ["-i", "input"],
  ["--input", "input"],
  ["-o", "output"],
  ["--output", "output"],
  ["-p", "patterns"],
  ["--patterns", "patterns"],
  ["-c", "confidence"],
  ["--confidence", "confidence"],
  ["-t", "type"],
  ["--type", "type"],
  ["-d", "direction"],
  ["--direction", "direction"],
]);

// Options that are their own value.
const FLAG_OPTIONS = new Map([
  ["-h", "help"],
  ["--help", "help"],
  ["--validate", "validate"],
  ["--metadata", "metadata"],
]);

// A token starting with "-" is a flag, not a value: without this check a
// forgotten value swallows the following flag, and that flag's effect is lost
// silently. "-" alone is the documented spelling for stdin, so it is the one
// exception. Anything else that legitimately starts with a dash goes after "--".
function isFlagLike(token) {
  return typeof token === "string" && token.startsWith("-") && token !== "-";
}

function parseArgs(argv = process.argv.slice(2)) {
  const args = {
    input: null,
    output: "json",
    patterns: null,
    confidence: 0,
    type: null,
    direction: null,
    validate: false,
    metadata: false,
    help: false,
  };

  // --help wins over any other parse error, so that a malformed command line
  // can still reach the usage text.
  if (argv.includes("--help") || argv.includes("-h")) {
    args.help = true;
    return args;
  }

  const operands = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    // End of options: everything after is an operand, dashes and all.
    if (arg === "--") {
      operands.push(...argv.slice(i + 1));
      break;
    }

    if (FLAG_OPTIONS.has(arg)) {
      args[FLAG_OPTIONS.get(arg)] = true;
      continue;
    }

    if (VALUE_OPTIONS.has(arg)) {
      const value = argv[i + 1];
      if (value === undefined || isFlagLike(value)) {
        throw new Error(`${arg} requires a value`);
      }
      i++;

      const key = VALUE_OPTIONS.get(arg);
      if (key === "confidence") {
        const parsed = Number.parseFloat(value);
        if (!Number.isFinite(parsed)) {
          throw new Error(`${arg} requires a number, got "${value}"`);
        }
        args.confidence = parsed;
      } else {
        args[key] = value;
      }
      continue;
    }

    // An unrecognized dashed token is a typo, not something to ignore.
    if (isFlagLike(arg)) {
      throw new Error(`Unknown option: ${arg}`);
    }

    operands.push(arg);
  }

  // The only operand this CLI accepts is an input path, equivalent to -i.
  if (operands.length > 0) {
    if (args.input !== null) {
      throw new Error(`Unexpected argument: ${operands[0]}`);
    }
    args.input = operands[0];
    if (operands.length > 1) {
      throw new Error(`Unexpected argument: ${operands[1]}`);
    }
  }

  return args;
}

// Picks a parser by looking at the payload, for input that has no usable file
// extension. The CSV format requires an open,high,low,close header line, and
// JSON input is an array or an object, so the first non-blank character
// separates them unambiguously.
function sniffFormat(data) {
  const firstLine = data.split("\n").find((line) => line.trim() !== "");
  if (firstLine === undefined) {
    // Nothing to go on. Stay on the JSON path so an empty input keeps its
    // existing error rather than gaining a CSV-flavoured one.
    return ".json";
  }
  const firstChar = firstLine.trim()[0];
  return firstChar === "{" || firstChar === "[" ? ".json" : ".csv";
}

function readInput(inputPath) {
  // One source of truth for "this is stdin": an omitted path and an explicit
  // "-" must agree, both when reading and when picking the parser.
  const fromStdin = !inputPath || inputPath === "-";

  const data = fromStdin
    ? fs.readFileSync(0, "utf-8")
    : fs.readFileSync(inputPath, "utf-8");

  // An explicit .json or .csv extension is authoritative: a malformed file
  // should report what it failed to be, not be reinterpreted as the other
  // format. Everything else -- stdin, no extension, an unrecognized one --
  // is decided by the payload.
  const ext = fromStdin ? null : path.extname(inputPath).toLowerCase();
  const explicit = ext === ".json" || ext === ".csv";
  const format = explicit ? ext : sniffFormat(data);
  const parse = () => (format === ".json" ? JSON.parse(data) : parseCSV(data));

  if (explicit) {
    return parse();
  }

  // The format was a guess, so a parse failure has two possible causes: the
  // input is malformed, or the guess was wrong. Saying which format was tried
  // keeps this at least as diagnostic as the "Unsupported file format" error
  // it replaces, which could only ever report the extension.
  try {
    return parse();
  } catch (cause) {
    const guessed = format === ".json" ? "JSON" : "CSV";
    throw new Error(
      `Could not parse input as ${guessed}, detected from its content: ` +
        `${cause.message}. Use a .json or .csv file extension to choose ` +
        `the parser explicitly.`,
      { cause },
    );
  }
}

function parseCSV(csvData) {
  const lines = csvData.trim().split("\n");
  const headers = lines[0]
    .toLowerCase()
    .split(",")
    .map((h) => h.trim());

  const openIdx = headers.indexOf("open");
  const highIdx = headers.indexOf("high");
  const lowIdx = headers.indexOf("low");
  const closeIdx = headers.indexOf("close");

  if (openIdx === -1 || highIdx === -1 || lowIdx === -1 || closeIdx === -1) {
    throw new Error("CSV must have headers: open,high,low,close");
  }

  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    return {
      open: parseFloat(values[openIdx]),
      high: parseFloat(values[highIdx]),
      low: parseFloat(values[lowIdx]),
      close: parseFloat(values[closeIdx]),
    };
  });
}

function getPatternList(patternsArg) {
  if (!patternsArg) {
    return candlestick.allPatterns;
  }

  const patternNames = patternsArg.split(",").map((p) => p.trim());
  return candlestick.allPatterns.filter((p) => patternNames.includes(p.name));
}

function processData(data, args) {
  // Validate if requested
  if (args.validate) {
    candlestick.utils.validateOHLCArray(data);
  }

  // Get patterns to detect
  const patterns = getPatternList(args.patterns);

  // Detect patterns
  let results = candlestick.patternChain(data, patterns);

  // Enrich with metadata. The table and CSV formats always print the type,
  // direction, confidence and strength columns, so they always need it —
  // otherwise those columns render empty and read as "could not classify".
  // Enrichment is a lookup against PATTERN_METADATA (~2.5% of detection time).
  const needsMetadata =
    args.metadata ||
    args.confidence > 0 ||
    args.type ||
    args.direction ||
    TABULAR_FORMATS.has(args.output);

  if (needsMetadata) {
    results = candlestick.metadata.enrichWithMetadata(results);
  }

  // Filter by confidence
  if (args.confidence > 0) {
    results = candlestick.metadata.filterByConfidence(results, args.confidence);
  }

  // Filter by type
  if (args.type) {
    results = candlestick.metadata.filterByType(results, args.type);
  }

  // Filter by direction
  if (args.direction) {
    results = candlestick.metadata.filterByDirection(results, args.direction);
  }

  return results;
}

function outputJSON(results) {
  console.log(JSON.stringify(results, null, 2));
}

function outputTable(results) {
  if (results.length === 0) {
    console.log("No patterns detected.");
    return;
  }

  const columns = [
    { header: "Index", min: 7, value: (r) => String(r.index) },
    { header: "Pattern", min: 19, value: (r) => String(r.pattern) },
    {
      header: "Type",
      min: 10,
      value: (r) => String((r.metadata || {}).type || "N/A"),
    },
    {
      header: "Confidence",
      min: 10,
      value: (r) => {
        const { confidence } = r.metadata || {};
        return confidence ? confidence.toFixed(2) : "N/A";
      },
    },
    {
      header: "Strength",
      min: 10,
      value: (r) => String((r.metadata || {}).strength || "N/A"),
    },
  ];

  // Widen each column to its longest cell so long pattern names cannot
  // overflow and break the box borders.
  const widths = columns.map((col) =>
    results.reduce(
      (width, r) => Math.max(width, col.value(r).length),
      Math.max(col.min, col.header.length),
    ),
  );

  const rule = (left, mid, right) =>
    left + widths.map((w) => "─".repeat(w + 2)).join(mid) + right;

  const center = (text, width) => {
    const pad = width - text.length;
    return (
      " ".repeat(Math.floor(pad / 2)) + text + " ".repeat(Math.ceil(pad / 2))
    );
  };

  const row = (cells) => `│ ${cells.join(" │ ")} │`;

  console.log("\n" + rule("┌", "┬", "┐"));
  console.log(row(columns.map((col, i) => center(col.header, widths[i]))));
  console.log(rule("├", "┼", "┤"));

  results.forEach((r) => {
    console.log(row(columns.map((col, i) => col.value(r).padEnd(widths[i]))));
  });

  console.log(rule("└", "┴", "┘"));
  console.log(`\nTotal patterns detected: ${results.length}\n`);
}

function outputCSV(results) {
  console.log("index,pattern,type,direction,confidence,strength");
  results.forEach((r) => {
    const meta = r.metadata || {};
    console.log(
      [
        r.index,
        r.pattern,
        meta.type || "",
        meta.direction || "",
        meta.confidence || "",
        meta.strength || "",
      ].join(","),
    );
  });
}

function main() {
  try {
    const args = parseArgs();

    if (args.help) {
      console.log(HELP_TEXT);
      process.exit(0);
    }

    // Read and parse input
    const data = readInput(args.input);

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Input must be a non-empty array of OHLC objects");
    }

    // Process data
    const results = processData(data, args);

    // Output results
    switch (args.output) {
      case "json":
        outputJSON(results);
        break;
      case "table":
        outputTable(results);
        break;
      case "csv":
        outputCSV(results);
        break;
      default:
        throw new Error(`Unsupported output format: ${args.output}`);
    }
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  main,
  parseArgs,
  readInput,
  processData,
  outputJSON,
  outputTable,
  outputCSV,
};
