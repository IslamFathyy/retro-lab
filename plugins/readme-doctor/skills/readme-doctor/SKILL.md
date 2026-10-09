---
name: readme-doctor
description: >-
  The readme-doctor MCP plugin scores README onboarding quality from a project
  scan or regenerates README.md from detected routes, tree, scripts, and
  .env.example names—without reading secrets or inventing APIs.
---

# README Doctor

## When to use

- `/check-readme` or user asks to **check** README → `analyze_readme` only
- `/fix-readme` or user asks to **fix/update** README → `improve_readme`
- Target path: workspace root or subproject (e.g. `retro-api`)

**Out of scope:** `improve_readme` when the user only asked for analysis; edits outside `README.md` / `README.md.backup`.

## Inputs

| Input | MCP tool | Notes |
| --- | --- | --- |
| `project_path` | both | Optional; defaults to MCP cwd |
| MCP server | `readme-doctor` | Plugin `mcp.json` or project `.cursor/mcp.json` |

## Output

| Mode | Deliverable |
| --- | --- |
| **Check** | Score, section checklist, and suggestions in chat (no file writes) |
| **Fix** | Updated `README.md` at `project_path`; `README.md.backup` when a prior file existed |
| **Handoff** | User reminded to review generated content before commit |

## Workflow

**Check (read-only)**

1. Call `analyze_readme` with `{ "project_path": "<root>" }`.
2. Present **Output** for check mode.

**Fix (writes)**

1. Optionally run `analyze_readme` first.
2. Call `improve_readme` with the same `project_path`.
3. Report backup path and sections added per **Output**.

## Decision rules

| Situation | Action |
| --- | --- |
| Invent endpoints/scripts | **Forbidden** — only detected routes and `package.json` scripts. |
| Read `.env` | **Forbidden** — `.env.example` names only. |
| Write files | **Only** `README.md` and `README.md.backup`. |
| MCP missing | Run `cd plugins/readme-doctor && npm install && npm run build`; reload Cursor; enable MCP. |

## Validation

- **Check:** score and suggestions delivered; `improve_readme` was not called.
- **Fix:** `README.md` exists at target path; no unexpected files under `docs/` from this tool.
- **Plugin tests:** `cd plugins/readme-doctor && npm test`

## Failure handling

| Failure | Action |
| --- | --- |
| MCP error | Show output; suggest rebuild `dist/mcp-server.js` and reload. |
| Invalid `project_path` | Report error from tool; do not guess paths outside project. |

## References

- [plugins/readme-doctor/README.md](../../README.md)
- [docs/plugins/readme-doctor.md](../../../../docs/plugins/readme-doctor.md)
- Commands: `commands/check-readme.md`, `commands/fix-readme.md`
