---
name: archive-retrospective
description: >-
  Copy retrospective files to Google Drive via MCP, mark retro archived locally,
  and export weekly reminder snapshot. Use for /archive-retro {id}. Copy-only —
  never delete local data. Fail if Drive upload cannot complete.
---

# Archive Retrospective

## Purpose

Back up one retrospective to Google Drive, set local status `archived`, and export `docs/reminders/latest-reminder.json` for weekly email automation.

## When to use

- Command `/archive-retro {retroId}`
- After report generated and user confirmed archive

**Do not use** without Drive MCP when policy requires upload success before `archived` status.

## Inputs

| Input | Source |
| --- | --- |
| `retroId` | User or command |
| Local files | `retro-api/data/retrospectives/{retroId}/` |
| Drive MCP | `user-google-drive` tools |
| Setup | [docs/mcp-setup.md](../../../docs/mcp-setup.md), [docs/mcp-golden-path.md](../../../docs/mcp-golden-path.md) |

## Workflow

1. Validate retro ready (report exists, human confirmed per command).
2. **Find or create** one root folder: `Retrospective Management` (search Drive root; dedupe empty duplicates if safe).
3. **Create** retro subfolder `{retroId} - {title}` with `parent` = root folder **ID** (not path).
4. **Create** `feedback` subfolder under retro folder ID.
5. **Upload sequentially** with `uploadFile` + `parentFolderId` (folder IDs only):
   - Retro folder: `retro.json`, `analysis.json`, `actions.json`, `report.md`
   - Feedback folder: each `feedback/FB-*.json`
6. **Verify** with `listFolder` on retro folder — expect 4 files + feedback folder.
7. Mark archived via API; **keep** all local files.
8. Run `cd retro-api && npm run export:reminder` → writes `docs/reminders/latest-reminder.json`.
9. Tell user to run `/commit-latest-report` for Sunday automation.

**Never** upload in parallel with path-based `parentFolderId` (creates duplicate parents).

## Decision rules

| Situation | Action |
| --- | --- |
| Drive MCP unavailable | **Fail** `/archive-retro` — do not set `archived` without successful upload. |
| Multiple `Retrospective Management` folders | Keep one with retro children; trash duplicate empty roots only if safe. |
| Delete local files after upload | **Forbidden** — copy-only. |

Follow root [`.cursor/rules/development.mdc`](../../rules/development.mdc) archive policy.

## Validation

- `listFolder` on retro Drive folder matches expected file count.
- Local `retro.json` status `archived` only after upload success.
- `docs/reminders/latest-reminder.json` exists after export step.

## Failure handling

| Failure | Action |
| --- | --- |
| MCP / upload error | Report clearly; leave local status non-archived if upload incomplete. |
| Export reminder fails | Report; user re-runs `npm run export:reminder`. |

## Completion criteria

**Done when:** Drive backup verified, local archived, reminder snapshot exported, user told to `/commit-latest-report`.

## References

- Drive structure and golden path: [docs/mcp-golden-path.md](../../../docs/mcp-golden-path.md)
- MCP setup: [docs/mcp-setup.md](../../../docs/mcp-setup.md)
- Export script: `retro-api` → `npm run export:reminder`
