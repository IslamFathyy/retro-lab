# Close Retrospective

Close a retrospective so analysis can run.

## Arguments

- `retroId` (required) — e.g. `RETRO-2026-001`

## Steps

1. Verify retro exists: `GET http://localhost:3001/api/retrospectives/{retroId}`
2. Confirm status is `open`.
3. Confirm feedback count meets **minimum to close** (see `config/guardrails.json` → `close.minFeedbackCount`, default **3**). If below minimum, API returns 400 — do not proceed.
4. Close via API:

```bash
curl -s -X POST http://localhost:3001/api/retrospectives/{retroId}/close
```

5. Confirm status is now `closed`.
6. Report feedback count and **next step**: `/analyze-retro {retroId}`.
