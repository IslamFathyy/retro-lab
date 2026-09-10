# Report insights JSON contract

Cursor agents produce chart data via `POST /api/retrospectives/{retroId}/report/insights/import`.

The API recomputes `feedbackItems`, `percent`, and `retrosSeen` from cited IDs — agents supply semantic clustering only.

## Required top-level fields

| Field | Type | Notes |
|---|---|---|
| `retroId` | string | Must match folder name |
| `generatedBy` | string | Use `cursor-agent` |
| `participationMix` | object | `{ wentWell, didNotGoWell, improvement }` counts |
| `topicBreakdown` | array | Topics for current retro charts |
| `recurringTopics` | array | Cross-retro recurrence |
| `limitations` | string[] | Must include feedback-items disclaimer |

## topicBreakdown item

```json
{
  "label": "Code review delays",
  "feedbackIds": ["FB-0003", "FB-0005"],
  "priority": "high",
  "summary": "The team reported slow review turnaround again."
}
```

- `priority`: `high` | `medium` | `low`
- `feedbackIds`: must exist in current retro feedback files

## recurringTopics item

```json
{
  "label": "Code review delays",
  "retroIds": ["RETRO-2026-002", "RETRO-2026-003", "RETRO-2026-004"],
  "priority": "high",
  "summary": "Semantically similar concerns across three sprints."
}
```

- `retroIds`: valid retrospective IDs from provided context

## Privacy rules

- Count **feedback items**, never individuals ("3 people" is forbidden).
- Use team/process language in summaries.
- Every topic must cite `feedbackIds` or `retroIds`.
- No performance rankings.

## Optional vocabulary

See `config/recurring-topics.json` for suggested labels (hints only — semantic matching is allowed).
