# Dev Guardrails — Cursor Plugin

**Teach:** Agents forget basic dev safety in chat. **Rules** state policy; **hooks** enforce it deterministically; **verifier** sub-agent checks tests before you ship.

## What it does

| Layer | What people forget | Enforcement |
|-------|-------------------|-------------|
| Hook | `git push --force`, `git reset --hard` | `beforeShellExecution` → deny |
| Hook | Broken JSON after agent edits | `afterFileEdit` → parse fail |
| Hook | Writing `.env` / credentials into repo | `afterFileEdit` → block |
| Rule | Tests required, no secrets in Git | Always-on guidance |
| Sub-agent | "Looks done" without running tests | `verifier` → pass/fail report |

## Install

1. **Cursor Marketplace** (after publish): search `dev-guardrails` → Install.
2. **From this repo:** Settings → Plugins → Install from path → select `plugins/dev-guardrails`.
3. **Team marketplace:** point Integrant catalog at `.cursor-plugin/marketplace.json` in `retro-lab`.

No MCP servers or secrets required.

## Use

```text
/verify-changes
```

Runs the `verify-changes` skill (tests + optional **verifier** Task). Works in any Node project with `npm test`; skips gracefully if no test script.

## Uninstall

Disable or remove the plugin in Cursor Settings → Plugins. Hooks stop when the plugin is disabled.

## Docs (parent repo)

- [`docs/plugins/dev-guardrails.md`](../../docs/plugins/dev-guardrails.md) — security checklist, clean install test, publish notes

## License

MIT — see [`LICENSE`](LICENSE).
