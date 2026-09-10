# Analyze Retrospective

Analyze one closed retrospective using **the Cursor agent model** and local feedback files.

## Arguments

- `retroId` (required) — e.g. `RETRO-2026-001`

## Sub-agents (required)

**Always** launch these three sub-agents via the **Task** tool. Do **not** inline their work in the parent agent.

| Order | Sub-agent | `description` (use exactly) | Responsibility |
|-------|-----------|----------------------------|----------------|
| 1 | `feedback-analyst` | `feedback-analyst` | Themes, strengths, concerns, opportunities + evidence IDs |
| 2 | `improvement-advisor` | `improvement-advisor` | Suggested actions only (never approve) |
| 3 | `verifier` | `verifier` | Post-import schema, privacy, and test check |

Run steps 1–2 **before** import. Run step 3 **after** import.

Each sub-agent must end its final message with:

```text
SUBAGENT_SUMMARY: <one short paragraph of what was done>
```

The `subagentStop` hook appends that summary to `.cursor/logs/subagent-activity.log`.

## Steps

1. Confirm retrospective status is `closed` or later in `retro-api/data/retrospectives/{retroId}/retro.json`.
2. Read all feedback from `retro-api/data/retrospectives/{retroId}/feedback/`.
3. Read skill `analyze-retrospective` and contract `references/analysis-contract.md`.

4. **Task → feedback-analyst** with retroId, feedback file paths, and privacy rules. Wait for result.

5. **Task → improvement-advisor** with themes/concerns/opportunities from step 4. Wait for result.

6. **Parent agent only:** merge sub-agent outputs into one import payload:
   - `themes`, `strengths`, `concerns`, `opportunities` from feedback-analyst
   - `suggestedActions` from improvement-advisor
   - `limitations` (include human-review disclaimer)
   - `generatedBy`: `"cursor-agent"`

7. Import analysis via API:

```bash
curl -s -X POST http://localhost:3001/api/retrospectives/{retroId}/analysis/import \
  -H "Content-Type: application/json" \
  -d @analysis-payload.json
```

8. **Task → verifier** with retroId, path to `analysis.json`, and privacy checklist. Wait for pass/fail report.

9. **Stop** — report summary and next step: `/approve-suggestions {retroId}`.

## Do not

- Skip Task launches or perform analyst/advisor/verifier work inline
- Call OpenAI or other external LLM APIs from the app
- Modify original feedback `text` fields
- Auto-approve suggested actions
