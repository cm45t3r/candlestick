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

Usage: candlestick [options]

Options:
  -i, --input <file>       Input CSV or JSON file with OHLC data
  -o, --output <format>    Output format: json, table, csv (default: json)
  -p, --patterns <list>    Comma-separated pattern names (default: all)
  -c, --confidence <min>   Minimum confidence threshold 0-1 (default: 0)
  -t, --type <type>        Filter by type: reversal, continuation, neutral
  -d, --direction <dir>    Filter by direction: bullish, bearish, neutral
  --validate               Validate OHLC data before processing
  --metadata               Include pattern metadata in JSON output
                           (table and csv always include it)
  --help, -h               Show this help message

Examples:
  candlestick -i data.json
  candlestick -i data.csv --patterns hammer,doji --output table
  candlestick -i data.json --confidence 0.8 --type reversal
  cat data.json | candlestick --output csv

Input Format:
  JSON: Array of {open, high, low, close} objects
  CSV:  Headers: open,high,low,close (first line)

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

function parseArgs() {
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

  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];

    if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else if (arg === "-i" || arg === "--input") {
      args.input = process.argv[++i];
    } else if (arg === "-o" || arg === "--output") {
      args.output = process.argv[++i];
    } else if (arg === "-p" || arg === "--patterns") {
      args.patterns = process.argv[++i];
    } else if (arg === "-c" || arg === "--confidence") {
      args.confidence = parseFloat(process.argv[++i]);
    } else if (arg === "-t" || arg === "--type") {
      args.type = process.argv[++i];
    } else if (arg === "-d" || arg === "--direction") {
      args.direction = process.argv[++i];
    } else if (arg === "--validate") {
      args.validate = true;
    } else if (arg === "--metadata") {
      args.metadata = true;
    }
  }

  return args;
}

function readInput(inputPath) {
  let data;

  if (!inputPath || inputPath === "-") {
    // Read from stdin
    data = fs.readFileSync(0, "utf-8");
  } else {
    data = fs.readFileSync(inputPath, "utf-8");
  }

  const ext = inputPath ? path.extname(inputPath).toLowerCase() : ".json";

  if (ext === ".json" || !inputPath) {
    return JSON.parse(data);
  } else if (ext === ".csv") {
    return parseCSV(data);
  } else {
    throw new Error(`Unsupported file format: ${ext}. Use .json or .csv`);
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
