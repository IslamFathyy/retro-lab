---
name: analyze-retrospective
description: Analyze retrospective feedback into themes, strengths, concerns, and suggested actions using the Cursor model. Use when running /analyze-retro or when the user asks for AI-assisted retrospective analysis.
---

# Analyze Retrospective Skill

## Who performs the analysis

**Sub-agents perform the analytical work.** The parent agent orchestrates, merges outputs, and imports.

Do **not** call external LLM APIs. Read local JSON files only.

## Input

- Retrospective ID
- `retro-api/data/retrospectives/{retroId}/retro.json`
- All files in `retro-api/data/retrospectives/{retroId}/feedback/`

## Output

Import analysis via API (preferred):

```http
POST http://localhost:3001/api/retrospectives/{retroId}/analysis/import
Content-Type: application/json
```

Body: see `.cursor/skills/analyze-retrospective/references/analysis-contract.md`

Set `generatedBy` to `"cursor-agent"`.

## Workflow (required)

1. Confirm retrospective status is `closed`, `analyzed`, `actioned`, or `archived`.
2. Read all feedback files — preserve original `text` fields untouched.

3. **Task → feedback-analyst** (required)
   - Pass feedback JSON content and retroId.
   - Receive: themes, strengths, concerns, opportunities, limitations draft.

4. **Task → improvement-advisor** (required)
   - Pass structured output from step 3.
   - Receive: `suggestedActions` array only.

5. **Parent merges** sub-agent outputs into one payload; validate every feedback ID reference and every `suggestedActions[].ownerTeams` entry (team ids from `config/action-teams.json` only).

6. POST to `/analysis/import`.

7. **Task → verifier** (required)
   - Validate imported `analysis.json`, privacy rules, and run `npm test` in `retro-api/`.

8. **Stop** — tell the user to validate in the web UI or run `/validate-retro-ui`.

## Sub-agent logging

Each sub-agent must end with:

```text
SUBAGENT_SUMMARY: <what was completed>
```

Hook `subagentStop` appends to `.cursor/logs/subagent-activity.log` with agent name, timestamp, status, and summary.

## Rules

- Preserve exact feedback text in source files; only summarize in analysis fields.
- Never infer anonymous authors.
- Include at least one limitation mentioning human review.
- Suggested actions are **not** approved — facilitator approves via `/approve-suggestions`.
- Never skip Task launches for the three analyze-retro sub-agents.
