# Archive Retrospective

Archive a completed retrospective to Google Drive and set local status to `archived`.

**Included in `/run-retro-workflow` as step 8 (required).**

## Arguments
- `retroId` (required)

## Steps
1. Validate status is `actioned` or `analyzed`.
2. Ensure `report.md` exists (generate if missing).
3. Use skill `archive-retrospective` and Google Drive MCP (required for workflow).
4. Drive layout: one `Retrospective Management` folder → one `{retroId} - {title}` subfolder per retro → all files inside (create folders first, upload sequentially by folder ID).
5. Upload copy only — never delete local files.
6. Update local status via API `POST /api/retrospectives/:retroId/archive`.
7. **Export reminder snapshot:** `cd retro-api && npm run export:reminder` → writes `docs/reminders/latest-reminder.json`.
8. Report exactly what succeeded or failed.
9. **Next step:** `/commit-latest-report` (workflow step 9 — push snapshot to GitHub `main` for mail automation).

## On MCP failure

If Google Drive MCP is unavailable, fail clearly — do not mark `archived` locally unless upload succeeded.
