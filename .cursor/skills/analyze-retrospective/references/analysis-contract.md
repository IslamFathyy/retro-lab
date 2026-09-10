# Analysis JSON contract

Cursor agents write analysis via `POST /api/retrospectives/{retroId}/analysis/import` or by writing `retro-api/data/retrospectives/{retroId}/analysis.json` and updating retro status.

## Required top-level fields

| Field | Type | Notes |
|---|---|---|
| `retroId` | string | Must match folder name |
| `version` | number | Use `1` |
| `generatedAt` | ISO string | Set at import time if using API |
| `generatedBy` | string | Use `cursor-agent` |
| `feedbackCount` | number | Count of feedback files |
| `themes` | array | Cross-cutting patterns |
| `strengths` | array | From went-well items |
| `concerns` | array | From did-not-go-well items |
| `opportunities` | array | From improvement items |
| `suggestedActions` | array | **Not approved** — human review required |
| `limitations` | string[] | Must include human-review disclaimer |

## Theme object

```json
{
  "name": "Code Review",
  "feedbackIds": ["FB-0001", "FB-0006"],
  "summary": "The team mentioned review turnaround repeatedly."
}
```

## Strength / concern / opportunity object

```json
{
  "feedbackId": "FB-0001",
  "summary": "Brief synthesis — do not alter stored feedback text."
}
```

## Suggested action object (before import)

```json
{
  "title": "Agree on a PR review response target",
  "reason": "Review delays appeared in multiple feedback items.",
  "sourceFeedbackIds": ["FB-0001", "FB-0006"],
  "ownerTeams": ["dev-team", "management-team"]
}
```

- **`ownerTeams`** (required): non-empty array of team ids from [`config/action-teams.json`](../../../../config/action-teams.json). Teams only — never individual names.
- API assigns `id` as `SUG-001`, `SUG-002`, … if omitted.

## Example limitations

- "Suggested actions require human facilitator review before approval."
- "Analysis identifies process patterns, not individuals."
- "Observations are not proof of causality."

## Privacy rules

- Never infer anonymous authors.
- Use team/process language.
- Every claim must cite existing feedback IDs.
- Do not modify original feedback `text` in feedback JSON files.
