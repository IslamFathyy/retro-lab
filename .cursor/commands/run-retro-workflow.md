# Run Retrospective Workflow

Master orchestration command for **prompt-driven testing** of the full app via Cursor.

## Prerequisites

- API running: `cd retro-api && npm start` (port 3001)
- Web UI running: `cd retro-web && npm start` (port 8080) — for validation only

## Step 1 — Seed (conditional)

**Do not re-seed if demo data already exists.**

Check before seeding:

```bash
cd retro-api && npm run retro:status
```

Or: `GET http://localhost:3001/api/retrospectives` — if any retro has `feedbackCount > 0`, **skip** `/seed-demo-retro`.

| Condition | Action |
|-----------|--------|
| `hasData: true` / retros with feedback exist | **Skip seed.** Use `suggestedWorkflowTarget` from `retro:status` (first `open` retro, else first without analysis). |
| No retros or all have zero feedback | Run `/seed-demo-retro` (`npm run seed:demo`) |

Report: `SKIP seed — using {retroId}` or `SEED — created {ids}`.

To **force a fresh reset**, run `/seed-demo-retro` explicitly before the workflow (that wipes and recreates Sprints 1–4).

## Ordered steps

| Step | Prompt | Purpose |
|------|--------|---------|
| 0 | `/verify-project` | Tests pass, servers healthy |
| 1 | `/seed-demo-retro` | **Only if no demo data** — else skip |
| 2 | `/close-retro {retroId}` | Close retrospective for analysis |
| 3 | `/analyze-retro {retroId}` | **Cursor AI** + sub-agents → `analysis.json` |
| 4 | `/approve-suggestions {retroId}` | Approve 2 suggestions as actions |
| 5 | `/review-actions {retroId}` | Action quality review (recommendations only) |
| 6 | `/generate-report {retroId}` | Generate `report.md` |
| 7 | `/validate-retro-ui {retroId}` | Checklist — open web UI to confirm |
| 8 | `/archive-retro {retroId}` | **Required** — Google Drive backup (MCP) + local `archived` status + `export:reminder` snapshot |

Default `{retroId}` when seed was skipped: **`RETRO-2026-001`** (Sprint 1), or the first `open` retro from `npm run retro:status`.

## Full-run prompt (single message)

```text
Run the retrospective test workflow:
0. /verify-project
1. Check retro:status — if hasData, SKIP /seed-demo-retro and use suggestedWorkflowTarget; else /seed-demo-retro
2. /close-retro {retroId}
3. /analyze-retro {retroId}
4. /approve-suggestions {retroId} (top 2 unless I say otherwise)
5. /review-actions {retroId}
6. /generate-report {retroId}
7. /validate-retro-ui {retroId}
8. /archive-retro {retroId}

Stop after each step and report results.
Use Cursor sub-agents for /analyze-retro.
Use Google Drive MCP for /archive-retro (see archive-retrospective skill).
Web UI is for validation only.
```

## Multi-sprint demo data

After `npm run seed:demo`, four retros exist (`RETRO-2026-001` … `004`). One workflow run processes **one** retro through all **nine** steps (0–8). Repeat for each sprint to build cross-retro recurring themes in reports.

## Architecture reminder

```text
Cursor Agent (you) → reads/writes retro-api/data/ + REST API
Browser (retro-web) → validation view only
No external LLM API in the running app
```
