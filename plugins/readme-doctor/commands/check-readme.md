---
name: check-readme
description: Read-only README quality check via readme-doctor MCP (analyze_readme).
---

# Check README

Analyze the current project's `README.md` without modifying any files.

## Steps

1. Read `.cursor/skills/readme-doctor/SKILL.md` if the readme-doctor plugin is installed; otherwise use project `plugins/readme-doctor/skills/readme-doctor/SKILL.md`.
2. Call MCP tool **`analyze_readme`** with `project_path` set to the target repo root (default: workspace folder).
3. Report:
   - Project name and type
   - README exists / path
   - Section checklist (present / missing / optional)
   - Score (e.g. 4/6)
   - Top suggestions
4. Do **not** call `improve_readme` in this command.

## Example prompt

> Check my README.
