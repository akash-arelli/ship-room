#!/usr/bin/env node
// Check the repo (files and full git history) for words you must not publish, and for secret-looking strings.
// Pass your own forbidden words as arguments, so they never need to be stored in the repo.
// usage: node scripts/scan.js word1 word2 word3
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const root = path.join(__dirname, "..");
const words = process.argv.slice(2).map((w) => w.toLowerCase());
const patterns = [
  ["GitHub token", /(ghp_|github_pat_)[A-Za-z0-9_]{20,}/],
  ["Discord bot token", /[MNO][A-Za-z\d]{23,}\.[\w-]{6}\.[\w-]{27,}/],
  ["AWS key", /AKIA[0-9A-Z]{16}/],
  ["Slack token", /xox[abp]-[A-Za-z0-9-]{10,}/],
  ["Private key", /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
];

function scanText(label, text) {
  const hits = [];
  const lower = text.toLowerCase();
  for (const w of words) if (lower.includes(w)) hits.push(`forbidden word "${w}" in ${label}`);
  for (const [name, re] of patterns) if (re.test(text)) hits.push(`${name} pattern in ${label}`);
  return hits;
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if ([".git", "node_modules"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

let problems = [];
for (const file of walk(root)) {
  problems = problems.concat(scanText(`file ${path.relative(root, file)}`, fs.readFileSync(file, "utf8")));
}
const history = execSync("git log --all -p --format=fuller", { cwd: root, maxBuffer: 1024 * 1024 * 200 }).toString();
problems = problems.concat(scanText("git history (including author names and emails)", history));

if (problems.length === 0) {
  console.log(`Scan clean: ${walk(root).length} files and full history checked against ${words.length} word(s) and ${patterns.length} secret patterns.`);
} else {
  console.log("PROBLEMS FOUND:");
  [...new Set(problems)].forEach((p) => console.log(`- ${p}`));
  process.exit(1);
}
