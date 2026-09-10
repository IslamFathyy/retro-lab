# Retrospective Lab — Root Orchestration Repository

This is the **parent repository** for the Agentic SDLC teaching project. It orchestrates AI-assisted development across two application repositories:

| Repository | Purpose | Port |
|---|---|---|
| [`retro-api/`](retro-api/) | Node.js + Express REST API, local JSON storage | 3001 |
| [`retro-web/`](retro-web/) | HTML/CSS/Vanilla JS browser UI | 8080 |

## Quick start

```powershell
# Terminal 1 — API
cd retro-api
npm install
npm start

# Terminal 2 — Web UI
cd retro-web
npm start
```

Open http://localhost:8080

## What lives here (orchestration layer)

This root repo is **not** the running application. It coordinates agent work:

- **`AGENTS.md`** — parent agent instructions for multi-repo changes
- **`PLAN.md`** — full implementation plan
- **`.cursor/`** — shared commands, skills, sub-agents, rules, hooks
- **`docs/`** — workflow, guardrails, teaching guide

Child repos have their own `AGENTS.md` and repo-specific rules.

## Open in Cursor (all 3 repos visible)

**Recommended:** open the workspace file (shows `retro-lab`, `retro-api`, and `retro-web` in Source Control):

1. **File → Open Workspace from File…**
2. Select `retro-lab.code-workspace` in this folder
3. In **Source Control**, use the repository dropdown to switch between the three repos

## Typical workflow (Cursor-driven testing)

1. Open **`retro-lab.code-workspace`** in Cursor.
2. Start `retro-api` and `retro-web` (for validation only).
3. Follow **`docs/cursor-test-workflow.md`** — run commands in order (`/verify-project` → `/seed-demo-retro` → `/analyze-retro` → …).
4. Use the **web UI** to validate `analysis.json`, actions, and report — not to drive the test.

Master command: **`/run-retro-workflow`**

## Teaching goal

Learn Agentic AI across the SDLC with a small real app — multi-repo coordination, rules, skills, sub-agents, hooks, MCP, and human-in-the-loop approval.
