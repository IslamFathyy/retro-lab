---
name: verify-changes
description: Run project tests and basic checks before marking coding work complete. Use with /verify-changes or before commit.
---

# Verify Changes Skill

Confirm AI-assisted edits are safe to ship. Works in any repo with a test script.

## Steps

1. Identify test command:
   - `package.json` → `scripts.test` (e.g. `npm test`)
   - `pyproject.toml` / `pytest` → `pytest`
   - If none found, report **SKIP tests** and continue with file review only.

2. Run tests from project root. Capture pass/fail count.

3. If JSON config files were edited, confirm they parse (hooks also enforce this).

4. **Task → verifier** (recommended): pass changed paths + test output; wait for pass/fail.

5. Summarize for the user: PASS / FAIL / SKIP with evidence.

## Rules

Follow plugin rules in `rules/development.mdc` and `rules/security.mdc`.

## Do not

- Force push or amend published commits
- Commit `.env` or credential files
- Delete failing tests to pass verification

## How to verify the plugin

In a clean workspace with only this plugin installed, run `/verify-changes` after a small edit — hooks should block invalid JSON or `.env` writes.
