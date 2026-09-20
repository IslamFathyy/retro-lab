---
name: readme-doctor
description: Analyze README.md quality and safely scaffold missing sections. Use with /check-readme or /fix-readme, or when the user asks to review or fix their README.
---

# README Doctor Skill

Use the **readme-doctor** MCP server tools. Read this skill before running `/check-readme` or `/fix-readme`.

## Tools

| Tool | Mode | Purpose |
|------|------|---------|
| `analyze_readme` | Read-only | Score sections, list suggestions, return JSON |
| `improve_readme` | Writes files | Update `README.md` only; creates `README.md.backup` if file exists |

## Workflow — check

1. Call `analyze_readme` with `{ "project_path": "<workspace root or subproject>" }`.
2. Present score, section checklist, and suggestions in plain language.
3. Do **not** call `improve_readme` unless the user asks to fix/update the README.

## Workflow — fix

1. Run `analyze_readme` first (optional but recommended).
2. Call `improve_readme` with the same `project_path`.
3. Show backup path and summarize what sections were added.
4. Remind the user to review placeholders (`<!-- ... -->`, TBD rows) before committing.

## Rules

- Never invent API endpoints, env values, or npm scripts not found in `package.json` / `.env.example`.
- Never read or print `.env` contents — only variable **names** from `.env.example`.
- Only modify `README.md` and `README.md.backup`.
- Preserve existing README content when improving.

## MCP not available?

From `plugins/readme-doctor`: `npm install && npm test`. For manual MCP, add the server from this plugin's `mcp.json` or install the plugin folder in Cursor → Settings → Plugins.
