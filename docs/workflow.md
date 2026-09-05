# Workflow

## Repositories

- **Root** — orchestrates agent work, commands, skills
- **retro-api** — backend + data
- **retro-web** — UI

## Retrospective lifecycle

`draft → open → closed → analyzed → actioned → archived`

## Agent workflow example

1. Team uses web UI for feedback (no LLM required).
2. Facilitator closes retro in UI.
3. Developer runs `/analyze-retro RETRO-2026-001` in Cursor.
4. Parent agent uses skills + sub-agents → writes `analysis.json`.
5. Facilitator approves suggestions in UI → actions created.
6. `/generate-report` → `report.md`
7. `/archive-retro` → Google Drive MCP (optional) + local archive status

## Human gates

- Approve suggestions → actions
- Archive retrospective
- Merge pull requests
