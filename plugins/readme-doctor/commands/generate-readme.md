---
name: generate-readme
description: Create a new README.md with company canonical structure via readme-doctor MCP (generate_readme).
---

# Generate README

Create `README.md` when the project has **no** README yet. Uses scan-derived content only.

## Steps

1. Read the readme-doctor skill (plugin or `plugins/readme-doctor/skills/readme-doctor/SKILL.md`).
2. Confirm `README.md` does **not** exist (if it exists, stop — use `/check-readme` instead).
3. Call **`generate_readme`** with `project_path` for the target project.
4. Report README path and sections created.
5. Ask the user to review before commit.

## Safety

- Never invent commands, env values, or API routes.
- Only creates `README.md` (no backup on first create).

## Example prompt

> Generate a README for this project.
