# retro-lab

> **Retrospective Lab** — Agentic SDLC teaching stack. Parent orchestration repo (`retro-lab` on disk and GitHub) plus two application repos. Cursor runs the retrospective workflow (analysis, reports, archive); the web UI validates results. No external LLM inside the running API.

**Clone path:** use folder name `retro-lab` (matches the Git remote) — `git clone …/retro-lab.git` then `cd retro-lab`. If your parent folder has another name (e.g. from an old clone), close Cursor and run `.\scripts\align-folder-name.ps1` or rename manually to `retro-lab`, then reopen **`retro-lab.code-workspace`**.

## Table of contents

- [Quick start](#quick-start)
- [5-minute setup](#5-minute-setup)
- [Team onboarding](#team-onboarding)
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
2. **MCP (optional):** `copy env.example .env`, then `.\scripts\setup-mcp.ps1` — see [MCP Integration Setup](#mcp-integration-setup-optional). **Restart Cursor** after setup.
3. In chat: **`/verify-project`**, then **`/run-retro-workflow`** or [`docs/cursor-test-workflow.md`](docs/cursor-test-workflow.md).

Open http://localhost:8080

---

## Team onboarding

1. Clone **retro-lab** and run **`clone-repos.sh`** (above).
2. Open the **workspace file** and read **[`AGENTS.md`](AGENTS.md)** (orchestration agent + routing).
3. Skim **[`docs/cursor-test-workflow.md`](docs/cursor-test-workflow.md)** — prompt order for testing.
4. Optional: complete **[MCP Integration Setup](#mcp-integration-setup-optional)** for archive, email, and GitHub workflows.
5. Per-repo stack and boundaries: [`AGENTS.md`](AGENTS.md). Cursor workflows: [`docs/agentic-engineering.md`](docs/agentic-engineering.md).

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
