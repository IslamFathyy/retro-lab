---
name: generate-retro-report
description: >-
  Approved actions, analysis, and chart-oriented insights are merged into
  API-generated markdown (PLAN section 15) plus stored report insights for the
  retrospective UI and archive flow.
---

# Generate Retro Report

## When to use

- `/generate-report {retroId}`
- User needs `report.md` or insights charts after workflow step 6+

**Out of scope:** `/analyze-retro`, `/archive-retro`, or full reports before analysis import and approved actions unless the user explicitly accepts a partial report.

## Inputs

| Input | Source |
| --- | --- |
| `retroId` | User or command |
| Current + prior retro context | `repos/retro-api/data/` via API or files |
| Insights contract | [references/report-insights-contract.md](references/report-insights-contract.md) |

## Output

| Deliverable | Location / effect |
| --- | --- |
| Report markdown | `repos/retro-api/data/retrospectives/{retroId}/report.md` via generate API |
| Insights JSON | Stored per [report-insights-contract.md](references/report-insights-contract.md) |
| Verification | `verifier` sub-agent when `/generate-report` command requires it |
| Handoff | User directed to `/validate-retro-ui` or review `report.md` |

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

[`.cursor/rules/privacy.mdc`](../../rules/privacy.mdc) applies.

## Validation

- Report sections: Overview, Participation counts, **Insights at a Glance**, Themes, Concerns, Approved Actions, Previous Actions, Limitations.
- `GET .../report` returns markdown; insights match contract.

## Failure handling

| Failure | Action |
| --- | --- |
| Generate API error | Report error; do not hand-edit `report.md` to bypass API unless user explicitly requests a manual fix. |
| Insights import invalid | Fix payload per contract; re-import. |

## References

- [references/report-insights-contract.md](references/report-insights-contract.md)
- `PLAN.md` section 15
- [`.cursor/commands/generate-report.md`](../../commands/generate-report.md)
