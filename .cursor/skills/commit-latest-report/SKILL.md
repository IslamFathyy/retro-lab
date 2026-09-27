---
name: commit-latest-report
description: >-
  Commit and push docs/reminders/latest-reminder.json to GitHub main so Cloud
  Automations read the weekly email snapshot. Use for /commit-latest-report after
  /archive-retro. Do not bundle unrelated files or push secrets.
---

# Commit Latest Reminder Snapshot

## Purpose

Publish `docs/reminders/latest-reminder.json` to `IslamFathyy/retro-lab` `main` for Sunday mail automation.

## When to use

- Command `/commit-latest-report`
- After `/archive-retro` export step (workflow step 9)

**Do not use** before snapshot exists or to commit `retro-api/data/`.

## Inputs

| Input | Source |
| --- | --- |
| File | `docs/reminders/latest-reminder.json` (orchestration repo root) |
| Prerequisite | `/archive-retro` completed (`npm run export:reminder`) |
| Remote | `origin` → `main` for automation |

## Workflow

1. Work from **orchestration root** (not `retro-api/`).
2. Confirm `docs/reminders/latest-reminder.json` exists.
3. Run `git status` — file new or modified.
4. If unchanged vs `HEAD`, report **SKIP** (already on GitHub).
5. `git add docs/reminders/latest-reminder.json` only.
6. `git commit -m "chore: update reminder snapshot for weekly automation"`.
7. `git push origin main` (if not on `main`, stop unless user confirms branch strategy).
8. Report commit hash; confirm file on remote `main`.

## Decision rules

| Situation | Action |
| --- | --- |
| Missing snapshot | **Stop** — run `/archive-retro {id}` first. |
| Unrelated staged files | **Do not** include in commit. |
| Commit `recipients.json` | Only if user explicitly asked. |
| Force push | **Forbidden**. |
| Push skipped | **Insufficient** — Cloud Agent needs remote `main`. |

## Validation

- `git show HEAD:docs/reminders/latest-reminder.json` parses as JSON after push.
- Hook `validate-json.js` if file edited in IDE before commit.

## Failure handling

| Failure | Action |
| --- | --- |
| Nothing to commit | Report SKIP. |
| Push rejected | Report error; user resolves sync/conflicts. |
| Invalid JSON | Fix file; re-run validation. |

## Completion criteria

**Done when:** push succeeded (or SKIP reported) and user knows automation can read `main`.

## References

- Automation: [docs/automation-tiers.md](../../../docs/automation-tiers.md)
- Command: [`.cursor/commands/commit-latest-report.md`](../../commands/commit-latest-report.md)
