# Hook: protect-feedback-text

**Guardrail:** Original retrospective feedback `text` must never be changed by the agent.

| Field | Value |
|-------|-------|
| Script | [`.cursor/hooks/protect-feedback-text.js`](../../.cursor/hooks/protect-feedback-text.js) |
| Event | `afterFileEdit` |
| Registered in | [`.cursor/hooks.json`](../../.cursor/hooks.json) |

## When it runs

After the agent edits a file under:

`retro-api/data/retrospectives/{retroId}/feedback/*.json`

## What it blocks

- **Any direct agent edit** to stored feedback JSON files (feedback must enter via the REST API).
- If the hook receives `old_content` / `new_content`, it also blocks when the `text` field changes.

## On failure

- Exit code `1`
- stderr explains: use `POST /api/retrospectives/{id}/feedback`; do not rewrite originals.

## Why this exists

People forget the privacy rule in chat: *"Do not modify original feedback text."* Rules and [`privacy.mdc`](../../.cursor/rules/privacy.mdc) are not enough — this hook enforces it at edit time.

API guardrails (C1, P1, P4) do not cover file edits; this hook does.

## How to test on a branch

1. Ensure demo data exists (`npm run seed:demo` in `retro-api`).
2. Ask the agent to change the `text` field in any file under `retro-api/data/retrospectives/RETRO-2026-001/feedback/`.
3. **Pass:** Hook blocks with privacy message.
4. Ask the agent to edit `config/guardrails.json` instead.
5. **Pass:** Hook does not apply (different path).

## Related standards

- [`.cursor/rules/privacy.mdc`](../../.cursor/rules/privacy.mdc)
- [`AGENTS.md`](../../AGENTS.md) — Never modify original feedback text
