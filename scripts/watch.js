#!/usr/bin/env node
// Read the latest CI result and error-rate metrics, and print alerts.
// usage: node scripts/watch.js
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const ERROR_RATE_THRESHOLD_PCT = 2.0;
const alerts = [];

const ci = JSON.parse(fs.readFileSync(path.join(root, "ci", "last-run.json"), "utf8"));
for (const job of ci.jobs) {
  if (job.status === "failed") {
    alerts.push(`CI failed: job ${job.name}. Cause: ${job.error}`);
  }
}

const rows = fs
  .readFileSync(path.join(root, "metrics", "metrics.csv"), "utf8")
  .trim()
  .split("\n")
  .slice(1);
let previous = null;
for (const row of rows) {
  const [time, service, rateText] = row.split(",");
  const rate = Number(rateText);
  if (previous !== null && previous < ERROR_RATE_THRESHOLD_PCT && rate >= ERROR_RATE_THRESHOLD_PCT) {
    alerts.push(`Error rate for ${service} rose from ${previous}% to ${rate}% at ${time}`);
  }
  previous = rate;
}

if (alerts.length === 0) {
  console.log("All clear. No alerts.");
} else {
  console.log(`ALERTS (${alerts.length}):`);
  alerts.forEach((a) => console.log(`- ${a}`));
}
