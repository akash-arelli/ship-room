#!/usr/bin/env node
// Compare the checkout deploy config between two environments.
// usage: node scripts/drift.js <envA> <envB>
const fs = require("fs");
const path = require("path");

const [envA, envB] = process.argv.slice(2);
if (!envA || !envB) {
  console.error("usage: node scripts/drift.js <envA> <envB>");
  process.exit(2);
}

const root = path.join(__dirname, "..", "deploy");
const load = (env) =>
  JSON.parse(fs.readFileSync(path.join(root, env, "checkout.json"), "utf8"));
const a = load(envA);
const b = load(envB);

const findings = [];
if (a.image !== b.image) {
  findings.push(`image: ${envA}=${a.image}, ${envB}=${b.image}`);
}
for (const [key, value] of Object.entries(a.flags)) {
  if (b.flags[key] !== value) {
    findings.push(`flag ${key}: ${envA}=${value}, ${envB}=${b.flags[key]}`);
  }
}
for (const [key, value] of Object.entries(a.env)) {
  if (!(key in b.env)) {
    findings.push(`env ${key}: set in ${envA}, missing in ${envB}`);
  } else if (b.env[key] !== value) {
    findings.push(`env ${key}: ${envA}=${value}, ${envB}=${b.env[key]}`);
  }
}

if (findings.length === 0) {
  console.log(`No drift between ${envA} and ${envB}.`);
} else {
  console.log(`Drift between ${envA} and ${envB}:`);
  findings.forEach((f) => console.log(`- ${f}`));
}
