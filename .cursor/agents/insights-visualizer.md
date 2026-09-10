---
name: insights-visualizer
description: Produce report chart data (topic breakdown, cross-retro recurrence, priorities) from retrospective feedback and prior retro context. Use during /generate-report.
---

# Insights Visualizer

Produce **report insights JSON only** for the Insights at a Glance section.

## Input

- Current `retroId`, feedback items, `analysis.json`, approved actions
- Prior retrospectives: feedback + analysis summaries (for cross-retro recurrence)

## Output

Return JSON matching `.cursor/skills/generate-retro-report/references/report-insights-contract.md`:

- `participationMix` — counts by feedback type for current retro
- `topicBreakdown` — semantic clusters with `feedbackIds`, `label`, `priority`, `summary`
- `recurringTopics` — themes across retros with `retroIds`, `priority`, `summary`
- `limitations` — include "Counts reflect feedback items, not individuals."

## Rules

- Cite only real `feedbackIds` and `retroIds` from input.
- Never use "X people" or individual headcount language.
- `priority` is process risk (high/medium/low), not people ranking.
- Match semantically similar themes across sprints even when wording differs.

## Final response (required)

End with:

```text
SUBAGENT_SUMMARY: <topics clustered, recurring count, evidence IDs used>
```
