# Shared configuration

## Guardrails — [`guardrails.json`](guardrails.json)

Workflow safety rules enforced by `retro-api`. See guardrails table in [`docs/guardrails.md`](../docs/guardrails.md).

## Action teams — [`action-teams.json`](action-teams.json)

Canonical **team owners** for retrospective action items (not individuals).

| Team id | Label |
|---------|--------|
| `dev-team` | Dev Team |
| `qa-team` | QA Team |
| `product-team` | Product Team |
| `ops-team` | Ops Team |
| `management-team` | Management Team |

- Each suggested action and approved action uses `ownerTeams: string[]` (one or more ids from this list).
- `retro-api` loads from `GUARDRAILS_CONFIG` / `ACTION_TEAMS_CONFIG`, sibling `../config/`, or `retro-api/config/` fallback.

## Recurring topics — [`recurring-topics.json`](recurring-topics.json)

Optional **vocabulary hints** for Cursor `insights-visualizer` when generating report chart labels. Not used by runtime keyword matching — insights come from AI import.

Keep orchestration and `retro-api` copies in sync when editing.
