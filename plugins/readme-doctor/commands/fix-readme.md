---
name: fix-readme
description: Safely scaffold missing README sections via readme-doctor MCP (improve_readme).
---

# Fix README

Improve `README.md` using only detected project metadata. Creates `README.md.backup` when updating an existing file.

## Steps

1. Read the readme-doctor skill (plugin or `plugins/readme-doctor/skills/readme-doctor/SKILL.md`).
2. Optionally run **`analyze_readme`** and show the score to the user.
3. Call **`improve_readme`** with `project_path` for the target project.
4. Confirm:
   - `README.md` path
   - `README.md.backup` path (if applicable)
   - Sections added (not overwritten blindly)
5. Ask the user to review placeholders before commit.

## Safety

- Never invent commands, env values, or API routes.
- Only touches `README.md` and `README.md.backup`.

## Example prompt

> Fix my README.
