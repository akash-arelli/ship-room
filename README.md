# Ship Room

A shared Switch room where people and AI agents handle releases and incidents together. Agents investigate and prepare fixes. A human who did not ask for a change must approve it, and every approval is recorded.

> Status: work in progress. The sections marked TODO are completed before submission.

## What is in this repo
- `deploy/` fake per-environment config for the `checkout` service (dev, stage, prod)
- `ci/last-run.json` fake CI result with one failed job
- `metrics/metrics.csv` fake error-rate data with a spike
- `scripts/drift.js` compares two environments
- `scripts/watch.js` prints CI and metric alerts
- `scripts/apply.js` merges a branch into `main`. It refuses unless a different person approved it
- `decisions.md` the approval log
- `switch/ship-room.template.yaml` the room and agent setup

All data is fake.

## Requirements
- Node.js 18 or newer (no packages to install)
- Git
- Docker, Switch Console, and an AI agent provider (TODO: confirm once the setup is tested)

## Run the scripts
```
node scripts/drift.js dev stage
node scripts/watch.js
node scripts/apply.js --branch <name> --requested-by <person> --approved-by <other person> --reason "<text>"
```

## How Switch is used (TODO)
- Agents connected: TODO
- Platform: TODO
- Room setup: TODO (import `switch/ship-room.template.yaml`)
- Demo scenes: TODO

## Guardrails
- Scout is read-only.
- Builder works on branches and cannot merge.
- `apply.js` refuses to merge unless the approver is different from the requester.
