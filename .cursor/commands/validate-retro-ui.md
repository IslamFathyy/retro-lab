# Validate Retro UI

Validation checklist — open the web UI to confirm Cursor workflow results.

## Arguments

- `retroId` (required)

## Prerequisites

- API: http://localhost:3001
- Web: http://localhost:8080

## Checklist

Report pass/fail for each:

| Page | URL | Verify |
|------|-----|--------|
| Retrospectives | `/retrospectives.html` | Retro listed with correct status |
| Board | `/board.html?retroId={id}` | All feedback in three columns; anonymous shows "Anonymous" |
| Analysis | `/analysis.html?retroId={id}` | `generatedBy: cursor-agent`, themes, suggestions visible |
| Actions | `/actions.html?retroId={id}` | Approved actions present with **team** assignments (`ownerTeams`) |
| Report | `/report.html?retroId={id}` | Insights bar charts + report markdown; `## Insights at a Glance` in report |

## File checks

- `retro-api/data/retrospectives/{retroId}/analysis.json` exists
- `actions.json` has approved actions
- `report.md` exists
- `report-insights.json` exists (from `/generate-report` + insights-visualizer)
- Feedback `text` fields unchanged from originals

## Output

Summary table: step | pass/fail | notes

Optional next step: `/archive-retro {retroId}`
