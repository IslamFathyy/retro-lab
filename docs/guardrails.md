# Guardrails

See PLAN.md section 24. Summary:

## Shared config

Enforced settings live in [`config/guardrails.json`](../config/guardrails.json) (see [`config/README.md`](../config/README.md)).

| ID | Rule | Enforced by |
|----|------|-------------|
| **C1** | Minimum feedback before close | `POST .../close` |
| **P1** | Explicit `approve SUG-###` confirmation | `POST .../actions/from-suggestion/:id` |
| **P4** | No blame/performance language in actions | create/approve action APIs |

## Domain
- No deanonymization, ranking, or blame
- No modifying original feedback text
- No auto-approving actions

## Development
- No database, React, or TypeScript in v1
- No force push or auto-merge
- No secrets in Git

## MCP
- Google Drive is archive/backup only
- Local `retro-api/data/` is source of truth
