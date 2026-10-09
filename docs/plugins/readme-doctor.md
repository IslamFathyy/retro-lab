# Plugin: readme-doctor

**Teaching focus:** Small, understandable developer tool — MCP + Cursor plugin format. Works on **any company repository** after install.

| Field | Value |
|-------|-------|
| **Name** | `readme-doctor` |
| **Version** | `1.1.0` |
| **Path** | [`plugins/readme-doctor/`](../../plugins/readme-doctor/) |
| **Marketplace** | [`.cursor-plugin/marketplace.json`](../../.cursor-plugin/marketplace.json) |

---

## Canonical README

All projects get the same **section order** (Integrant default). See [`plugins/readme-doctor/references/canonical-readme-outline.md`](../../plugins/readme-doctor/references/canonical-readme-outline.md). **Features** always follows **Development ports**; body text is scan-derived only.

---

## Manifest contents

| Component | Files |
|-----------|-------|
| MCP server | `mcp.json` → `analyze_readme`, `align_readme`, `generate_readme` (`improve_readme` deprecated) |
| Skill | `skills/readme-doctor/SKILL.md` |
| Commands | `check-readme`, `generate-readme` |
| Rules / hooks | None (MVP) |

---

## Install

### Local / teaching

1. `cd plugins/readme-doctor && npm install`
2. Cursor → **Plugins** → install `plugins/readme-doctor` (or org marketplace)
3. Reload; enable MCP server **readme-doctor**
4. `/generate-readme` on a repo without README, or `/check-readme` to align an existing README

### Org marketplace

Register root `.cursor-plugin/marketplace.json`; users install **readme-doctor** from catalog.

---

## Clean install test (sign-off checklist)

| Step | Expected |
|------|----------|
| Fresh clone; `npm install` in `plugins/readme-doctor` | `dist/` built, `npm test` passes |
| Install plugin folder only in Cursor | MCP **readme-doctor** appears |
| `analyze_readme` on any app repo | Canonical section score + suggestions |
| `align_readme` on repo with README | `README.md.backup` + canonical structure |
| `generate_readme` when README missing | New `README.md` only |
| `generate_readme` when README exists | Error — use `align_readme` |
| No `.env` values in tool output | Names only from `.env.example` |

---

## Security checklist

| Check | Status |
|-------|--------|
| No secrets in plugin package | ☑ |
| MCP never reads `.env` | ☑ |
| Only README + backup written | ☑ |
| Path traversal blocked in tests | ☑ |
