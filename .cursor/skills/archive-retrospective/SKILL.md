---
name: archive-retrospective
description: Archive retrospective files to Google Drive via MCP when configured. Copy only, never delete local files.
---

# Archive Retrospective Skill

1. Validate retrospective is ready (report exists, human confirmed).
2. If Google Drive MCP is configured, upload to `Retrospective Management/Archive/{year}/{retroId}/`.
3. Files to upload: retro.json, feedback/*.json, analysis.json, actions.json, report.md
4. Verify upload; if MCP unavailable, fail safely and report clearly.
5. Mark archived via API; local files remain.
