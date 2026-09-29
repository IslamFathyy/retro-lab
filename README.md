# Retrospective Lab

> **Agentic SDLC teaching lab** — a parent orchestration repo plus two application repos. Cursor runs the retrospective workflow (analysis, reports, archive); the web UI validates results. No external LLM inside the running API.

## Table of contents

- [Quick start](#quick-start)
- [5-minute setup](#5-minute-setup)
- [Team onboarding](#team-onboarding)
- [Prerequisites](#prerequisites)
- [Repository structure](#repository-structure)
- [Development ports](#development-ports)
- [MCP setup (Cursor agents)](#mcp-setup-cursor-agents)
- [AI concepts in this repo](#ai-concepts-in-this-repo)
- [Typical workflow](#typical-workflow)
- [Documentation map](#documentation-map)
- [Security](#security)
- [Links](#links)

---

## Quick start

| Repo | Role | Port |
|------|------|------|
| **This repo (retro-lab)** | Commands, skills, MCP config, docs | — |
| [`repos/retro-api/`](repos/retro-api/) | REST API + local JSON storage | 3001 |
| [`repos/retro-web/`](repos/retro-web/) | Read-only validation UI | 8080 |

Child repos are **separate git repositories** (not vendored in the parent clone). See [`repos/README.md`](repos/README.md) and [`repos.json`](repos.json).

---

## 5-minute setup

```bash
git clone https://github.com/IslamFathyy/retro-lab.git
cd retro-lab
bash clone-repos.sh          # Windows: Git Bash, or: bash clone-repos.sh
```

```powershell
# Terminal 1 — API
cd repos/retro-api
copy .env.example .env         # if present
npm install
npm start

# Terminal 2 — Web
cd repos/retro-web
npm install
npm start
```

1. Open **`retro-lab.code-workspace`** in Cursor (all three repos in Source Control).
2. **Settings → MCP** — confirm project servers from [`.cursor/mcp.json`](.cursor/mcp.json) are enabled; **Reload Window** after changes.
3. In chat: **`/verify-project`**, then **`/run-retro-workflow`** or [`docs/cursor-test-workflow.md`](docs/cursor-test-workflow.md).

Open http://localhost:8080

---

## Team onboarding

1. Clone **retro-lab** and run **`clone-repos.sh`** (above).
2. Open the **workspace file** and read **[`AGENTS.md`](AGENTS.md)** (orchestration agent + routing).
3. Skim **[`docs/cursor-test-workflow.md`](docs/cursor-test-workflow.md)** — prompt order for testing.
4. Optional: complete **[MCP setup](#mcp-setup-cursor-agents)** for archive, email, and GitHub workflows.
5. Per-repo detail: [`repos/retro-api/README.md`](repos/retro-api/README.md), [`repos/retro-web/AGENTS.md`](repos/retro-web/AGENTS.md).

**What you get:** one workspace, three git repos, shared Cursor commands/skills, and a full demo retrospective path without calling OpenAI/Anthropic from `retro-api`.

---

## Prerequisites

- **Git**
- **Node.js 18+** and **npm** (API + web)
- **Cursor** (commands, skills, MCP)
- **Git Bash** on Windows (for `clone-repos.sh`), or clone child repos manually from [`repos.json`](repos.json)

Optional for full workflow:

- **Google Drive MCP** OAuth (archive) — see [`docs/mcp-setup.md`](docs/mcp-setup.md)
- **Gmail MCP** OAuth (weekly reminder test)
- **GitHub MCP** OAuth (`/commit-latest-report`)

---

## Repository structure

```
retro-lab/                 ← you are here (orchestration)
├── .cursor/               commands, skills, sub-agents, rules, hooks, mcp.json
├── docs/                  workflows, MCP, guardrails, automation
├── plugins/readme-doctor/ optional Cursor plugin (README MCP)
├── clone-repos.sh         clones app repos into repos/
├── repos.json             paths, git URLs, ports
└── repos/
    ├── retro-api/         own .git → backend
    └── retro-web/         own .git → frontend
```

The parent [`.gitignore`](.gitignore) excludes `repos/retro-api/` and `repos/retro-web/` so demo data and app history stay in child remotes.

**Architecture (runtime):**

```text
Browser → retro-web → REST → retro-api → data/*.json
Cursor agent → commands/skills → API + local files
MCP (Drive, Gmail, GitHub) → Cursor only — not the running web app
```

---

## Development ports

| Service | URL | Notes |
|---------|-----|--------|
| retro-api | http://localhost:3001/api/health | `npm start` in `repos/retro-api` |
| retro-web | http://localhost:8080 | `npm start` in `repos/retro-web` |

API env (see `repos/retro-api/.env.example`): `PORT`, `DATA_ROOT`.

---

## MCP setup (Cursor agents)

Project MCP config: **[`.cursor/mcp.json`](.cursor/mcp.json)** (template: [`.cursor/mcp.example.json`](.cursor/mcp.example.json)).

| Server | Used for |
|--------|----------|
| **readme-doctor** | `/check-readme`, `/fix-readme` |
| **google-drive** | `/archive-retro`, Drive cleanup on `/reset-demo-retro` |
| **gmail** | `/weekly-action-reminder` |
| **github** | `/commit-latest-report`, PR/issue tools |

**First-time:** open retro-lab as the workspace folder so `${workspaceFolder}/plugins/readme-doctor/...` resolves. Complete OAuth per [`docs/mcp-setup.md`](docs/mcp-setup.md). Avoid duplicating the same server names in user `~/.cursor/mcp.json`.

Sign-off checklist: [`docs/mcp-golden-path.md`](docs/mcp-golden-path.md).

---

## AI concepts in this repo

| Concept | Location | Example |
|---------|----------|---------|
| **Rules** | [`.cursor/rules/`](.cursor/rules/) | privacy, orchestration, development |
| **Commands** | [`.cursor/commands/`](.cursor/commands/) | `/analyze-retro`, `/run-retro-workflow` |
| **Skills** | [`.cursor/skills/`](.cursor/skills/) | analyze-retrospective, archive-retrospective |
| **Sub-agents** | [`.cursor/agents/`](.cursor/agents/) + Task | feedback-analyst, verifier |
| **Hooks** | [`.cursor/hooks.json`](.cursor/hooks.json) | JSON validation, subagent activity log |
| **MCP** | [`.cursor/mcp.json`](.cursor/mcp.json) | Drive, Gmail, GitHub |
| **Plugins** | [`.cursor-plugin/marketplace.json`](.cursor-plugin/marketplace.json) | readme-doctor |

Deeper catalog: [`AGENTS.md`](AGENTS.md), [`docs/sub-agents.md`](docs/sub-agents.md), [`docs/guardrails.md`](docs/guardrails.md), [`docs/automation-tiers.md`](docs/automation-tiers.md).

**Testing model:** Cursor is the test runner; the web UI is for **validation only**. AI analysis runs in the agent (`/analyze-retro`), then imports via `POST .../analysis/import` — no LLM API keys in `retro-api`.

---

## Typical workflow

Master command: **`/run-retro-workflow`** — see [`.cursor/commands/run-retro-workflow.md`](.cursor/commands/run-retro-workflow.md).

Short path:

1. `/verify-project`
2. `/seed-demo-retro` (if no demo data)
3. `/close-retro {retroId}` → `/analyze-retro {retroId}` → **`/approve-suggestions`** (human types `approve SUG-###`)
4. `/generate-report` → `/validate-retro-ui` → `/archive-retro` → `/commit-latest-report`

Full prompt order: [`docs/cursor-test-workflow.md`](docs/cursor-test-workflow.md).

---

## Documentation map

| Doc | Purpose |
|-----|---------|
| [`AGENTS.md`](AGENTS.md) | Parent agent, MCP matrix, skills catalog |
| [`PLAN.md`](PLAN.md) | Scope and acceptance criteria |
| [`docs/cursor-test-workflow.md`](docs/cursor-test-workflow.md) | Step-by-step Cursor testing |
| [`docs/mcp-setup.md`](docs/mcp-setup.md) | Drive / Gmail / GitHub auth |
| [`docs/rules-audit.md`](docs/rules-audit.md) | Rules vs skills precedence |
| [`docs/plugins/readme-doctor.md`](docs/plugins/readme-doctor.md) | README Doctor plugin |
| [`config/README.md`](config/README.md) | Shared action-teams, guardrails JSON |

---

## Security

- Do not commit `.env`, OAuth keys, or `repos/retro-api/data/` (child repo local data).
- MCP tokens live on your machine (e.g. `~/.config/google-drive-mcp/`), not in git.
- Anonymous feedback must not be deanonymized in analysis — see [`.cursor/rules/privacy.mdc`](.cursor/rules/privacy.mdc).

---

## Links

| Repository | URL |
|------------|-----|
| retro-lab (this repo) | https://github.com/IslamFathyy/retro-lab.git |
| retro-api | https://github.com/IslamFathyy/retro-api.git |
| retro-web | https://github.com/IslamFathyy/retro-web.git |

**Teaching goal:** practice Agentic AI across the SDLC — multi-repo coordination, rules, skills, sub-agents, hooks, MCP, and human-in-the-loop approval on suggested actions.
