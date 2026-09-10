# Workflow

## Repositories

- **Root** — orchestrates agent work, commands, skills
- **retro-api** — backend + data
- **retro-web** — UI (validation view)

## Retrospective lifecycle

`draft → open → closed → analyzed → actioned → archived`

## Cursor test workflow (primary)

See **`docs/cursor-test-workflow.md`** for the full prompt order.

```text
/reset-demo-retro          ← full demo reset (local + Drive); confirm RESET DEMO
/verify-project
/seed-demo-retro
/close-retro {id}
/analyze-retro {id}        ← Cursor model analyzes local feedback
/approve-suggestions {id}
/review-actions {id}
/generate-report {id}
/validate-retro-ui {id}    ← open browser to confirm
/archive-retro {id}        ← Google Drive MCP backup + local archived + export snapshot
/commit-latest-report      ← push latest-reminder.json to GitHub main (mail automation)
```

## Agent workflow example

1. Cursor seeds retro + feedback via API (`/seed-demo-retro`).
2. Cursor closes retro (`/close-retro`).
3. **Cursor agent model** analyzes feedback → imports `analysis.json` (`/analyze-retro`).
4. User confirms → Cursor approves suggestions via API (`/approve-suggestions`).
5. `/generate-report` → `report.md`
6. User validates in web UI (`/validate-retro-ui`).
7. `/archive-retro` → Google Drive MCP backup + local archive status

## Human gates

- Approve suggestions → actions
- Archive retrospective
- Merge pull requests

## No external LLM in the app

The running web/API does not call OpenAI. AI analysis is performed by the **Cursor agent** when you run `/analyze-retro`.
