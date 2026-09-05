# Verify Project

Run verification across repositories.

## Steps
1. Run `npm test` in `retro-api/`.
2. Confirm API health at `http://localhost:3001/api/health`.
3. Check required files exist per PLAN.md Phase 0–7.
4. Validate JSON in `retro-api/data/` if present.
5. Invoke `verifier` sub-agent for independent check.
6. Report pass/fail with evidence.
