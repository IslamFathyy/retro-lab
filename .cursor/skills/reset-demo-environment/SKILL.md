---
name: reset-demo-environment
description: >-
  Wipe local RETRO-* demo data and trash Google Drive retro subfolders under
  Retrospective Management after explicit user confirmation (e.g. RESET DEMO).
  Use only for /reset-demo-retro. Never run without clear human confirmation in
  chat.
---

# Reset Demo Environment

## Purpose

Return teaching/demo environment to a clean slate: local retrospective folders removed, Drive archive children trashed, reminder snapshot cleared.

## When to use

- Command `/reset-demo-retro`
- User explicitly confirmed reset in **this chat**

**Do not use** for production data or without confirmation text.

## Inputs

| Input | Source |
| --- | --- |
| Confirmation | User message: `RESET DEMO` or `yes, reset demo data and Drive archives` |
| Local wipe | `cd retro-api && npm run reset:demo` |
| Drive | `user-google-drive` MCP (unless `--local-only`) |

## Workflow

1. **Stop** unless user gave explicit confirmation (not `/reset-demo-retro` alone).
2. Run `cd retro-api && npm run reset:demo`; report `deletedRetroIds` and reminder snapshot removal.
3. Unless `--local-only`:
   - Search Drive for folder `Retrospective Management`.
   - `listFolder` on parent ID; `deleteItem` each **child** retro folder (trash).
   - **Do not** delete parent `Retrospective Management` folder.
   - Verify parent empty of retro children.
4. Summarize: local ids deleted, reminder removed, Drive folders trashed, failures.
5. Tell user: **Next** `/seed-demo-retro` then workflow from step 1.

## Decision rules

| Situation | Action |
| --- | --- |
| No explicit confirmation | **Stop** — ask for `RESET DEMO`. |
| Drive MCP unavailable | Complete local reset only; report Drive **not** cleared. |
| Delete non-`RETRO-*` data | **Forbidden**. |
| Delete Drive parent folder | **Forbidden**. |

Follow [`.cursor/rules/privacy.mdc`](../../rules/privacy.mdc) — do not log feedback text before deletion.

## Validation

- `retro-api/data/retrospectives/` has no `RETRO-*` folders after step 2.
- Drive `listFolder` shows no retro subfolders (when Drive step ran).

## Failure handling

| Failure | Action |
| --- | --- |
| User did not confirm | Do not run reset script. |
| Partial Drive trash | Report which folders failed; do not claim full reset. |

## Completion criteria

**Done when:** summary delivered and next steps (`/seed-demo-retro`) stated.

## References

- Script: `retro-api` → `npm run reset:demo`
- Command: [`.cursor/commands/reset-demo-retro.md`](../../commands/reset-demo-retro.md)
