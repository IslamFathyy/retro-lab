# Archive Retrospective

Archive a completed retrospective to Google Drive and set local status to `archived`.

**Included in `/run-retro-workflow` as step 8 (required).**

## Arguments
- `retroId` (required)

## Steps
1. Validate status is `actioned` or `analyzed`.
2. Ensure `report.md` exists (generate if missing).
3. **Human confirm:** When run standalone, ask before archiving. When run as part of `/run-retro-workflow`, proceed — the user already invoked the full workflow.
4. Use skill `archive-retrospective` and Google Drive MCP (required for workflow).
5. Drive layout: one `Retrospective Management` folder → one `{retroId} - {title}` subfolder per retro → all files inside (create folders first, upload sequentially by folder ID).
6. Upload copy only — never delete local files.
7. Update local status via API `POST /api/retrospectives/:retroId/archive`.
8. **Export reminder snapshot:** `cd retro-api && npm run export:reminder` → writes `docs/reminders/latest-reminder.json`. Remind user to commit it for weekly automation.
9. Report exactly what succeeded or failed.

## On MCP failure

If Google Drive MCP is unavailable, fail clearly — do not mark `archived` locally unless upload succeeded.
