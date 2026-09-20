# Hook: block-secrets-path

**Guardrail:** Agents must not create or edit secret/credential files in the repo.

| Field | Value |
|-------|-------|
| Script | [`.cursor/hooks/block-secrets-path.js`](../../.cursor/hooks/block-secrets-path.js) |
| Event | `afterFileEdit` |
| Registered in | [`.cursor/hooks.json`](../../.cursor/hooks.json) |

## When it runs

After the agent edits any file whose path matches a blocked secret pattern.

## What it blocks

| Pattern | Examples |
|---------|----------|
| `.env` (not `.env.example`) | `.env`, `.env.local`, `.env.production` |
| Credential JSON | `credentials.json`, `secrets.json`, `gcp-oauth.keys.json` |
| Key material | `*.pem`, `id_rsa`, `*.pfx` |

## On failure

- Exit code `1`
- stderr: do not edit secret/credential files via the agent; use local env or a secret manager.

## Why this exists

Teams forget *"no secrets in Git"* in chat. [`docs/guardrails.md`](../guardrails.md) states the rule; this hook blocks the common mistake of agent-writing `.env`.

## How to test on a branch

1. Ask the agent to create or edit a root `.env` file with dummy content.
2. **Pass:** Hook blocks the edit.
3. Ask the agent to edit `.env.example` or `README.md`.
4. **Pass:** Hook allows (example/template files are not blocked).

## Related standards

- [`docs/guardrails.md`](../guardrails.md) — Development: no secrets in Git
- [`AGENTS.md`](../../AGENTS.md) — Store secrets in Git
