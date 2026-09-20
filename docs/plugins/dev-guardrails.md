# Plugin: dev-guardrails

**Teaching focus:** Code safety for AI-assisted development — not domain/business logic.

| Field | Value |
|-------|-------|
| **Name** | `dev-guardrails` |
| **Version** | `1.0.0` (frozen 2026-09-19) |
| **Path** | [`plugins/dev-guardrails/`](../../plugins/dev-guardrails/) |
| **Marketplace** | [`.cursor-plugin/marketplace.json`](../../.cursor-plugin/marketplace.json) |

---

## Why this plugin (not retro-specific)

| Option | Verdict |
|--------|---------|
| Full retrospective workflow plugin | Too domain-specific; hard to install without `retro-api` |
| **dev-guardrails** (hooks + rules + verifier) | **Selected** — teaches plugin format; works in any repo |

**One problem:** Agents forget dev safety in chat.  
**One audience:** Teams using Cursor on application code.

---

## Manifest contents (frozen)

| Component | Files |
|-----------|-------|
| Rules | `development.mdc`, `security.mdc`, `testing.mdc` |
| Hooks | `block-dangerous-command`, `validate-json`, `block-secrets-path` |
| Sub-agent | `verifier` |
| Skill + command | `verify-changes` |
| MCP | None (no secrets) |

**Not included:** retrospective skills, privacy/feedback hooks, MCP stubs (install separately).

---

## Install

### Local / teaching

1. Cursor → **Plugins → + Add → From GitHub Repository** → `IslamFathyy/retro-lab` with path `plugins/dev-guardrails` (or copy to `%USERPROFILE%\.cursor\plugins\local\dev-guardrails`).
2. Reload the window.
3. Confirm hooks appear under project/plugin hooks.

### Team marketplace (Integrant)

1. Publish `retro-lab` repo (or plugin-only repo) to GitHub.
2. Register `.cursor-plugin/marketplace.json` in Integrant Cursor marketplace admin.
3. Users install **dev-guardrails** from org catalog.

### Cursor public marketplace

Submit after push to public GitHub:

**https://cursor.com/marketplace/publish**

Repository: `https://github.com/IslamFathyy/retro-lab` (or dedicated `integrant-dev-guardrails` repo with plugin at root).

---

## Uninstall

1. Cursor → Settings → Plugins → disable or remove **dev-guardrails**.
2. Hooks no longer run.
3. Rules from the plugin no longer apply.

No data directory to clean up (no MCP, no `${PLUGIN_DATA}`).

---

## Security checklist (pre-submission)

| Check | Status |
|-------|--------|
| No secrets, tokens, or `.env` in plugin package | ☑ |
| Hook scripts are readable Node (no `eval` of user input) | ☑ |
| Hooks block credential paths, not just warn | ☑ |
| License MIT committed | ☑ |
| No network calls from hook scripts | ☑ |
| Sub-agent does not auto-merge or push | ☑ |
| README states data handling (no telemetry) | ☑ |

---

## Clean install test

| # | Step | Expected | Result |
|---|------|----------|--------|
| 1 | New empty folder + open in Cursor | — | ☐ |
| 2 | Install plugin from `plugins/dev-guardrails` only | Rules + hooks load | ☐ |
| 3 | Agent tries `git push --force` | Denied by hook | ☐ |
| 4 | Agent saves invalid JSON | Hook fails parse | ☐ |
| 5 | Agent edits `.env` | Hook blocks | ☐ |
| 6 | `/verify-changes` in a Node repo with tests | Runs `npm test` | ☐ |

Fill results after test; attach screenshot for marketplace review.

---

## Publish checklist (goal milestones)

| Milestone | % | Status |
|-----------|---|--------|
| Manifest + contents frozen | 25% | ☑ 2026-09-19 |
| Clean install test passed | 50% | ☐ Pending |
| Review submitted (Integrant or cursor.com) | 75% | ☐ Pending |
| Listing live / publish date committed | 100% | ☐ Pending |

---

## Related teaching assets

Same patterns in the full lab (with retro-specific additions):

- [`docs/hooks/`](../hooks/) — hook one-pagers
- [`docs/rules-audit.md`](../rules-audit.md) — rules vs skills
