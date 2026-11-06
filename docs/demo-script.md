# Demo script (target: under 3 minutes)

Cast: **Priya** (teammate, asks and investigates), **Akash** (approver). Replace with the real people in the Discord server.
Rule shown on screen: the person who asked cannot approve.

Before every take, run `node scripts/reset-demo.js`.

## Opening (0:00 to 0:15)
Show the Discord room with Scout and Builder as members. Say: "Ship Room is a Switch room where people and AI agents handle releases together. Agents prepare, humans decide."

## Scene 1: safe promotion (0:15 to 1:15)
1. Priya: `@ship-scout can we promote checkout from dev to stage?`
2. Scout runs `drift.js dev stage` and replies with 4 differences (image, flag, 2 missing env vars).
3. Scout hands off: `@ship-builder please prepare the stage update`.
4. Builder creates `fix/stage-checkout-promote`, changes `deploy/stage/checkout.json`, commits, and posts a summary.
5. Priya replies APPROVE. Show that it is refused, because she asked for it (run apply.js with her as both).
6. Akash replies APPROVE. `apply.js` merges and writes `decisions.md`.

## Scene 2: incident and rollback (1:15 to 2:25)
1. Priya: `@ship-scout error rate on checkout looks bad since this morning. What changed?`
2. Scout runs `watch.js`, reads `git log` and the deploy files, and says: error rate rose from 0.5% to 9.1% at 09:42, prod runs checkout:2.14.0 with NEW_PAYMENTS on, stage still runs 2.13.2.
3. Scout: `@ship-builder prepare a rollback of prod to 2.13.2`.
4. Builder creates `fix/prod-rollback-2-13-2`, edits `deploy/prod/checkout.json`, and posts a summary.
5. Akash approves, `apply.js` merges, and the decision is recorded with the reason.

## Closing (2:25 to 2:50)
Show `decisions.md` (two lines: who asked, who approved, why). Say: "Every change was prepared by an agent and approved by a different human. That record lives with the room."

## Optional scene 3 (only if time)
`@ship-scout what is the CI failure?` Scout runs `watch.js` and explains: build-checkout failed because image checkout:2.14.0-rc1 was not found.

## Checks before recording
- Two humans visible in the room, both with different names.
- No real names, hosts or tokens visible in the screen or the terminal.
- Discord bot token not visible anywhere.
