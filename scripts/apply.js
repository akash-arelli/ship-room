#!/usr/bin/env node
// Merge a branch into main, but only with a human approval from someone other than the requester.
// usage: node scripts/apply.js --branch <name> --requested-by <name> --approved-by <name> --reason "<text>"
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const args = {};
for (let i = 2; i < process.argv.length; i += 2) {
  args[process.argv[i].replace(/^--/, "")] = process.argv[i + 1];
}
const branch = args["branch"];
const requestedBy = args["requested-by"];
const approvedBy = args["approved-by"];
const reason = args["reason"];

function refuse(message) {
  console.error(`REFUSED: ${message}`);
  process.exit(1);
}

if (!branch) refuse("missing --branch");
if (!requestedBy) refuse("missing --requested-by");
if (!approvedBy) refuse("missing --approved-by. A human must approve.");
if (/^ship-/i.test(approvedBy.trim())) {
  refuse("an agent cannot approve. A human must approve.");
}
if (approvedBy.trim().toLowerCase() === requestedBy.trim().toLowerCase()) {
  refuse("the approver must be different from whoever prepared or requested the change");
}
if (!reason) refuse("missing --reason");

const root = path.join(__dirname, "..");
const git = (cmd) =>
  execSync(`git ${cmd}`, { cwd: root, stdio: ["ignore", "pipe", "pipe"] }).toString().trim();

const branches = git("branch --format=%(refname:short)").split("\n").map((s) => s.trim());
if (!branches.includes(branch)) refuse(`branch ${branch} does not exist`);

git("checkout main");
git(`merge --no-ff ${branch} -m "Merge ${branch}, approved by ${approvedBy}"`);

const when = new Date().toISOString();
const decisionsFile = path.join(root, "decisions.md");
const existing = fs.existsSync(decisionsFile) ? fs.readFileSync(decisionsFile, "utf8") : "";
const lead = existing === "" || existing.endsWith("\n\n") ? "" : existing.endsWith("\n") ? "\n" : "\n\n";
const isFirst = !/^- /m.test(existing);
// Keep one entry per line. A blank line separates the header from the first entry only.
const separator = isFirst ? lead : existing.endsWith("\n") ? "" : "\n";
fs.appendFileSync(
  decisionsFile,
  `${separator}- ${when} | ${branch} | requested by ${requestedBy} | approved by ${approvedBy} | ${reason}\n`
);
git("add decisions.md");
git(`commit -m "Record decision for ${branch}"`);

console.log(`Merged ${branch} into main. Decision recorded.`);
