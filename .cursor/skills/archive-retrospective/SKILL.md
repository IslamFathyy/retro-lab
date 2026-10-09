---
name: archive-retrospective
description: >-
  A retrospective’s on-disk artifacts are copied into Google Drive, local status
  moves to archived, and the weekly-reminder export is refreshed; local data is
  never deleted.
---

# Archive Retrospective

## When to use

- `/archive-retro {retroId}`
- Report exists and the user confirmed archive (per command)

**Out of scope:** marking `archived` when Drive upload is required but MCP upload cannot complete.

## Inputs

| Input | Source |
| --- | --- |
| `retroId` | User or command |
| Local files | `repos/retro-api/data/retrospectives/{retroId}/` |
| Drive MCP | `user-google-drive` tools |
| Setup | [docs/mcp-setup.md](../../../docs/mcp-setup.md), [docs/mcp-golden-path.md](../../../docs/mcp-golden-path.md) |

## Output

| Deliverable | Location / effect |
| --- | --- |
| Drive backup | `Retrospective Management/{retroId} - {title}/` with `retro.json`, `analysis.json`, `actions.json`, `report.md`, and `feedback/FB-*.json` |
| Local status | `retro.json` → `archived` only after upload success; all local files retained |
| Reminder snapshot | `docs/reminders/latest-reminder.json` from `npm run export:reminder` |
| Handoff | User prompted for `/commit-latest-report` |

## Workflow

1. Validate retro ready (report exists, human confirmed per command).
2. **Find or create** one root folder: `Retrospective Management` (search Drive root; dedupe empty duplicates if safe).
3. **Create** retro subfolder `{retroId} - {title}` with `parent` = root folder **ID** (not path).
4. **Create** `feedback` subfolder under retro folder ID.
5. **Upload sequentially** with `uploadFile` + `parentFolderId` (folder IDs only):
   - Retro folder: `retro.json`, `analysis.json`, `actions.json`, `report.md`
   - Feedback folder: each `feedback/FB-*.json`
6. **Verify** with `listFolder` on retro folder — expect 4 files + feedback folder.
7. Mark archived via API.
8. Run `cd repos/retro-api && npm run export:reminder`.

**Never** upload in parallel with path-based `parentFolderId` (creates duplicate parents).

## Decision rules

| Situation | Action |
| --- | --- |
| Drive MCP unavailable | **Fail** — do not set `archived` without successful upload. |
| Multiple `Retrospective Management` folders | Keep one with retro children; trash duplicate empty roots only if safe. |
| Delete local files after upload | **Forbidden** — copy-only. |

[`.cursor/rules/development.mdc`](../../rules/development.mdc) archive policy applies.

## Validation

- `listFolder` on retro Drive folder matches expected file count.
- `docs/reminders/latest-reminder.json` exists after export step.

## Failure handling

| Failure | Action |
| --- | --- |
| MCP / upload error | Report clearly; leave local status non-archived if upload incomplete. |
| Export reminder fails | Report; user re-runs `npm run export:reminder`. |

## References

- [docs/mcp-golden-path.md](../../../docs/mcp-golden-path.md)
- [docs/mcp-setup.md](../../../docs/mcp-setup.md)
- Export: `repos/retro-api` → `npm run export:reminder`
