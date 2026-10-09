---
name: readme-doctor
description: >-
  The readme-doctor MCP plugin scores or writes README.md using a fixed company
  outline (Features after Development ports) with content derived from each
  project's scan—routes, pages, scripts, and Cursor assets—without reading
  secrets or inventing APIs.
---

# README Doctor

## When to use

- `/check-readme` — **existing** `README.md` → align structure and refresh content (`align_readme`)
- `/generate-readme` — **no** `README.md` → create canonical README (`generate_readme`)
- Optional read-only score before writes → `analyze_readme`

**Out of scope:** edits outside `README.md` / `README.md.backup`; `generate_readme` when README already exists.

## Inputs

| Input | MCP tool | Notes |
| --- | --- | --- |
| `project_path` | all | Optional; defaults to MCP cwd (any company repo root) |
| MCP server | `readme-doctor` | Plugin `mcp.json` or project `.cursor/mcp.json` |

## Output

| Mode | Deliverable |
| --- | --- |
| **Analyze** | Canonical section score and suggestions in chat (no file writes) |
| **Check / align** | Updated `README.md`; `README.md.backup` when a prior file existed |
| **Generate** | New `README.md` at `project_path` |
| **Handoff** | User reminded to review generated content before commit |

## Workflow

**Analyze (optional)**

1. Call `analyze_readme` with `{ "project_path": "<root>" }`.

**Check / align**

1. Confirm `README.md` exists.
2. Call `align_readme` with the same `project_path`.

**Generate**

1. Confirm `README.md` is missing.
2. Call `generate_readme` with `project_path`.

## Decision rules

| Situation | Action |
| --- | --- |
| Invent endpoints/scripts | **Forbidden** — only detected routes and `package.json` scripts. |
| Read `.env` | **Forbidden** — `.env.example` names only. |
| Write files | **Only** `README.md` and `README.md.backup`. |
| README exists + generate requested | **Stop** — use `align_readme` / `/check-readme`. |
| MCP missing | Run `cd plugins/readme-doctor && npm install && npm run build`; reload Cursor; enable MCP. |

## Validation

- **Align:** canonical headings include `## Development ports` then `## Features`.
- **Generate:** `README.md` exists; no unexpected files under `docs/` from this tool.
- **Plugin tests:** `cd plugins/readme-doctor && npm test`

## Failure handling

| Failure | Action |
| --- | --- |
| MCP error | Show output; suggest rebuild `dist/mcp-server.js` and reload. |
| Invalid `project_path` | Report error from tool; do not guess paths outside project. |

## References

- [references/canonical-readme-outline.md](../../references/canonical-readme-outline.md)
- [plugins/readme-doctor/README.md](../../README.md)
- [docs/plugins/readme-doctor.md](../../../../docs/plugins/readme-doctor.md)
- Commands: `commands/check-readme.md`, `commands/generate-readme.md`
