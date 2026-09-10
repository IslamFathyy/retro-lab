# Generate Report

Generate or update `report.md` for a retrospective with **AI-driven Insights at a Glance** charts.

## Arguments

- `retroId` (required)

## Prerequisites

- At least one **approved** action exists (`/approve-suggestions` completed).
- `analysis.json` exists for the retro.

## Workflow (required)

1. Read current retro: `retro.json`, feedback, `analysis.json`, `actions.json`.
2. Read **all prior retros** (feedback + analysis) for cross-retro recurrence context.
3. **Task → insights-visualizer** (required) — pass full context; receive report insights JSON per [report-insights-contract.md](../skills/generate-retro-report/references/report-insights-contract.md).
4. Import insights:

```bash
curl -s -X POST http://localhost:3001/api/retrospectives/{retroId}/report/insights/import \
  -H "Content-Type: application/json" \
  -d @report-insights-payload.json
```

5. Generate report (merges stored insights into markdown):

```bash
curl -s -X POST http://localhost:3001/api/retrospectives/{retroId}/report/generate
```

6. **Task → verifier** — privacy check, feedback ID references, no people-count language.
7. **Next step**: `/validate-retro-ui {retroId}`.

## Rules

- Do not skip the insights-visualizer Task.
- API recomputes percentages from cited `feedbackIds` — do not invent counts.
- Never name anonymous feedback authors.
