# Commit Latest Report (reminder snapshot)

**Workflow step 9** — commit and push the archived retro **snapshot bundle** to GitHub `main` for Sunday mail Cloud Automation and human review on GitHub.

## When to run

Immediately after **step 8** `/archive-retro {retroId}` (which runs `npm run export:reminder`).

## Arguments

None.

## Steps

1. Use skill `commit-latest-report`.
2. Verify these files exist (from step 8 export):
   - `docs/reminders/latest-reminder.json`
   - `docs/reminders/latest-email-payload.json`
   - `docs/reminders/latest-analysis.json`
   - `docs/reminders/latest-report.md`
3. From orchestration repo root, stage **only** those four files, commit, and **push to `main`**.
4. Report: `retroId`, commit hash, branch, and whether Cloud Agent will see the update.

## Skip conditions

- Any snapshot file missing → run `/archive-retro` first
- All four unchanged vs `HEAD` → report **SKIP — snapshot already on GitHub**

## Example

```bash
git add docs/reminders/latest-reminder.json \
  docs/reminders/latest-email-payload.json \
  docs/reminders/latest-analysis.json \
  docs/reminders/latest-report.md
git commit -m "chore: update reminder snapshot for weekly automation"
git push origin main
```

## Related

- Export: step 8 `/archive-retro`
- Email: `/weekly-action-reminder` or Sunday Cursor Automation (reads `latest-email-payload.json`)
- Docs: `docs/cursor-automation-weekly-reminder.md`
