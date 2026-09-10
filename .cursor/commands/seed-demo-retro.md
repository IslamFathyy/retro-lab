# Seed Demo Retrospective

Reset local data and create **four** demo retrospectives (Sprint 1–4) with varied feedback and **recurring topics** across sprints for cross-retro report testing.

## Prerequisites

- Run from `retro-api/` (no API server required for the script)

## Run

```bash
cd retro-api
npm run seed:demo
```

**Warning:** This **deletes all existing** `RETRO-*` data before seeding. Do not run if you want to keep current retros.

For a **full demo reset** (local + Google Drive archives + reminder snapshot), run **`/reset-demo-retro`** first (requires `RESET DEMO` confirmation), then `/seed-demo-retro`.

When `/run-retro-workflow` runs, it **skips** this step if data already exists (`npm run retro:status` → `hasData: true`). Use `/seed-demo-retro` only when you need a clean reset.

| Sprint | Title | retroId (expected) |
|--------|--------|-------------------|
| 1 | Sprint 1 Retro | `RETRO-2026-001` |
| 2 | Sprint 2 Retro | `RETRO-2026-002` |
| 3 | Sprint 3 Retro | `RETRO-2026-003` |
| 4 | Sprint 4 Retro | `RETRO-2026-004` |

Each retro: **open** status, **6** anonymous feedback items (2 went-well, 2 did-not-go-well, 2 improvement).

## Recurring topics (different wording, same meaning)

Designed so Cursor analysis and reports can surface patterns across sprints:

- **Code review delays** — Sprints 2, 3, 4 (and review-policy improvements in 1, 4)
- **Long meetings** — Sprints 1, 4
- **QA / testing gaps** — Sprints 1, 3
- **Sprint readiness / acceptance criteria** — Sprints 2, 3
- **Deployment reliability** (positive) — Sprints 2, 4

Dataset source: `retro-api/scripts/seed-demo-data.js`

## Manual API alternative

If you prefer API calls instead of the script, follow the per-item POST pattern in `seed-demo-data.js` — but prefer `npm run seed:demo` for a clean reset.

## After seeding

Report created IDs, then **next step** for one sprint:

```text
/close-retro RETRO-2026-001
```

Or run the full workflow per sprint starting from Sprint 1.

## PowerShell

```powershell
cd retro-api
npm run seed:demo
```
