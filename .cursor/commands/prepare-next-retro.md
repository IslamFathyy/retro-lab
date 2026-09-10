# Prepare Next Retro

Prepare a facilitator briefing from the previous retrospective.

## Arguments

- `retroId` (optional) — latest retro if omitted

## Steps

1. Identify the target retrospective (latest non-archived if no ID given).
2. Read `analysis.json`, `actions.json`, and open actions from other retros (`GET /api/actions/open`).
3. List unfinished actions to carry forward.
4. Identify recurring themes from `GET /api/comparison`.
5. Produce a short briefing:
   - What to celebrate
   - What to discuss
   - Open actions to review
   - Recurring themes (observations only — no causality claims)

## Do not

- Auto-create a new retrospective unless user asks
- Rank team members
