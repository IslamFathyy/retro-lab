# Analyze Retrospective

Analyze one closed retrospective using local feedback files.

## Arguments
- `retroId` (required) — e.g. `RETRO-2026-001`

## Steps
1. Confirm retrospective status is `closed` or later in `retro-api/data/`.
2. Read all feedback from `retro-api/data/retrospectives/{retroId}/feedback/`.
3. Use skill `analyze-retrospective` and delegate theme work to `feedback-analyst` sub-agent.
4. Delegate improvement suggestions to `improvement-advisor` (suggestions only, not approved actions).
5. Write output to `analysis.json` matching the schema in PLAN.md.
6. Set `generatedBy` to identify agent-assisted analysis (not `deterministic-baseline` unless using API baseline).
7. Invoke `verifier` to validate schema and privacy rules.
8. **Stop** — human facilitator reviews before approving any actions.
