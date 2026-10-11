# Retrospective Lab

> **Agentic SDLC teaching lab** — a parent orchestration repo plus two application repos. Cursor runs the retrospective workflow (analysis, reports, archive); the web UI validates results. No external LLM inside the running API.

## Table of contents

- [Quick start](#quick-start)
- [Onboarding / setup the project](#onboarding--setup-the-project)
- [Prerequisites](#prerequisites)
- [Repository structure](#repository-structure)
- [Development ports](#development-ports)
- [MCP Integration Setup (optional)](#mcp-integration-setup-optional)
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

## Onboarding / setup the project

End-to-end setup for a new machine: parent repo, child app repos, local servers, Cursor workspace, and optional MCP.

### 1. Clone the orchestration repo

```bash
git clone https://github.com/IslamFathyy/retro-lab.git
cd retro-lab
```

### 2. Clone application repos (`clone-repos.sh`)

Child apps are **not** included in the parent clone. From the **retro-lab root**, run:

```bash
bash clone-repos.sh
```

| Platform | How to run |
|----------|------------|
| Windows | **Git Bash** from repo root, or `bash clone-repos.sh` from PowerShell if `bash` is on PATH |
| macOS / Linux | `bash clone-repos.sh` |

The script ([`clone-repos.sh`](clone-repos.sh)) reads the same URLs as [`repos.json`](repos.json), creates `repos/`, and clones **`retro-api`** and **`retro-web`** on branch `main`. If a folder already has a `.git` directory, it skips; otherwise it clones fresh.

**Manual alternative:** clone each URL from `repos.json` into `repos/<name>/`.

### 3. Install and run API + web

```powershell
# Terminal 1 — API (port 3001)
cd repos/retro-api
copy .env.example .env    # if present
npm install
npm start

# Terminal 2 — Web (port 8080)
cd repos/retro-web
npm install
npm start
```

Open http://localhost:8080 (API health: http://localhost:3001/api/health).

### 4. Open the Cursor workspace

1. Open **`retro-lab.code-workspace`** in Cursor (parent + both child repos in Source Control).
2. Read **[`AGENTS.md`](AGENTS.md)** for repo routing, stack, and boundaries.
3. Cursor assets (commands, skills, hooks) load from **retro-lab** `.cursor/` — prefer the workspace file over opening only `repos/retro-api` or `repos/retro-web`.

### 5. MCP setup (optional — archive, email, GitHub)

MCP runs in **Cursor only**; the running web app never calls MCP. Team config is a **template in git**; each developer generates a **local** file Cursor reads at runtime.

| File | In git? | Role |
|------|---------|------|
| [`env.example`](env.example) | Yes | Sample variable names — **copy** to `.env` |
| [`.env`](.env) | **No** | Your machine paths and settings (gitignored) |
| [`mcp-config.json`](mcp-config.json) | Yes | Committed MCP server template (`${env:VAR}` placeholders only) |
| [`.cursor/mcp.json`](.cursor/mcp.json) | **No** | **Generated** — Cursor loads this (gitignored) |

**Copy and generate flow:**

1. From retro-lab root: `copy env.example .env` (Windows) or `cp env.example .env` (macOS/Linux). Edit `.env` (e.g. `MCP_NPX_PATH`, `GOOGLE_DRIVE_OAUTH_KEYS_DIR`).
2. Run the setup script — it **loads `.env` into your environment** and **copies** `mcp-config.json` → `.cursor/mcp.json`:
   - Windows: `.\scripts\setup-mcp.ps1`
   - Git Bash / macOS / Linux: `bash scripts/setup-mcp.sh`
3. **Restart Cursor** (required after `.env` or `mcp-config.json` changes).
4. **Settings → MCP** — confirm project servers are enabled.

When the team changes MCP servers, edit **`mcp-config.json`** in git; each developer re-runs the setup script locally. **Do not commit** `.cursor/mcp.json` or `.env`.

OAuth and server details: [MCP Integration Setup (optional)](#mcp-integration-setup-optional) and [`docs/mcp-setup.md`](docs/mcp-setup.md).

### 6. First run in Cursor

1. **`/verify-project`** — API, web, and workspace checks.
2. **`/run-retro-workflow`** or follow [`docs/cursor-test-workflow.md`](docs/cursor-test-workflow.md).
3. Deeper agent catalog: [`docs/agentic-engineering.md`](docs/agentic-engineering.md).

**What you get:** three git repos in one workspace, shared commands/skills/hooks, and a full retrospective demo path without external LLM calls from `retro-api`.

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
├── mcp-config.json        committed MCP template (${env:...} placeholders)
├── env.example            copy to .env for MCP setup (gitignored)
├── scripts/setup-mcp.ps1  generates .cursor/mcp.json from template
├── .cursor/               commands, skills, sub-agents, rules, hooks (mcp.json local)
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

## MCP Integration Setup (optional)

Step-by-step copy flow (`env.example` → `.env`, `mcp-config.json` → `.cursor/mcp.json`): [Onboarding / setup the project](#onboarding--setup-the-project) §5.

| File | Role |
|------|------|
| [`mcp-config.json`](mcp-config.json) | **Committed template** — team source of truth; `${env:VAR}` only, no tokens |
| [`.cursor/mcp.json`](.cursor/mcp.json) | **Generated locally** (gitignored) — Cursor reads this at runtime |
| [`.env`](.env) | **Gitignored** — real values; copy from [`env.example`](env.example) |

**Developer flow:**

1. `copy env.example .env` and set paths (e.g. `MCP_NPX_PATH`, `GOOGLE_DRIVE_OAUTH_KEYS_DIR`).
2. Run **`.\scripts\setup-mcp.ps1`** (Windows) or **`bash scripts/setup-mcp.sh`** (Git Bash / macOS / Linux).
3. **Restart Cursor** after any `.env` or `mcp-config.json` change (Cursor resolves `${env:...}` from your environment).
4. **Settings → MCP** — confirm project servers are enabled.

To share behavior via git: edit **`mcp-config.json`**, re-run setup locally — do not commit `.cursor/mcp.json`.

| Server | Required? | Used for |
|--------|-----------|----------|
| **google-drive** | **Yes** for full archive golden path | `/archive-retro`, `/reset-demo-retro` Drive cleanup |
| **gmail** | Optional | `/weekly-action-reminder` |
| **github** | Optional | `/commit-latest-report`, PR/issue tools |
| **readme-doctor** | Optional | `/check-readme`, `/generate-readme` (build plugin first) |
| **Lokka / M365** | Personal | Keep in user `~/.cursor/mcp.json` — see `env.example` comments |

OAuth details: [`docs/mcp-setup.md`](docs/mcp-setup.md). Sign-off: [`docs/mcp-golden-path.md`](docs/mcp-golden-path.md).

---

## AI Agent Integration

Cursor agents use **commands, skills, and sub-agents** documented in [`docs/agentic-engineering.md`](docs/agentic-engineering.md). Application code never calls MCP — see [`AGENTS.md`](AGENTS.md).

---

## AI concepts in this repo

| Concept | Location | Example |
|---------|----------|---------|
| **Rules** | [`.cursor/rules/`](.cursor/rules/) | privacy, orchestration, development |
| **Commands** | [`.cursor/commands/`](.cursor/commands/) | `/analyze-retro`, `/run-retro-workflow` |
| **Skills** | [`.cursor/skills/`](.cursor/skills/) | analyze-retrospective, archive-retrospective |
| **Sub-agents** | [`.cursor/agents/`](.cursor/agents/) + Task | feedback-analyst, verifier |
| **Hooks** | [`.cursor/hooks.json`](.cursor/hooks.json) | JSON validation, subagent activity log |
| **MCP** | [`mcp-config.json`](mcp-config.json) → local [`.cursor/mcp.json`](.cursor/mcp.json) | Drive, Gmail, GitHub |
| **Plugins** | [`.cursor-plugin/marketplace.json`](.cursor-plugin/marketplace.json) | readme-doctor |

Deeper catalog: [`docs/agentic-engineering.md`](docs/agentic-engineering.md), [`docs/sub-agents.md`](docs/sub-agents.md), [`docs/guardrails.md`](docs/guardrails.md), [`docs/automation-tiers.md`](docs/automation-tiers.md).

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
| [`AGENTS.md`](AGENTS.md) | Stack, structure, tests, boundaries (all repos) |
| [`docs/agentic-engineering.md`](docs/agentic-engineering.md) | Commands, skills, MCP, sub-agents, workflow |
| [`PLAN.md`](PLAN.md) | Scope and acceptance criteria |
| [`docs/cursor-test-workflow.md`](docs/cursor-test-workflow.md) | Step-by-step Cursor testing |
| [`docs/mcp-setup.md`](docs/mcp-setup.md) | Drive / Gmail / GitHub auth |
| [`docs/rules-audit.md`](docs/rules-audit.md) | Rules vs skills precedence |
| [`docs/plugins/readme-doctor.md`](docs/plugins/readme-doctor.md) | README Doctor plugin |
| [`config/README.md`](config/README.md) | Shared action-teams, guardrails JSON |

---

## Security

- Do not commit `.env`, `.cursor/mcp.json`, OAuth keys, or `repos/retro-api/data/` (child repo local data).
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
