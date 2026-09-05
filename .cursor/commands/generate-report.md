# Generate Report

Generate or update `report.md` for a retrospective.

## Arguments
- `retroId` (required)

## Steps
1. Read `retro.json`, feedback, `analysis.json`, and `actions.json`.
2. Use skill `generate-retro-report` with the report template.
3. Call API `POST /api/retrospectives/:retroId/report/generate` or write `report.md` directly.
4. Verify anonymous authors are not named.
5. Distinguish raw feedback, analysis, suggestions, and approved actions.
