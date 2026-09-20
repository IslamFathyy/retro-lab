# Plugin: readme-doctor

**Teaching focus:** Small, understandable developer tool — MCP + Cursor plugin format.

| Field | Value |
|-------|-------|
| **Name** | `readme-doctor` |
| **Version** | `1.0.0` |
| **Path** | [`plugins/readme-doctor/`](../../plugins/readme-doctor/) |
| **Marketplace** | [`.cursor-plugin/marketplace.json`](../../.cursor-plugin/marketplace.json) |

---

## Why this plugin (plugin goal)

| Option | Verdict |
|--------|---------|
| Full retrospective workflow plugin | Too domain-specific |
| dev-guardrails only | Hooks/rules — no MCP teaching surface |
| **readme-doctor** | **Selected** — MCP tools, clear I/O, any repo |

**One problem:** READMEs are incomplete and agents invent fake commands.  
**One audience:** Teams using Cursor on application code.

---

## Manifest contents

| Component | Files |
|-----------|-------|
| MCP server | `mcp.json` → `analyze_readme`, `improve_readme` |
| Skill | `skills/readme-doctor/SKILL.md` |
| Commands | `check-readme`, `fix-readme` |
| Rules / hooks | None (MVP) |

---

## Install

### Local / teaching

1. `cd plugins/readme-doctor && npm install`
2. Cursor → **Plugins → + Add → From GitHub Repository** → `IslamFathyy/retro-lab` with path `plugins/readme-doctor` (or copy to `%USERPROFILE%\.cursor\plugins\local\readme-doctor`)
3. Reload; enable MCP server **readme-doctor**
4. `/check-readme` on `retro-api` or `retro-web`

### Org marketplace

Register root `.cursor-plugin/marketplace.json`; users install **readme-doctor** from catalog.

### Public marketplace

Submit after GitHub push: **https://cursor.com/marketplace/publish**

---

## Clean install test (sign-off checklist)

| Step | Expected |
|------|----------|
| Fresh clone; `npm install` in `plugins/readme-doctor` | `dist/` built, `npm test` passes |
| Install plugin folder only in Cursor | MCP **readme-doctor** appears |
| `analyze_readme` on `retro-api` | JSON score + suggestions |
| `improve_readme` on temp copy | `README.md.backup` if file existed |
| No `.env` values in tool output | Names only from `.env.example` |

Status: **pending** manual Cursor install sign-off.

---

## Security checklist

| Check | Status |
|-------|--------|
| No secrets in plugin package | ☑ |
| MCP never reads `.env` | ☑ |
| Only README + backup written | ☑ |
| Path traversal blocked in tests | ☑ |

---

## Coexistence with dev-guardrails

Both plugins are listed in the same marketplace manifest. Install either or both:

- **dev-guardrails** — chat-time hooks + verifier
- **readme-doctor** — MCP documentation tools
