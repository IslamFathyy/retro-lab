---
name: commit-latest-report
description: >-
  Cursor Cloud Automation reads open-action email context from
  docs/reminders/latest-reminder.json on the retro-lab main branch; this skill
  publishes that snapshot after archive export.
---

# Commit Latest Reminder Snapshot

## When to use

- `/commit-latest-report`
- Immediately after `/archive-retro` produced `latest-reminder.json`

**Out of scope:** committing `repos/retro-api/data/`, unrelated files, or secrets.

## Inputs

| Input | Source |
| --- | --- |
| File | `docs/reminders/latest-reminder.json` (orchestration repo root) |
| Prerequisite | `/archive-retro` export (`npm run export:reminder`) |
| Remote | `origin` → `main` for automation |

## Output

| Deliverable | Location / effect |
| --- | --- |
| Git commit | `main` contains only `docs/reminders/latest-reminder.json` (new or updated) |
| Remote | `origin/main` updated, or explicit **SKIP** if file unchanged vs `HEAD` |
| Report | Commit hash (when pushed) so automation can rely on remote `main` |

## Workflow

1. Work from **orchestration root** (not `repos/retro-api/`).
2. Confirm `docs/reminders/latest-reminder.json` exists.
3. Run `git status` — file new or modified.
4. If unchanged vs `HEAD`, report **SKIP**.
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
| Push skipped | **Insufficient** for Cloud Agent — remote `main` must have snapshot. |

## Validation

- After push: `git show HEAD:docs/reminders/latest-reminder.json` parses as JSON.
- Hook `validate-json.js` applies if the file was edited in the IDE before commit.

## Failure handling

| Failure | Action |
| --- | --- |
| Nothing to commit | Report SKIP. |
| Push rejected | Report error; user resolves sync/conflicts. |
| Invalid JSON | Fix file; re-run validation. |

## References

- [docs/automation-tiers.md](../../../docs/automation-tiers.md)
- [`.cursor/commands/commit-latest-report.md`](../../commands/commit-latest-report.md)
