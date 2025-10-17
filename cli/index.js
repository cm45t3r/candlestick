#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require("fs");
const path = require("path");
const candlestick = require("../index.js");

const HELP_TEXT = `
╔══════════════════════════════════════════════════════════════╗
║          Candlestick Pattern Detection CLI v1.1.0            ║
╚══════════════════════════════════════════════════════════════╝

Usage: candlestick [options]

Options:
  -i, --input <file>       Input CSV or JSON file with OHLC data
  -o, --output <format>    Output format: json, table, csv (default: json)
  -p, --patterns <list>    Comma-separated pattern names (default: all)
  -c, --confidence <min>   Minimum confidence threshold 0-1 (default: 0)
  -t, --type <type>        Filter by type: reversal, continuation, neutral
  -d, --direction <dir>    Filter by direction: bullish, bearish, neutral
  --validate               Validate OHLC data before processing
  --metadata               Include pattern metadata in output
  --help                   Show this help message

Examples:
  candlestick -i data.json
  candlestick -i data.csv --patterns hammer,doji --output table
  candlestick -i data.json --confidence 0.8 --type reversal
  cat data.json | candlestick --output csv

Input Format:
  JSON: Array of {open, high, low, close} objects
  CSV:  Headers: open,high,low,close (first line)

Supported Patterns:
  1-candle: hammer, invertedHammer, doji
  2-candle: engulfing, harami, kicker, hangingMan, shootingStar,
            piercingLine, darkCloudCover
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

  // Enrich with metadata
  if (args.metadata || args.confidence > 0 || args.type || args.direction) {
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

  console.log(
    "\n┌─────────┬─────────────────────┬────────────┬────────────┬────────────┐",
  );
  console.log(
    "│  Index  │       Pattern       │    Type    │ Confidence │  Strength  │",
  );
  console.log(
    "├─────────┼─────────────────────┼────────────┼────────────┼────────────┤",
  );

  results.forEach((r) => {
    const meta = r.metadata || {};
    const index = String(r.index).padEnd(7);
    const pattern = String(r.pattern).padEnd(19);
    const type = String(meta.type || "N/A").padEnd(10);
    const conf = String(
      meta.confidence ? meta.confidence.toFixed(2) : "N/A",
    ).padEnd(10);
    const strength = String(meta.strength || "N/A").padEnd(10);
    console.log(`│ ${index} │ ${pattern} │ ${type} │ ${conf} │ ${strength} │`);
  });

  console.log(
    "└─────────┴─────────────────────┴────────────┴────────────┴────────────┘",
  );
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
