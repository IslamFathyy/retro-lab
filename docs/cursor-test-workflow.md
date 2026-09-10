# Cursor Test Workflow

Prompt-driven testing for Retrospective Lab. **Cursor is the test runner; the web UI is for validation only.**

## Architecture

```text
You (prompts) → Cursor Agent → API + local JSON files
                                      ↓
                              retro-web (read-only validation)
```

- **No external LLM API** in `retro-api`
- **Cursor's model** performs analysis when you run `/analyze-retro`
- Analysis is saved via `POST /api/retrospectives/{id}/analysis/import`

## Before you start

Terminal 1:

```powershell
cd retro-api
npm start
```

Terminal 2:

```powershell
cd retro-web
npm start
```

## Prompt order (copy one at a time)

### Step 0 — Verify

```text
/verify-project
```

### Step 1 — Seed data (skip if already present)

```text
/run-retro-workflow
```

Or check manually:

```bash
cd retro-api && npm run retro:status
```

If `hasData` is true, skip seeding and use `suggestedWorkflowTarget` (e.g. `RETRO-2026-001`). To force a reset: `/seed-demo-retro` then workflow.

Standalone seed (wipes and recreates Sprints 1–4):

```text
/seed-demo-retro
```

### Step 2 — Close retro

```text
/close-retro RETRO-2026-001
```

Replace with your ID.

### Step 3 — AI analysis (Cursor model)

```text
/analyze-retro RETRO-2026-001
```

Agent reads feedback files, analyzes with Cursor AI, imports `analysis.json`.

### Step 4 — Approve actions

```text
/approve-suggestions RETRO-2026-001
```

Confirm when asked which suggestions to approve.

### Step 5 — Review actions

```text
/review-actions RETRO-2026-001
```

### Step 6 — Report

```text
/generate-report RETRO-2026-001
```

### Step 7 — Validate in browser

```text
/validate-retro-ui RETRO-2026-001
```

Then open:

- http://localhost:8080/analysis.html?retroId=RETRO-2026-001
- http://localhost:8080/actions.html?retroId=RETRO-2026-001
- http://localhost:8080/report.html?retroId=RETRO-2026-001

### Step 8 — Archive

```text
/archive-retro RETRO-2026-001
```

Required: upload copy to Google Drive (`Retrospective Management/{retroId} - {title}/`) and set local status to `archived`. Requires Google Drive MCP configured.

### Step 9 — Commit reminder snapshot to GitHub

```text
/commit-latest-report
```

Pushes `docs/reminders/latest-reminder.json` to `main` so the Sunday mail Cloud Automation can read it.

## One-shot full workflow

```text
/run-retro-workflow
```

Or:

```text
Run the full retrospective test workflow in order. Use Cursor model for analysis — no external API keys. Stop after each step and show results.
```

## Concept map

| Cursor concept | This workflow |
|----------------|---------------|
| **Command** | `/analyze-retro`, `/seed-demo-retro`, etc. |
| **Skill** | `analyze-retrospective`, `generate-retro-report` |
| **Sub-agent** | `feedback-analyst`, `improvement-advisor`, `verifier` (required for `/analyze-retro`) |
| **Rules** | `.cursor/rules/privacy.mdc`, `orchestration.mdc` |
| **AGENTS.md** | Parent agent routing across repos |
| **Hooks** | JSON validation, dangerous-command block, `subagentStop` → `.cursor/logs/subagent-activity.log` |
| **MCP** | Google Drive archive (required in full workflow) |
| **Human-in-the-loop** | Approve suggestions, archive, merge PRs |

## Files produced

```text
retro-api/data/retrospectives/RETRO-2026-001/
├── retro.json
├── feedback/FB-*.json
├── analysis.json      ← Cursor agent
├── actions.json       ← after /approve-suggestions
├── report.md          ← after /generate-report
└── audit.jsonl
```
