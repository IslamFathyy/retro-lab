---
name: analyze-retrospective
description: >-
  Closed-retrospective feedback becomes structured analysis—themes, strengths,
  concerns, limitations, and suggested actions—via Cursor sub-agents and the
  retro-api analysis import endpoint; the API does not call external LLMs.
---

# Analyze Retrospective

## When to use

- `/analyze-retro {retroId}`
- User wants AI-assisted clustering or suggested actions from feedback on a **closed** retro

**Out of scope:** open retros, `/approve-suggestions`, `/generate-report`, `/archive-retro`, or baseline test runs without import intent.

## Inputs

| Input | Source |
| --- | --- |
| `retroId` | User or command argument |
| Retro metadata | `repos/retro-api/data/retrospectives/{retroId}/retro.json` |
| Feedback | All files in `repos/retro-api/data/retrospectives/{retroId}/feedback/` |
| Team ids for actions | `repos/retro-api/config/action-teams.json` (or parent `config/`) |

## Output

| Deliverable | Location / effect |
| --- | --- |
| Analysis payload | `repos/retro-api/data/retrospectives/{retroId}/analysis.json` (via import API) |
| Provenance | `generatedBy`: `"cursor-agent"` on imported analysis |
| Sub-agent trace | `SUBAGENT_SUMMARY` lines in `.cursor/logs/subagent-activity.log` for `feedback-analyst`, `improvement-advisor`, `verifier` |
| Handoff | User directed to web UI or `/validate-retro-ui` |

Suggested actions remain **unapproved** until `/approve-suggestions`.

## Workflow

1. Confirm retro status is `closed`, `analyzed`, `actioned`, or `archived`.
2. Read all feedback files — **do not** change original `text` fields.
3. **Task → `feedback-analyst`** — pass feedback JSON + `retroId`; receive themes, strengths, concerns, opportunities, limitations draft.
4. **Task → `improvement-advisor`** — pass step 3 output; receive `suggestedActions` only.
5. **Parent merges** payloads; validate every feedback ID reference and every `suggestedActions[].ownerTeams` against `action-teams.json`.
6. `POST http://localhost:3001/api/retrospectives/{retroId}/analysis/import` with body per `references/analysis-contract.md`.
7. **Task → `verifier`** — validate imported `analysis.json`, privacy rules, run `npm test` in `repos/retro-api/`.

Sub-agents must end with: `SUBAGENT_SUMMARY: <what was completed>` (logged by `subagentStop` hook).

## Decision rules

| Situation | Action |
| --- | --- |
| Status not closed (or allowed post-close states) | **Stop** — close retro first (`/close-retro`). |
| Uncertain whether to edit feedback `text` | **Never edit** — summarize only in analysis fields. |
| Skip sub-agents | **Forbidden** — always launch `feedback-analyst`, `improvement-advisor`, and `verifier` via Task. |
| External LLM from `retro-api` | **Forbidden** — Cursor agent only. |

[`.cursor/rules/privacy.mdc`](../../rules/privacy.mdc) and [`.cursor/rules/development.mdc`](../../rules/development.mdc) apply.

## Validation

- Payload matches [references/analysis-contract.md](references/analysis-contract.md).
- `cd repos/retro-api && npm test` passes (verifier).
- Checklist: [`docs/skills/verify-analyze-retrospective.md`](../../../docs/skills/verify-analyze-retrospective.md).
- Import API success and verifier **PASS** (or user informed of FAIL with evidence).

## Failure handling

| Failure | Action |
| --- | --- |
| Import API error | Report status/body; do not patch feedback files to “fix” analysis. |
| Verifier FAIL | Report evidence; do not claim workflow complete. |
| Missing feedback folder | Stop and report missing data path. |

## References

- [references/analysis-contract.md](references/analysis-contract.md)
- [docs/skills/verify-analyze-retrospective.md](../../../docs/skills/verify-analyze-retrospective.md)
- [docs/sub-agents.md](../../../docs/sub-agents.md)
