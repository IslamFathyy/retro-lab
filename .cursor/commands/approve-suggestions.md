# Approve Suggestions

Convert AI suggested actions into approved actions (human-in-the-loop via agent prompt).

**This is the only step in `/run-retro-workflow` that stops for human input.** After approvals, the agent continues steps 5–9 automatically.

## Arguments

- `retroId` (required)

## Steps

1. Read `retro-api/data/retrospectives/{retroId}/analysis.json`.
2. List all `suggestedActions` with IDs, titles, reasons, and **`ownerTeams`** (team labels from `config/action-teams.json`).
3. **Ask the user** which suggestions to approve (default: approve top 2 if user said "proceed").
4. User must type an explicit confirmation phrase per suggestion, e.g. **`approve SUG-001`**. Do not call the API until the user provides this phrase.
5. For each approved suggestion:

```bash
curl -s -X POST http://localhost:3001/api/retrospectives/{retroId}/actions/from-suggestion/{suggestionId} \
  -H "Content-Type: application/json" \
  -d "{\"approvalConfirmation\": \"approve {suggestionId}\"}"
```

The API rejects requests without matching `approvalConfirmation` (guardrail **P1**). Suggestions with blame/performance language in title or reason are rejected (guardrail **P4**).

6. Confirm `actions.json` contains new actions with `source: "approved-suggestion"`.
7. Report action IDs and **next step**: `/review-actions {retroId}`.

## Rules

- Never approve without explicit user confirmation in the chat (`approve SUG-###` phrase required by API).
- Never assign blame or individual performance targets — API blocks blame patterns from `config/guardrails.json`.
