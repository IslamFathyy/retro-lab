# Agentic engineering — Retrospective Lab

Cursor commands, skills, sub-agents, MCP, hooks, and workflow order for this teaching lab. **Application runtime** (`retro-api`, `retro-web`) does not call external LLMs or MCP — that work happens in the IDE agent.

**Product engineering context:** [`AGENTS.md`](../AGENTS.md) (stack, structure, tests, boundaries).

---

## Testing model

| Layer | Role |
|-------|------|
| Cursor agent | Demo data, AI analysis, reports, verification, archive |
| `retro-api` | REST API + local JSON storage |
| `retro-web` | Read-only validation in the browser |

AI analysis: run `/analyze-retro {id}` in Cursor, then import via:

`POST /api/retrospectives/{retroId}/analysis/import`

Never call external LLM APIs from `retro-api`.

---

## Repository routing (agent work)

| Task type | Target |
|-----------|--------|
| API, storage, import, reports | `repos/retro-api/` |
| HTML, CSS, JS, UI | `repos/retro-web/` |
| Commands, skills, sub-agents, hooks, MCP docs | retro-lab root |
| Cross-cutting feature | `retro-api` + `retro-web` (coordinate contract first) |

---

## Command workflow (golden path)

Master: [`.cursor/commands/run-retro-workflow.md`](../.cursor/commands/run-retro-workflow.md) — detail: [`cursor-test-workflow.md`](cursor-test-workflow.md).

| Step | Command |
|------|---------|
| 1 | `/verify-project` |
| 2 | `/seed-demo-retro` |
| 3 | `/close-retro {id}` |
| 4 | `/analyze-retro {id}` — sub-agents via Task; parent merges + imports |
| 5 | `/approve-suggestions {id}` — **human** types `approve SUG-###` |
| 6 | `/review-actions {id}` |
| 7 | `/generate-report {id}` |
| 8 | `/validate-retro-ui {id}` |
| 9 | `/archive-retro {id}` |
| 10 | `/commit-latest-report` |

Other commands (no dedicated skill): `.cursor/commands/` — e.g. `/verify-project`, `/close-retro`, `/prepare-next-retro`.

---

## Skills catalog

Read `.cursor/skills/<name>/SKILL.md` before running the matching command. Procedures live in skills; non-negotiables live in [`.cursor/rules/`](../.cursor/rules/) — see [`rules-audit.md`](rules-audit.md).

### Skill file shape

| Section | Role |
| --- | --- |
| YAML `description` | Informative summary of what the capability does in this lab (not step orders or “use when” imperatives). |
| **When to use** | Triggers and a single **Out of scope** line. |
| **Inputs** | Data sources and prerequisites. |
| **Output** | Artifacts, API effects, and handoffs (pairs with **Inputs**; replaces the old **Purpose** section). |
| **Workflow** | Ordered steps only. |
| **Decision rules** / **Validation** / **Failure handling** | Judgment, checks, and recovery — no repeat of **Output** bullets. |
| **References** | Links and paths not already stated above. |

Avoid a separate **Completion criteria** section when **Validation** already states done conditions.

| Skill | Command | When |
|-------|---------|------|
| analyze-retrospective | `/analyze-retro {id}` | Closed retro — themes, strengths, concerns, suggested actions |
| generate-retro-report | `/generate-report {id}` | After actions approved — report + insights |
| archive-retrospective | `/archive-retro {id}` | Drive backup, local `archived`, reminder export |
| weekly-action-reminder | `/weekly-action-reminder` | Email open actions |
| commit-latest-report | `/commit-latest-report` | Push `docs/reminders/latest-reminder.json` to GitHub `main` |
| reset-demo-environment | `/reset-demo-retro` | Wipe demo + Drive (requires `RESET DEMO`) |

Published skill verification: [`skills/verify-analyze-retrospective.md`](skills/verify-analyze-retrospective.md).

---

## Sub-agents catalog

Use **Task** with `subagent_type` — do not inline their work in the parent. Handoffs: [`sub-agents.md`](sub-agents.md). Sign-off: [`sub-agents-golden-path.md`](sub-agents-golden-path.md).

| Role | Agent | Launched by |
|------|-------|-------------|
| Exploration | `feedback-analyst` | `/analyze-retro` |
| Execution | `improvement-advisor` | `/analyze-retro` |
| Verification | `verifier` | `/analyze-retro`, `/generate-report`, `/verify-project` |
| Exploration (report) | `insights-visualizer` | `/generate-report` |

Definitions: [`.cursor/agents/`](../.cursor/agents/).

---

## MCP (Cursor agents only)

Setup: [`mcp-setup.md`](mcp-setup.md). Sign-off: [`mcp-golden-path.md`](mcp-golden-path.md).

**Config:** [`mcp-config.json`](../mcp-config.json) → [`scripts/setup-mcp.ps1`](../scripts/setup-mcp.ps1) → gitignored `.cursor/mcp.json`. Secrets in `.env` from [`env.example`](../env.example).

| Task | Use | Do not use |
|------|-----|------------|
| CRUD, close retro, import analysis, approve actions | `retro-api` REST | Drive MCP |
| Validate UI | `retro-web` + API | MCP |
| Sprint data during workflow | API / `repos/retro-api/data/` | Drive as source of truth |
| Long-term backup | **Google Drive MCP** on `/archive-retro` | Delete local files |
| Weekly email | **Gmail MCP** on `/weekly-action-reminder` | — |
| Reminder snapshot on GitHub | Git / GitHub MCP on `/commit-latest-report` | Push secrets or `data/` |

MCP rules: copy-only archive; fail `/archive-retro` if Drive unavailable; validate MCP output before API import.

---

## Hooks

[`.cursor/hooks.json`](../.cursor/hooks.json) — docs: [`docs/hooks/`](hooks/). Index: [`guardrails.md`](guardrails.md).

| Hook | Enforces |
|------|----------|
| `block-dangerous-command.js` | No force push / destructive shell |
| `validate-json.js` | Valid JSON after edits |
| `protect-feedback-text.js` | Do not change feedback `text` |
| `block-secrets-path.js` | No `.env` / credentials / generated `mcp.json` in repo |

---

## Automation tiers

| Tier | When | Doc |
|------|------|-----|
| IDE (interactive) | Commands, skills, MCP on localhost | `cursor-test-workflow.md` |
| Cursor Automation | Scheduled weekly email | `cursor-automation-weekly-reminder.md` |
| Cloud Agent | Automations runtime | `automation-tiers.md` |
| GitHub Actions | `npm test` on PR (`retro-api`) | `repos/retro-api/.github/workflows/test.yml` |

Evidence: [`automation-tiers.md`](automation-tiers.md), [`automation-golden-path.md`](automation-golden-path.md).

---

## Plugins

| Plugin | Purpose | Doc |
|--------|---------|-----|
| readme-doctor | Safe README analyze/improve via MCP | [`plugins/readme-doctor.md`](plugins/readme-doctor.md) |

Manifest: [`.cursor-plugin/marketplace.json`](../.cursor-plugin/marketplace.json). Retro workflow assets stay in `.cursor/` — not bundled in the plugin.

---

## Human approval (agent workflows)

Required before:

- `/reset-demo-retro` — user confirms `RESET DEMO`
- `/approve-suggestions` — user types `approve SUG-###` (only interactive workflow gate)
- Merging pull requests
- Changing project architecture or v1 stack

---

## Rules vs skills vs this doc

| Layer | Location | Purpose |
|-------|----------|---------|
| Rules | `.cursor/rules/*.mdc` | Short non-negotiables |
| Skills | `.cursor/skills/*/SKILL.md` | Step-by-step procedures |
| Commands | `.cursor/commands/*.md` | Thin entry points |
| This doc | `docs/agentic-engineering.md` | Catalog and pointers |

Precedence: [`rules-audit.md`](rules-audit.md).
