# Guardrails

See PLAN.md section 24. **Rules inventory and precedence:** [`docs/rules-audit.md`](rules-audit.md).

Summary:

## Shared config

Enforced settings live in [`config/guardrails.json`](../config/guardrails.json) (see [`config/README.md`](../config/README.md)).

| ID | Rule | Enforced by |
|----|------|-------------|
| **C1** | Minimum feedback before close | `POST .../close` |
| **P1** | Explicit `approve SUG-###` confirmation | `POST .../actions/from-suggestion/:id` |
| **P4** | No blame/performance language in actions | create/approve action APIs |

## Domain
- No deanonymization, ranking, or blame
- No modifying original feedback text
- No auto-approving actions

## Development
- No database, React, or TypeScript in v1
- No force push or auto-merge
- No secrets in Git

## MCP

Full setup, allowed tools, and error handling: [`mcp-setup.md`](mcp-setup.md). Golden-path sign-off: [`mcp-golden-path.md`](mcp-golden-path.md).

- Google Drive is archive/backup only — never delete local files on archive
- Local `retro-api/data/` is source of truth during active workflow
- MCP runs in Cursor agents only — not in `retro-api` or `retro-web` at runtime
- No OAuth tokens or `mcp.json` secrets in Git
- Validate MCP output before merging into API import payloads

## Hooks (automated guardrails in chat)

Policy checks run via [`.cursor/hooks.json`](../.cursor/hooks.json) so agents do not rely on memory alone.

| Hook | Event | What people forget | Doc |
|------|-------|-------------------|-----|
| block-dangerous-command | `beforeShellExecution` | Force push / destructive shell | [01-block-dangerous-command.md](hooks/01-block-dangerous-command.md) |
| validate-json | `afterFileEdit` | Leaving broken JSON after edits | [02-validate-json.md](hooks/02-validate-json.md) |
| protect-feedback-text | `afterFileEdit` | Changing original feedback `text` | [03-protect-feedback-text.md](hooks/03-protect-feedback-text.md) |
| block-secrets-path | `afterFileEdit` | Writing `.env` / credentials into repo | [04-block-secrets-path.md](hooks/04-block-secrets-path.md) |

**Observability only (not policy):** `log-task-subagent.js`, `log-subagent-stop.js` → `.cursor/logs/subagent-activity.log`

Runtime API rules (C1, P1, P4) remain in `retro-api` — hooks complement API enforcement during agent sessions.
