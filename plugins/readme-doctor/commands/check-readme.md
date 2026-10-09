---
name: check-readme
description: Align an existing README.md to the company canonical structure via readme-doctor MCP (align_readme).
---

# Check README

Update the current project's `README.md` to the **company canonical outline** (scan-derived content). Creates `README.md.backup` before writing.

## Steps

1. Read the readme-doctor skill (plugin or `plugins/readme-doctor/skills/readme-doctor/SKILL.md`).
2. Confirm `README.md` exists at the target repo root.
3. Optionally call **`analyze_readme`** and show the canonical section score.
4. Call **`align_readme`** with `project_path` set to the target repo root.
5. Report README path, backup path, and ask the user to review before commit.

## Example prompt

> Check and align my README for this repo.
