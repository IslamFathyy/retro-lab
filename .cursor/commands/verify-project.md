# Verify Project

Run verification before starting the Cursor test workflow.

## Steps

1. Run `npm test` in `retro-api/` — all tests must pass.
2. Confirm API health: `GET http://localhost:3001/api/health`
3. Confirm web UI serves: `GET http://localhost:8080/index.html`
4. Check orchestration assets exist:
   - `.cursor/commands/run-retro-workflow.md`
   - `.cursor/skills/analyze-retrospective/SKILL.md`
   - `.cursor/agents/feedback-analyst.md`, `improvement-advisor.md`, `insights-visualizer.md`, `verifier.md`
5. Invoke **verifier** sub-agent for independent check.
6. Report pass/fail with evidence.

## Next step

If all pass: `/seed-demo-retro` or `/run-retro-workflow`
