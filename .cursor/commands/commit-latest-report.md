# Commit Latest Report (reminder snapshot)

**Workflow step 9** — commit and push `docs/reminders/latest-reminder.json` to GitHub so the **Sunday mail Cloud Automation** can read open actions from `main`.

## When to run

Immediately after **step 8** `/archive-retro {retroId}` (which runs `npm run export:reminder`).

## Arguments

None.

## Steps

1. Use skill `commit-latest-report`.
2. Verify `docs/reminders/latest-reminder.json` exists (from step 8).
3. From orchestration repo root, stage, commit, and **push to `main`**.
4. Report: commit hash, branch, and whether Cloud Agent will see the update.

## Skip conditions

- File missing → run `/archive-retro` first
- `git diff` shows no changes → report **SKIP — snapshot already on GitHub**

## Example

```bash
git add docs/reminders/latest-reminder.json
git commit -m "chore: update reminder snapshot for weekly automation"
git push origin main
```

## Related

- Export: step 8 `/archive-retro`
- Email: `/weekly-action-reminder` or Sunday Cursor Automation
- Docs: `docs/cursor-automation-weekly-reminder.md`
