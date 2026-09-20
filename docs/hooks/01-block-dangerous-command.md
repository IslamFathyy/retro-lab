# Hook: block-dangerous-command

**Guardrail:** Agents must not run destructive Git or shell commands.

| Field | Value |
|-------|-------|
| Script | [`.cursor/hooks/block-dangerous-command.js`](../../.cursor/hooks/block-dangerous-command.js) |
| Event | `beforeShellExecution` |
| Registered in | [`.cursor/hooks.json`](../../.cursor/hooks.json) |

## When it runs

Before the Cursor agent executes any shell command.

## What it blocks

Commands containing (case-insensitive):

- `rm -rf /`
- `del /s`
- `format `
- `git push --force`
- `git reset --hard`

## On failure

Returns JSON to Cursor:

```json
{ "permission": "deny", "message": "Blocked dangerous command (teaching guardrail)." }
```

The command does not run.

## How to test on a branch

1. Open the project in Cursor Agent mode.
2. Ask the agent to run: `git push --force origin main`
3. **Pass:** Command is denied with the teaching guardrail message.
4. Ask the agent to run: `git status`
5. **Pass:** Harmless command is allowed.

## Related standards

- [`docs/guardrails.md`](../guardrails.md) — Development: no force push
- [`AGENTS.md`](../../AGENTS.md) — Do not push to `main` directly
