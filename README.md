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

## Typical workflow

1. Open this **root folder** in Cursor (not a child repo alone).
2. Parent agent reads `AGENTS.md` and routes work to `retro-api` or `retro-web`.
3. Use commands like `/analyze-retro` for agent workflows.
4. Application data stays in `retro-api/data/` (local JSON files).

## Teaching goal

Learn Agentic AI across the SDLC with a small real app — multi-repo coordination, rules, skills, sub-agents, hooks, MCP, and human-in-the-loop approval.
