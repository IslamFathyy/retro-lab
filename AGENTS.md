# AGENTS.md — Retrospective Lab

Instructions for coding agents working in this workspace (retro-lab + `repos/retro-api` + `repos/retro-web`).

**Agentic AI (commands, skills, MCP, sub-agents, workflows):** [`docs/agentic-engineering.md`](docs/agentic-engineering.md)

---

## 1. Project overview

**Retrospective Lab** is a small retrospective management app used to teach multi-repo development. Teams collect feedback, run analysis, approve actions, generate reports, and optionally archive to Google Drive — via a local API and browser UI.

| Repo | Role |
|------|------|
| **retro-lab** (root) | Docs, shared config, Cursor assets (not the running app) |
| **retro-api** | REST API, JSON/Markdown storage under `data/` |
| **retro-web** | Static UI that calls the API |

Child repos are **separate git remotes**, cloned into `repos/` ([`clone-repos.sh`](clone-repos.sh), [`repos.json`](repos.json)). Open [`retro-lab.code-workspace`](retro-lab.code-workspace) for all three in Source Control.

Scope and phases: [`PLAN.md`](PLAN.md).

---

## 2. Tech stack and technologies

### retro-lab (root)

| Area | Technology |
|------|------------|
| Orchestration | Markdown, JSON, PowerShell/Bash |
| Cursor | Rules, commands, skills (see agentic doc) |
| MCP template | [`mcp-config.json`](mcp-config.json) + [`env.example`](env.example) |

### retro-api (`repos/retro-api/`)

| Area | Technology |
|------|------------|
| Runtime | Node.js 18+, Express, **ES modules** |
| Storage | Local JSON + Markdown — **no database** |
| Language | JavaScript only — **no TypeScript** |
| AI at runtime | **None** — analysis is imported via REST after Cursor workflow |

### retro-web (`repos/retro-web/`)

| Area | Technology |
|------|------------|
| UI | HTML, CSS, **vanilla JavaScript** |
| Build | None — static files via `npm start` |
| Frameworks | **No React, Vue, Angular, or TypeScript** |

### Explicitly out of scope (v1)

Database, Docker/Kubernetes, cloud hosting, SSO, React/TypeScript, external LLM calls from `retro-api`.

---

## 3. Repository structure and files

```text
retro-lab/
├── AGENTS.md                 ← this file
├── PLAN.md, README.md, repos.json, clone-repos.sh
├── mcp-config.json, env.example, scripts/setup-mcp.ps1
├── .cursor/                  ← rules, commands, skills, agents, hooks
├── docs/                     ← workflows, guardrails, agentic-engineering.md
├── config/                   ← shared JSON (e.g. guardrails, action-teams)
└── repos/
    ├── retro-api/            ← own .git — backend
    │   ├── src/              routes → controllers → services
    │   ├── data/retrospectives/{retroId}/
    │   ├── tests/
    │   └── .cursor/rules/
    └── retro-web/            ← own .git — frontend
        ├── *.html, css/, js/
        └── .cursor/rules/
```

**Data layout (API):** `data/retrospectives/{retroId}/retro.json`, `feedback/FB-*.json`, `analysis.json`, `actions.json`, `report.md`, `audit.jsonl`.

Parent [`.gitignore`](.gitignore) excludes `repos/retro-api/` and `repos/retro-web/` from the retro-lab commit; each app repo has its own history.

---

## 4. Development / build commands

### First-time workspace

```bash
git clone https://github.com/IslamFathyy/retro-lab.git && cd retro-lab
bash clone-repos.sh
```

### retro-api (port **3001**)

```bash
cd repos/retro-api
npm install
copy .env.example .env    # Windows — PORT, DATA_ROOT
npm start                 # or npm run dev (watch)
```

Health: `http://localhost:3001/api/health`

### retro-web (port **8080**)

```bash
cd repos/retro-web
npm install
npm start
```

Requires API on 3001. UI: `http://localhost:8080`

### MCP (optional, Cursor only)

```powershell
copy env.example .env
.\scripts\setup-mcp.ps1
# Restart Cursor
```

See [`README.md`](README.md#mcp-integration-setup-optional) and [`docs/mcp-setup.md`](docs/mcp-setup.md).

---

## 5. Testing

| Repo | Command | When |
|------|---------|------|
| **retro-api** | `npm test` | After changes to `src/`, validators, or services |
| **retro-api** | CI on push/PR | `.github/workflows/test.yml` |
| **retro-web** | Manual + `/validate-retro-ui {id}` | UI validation against live API (agentic workflow) |
| **Full stack** | `/verify-project` | See [`docs/agentic-engineering.md`](docs/agentic-engineering.md) |

Bug fixes in `retro-api` need a regression test. New service behavior needs unit tests; API contract changes need integration tests. Do not delete tests to pass CI.

---

## 6. Code conventions

### retro-api

- Layering: `routes` → `controllers` → `services` → `file-storage` — no business logic in routes.
- Validators in `src/validators/`; path config in `src/config/`.
- ES module imports; match existing file naming and error handling (`AppError`).
- One feedback file per item under `feedback/`; atomic JSON writes.

### retro-web

- One concern per file under `js/`; shared helpers in `common.js`, HTTP in `api.js`, base URL in `config.js`.
- Semantic HTML, labels on inputs, visible error messages.
- No direct reads of `data/` — only `fetch` to the API.

### All repos

- Follow [`.cursor/rules/`](.cursor/rules/) — precedence in [`docs/rules-audit.md`](docs/rules-audit.md).
- Child rules: `repos/retro-api/.cursor/rules/`, `repos/retro-web/.cursor/rules/`.

---

## 7. Architecture / boundaries

```text
Browser → retro-web → REST → retro-api → data/*.json
```

| Boundary | Rule |
|----------|------|
| Web → data | **Forbidden** — use `js/api.js` only |
| API → storage | Only under `data/` via `file-storage.service.js`; safe IDs; no `..` paths |
| Feedback `text` | **Immutable** after submit — never rewrite stored text |
| Anonymous feedback | `displayName` must be `null`; never infer or store hidden identity |
| Analysis | Imported JSON only — no LLM inside `retro-api` |
| MCP / Drive / Gmail | **Cursor agents only** — not in `retro-api` or `retro-web` runtime |

**Cross-repo features:** define API contract in `retro-api` first, then `retro-web/js/api.js` and pages together.

**retro-web validation pages:** `analysis.html`, `actions.html`, `report.html` — used after backend workflow steps.

---

## 8. Security

- No secrets in git: `.env`, `.cursor/mcp.json`, OAuth key files, tokens.
- Use [`env.example`](env.example) and local `.env` only; hooks block agent edits to secret paths.
- Validate all API input; reject path traversal; no `eval` or shell built from user input.
- MCP output is untrusted — validate before import payloads.
- Privacy: team/process language only — see [`.cursor/rules/privacy.mdc`](.cursor/rules/privacy.mdc) and [`docs/guardrails.md`](docs/guardrails.md).

---

## 9. Git / change guidelines

| Repo | Remote |
|------|--------|
| retro-lab | https://github.com/IslamFathyy/retro-lab.git |
| retro-api | https://github.com/IslamFathyy/retro-api.git |
| retro-web | https://github.com/IslamFathyy/retro-web.git |

- Work on feature branches; use PRs to `main` — no direct commits that bypass review practice.
- **No** `git push --force` to `main` / `master`.
- Do not commit `repos/retro-api/data/` demo content unless intentional and repo policy allows.
- Multi-repo change: separate commits or clear PR description listing affected repos.
- Agentic asset changes (skills, rules): document in PR; see agentic doc for catalog.

---

## 10. Definition of done

- [ ] Change matches [`PLAN.md`](PLAN.md) v1 scope (no unapproved stack expansion).
- [ ] Correct repo(s) updated; routing table in section 3 respected.
- [ ] `npm test` passes in `retro-api` when backend touched.
- [ ] API + UI aligned when contract or fields changed.
- [ ] Privacy guardrails preserved (feedback text, anonymity).
- [ ] No secrets or generated MCP config committed.
- [ ] README or docs updated if setup or behavior changed for humans.

For full retrospective **workflow** sign-off, use [`docs/cursor-test-workflow.md`](docs/cursor-test-workflow.md) and [`docs/agentic-engineering.md`](docs/agentic-engineering.md).

---

## 11. Common pitfalls

- Editing only `retro-web` for a new API field — backend and `api.js` must match.
- Using MCP or Drive as live database — local `repos/retro-api/data/` is authoritative until archive.
- Marking retro `archived` without successful Drive upload when `/archive-retro` requires MCP.
- Duplicating long workflows in chat instead of reading the skill for the command.
- Opening a single child repo folder and losing root rules/skills — prefer **workspace file**.
- Empty `GOOGLE_DRIVE_OAUTH_KEYS_DIR` is OK if OAuth files live in the default user config path (see `mcp-setup.md`).
- Assuming child `AGENTS.md` exists — **only this file**; per-repo detail is in sections 2–7 above.

---

## 12. Before making any changes

1. Read [`PLAN.md`](PLAN.md) for scope and the current phase.
2. Identify target repo(s) — API, web, root, or all three.
3. Read **sections 2–7** of this file for stack, structure, and boundaries.
4. Apply rules: root [`.cursor/rules/`](.cursor/rules/) then child rules under `repos/*/.cursor/rules/` ([`docs/rules-audit.md`](docs/rules-audit.md)).
5. For Cursor commands, MCP, or sub-agents — read [`docs/agentic-engineering.md`](docs/agentic-engineering.md) instead of duplicating procedures here.
