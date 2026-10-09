---
name: reset-demo-environment
description: >-
  Teaching demos return to a clean slate by removing local RETRO-* retrospectives,
  optionally trashing matching Drive subfolders under Retrospective Management,
  and clearing the reminder snapshot—only after explicit confirmation in chat.
---

# Reset Demo Environment

## When to use

- `/reset-demo-retro` **and** explicit confirmation in **this chat** (`RESET DEMO` or equivalent)

**Out of scope:** production data, Drive parent deletion, or non-`RETRO-*` folders.

## Inputs

| Input | Source |
| --- | --- |
| Confirmation | User message: `RESET DEMO` or `yes, reset demo data and Drive archives` |
| Local wipe | `cd repos/retro-api && npm run reset:demo` |
| Drive | `user-google-drive` MCP (unless `--local-only`) |

## Output

| Deliverable | Location / effect |
| --- | --- |
| Local data | No `RETRO-*` under `repos/retro-api/data/retrospectives/` |
| Reminder | `docs/reminders/latest-reminder.json` removed via reset script |
| Drive | Retro **child** folders trashed under `Retrospective Management` (when Drive step runs) |
| Summary | Deleted ids, Drive results, failures; next step `/seed-demo-retro` |

## Workflow

1. **Stop** unless user gave explicit confirmation (not `/reset-demo-retro` alone).
2. Run `cd repos/retro-api && npm run reset:demo`; report `deletedRetroIds`.
3. Unless `--local-only`:
   - Search Drive for folder `Retrospective Management`.
   - `listFolder` on parent ID; `deleteItem` each **child** retro folder (trash).
   - **Do not** delete parent `Retrospective Management` folder.
   - Verify parent empty of retro children.
4. Deliver summary from **Output** table.

## Decision rules

| Situation | Action |
| --- | --- |
| No explicit confirmation | **Stop** — ask for `RESET DEMO`. |
| Drive MCP unavailable | Complete local reset only; report Drive **not** cleared. |
| Delete non-`RETRO-*` data | **Forbidden**. |
| Delete Drive parent folder | **Forbidden**. |

[`.cursor/rules/privacy.mdc`](../../rules/privacy.mdc) — do not log feedback text before deletion.

## Validation

- `repos/retro-api/data/retrospectives/` has no `RETRO-*` folders after local step.
- When Drive ran: `listFolder` shows no retro subfolders under the management root.

## Failure handling

| Failure | Action |
| --- | --- |
| User did not confirm | Do not run reset script. |
| Partial Drive trash | Report which folders failed; do not claim full reset. |

## References

- `repos/retro-api` → `npm run reset:demo`
- [`.cursor/commands/reset-demo-retro.md`](../../commands/reset-demo-retro.md)
