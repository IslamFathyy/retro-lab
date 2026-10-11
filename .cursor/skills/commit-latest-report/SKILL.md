---
name: commit-latest-report
description: >-
  Publishes the archived retro reminder snapshot, email payload, and final
  analysis.json and report.md copies to GitHub main for Cloud Automation.
---

# Commit Latest Reminder Snapshot

## When to use

- `/commit-latest-report`
- Immediately after `/archive-retro` produced the export (`npm run export:reminder`)

**Out of scope:** committing `repos/retro-api/data/`, unrelated files, or secrets.

## Inputs

| Input | Source |
| --- | --- |
| Files | `docs/reminders/latest-reminder.json`, `latest-email-payload.json`, `latest-analysis.json`, `latest-report.md` |
| Prerequisite | `/archive-retro` export (`npm run export:reminder`) |
| Remote | `origin` → `main` for automation |

## Output

| Deliverable | Location / effect |
| --- | --- |
| Git commit | `main` contains only the four `docs/reminders/latest-*` snapshot files (new or updated) |
| Remote | `origin/main` updated, or explicit **SKIP** if all four unchanged vs `HEAD` |
| Report | Commit hash (when pushed); `retroId` from `latest-reminder.json` |

## Workflow

1. Work from **orchestration root** (not `repos/retro-api/`).
2. Confirm all four snapshot files exist under `docs/reminders/`.
3. Run `git status` / `git diff` on those paths only.
4. If all four unchanged vs `HEAD`, report **SKIP**.
5. Stage **only**:
   - `docs/reminders/latest-reminder.json`
   - `docs/reminders/latest-email-payload.json`
   - `docs/reminders/latest-analysis.json`
   - `docs/reminders/latest-report.md`
6. `git commit -m "chore: update reminder snapshot for weekly automation"` (mention `retroId` in body if helpful).
7. `git push origin main` (if not on `main`, stop unless user confirms branch strategy).
8. Report commit hash; confirm Cloud Automation can read `latest-email-payload.json` on remote `main`.

## Decision rules

| Situation | Action |
| --- | --- |
| Missing any snapshot file | **Stop** — run `/archive-retro {id}` (export) first. |
| Unrelated staged files | **Do not** include in commit. |
| Commit `recipients.json` | Only if user explicitly asked. |
| Force push | **Forbidden**. |
| Push skipped | **Insufficient** for Cloud Agent — remote `main` must have snapshots. |

## Validation

- After push: `latest-reminder.json` and `latest-analysis.json` parse as JSON.
- `latest-report.md` non-empty; `retroId` in analysis matches reminder snapshot.
- Hook `validate-json.js` applies if JSON files were edited in the IDE before commit.

## Failure handling

| Failure | Action |
| --- | --- |
| Nothing to commit | Report SKIP. |
| Push rejected | Report error; user resolves sync/conflicts. |
| Invalid JSON | Fix file; re-run export or validation. |

## References

- [docs/automation-tiers.md](../../../docs/automation-tiers.md)
- [docs/reminders/README.md](../../../docs/reminders/README.md)
- [`.cursor/commands/commit-latest-report.md`](../../commands/commit-latest-report.md)
