# Ship Room

**A shared Switch room where people and AI agents handle releases and incidents together. Agents investigate and prepare fixes. A human must approve every change, and every approval is recorded.**

Built for the Flip the Switch Hackathon, Track 1 (Best Business Workflow).

Demo video: TODO (add link)

## The problem
Release work is mostly coordination: "can we promote this to stage?", "why did errors jump at 09:42?", "who approved that rollback?". The answers live in different chats and tools, and approvals get lost. AI agents can do the legwork, but teams are right to worry about an agent changing production on its own.

## The idea
Put the agents in the same room as the people, and make the rule part of the workflow:

- **ship-scout** investigates. It is read-only.
- **ship-builder** prepares a fix on a `fix/*` branch and pushes it. It cannot merge.
- **A human** replies `APPROVE` in the room. Only then does the change reach `main`.
- Every approval is written to [`decisions.md`](decisions.md): who prepared it, who approved, when, and why.

An agent asked to approve its own work refuses, and the script that merges refuses too, so the rule does not depend on the agent behaving well.

## How Switch is used
- **One room, three kinds of participants.** The Switch room is bridged to a Discord channel. People talk to agents in a normal chat. Agents talk to each other in the same room.
- **Two agents with different jobs and permissions**, each with its own working folder and instructions ([`switch/agents.md`](switch/agents.md)).
- **Agent-to-agent handoff.** Scout investigates an incident, then tags `@ship-builder` with the exact change. No human has to copy anything between tools.
- **Human in the loop.** The approval is a chat reply in the same room. Scout and Builder stay inside their own folders on the human's own machine, run by Switch Console with the Cursor agent as the provider.
- **Switch Console runs locally.** The agents start on demand on the laptop. The repo and data never leave it. All data in this repo is fake.

## What the demo shows
1. **Safe promotion.** Ask Scout whether `checkout` can go from dev to stage. Scout finds four differences and a failing CI build, and says it is not ready. Builder prepares the stage update on a branch. A human approves. It merges and is logged.
2. **Incident and rollback.** Prod errors jump from 0.5% to 9.1%. Scout finds prod runs the newer image with the new payments flag on while stage is healthy. It recommends rolling back both, and hands the exact change to Builder. Builder prepares the rollback and asks for approval.
3. **The guardrail.** Asked to approve and merge its own rollback, Builder refuses. A human replies `APPROVE`, and the rollback is merged and logged.

Script: [`docs/demo-script.md`](docs/demo-script.md).

## What is in this repo
- `deploy/` fake per-environment config for the `checkout` service (dev, stage, prod)
- `ci/last-run.json` fake CI result with one failed job
- `metrics/metrics.csv` fake error-rate data with a spike
- `scripts/drift.js` compares two environments
- `scripts/watch.js` prints CI and metric alerts
- `scripts/apply.js` merges a branch into `main`. It refuses unless a human other than the requester approved
- `scripts/setup-workspaces.js` creates one working folder per agent
- `scripts/reset-demo.js` puts the demo back to its starting state
- `scripts/scan.js` checks files and history for forbidden words and secret patterns before publishing
- `switch/agents.md` the exact room and agent setup
- `decisions.md` the approval log

## Run it yourself
Requirements: Node.js 18+ (no packages), Git, Docker Desktop, Switch Console, and an AI agent provider that Switch Console can see (this project uses the Cursor CLI, signed in).

1. Create the per-agent folders: `node scripts/setup-workspaces.js`
2. In Switch Console, connect a Discord bot (Developer Portal app with the Server Members and Message Content intents, invited with the `bot` and `applications.commands` scopes) and create a room in a Discord channel.
3. Create the two agents with the values in [`switch/agents.md`](switch/agents.md), and point each at its folder.
4. Invite both into the room with `!invite-agent @ship-scout` and `!invite-agent @ship-builder`.
5. Chat. For example: `@ship-scout can we promote checkout from dev to stage?`
6. To start over: `node scripts/reset-demo.js` and `node scripts/setup-workspaces.js`.

You can also try the scripts without Switch:
```
node scripts/drift.js dev stage
node scripts/watch.js
node scripts/apply.js --branch <name> --requested-by <person> --approved-by <other person> --reason "<text>"
```

## Notes from building it on Windows
- The Cursor CLI needs Git Bash on `PATH`. If agents reply "Can't find Bash", add Git's `bin` folder to `PATH` and restart Switch Console, since agents inherit its environment.
- Switch Console needs to be started after the agent provider is installed and signed in, or it will not see the provider.
