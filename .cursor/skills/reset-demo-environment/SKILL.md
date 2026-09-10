---
name: reset-demo-environment
description: Destructively clear local demo retrospective data and Google Drive Retrospective Management archives for a fresh team demo. Use with /reset-demo-retro only after explicit human confirmation.
---

# Reset Demo Environment Skill

Prepare a **clean slate** for re-seeding and live demos.

## Human gate (required)

**Stop** unless the user explicitly confirmed in this chat, e.g.:

- `RESET DEMO` or
- `yes, reset demo data and Drive archives`

Do not infer confirmation from `/reset-demo-retro` alone.

## Scope

| Target | Action |
|--------|--------|
| Local `retro-api/data/retrospectives/RETRO-*` | Delete all retrospective folders |
| `docs/reminders/latest-reminder.json` | Delete if present (orchestration repo) |
| Google Drive `Retrospective Management/` | Trash **child retro folders only** — keep the parent folder |

**Do not** delete non-`RETRO-*` data. **Do not** delete the `Retrospective Management` parent folder.

## Step 1 — Local reset

```bash
cd retro-api && npm run reset:demo
```

Report `deletedRetroIds` and whether the reminder snapshot was removed.

## Step 2 — Google Drive cleanup (unless `--local-only`)

Requires **google-drive** MCP.

1. **Find** folder `Retrospective Management` at Drive root (`search` with `mimeType = 'application/vnd.google-apps.folder' and name = 'Retrospective Management' and trashed = false`).
2. If multiple matches, use the folder that contains retro subfolders; trash duplicate empty roots only if safe.
3. **`listFolder`** on the chosen parent folder ID.
4. For each **child folder** (retro archives like `RETRO-2026-001 - Sprint 1 Retro`):
   - `deleteItem` with `itemId` → moves to Google Drive trash (restorable).
5. **Do not** `deleteItem` on the `Retrospective Management` parent itself.
6. **Verify** with `listFolder` — parent should be empty or only contain non-retro items the user did not ask to remove.

If Drive MCP is unavailable, report clearly and stop after local reset — do not claim Drive was cleared.

## Step 3 — Report

Summarize:

- Local retros deleted (count + ids)
- Reminder snapshot removed (yes/no)
- Drive folders trashed (count + names)
- Failures (if any)

**Next step for user:** `/seed-demo-retro` then `/run-retro-workflow` from Sprint 1 (steps 0–9, including `/commit-latest-report` after archive).

## Privacy

- This is a teaching/demo reset only.
- Never export or log feedback text before deletion.
- Trashing Drive copies does not affect anonymous feedback rules on remaining local data (there should be none after step 1).
