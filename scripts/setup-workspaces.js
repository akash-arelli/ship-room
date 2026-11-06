#!/usr/bin/env node
// Create (or re-create) one working folder per agent, each a clone of this repo.
// Scout reads from its clone. Builder prepares branches in its clone and pushes them back here.
// Keeping them separate means one agent switching branches never changes what the other sees.
// usage: node scripts/setup-workspaces.js
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const repo = path.resolve(__dirname, "..");
const base = path.resolve(repo, "..", "workspaces");

for (const name of ["scout", "builder"]) {
  const dir = path.join(base, name);
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(base, { recursive: true });
  execSync(`git clone -q "${repo}" "${dir}"`, { stdio: "inherit" });
  execSync('git config user.name "Ship Room Demo"', { cwd: dir });
  execSync('git config user.email "demo@example.invalid"', { cwd: dir });
  console.log(`Created ${dir}`);
}
