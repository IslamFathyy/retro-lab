# Archive Retrospective

Archive a completed retrospective (human-approved).

## Arguments
- `retroId` (required)

## Steps
1. Validate status is `actioned` or `analyzed`.
2. Ensure `report.md` exists (generate if missing).
3. **Ask human to confirm** archive operation.
4. Use skill `archive-retrospective` and Google Drive MCP if configured.
5. Upload copy only — never delete local files.
6. Update local status via API `POST /api/retrospectives/:retroId/archive`.
7. Report exactly what succeeded or failed.
