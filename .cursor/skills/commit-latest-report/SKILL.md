---
name: commit-latest-report
description: Commit and push docs/reminders/latest-reminder.json so Cloud Automations can read the weekly email snapshot from GitHub main.
---

# Commit Latest Reminder Snapshot

Publishes the local reminder snapshot to GitHub for the **Sunday mail automation** (Cloud Agent reads `main`).

## Prerequisites

- Step 8 `/archive-retro` completed (`npm run export:reminder` already ran)
- File exists: `docs/reminders/latest-reminder.json`
- Git remote configured for orchestration repo (`retro-lab`)
- Work from **orchestration root** (not `retro-api/`)

## Steps

1. **Verify** `docs/reminders/latest-reminder.json` exists and is valid JSON.
2. `git status` — confirm the file is new or modified.
3. If unchanged vs last commit, report **SKIP** (already on GitHub).
4. Stage only the snapshot (do not bundle unrelated changes):

```bash
git add docs/reminders/latest-reminder.json
```

5. Commit:

```bash
git commit -m "chore: update reminder snapshot for weekly automation"
```

6. Push so Cloud Automations can read it:

```bash
git push origin main
```

If current branch is not `main`, either checkout `main` and cherry-pick, or push to `main` only after user confirms — **weekly automation reads `IslamFathyy/retro-lab` / `main`**.

7. Report commit hash and confirm file is on remote `main`.

## Do not

- Commit `recipients.json` unless user explicitly asked
- Commit secrets or `retro-api/data/`
- Force push
- Skip push (local commit alone is insufficient for Cloud Agent)

## On failure

- Missing file → run `/archive-retro {retroId}` first
- Nothing to commit → snapshot already matches git
- Push rejected → report error; user resolves sync/conflicts manually
