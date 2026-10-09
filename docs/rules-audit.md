# Rules audit — Retrospective Lab

**Goal:** Clean up agent rules so they do not overlap or contradict each other.  
**Repos in scope:** `retro-lab` (root), `retro-api`, `retro-web`  
**Last audit:** 2026-09-19  
**Sign-off:** Islam Fathy (precedence + inventory complete)

---

## Precedence (when scopes overlap)

Highest wins first:

| Priority | Source | Scope | Example |
|----------|--------|-------|---------|
| 1 | **User Cursor rules** | Global (outside Git) | Personal tone, org-wide security |
| 2 | **Project rules** `alwaysApply: true` | Repo or workspace | `privacy.mdc`, `development.mdc` |
| 3 | **Project rules** (glob-scoped) | Matching file paths | `repos/retro-api/.cursor/rules/storage.mdc` on `src/services/**` |
| 4 | **`AGENTS.md`** | Root only — product engineering (sections 2–7 cover retro-api / retro-web) |
| 5 | **Skills** `.cursor/skills/*/SKILL.md` | When command invokes skill | `/analyze-retro` workflow steps |
| 6 | **Commands** `.cursor/commands/*.md` | Thin entry points | Args + “read skill X” |
| 7 | **Hooks** `.cursor/hooks/*.js` | Deterministic enforcement | Block `.env` edits, feedback `text` |

**Principles**

- **Rules** = short non-negotiables (privacy, layering, stack, security).
- **Skills** = multi-step procedures; link rules, do not copy them.
- **Commands** = pointer to skill + arguments; no duplicate workflows.
- **Hooks** = chat-time backup when agents forget rules.
- **API** (`config/guardrails.json`) = runtime enforcement for app behavior (C1, P1, P4).

---

## Inventory by repository

### retro-lab (root)

| File | Type | alwaysApply / globs | Purpose |
|------|------|---------------------|---------|
| `.cursor/rules/privacy.mdc` | Rule | always | Deanonymization, feedback text, team language |
| `.cursor/rules/orchestration.mdc` | Rule | always | Multi-repo routing; read AGENTS.md §2–7 + agentic-engineering.md |
| `.cursor/rules/development.mdc` | Rule | always | v1 stack, no secrets, no force push, Cursor-as-LLM |
| `AGENTS.md` | Agent context | — | Product engineering: stack, structure, tests, boundaries |
| `docs/agentic-engineering.md` | Agent catalog | — | Commands, skills, MCP, sub-agents, hooks, workflow order |
| `.cursor/skills/*/SKILL.md` | Skills | on command | Workflows (analyze, report, archive, …) |
| `.cursor/commands/*.md` | Commands | on invoke | Thin triggers |
| `.cursor/hooks/*.js` | Hooks | events | Policy + logging |
| `docs/guardrails.md` | Doc | — | API + hooks index |

### retro-api

| File | Type | alwaysApply / globs | Purpose |
|------|------|---------------------|---------|
| `.cursor/rules/architecture.mdc` | Rule | `src/**/*.js` | routes → controllers → services → storage |
| `.cursor/rules/storage.mdc` | Rule | `src/services/**`, `src/config/paths.js` | data dir, atomic writes, safe IDs |
| `.cursor/rules/testing.mdc` | Rule | `src/**`, `tests/**` | regression + API tests required |
| `.cursor/rules/security.mdc` | Rule | always (in repo) | input validation, no eval, no path traversal |

Shared privacy/stack rules: **root** `.cursor/rules/privacy.mdc` + `development.mdc` (workspace open via `retro-lab.code-workspace`).

### retro-web

| File | Type | alwaysApply / globs | Purpose |
|------|------|---------------------|---------|
| `.cursor/rules/frontend.mdc` | Rule | `**/*.{html,js,css}` | No framework, semantic HTML, API client only |

---

## Overlaps resolved

| Topic | Was duplicated in | Kept in | Removed / slimmed |
|-------|-------------------|---------|-------------------|
| Privacy / deanonymize | `AGENTS.md`, multiple skills | `privacy.mdc` | AGENTS.md section; skill bullets → link |
| Don’t edit feedback `text` | `AGENTS.md`, analyze skill, hook doc | `privacy.mdc` + hook | AGENTS.md repeat |
| v1 stack (no React/TS/DB) | `AGENTS.md` “Do not” | `development.mdc` | AGENTS.md list → link |
| No secrets / no force push | `AGENTS.md` | `development.mdc` | AGENTS.md repeat |
| No external LLM in API | `AGENTS.md`, analyze skill/command | `development.mdc` + skill one-liner | Command long “do not” |
| Multi-repo routing | `orchestration.mdc`, `AGENTS.md` | Both — **different depth**: rule = one line; AGENTS = table | — |
| Analyze workflow | command + skill (~80% duplicate) | **Skill** (full) | Command → args + read skill |
| API layering | PLAN.md only | `retro-api` `architecture.mdc` | — |
| Storage safety | PLAN.md only | `retro-api` `storage.mdc` | — |
| Frontend constraints | PLAN.md only | `retro-web` `frontend.mdc` | — |

---

## Contradictions fixed

| Issue | Resolution |
|-------|------------|
| Per-repo agent instructions | Consolidated in root `AGENTS.md` (§2–7); removed child `AGENTS.md` files |
| `orchestration.mdc` routing | Points to AGENTS.md §2–7 and `docs/agentic-engineering.md` |
| PLAN §18 listed rules not in repo | Implemented subset in child repos; PLAN remains roadmap |
| Privacy in 5+ places | Single source: `privacy.mdc`; skills reference it |

---

## Skills linked (procedures not in rules)

| Command | Skill | Rule dependencies |
|---------|-------|-------------------|
| `/analyze-retro` | `analyze-retrospective` | `privacy.mdc`, `development.mdc` |
| `/generate-report` | `generate-retro-report` | `privacy.mdc` |
| `/archive-retro` | `archive-retrospective` | `development.mdc` (no local delete) |
| `/weekly-action-reminder` | `weekly-action-reminder` | `privacy.mdc` |
| `/commit-latest-report` | `commit-latest-report` | `development.mdc` |
| `/reset-demo-retro` | `reset-demo-environment` | `privacy.mdc`, human confirm |

---

## MCP documentation (separate goal)

| Doc | Purpose |
|-----|---------|
| [`mcp-setup.md`](mcp-setup.md) | Auth, allowed tools, errors, MCP vs local paths |
| [`mcp-golden-path.md`](mcp-golden-path.md) | E2E checklist for `/archive-retro` sign-off |

Referenced from [`AGENTS.md`](../AGENTS.md) MCP section.

---

## Out of scope (documented, not duplicated in rules)

- **User-level Cursor rules** — maintained in Cursor Settings; not in Git.
- **PLAN.md** — full SDLC spec; agents read for scope, not as live rule files.
- **API guardrails C1/P1/P4** — enforced in `retro-api` code + `config/guardrails.json`.

---

## How to re-audit

1. List `.cursor/rules/*.mdc` in each repo.
2. Grep skills/commands for “Never” / “Do not” — should point to rules.
3. Confirm `AGENTS.md` stays product-focused; long agent procedures belong in `docs/agentic-engineering.md` and skills.
4. Update this file and bump **Last audit** date.
