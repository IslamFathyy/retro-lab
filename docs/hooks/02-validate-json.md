# Hook: validate-json

**Guardrail:** Agent-edited JSON files must remain valid syntax.

| Field | Value |
|-------|-------|
| Script | [`.cursor/hooks/validate-json.js`](../../.cursor/hooks/validate-json.js) |
| Event | `afterFileEdit` |
| Registered in | [`.cursor/hooks.json`](../../.cursor/hooks.json) (runs first in chain) |

## When it runs

After the agent edits a file. Only processes paths ending in `.json`.

## What it checks

Parses the file on disk with `JSON.parse`. Invalid syntax fails the hook.

## On failure

- Exit code `1`
- stderr: `Invalid JSON after edit: <path> — <parse error>`

Cursor surfaces the error; the agent should fix the JSON before continuing.

## How to test on a branch

1. Ask the agent to add a trailing comma or remove a quote in `config/guardrails.json`.
2. **Pass:** Hook reports invalid JSON and blocks completion.
3. Revert or fix the file so JSON is valid again.
4. **Pass:** Normal edits with valid JSON succeed.

## Related standards

- [`config/guardrails.json`](../../config/guardrails.json) — shared policy config
- API and data fixtures under `retro-api/data/` rely on valid JSON
