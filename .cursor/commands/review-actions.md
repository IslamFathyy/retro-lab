# Review Actions

Review proposed and approved actions for quality (recommendations only).

## Arguments

- `retroId` (required)

## Steps

1. Read `analysis.json` suggested actions and `actions.json` approved actions.
2. Check each action is:
   - Specific and measurable where possible
   - Linked to feedback evidence
   - Not vague or duplicate
3. Apply **improvement-advisor** quality lens (specific, measurable, evidence-linked) — parent checklist only; no separate sub-agent in v1.
4. Report recommendations only — **do not** change action status automatically.
5. **Next step**: `/generate-report {retroId}`.

## Do not

- Close, cancel, or approve actions without human instruction
- Rank individuals
