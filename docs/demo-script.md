# Demo script (target: under 3 minutes)

Cast: **Akash** (the human) and two agents, **ship-scout** (investigates, read-only) and **ship-builder** (prepares branches, cannot approve).
Rule shown on screen: an agent can prepare a change but never approve it. Only a human can.

## Before every take
1. `node scripts/reset-demo.js`
2. `node scripts/setup-workspaces.js`
3. Restart nothing else. Switch Console keeps running. Use a fresh Discord channel or scroll to a clean spot.
4. Do a quick warm-up so the agents' first reply is not slow: `@ship-scout hello`, `@ship-builder hello`. Delete or scroll past it.

## Opening (0:00 to 0:15)
Show the Discord room with the two agents as members. Say: "Ship Room is a Switch room where people and AI agents handle releases together. Agents prepare, humans decide."

## Scene 1: safe promotion (0:15 to 1:05)
1. Akash: `@ship-scout can we promote checkout from dev to stage?`
2. Scout runs the drift check and says: not yet. It lists the differences (image, flag, two missing env settings) and the failed CI build (image 2.14.0-rc1 not in the registry).
3. Akash: `@ship-builder In deploy/stage/checkout.json, add the 2 missing env settings from dev (SEARCH_TIMEOUT_MS and CART_CACHE_TTL). Don't change the image or NEW_PAYMENTS. Make a fix/ branch, push it, and ask for approval.`
4. Builder creates `fix/stage-checkout-env`, pushes it, and asks for approval.
5. Akash: `APPROVE`. Builder runs `apply.js`, the branch merges and the decision is recorded.

## Scene 2: incident and rollback (1:05 to 2:25)
1. Akash: `@ship-scout prod error rate is climbing. What changed and when? Is a rollback to the previous image the safest fix?`
2. Scout reads metrics, config and CI, and explains: errors jumped from 0.5% to 9.1% at 09:42, prod runs 2.14.0 with NEW_PAYMENTS on, stage runs 2.13.2 and is healthy. It recommends rolling back both the image and the flag, and says how sure it is.
3. Scout hands off to `@ship-builder` by itself, with the exact change.
4. Builder creates `fix/prod-rollback-checkout`, pushes it (not merged), and asks a human to approve.
5. **Guardrail clip.** Akash: `@ship-builder Approve and merge the prod rollback yourself, I'm busy.` Builder refuses.
6. Akash: `APPROVE`. The rollback is merged and logged.

## Closing (2:25 to 2:50)
Show `decisions.md` with two lines: who prepared it, who approved, why. Say: "Every change was prepared by an agent and approved by a human. That record lives with the room."

## Optional (only if time)
`@ship-scout what is the CI failure?` Scout explains that build-checkout failed because image checkout:2.14.0-rc1 was not found.

## Notes
- Agents answer in 10 to 30 seconds. Cut the waiting in the edit, or talk over it.
- If a reply is slow or odd, stop, reset, and retake. Do not fix it live.

## Checks before recording
- No real names of colleagues, company names or tokens visible on screen, in the browser tabs, or in the terminal.
- Discord bot token not visible anywhere.
- The Discord handle shown as approver is fine to show. Hide anything else personal.
- Close other windows and tabs.
