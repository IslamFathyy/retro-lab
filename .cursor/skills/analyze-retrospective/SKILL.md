---
name: analyze-retrospective
description: >-
  Run AI retrospective analysis for a closed retro via sub-agents, merge results,
  and import to retro-api. Use for /analyze-retro {id}, or when the user asks
  for themes, strengths, concerns, or suggested actions from feedback. Do not use
  for report generation, archiving, or approving actions.
---

# Analyze Retrospective

## Purpose

Produce `analysis.json` (themes, strengths, concerns, limitations, suggested actions) from local feedback files using Cursor sub-agents, then import via `retro-api` — no external LLM APIs.

## When to use

- Command `/analyze-retro {retroId}`
- User asks for AI-assisted analysis on a **closed** retrospective

**Do not use** when retro is still open, for baseline-only test generation without import intent, or when user only wants `/approve-suggestions` / `/generate-report`.

## Inputs

| Input | Source |
| --- | --- |
| `retroId` | User or command argument |
| Retro metadata | `repos/retro-api/data/retrospectives/{retroId}/retro.json` |
| Feedback | All files in `repos/retro-api/data/retrospectives/{retroId}/feedback/` |
| Team ids for actions | `repos/retro-api/config/action-teams.json` (or parent `config/`) |

## Workflow

1. Confirm retro status is `closed`, `analyzed`, `actioned`, or `archived`.
2. Read all feedback files — **do not** change original `text` fields.
3. **Task → `feedback-analyst`** — pass feedback JSON + `retroId`; receive themes, strengths, concerns, opportunities, limitations draft.
4. **Task → `improvement-advisor`** — pass step 3 output; receive `suggestedActions` only.
5. **Parent merges** payloads; validate every feedback ID reference and every `suggestedActions[].ownerTeams` against `action-teams.json`.
6. `POST http://localhost:3001/api/retrospectives/{retroId}/analysis/import` with body per `references/analysis-contract.md`; set `generatedBy` to `"cursor-agent"`.
7. **Task → `verifier`** — validate imported `analysis.json`, privacy rules, run `npm test` in `repos/retro-api/`.
8. Tell the user to validate in the web UI or run `/validate-retro-ui`.

Sub-agents must end with: `SUBAGENT_SUMMARY: <what was completed>` (logged by `subagentStop` hook).

## Decision rules

| Situation | Action |
| --- | --- |
| Status not closed (or allowed post-close states) | **Stop** — close retro first (`/close-retro`). |
| Uncertain whether to edit feedback `text` | **Never edit** — summarize only in analysis fields. |
| Suggested actions | Output as **suggestions only** — facilitator uses `/approve-suggestions`. |
| Skip sub-agents | **Forbidden** — always launch `feedback-analyst`, `improvement-advisor`, and `verifier` via Task. |
| External LLM from `retro-api` | **Forbidden** — Cursor agent only. |

Follow [`.cursor/rules/privacy.mdc`](../../rules/privacy.mdc) and [`.cursor/rules/development.mdc`](../../rules/development.mdc).

## Validation

- **Contract:** Payload matches [`.cursor/skills/analyze-retrospective/references/analysis-contract.md`](references/analysis-contract.md).
- **Tests:** `cd repos/retro-api && npm test` (verifier sub-agent).
- **Deterministic checklist:** [`docs/skills/verify-analyze-retrospective.md`](../../../docs/skills/verify-analyze-retrospective.md).
- **Sub-agent evidence:** `.cursor/logs/subagent-activity.log` contains `SUBAGENT_SUMMARY` lines for the three sub-agents.

## Failure handling

| Failure | Action |
| --- | --- |
| Import API error | Report status/body; do not patch feedback files to “fix” analysis. |
| Verifier FAIL | Report evidence; do not mark workflow complete. |
| Missing feedback folder | Stop and report missing data path. |

## Completion criteria

**Done when:** analysis imported successfully, verifier passed (or user informed of FAIL), user directed to UI validation or `/validate-retro-ui`.

**Not done:** approving suggestions, generating report, or archiving.

## References

- Import contract: [references/analysis-contract.md](references/analysis-contract.md)
- Verify skill: [docs/skills/verify-analyze-retrospective.md](../../../docs/skills/verify-analyze-retrospective.md)
- Sub-agents: [docs/sub-agents.md](../../../docs/sub-agents.md)
