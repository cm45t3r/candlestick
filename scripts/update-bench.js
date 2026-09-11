#!/usr/bin/env node

/* eslint-disable no-console */

/* Runs the benchmark suite and updates the performance table in README.md.
   Usage: node scripts/update-bench.js            (run bench + update)
          node scripts/update-bench.js results.json (use existing JSON) */

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const readmePath = path.join(root, "README.md");
const tmpJson = path.join(root, "bench-results.json");

const existingJson = process.argv[2];

if (existingJson) {
  const data = JSON.parse(fs.readFileSync(existingJson, "utf8"));
  updateReadme(data.table || data);
} else {
  console.log("Running benchmark suite...\n");
  // execFileSync, not execSync: tmpJson is an absolute path derived from
  // __dirname, so interpolating it into a shell string breaks on a checkout
  // directory containing a space and would execute anything a directory name
  // smuggled in. Passing argv directly runs no shell at all. process.execPath
  // also keeps the child on the same Node binary as the parent.
  execFileSync(process.execPath, ["benchmark.js", "--json", tmpJson], {
    cwd: root,
    stdio: "inherit",
  });
  const data = JSON.parse(fs.readFileSync(tmpJson, "utf8"));
  fs.unlinkSync(tmpJson);
  updateReadme(data.table || data);
}

function formatThroughput(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

function formatSize(n) {
  return n.toLocaleString("en-US");
}

// Heap deltas on the smallest datasets are below the resolution of
// process.memoryUsage(): a collection between the two samples can even make
// them negative. Report that as a bound instead of printing a number the
// measurement cannot support.
function formatMemory(mb) {
  return mb < 0.1 ? "<0.1" : mb.toFixed(1);
}

function updateReadme(results) {
  const readme = fs.readFileSync(readmePath, "utf8");

  const startMarker = "<!-- BENCH:START -->";
  const endMarker = "<!-- BENCH:END -->";

  const startIdx = readme.indexOf(startMarker);
  const endIdx = readme.indexOf(endMarker);

  if (startIdx === -1 || endIdx === -1) {
    console.error("Could not find BENCH markers in README.md");
    process.exit(1);
  }

  const header =
    "| Dataset Size | Pattern Chain (ms) | Throughput (candles/sec) | Memory (MB) |";
  const separator = "|---|---|---|---|";
  const rows = results
    .filter((r) => r.size >= 1000)
    .map(
      (r) =>
        `| ${formatSize(r.size)} | ${r.chainMs.toFixed(1)} | ${formatThroughput(r.throughput)} | ${formatMemory(r.memoryMb)} |`,
    );

  const table = [header, separator, ...rows].join("\n");
  const newContent = `${startMarker}\n${table}\n${endMarker}`;

  const updated =
    readme.slice(0, startIdx) +
    newContent +
    readme.slice(endIdx + endMarker.length);
  fs.writeFileSync(readmePath, updated);

  console.log("\nREADME.md performance table updated:");
  console.log(table);
}
