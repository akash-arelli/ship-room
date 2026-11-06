#!/usr/bin/env node
// Put the demo repo back to its starting state, so you can record another take.
// Removes fix/* branches and resets main to the "baseline" tag.
// usage: node scripts/reset-demo.js
const path = require("path");
const { execSync } = require("child_process");

const root = path.join(__dirname, "..");
const git = (cmd) =>
  execSync(`git ${cmd}`, { cwd: root, stdio: ["ignore", "pipe", "pipe"] }).toString().trim();

const tags = git("tag --list").split("\n");
if (!tags.includes("baseline")) {
  console.error('REFUSED: no "baseline" tag found, so this does not look like the demo repo.');
  process.exit(1);
}

git("checkout -q main");
git("reset -q --hard baseline");
const branches = git("branch --format=%(refname:short)")
  .split("\n")
  .map((s) => s.trim())
  .filter((b) => b.startsWith("fix/"));
for (const b of branches) git(`branch -D ${b}`);

console.log(`Reset main to baseline. Removed ${branches.length} fix branch(es).`);
