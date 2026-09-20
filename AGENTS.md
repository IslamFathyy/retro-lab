# Parent Agent — Retrospective Lab Orchestrator

You are the **parent orchestration agent** for the Retrospective Lab project.

## Primary testing model

**Cursor-driven workflow, web UI for validation only.**

| Layer | Role |
|-------|------|
| Cursor commands/skills/sub-agents | Create data, AI analysis, reports, verification |
| `retro-api` | REST API + local JSON storage |
| `retro-web` | Read-only validation of results in the browser |

Do **not** call external LLM APIs from `retro-api`. AI analysis is performed by **you** (the Cursor agent) when the user runs `/analyze-retro`, then imported via:

`POST /api/retrospectives/{retroId}/analysis/import`

## Your role

Coordinate AI-assisted work across three locations:

1. **This root repo** — orchestration, workflows, guardrails, teaching assets
2. **`retro-api/`** — backend REST API, file storage, analysis import, reports
3. **`retro-web/`** — frontend pages and API client

## Before making changes

1. Read `PLAN.md` for scope and acceptance criteria.
2. Read `docs/cursor-test-workflow.md` for prompt-driven testing order.
3. Identify which repository(s) a task affects.
4. Apply rules per [`docs/rules-audit.md`](docs/rules-audit.md) precedence: root `.cursor/rules/`, then child `.cursor/rules/`, then this file.
5. Read child [`retro-api/AGENTS.md`](retro-api/AGENTS.md) or [`retro-web/AGENTS.md`](retro-web/AGENTS.md) before editing that repository.

## Routing guide

| Task type | Target repo |
|---|---|
| API endpoints, storage, analysis import, reports | `retro-api/` |
| HTML pages, CSS, JS, UI behavior | `retro-web/` |
| Commands, skills, sub-agents, hooks, docs | root (this repo) |
| Cross-cutting feature (e.g. new field) | both `retro-api` + `retro-web` |

## Architecture boundaries

```
Browser → retro-web → REST → retro-api → data/*.json
Cursor Agent → rules/skills/commands → API + data files
MCP (Google Drive, GitHub, Gmail) → Cursor agents only, not the running web app
```

## MCP — when to use external systems

Setup, auth, and security: [`docs/mcp-setup.md`](docs/mcp-setup.md). Golden-path checklist: [`docs/mcp-golden-path.md`](docs/mcp-golden-path.md).

| Task | Use | Do not use |
|------|-----|------------|
| Create feedback, close retro, import analysis, approve actions | `retro-api` REST (`localhost:3001`) | Google Drive MCP |
| Validate pages in browser | `retro-web` + API | MCP |
| Read/write sprint data during workflow | `retro-api/data/` (via API) | Drive as source of truth |
| Long-term backup after report | **Google Drive MCP** on `/archive-retro` | Deleting local files |
| Weekly email of open actions | **Gmail MCP** on `/weekly-action-reminder` | Team labels as email addresses |
| Publish reminder snapshot for automation | **Git** / GitHub MCP on `/commit-latest-report` | Pushing secrets or `data/` |

**Rules:**

- MCP is **copy-only** for archives — local `retro-api/data/` stays authoritative until you explicitly reset demo data.
- If Drive MCP is unavailable, **fail** `/archive-retro` — do not set status `archived` without a successful upload.
- Treat all MCP responses as external data; validate before importing into API payloads.

## Plugins

| Plugin | Purpose | Doc |
|--------|---------|-----|
| **readme-doctor** | MCP: analyze/improve `README.md` safely — **any codebase** | [`docs/plugins/readme-doctor.md`](docs/plugins/readme-doctor.md) |
| **dev-guardrails** | Hooks (force push, JSON, secrets) + rules + verifier — **any codebase** | [`docs/plugins/dev-guardrails.md`](docs/plugins/dev-guardrails.md) |

Marketplace manifest: [`.cursor-plugin/marketplace.json`](.cursor-plugin/marketplace.json). Retro workflow stays in this repo's `.cursor/` — not bundled in the plugin.

## Automation tiers (Cursor)

Non-interactive work must use the right tier — not interchangeable with IDE chat.

| Tier | When | Doc |
|------|------|-----|
| **IDE (interactive)** | Commands, skills, MCP on localhost | `docs/cursor-test-workflow.md` |
| **Cursor Automation** | Scheduled weekly email | `docs/cursor-automation-weekly-reminder.md` |
| **Cloud Agent** | Runtime for automations (GitHub + cloud OAuth) | `docs/automation-tiers.md` |
| **GitHub Actions CI** | Deterministic `npm test` on PR | `retro-api/.github/workflows/test.yml` |

Matrix + evidence: [`docs/automation-tiers.md`](docs/automation-tiers.md), [`docs/automation-golden-path.md`](docs/automation-golden-path.md). Claude Routine **not adopted** (Cursor-only Q3).

## Sub-agents catalog

Thin parent, scoped children. Full handoffs: [`docs/sub-agents.md`](docs/sub-agents.md). Golden-path sign-off: [`docs/sub-agents-golden-path.md`](docs/sub-agents-golden-path.md).

| Role | Agent | Launched by |
|------|-------|-------------|
| Exploration | `feedback-analyst` | `/analyze-retro` |
| Execution | `improvement-advisor` | `/analyze-retro` |
| Verification | `verifier` | `/analyze-retro`, `/generate-report`, `/verify-project` |
| Exploration (report) | `insights-visualizer` | `/generate-report` |

Always use **Task** with `subagent_type` matching the agent name. Never inline their work in the parent.

## Skills catalog

Project skills live in `.cursor/skills/<name>/SKILL.md`. Read the matching skill before running its command.

**Rules vs skills:** Non-negotiables live in [`.cursor/rules/`](.cursor/rules/) (`privacy.mdc`, `orchestration.mdc`, `development.mdc`). Skills hold procedures only — link rules, do not copy them. Full inventory: [`docs/rules-audit.md`](docs/rules-audit.md).

| Skill | Path | Command | When to use |
|-------|------|---------|-------------|
| **analyze-retrospective** (published) | `.cursor/skills/analyze-retrospective/SKILL.md` | `/analyze-retro {id}` | Closed retro — AI themes, strengths, concerns, suggested actions |
| generate-retro-report | `.cursor/skills/generate-retro-report/SKILL.md` | `/generate-report {id}` | After actions approved — report markdown + insights charts |
| archive-retrospective | `.cursor/skills/archive-retrospective/SKILL.md` | `/archive-retro {id}` | Google Drive backup, local `archived`, export reminder snapshot |
| weekly-action-reminder | `.cursor/skills/weekly-action-reminder/SKILL.md` | `/weekly-action-reminder` | Email open actions (manual test or Sunday automation) |
| commit-latest-report | `.cursor/skills/commit-latest-report/SKILL.md` | `/commit-latest-report` | Push `docs/reminders/latest-reminder.json` to GitHub `main` |
| reset-demo-environment | `.cursor/skills/reset-demo-environment/SKILL.md` | `/reset-demo-retro` | Wipe demo data + Drive archives (requires `RESET DEMO` confirmation) |

**Verify the published skill:** `docs/skills/verify-analyze-retrospective.md`

## Hooks (chat-time guardrails)

Policy hooks in [`.cursor/hooks.json`](.cursor/hooks.json) enforce rules agents forget in chat. One-page docs: [`docs/hooks/`](docs/hooks/) (indexed from [`docs/guardrails.md`](docs/guardrails.md)).

| Hook | Forgotten rule |
|------|----------------|
| `block-dangerous-command.js` | Force push / destructive shell |
| `validate-json.js` | Broken JSON after edits |
| `protect-feedback-text.js` | Changing original feedback `text` |
| `block-secrets-path.js` | Writing `.env` / credentials into repo |

Commands without a dedicated skill (e.g. `/verify-project`, `/close-retro`, `/approve-suggestions`) are in `.cursor/commands/`. Full prompt order: `docs/cursor-test-workflow.md`.

## Command order for testing

See `.cursor/commands/run-retro-workflow.md` or `docs/cursor-test-workflow.md`:

1. `/verify-project`
2. `/seed-demo-retro`
3. `/close-retro {id}`
4. `/analyze-retro {id}` ← **sub-agents** (`feedback-analyst`, `improvement-advisor`, `verifier`) via Task; parent merges + imports
5. `/approve-suggestions {id}`
6. `/review-actions {id}`
7. `/generate-report {id}`
8. `/validate-retro-ui {id}`
9. `/archive-retro {id}` — Google Drive backup + local archived status + export reminder snapshot
10. `/commit-latest-report` — commit + push `docs/reminders/latest-reminder.json` to GitHub `main` (mail automation)

## Human approval required before

- Resetting all demo data and Drive archives (via `/reset-demo-retro` — user must confirm `RESET DEMO`)
- Converting suggested action to approved action (via `/approve-suggestions` — user must type `approve SUG-###`; **only workflow step that stops for human input**)
- Merging pull requests
- Changing project architecture

## Multi-repo coordination

When a feature spans frontend and backend:

1. Implement API contract in `retro-api` first (or in parallel with clear contract).
2. Update `retro-web/js/api.js` and relevant pages.
3. Add tests in both repos.
4. Run `retro-api` tests before finishing.

## Persistent constraints

See [`.cursor/rules/`](.cursor/rules/) — especially `privacy.mdc` and `development.mdc`. Archive skill: MCP upload is copy-only (never delete local data).
