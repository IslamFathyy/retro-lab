# Analyze Retrospective

Analyze one closed retrospective using the **Cursor agent model** and local feedback files.

## Arguments

- `retroId` (required) — e.g. `RETRO-2026-001`

## Required

1. Read skill **[`analyze-retrospective`](../skills/analyze-retrospective/SKILL.md)** and follow it end-to-end.
2. Use contract [`references/analysis-contract.md`](../skills/analyze-retrospective/references/analysis-contract.md) for the import payload.

The skill defines sub-agents (`feedback-analyst`, `improvement-advisor`, `verifier`), merge/import steps, and verification. Do not inline sub-agent work in the parent agent.

## Stop

Report summary and next step: `/approve-suggestions {retroId}`.
