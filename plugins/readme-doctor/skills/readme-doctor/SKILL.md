---
name: readme-doctor
description: >-
  Analyze or improve project README.md via readme-doctor MCP (analyze_readme,
  improve_readme). Use for /check-readme, /fix-readme, or when the user asks to
  review or fix a README. Do not invent APIs, env values, or edit files other
  than README.md and README.md.backup.
---

# README Doctor

## Purpose

Score README quality (read-only) or regenerate an onboarding `README.md` from a project scan (routes, tree, `.cursor/`, env names, scripts).

## When to use

- `/check-readme` or user asks to **check** README → `analyze_readme` only
- `/fix-readme` or user asks to **fix/update** README → `improve_readme`
- Target path: workspace root or subproject (e.g. `retro-api`)

**Do not use** `improve_readme` when user only asked for analysis.

## Inputs

| Input | MCP tool | Notes |
| --- | --- | --- |
| `project_path` | both | Optional; defaults to MCP cwd |
| MCP server | `readme-doctor` | Plugin `mcp.json` or project `.cursor/mcp.json` |

## Workflow

**Check (read-only)**

1. Call `analyze_readme` with `{ "project_path": "<root>" }`.
2. Present score, section checklist, suggestions.
3. Do **not** call `improve_readme`.

**Fix (writes)**

1. Optionally run `analyze_readme` first.
2. Call `improve_readme` with same `project_path`.
3. Report backup path (`README.md.backup` if file existed) and sections added.
4. Remind user to review generated content before commit.

## Decision rules

| Situation | Action |
| --- | --- |
| Invent endpoints/scripts | **Forbidden** — only detected routes and `package.json` scripts. |
| Read `.env` | **Forbidden** — `.env.example` names only. |
| Write files | **Only** `README.md` and `README.md.backup`. |
| MCP missing | Run `cd plugins/readme-doctor && npm install && npm run build`; reload Cursor; enable MCP. |

## Validation

- **Plugin tests:** `cd plugins/readme-doctor && npm test`
- After fix: README exists; no unexpected files under `docs/` from this tool.

## Failure handling

| Failure | Action |
| --- | --- |
| MCP error | Show output; suggest rebuild `dist/mcp-server.js` and reload. |
| Invalid `project_path` | Report error from tool; do not guess paths outside project. |

## Completion criteria

**Check done:** user has score + suggestions.

**Fix done:** `README.md` updated, backup noted if applicable, user warned to review before commit.

## References

- Plugin README: [plugins/readme-doctor/README.md](../../README.md)
- Commands: `commands/check-readme.md`, `commands/fix-readme.md`
- Doc: [docs/plugins/readme-doctor.md](../../../../docs/plugins/readme-doctor.md)
