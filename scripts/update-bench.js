#!/usr/bin/env node

/* Runs the benchmark suite and updates the performance table in README.md.
   Usage: node scripts/update-bench.js            (run bench + update)
          node scripts/update-bench.js results.json (use existing JSON) */

const { execSync } = require("child_process");
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
  execSync(`node benchmark.js --json ${tmpJson}`, { cwd: root, stdio: "inherit" });
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

  const header = "| Dataset Size | Pattern Chain (ms) | Throughput (candles/sec) | Memory (MB) |";
  const separator = "|---|---|---|---|";
  const rows = results
    .filter((r) => r.size >= 1000)
    .map(
      (r) =>
        `| ${formatSize(r.size)} | ${r.chainMs.toFixed(1)} | ${formatThroughput(r.throughput)} | ${r.memoryMb.toFixed(1)} |`,
    );

  const table = [header, separator, ...rows].join("\n");
  const newContent = `${startMarker}\n${table}\n${endMarker}`;

  const updated = readme.slice(0, startIdx) + newContent + readme.slice(endIdx + endMarker.length);
  fs.writeFileSync(readmePath, updated);

  console.log("\nREADME.md performance table updated:");
  console.log(table);
}
