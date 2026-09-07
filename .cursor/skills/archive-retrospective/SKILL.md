---
name: archive-retrospective
description: Archive retrospective files to Google Drive via MCP when configured. Copy only, never delete local files.
---

# Archive Retrospective Skill

1. Validate retrospective is ready (report exists, human confirmed).
2. If Google Drive MCP is configured, upload using **one parent folder** and **one subfolder per retrospective**.
3. **Never** upload files in parallel with path-based `parentFolderId` — that creates duplicate parent folders.

## Target Drive structure

```text
Retrospective Management/
└── {retroId} - {title}/
    ├── retro.json
    ├── analysis.json
    ├── actions.json
    ├── report.md
    └── feedback/
        └── FB-*.json
```

## Upload workflow (required order)

1. **Find or create** exactly one root folder: `Retrospective Management`
   - Search Drive root for existing folder by name.
   - If multiple exist, keep one and trash duplicates after consolidating.
   - If none exists: `createFolder` with `name: "Retrospective Management"`.

2. **Create retrospective subfolder** once, using the **parent folder ID** (not a path):
   - Name: `{retroId} - {title}` (e.g. `RETRO-2026-001 - Sprint 1 Retro`)
   - `createFolder` with `parent: <Retrospective Management folder ID>`

3. **Create feedback subfolder** inside the retrospective folder:
   - `createFolder` with `name: "feedback"` and `parent: <retro folder ID>`

4. **Upload files sequentially** using **folder IDs** only:
   - To retro folder ID: `retro.json`, `analysis.json`, `actions.json`, `report.md`
   - To feedback folder ID: each `feedback/FB-*.json`
   - Use `uploadFile` with `parentFolderId: "<folder ID>"` — do not use path strings.

5. **Verify** with `listFolder` on the retrospective folder — expect 4 files + 1 feedback folder.

6. Mark archived via API; local files remain.

7. **Export reminder snapshot** for weekly email automation:

```bash
cd retro-api && npm run export:reminder
```

This writes `docs/reminders/latest-reminder.json` in the orchestration repo. Remind the user to **commit** that file so Cloud Automations can read it from GitHub.

## Files to upload

- `retro.json`
- `analysis.json`
- `actions.json`
- `report.md`
- `feedback/*.json`

## On failure

- If MCP unavailable, fail safely and report clearly.
- Do not delete local files.
