---
name: generate-retro-report
description: >-
  Generate retrospective markdown report and chart insights after actions are
  approved. Use for /generate-report {id} or when the user needs report.md and
  report insights. Do not use before analysis import or before approved actions
  exist unless user explicitly wants a partial report.
---

# Generate Retro Report

## Purpose

Produce `report.md` and stored report insights (charts) from local retro files, following PLAN.md section 15 structure.

## When to use

- Command `/generate-report {retroId}`
- User asks for retrospective report or insights charts after workflow step 6+

**Do not use** for analysis-only (`/analyze-retro`) or Drive archive (`/archive-retro`).

## Inputs

| Input | Source |
| --- | --- |
| `retroId` | User or command |
| Current + prior retro context | `retro-api/data/` via API or files |
| Insights contract | [references/report-insights-contract.md](references/report-insights-contract.md) |

## Workflow

1. **Task → `insights-visualizer`** with current and prior retro context.
2. Import insights JSON per [report-insights-contract.md](references/report-insights-contract.md).
3. `POST http://localhost:3001/api/retrospectives/{retroId}/report/insights/import` (if not already stored).
4. `POST http://localhost:3001/api/retrospectives/{retroId}/report/generate` — API renders tables and Mermaid from stored insights.
5. **Task → `verifier`** when command workflow requires verification (see `/generate-report` command).

## Decision rules

| Situation | Action |
| --- | --- |
| Missing analysis or actions | Stop or report prerequisites per command doc. |
| Feedback traceability | Reference feedback IDs where helpful; **never** rewrite feedback `text`. |

Follow [`.cursor/rules/privacy.mdc`](../../rules/privacy.mdc).

## Validation

- Report sections present: Overview, Participation counts, **Insights at a Glance**, Themes, Concerns, Approved Actions, Previous Actions, Limitations.
- `GET .../report` returns markdown; insights stored per contract.

## Failure handling

| Failure | Action |
| --- | --- |
| Generate API error | Report error; do not hand-edit `report.md` to bypass API unless user explicitly requests manual fix. |
| Insights import invalid | Fix payload per contract; re-import. |

## Completion criteria

**Done when:** report generated via API, user directed to `/validate-retro-ui` or review `report.md`.

## References

- Insights contract: [references/report-insights-contract.md](references/report-insights-contract.md)
- Template: `PLAN.md` section 15
- Command: [`.cursor/commands/generate-report.md`](../../commands/generate-report.md)
