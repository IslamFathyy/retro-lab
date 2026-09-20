# Sub-agents golden path — checklist

**Purpose:** Prove all three org roles (Exploration → Execution → Verification) on one real workflow without circular delegation.

**Workflow:** `/analyze-retro RETRO-2026-001` (parent thin; sub-agents via Task)  
**Last run:** 2026-09-19

---

## Role tests

| # | Org role | Agent | Input passed | Output received | Result |
|---|----------|-------|--------------|-----------------|--------|
| 1 | **Exploration** | `feedback-analyst` | 6 feedback items (FB-0001–FB-0006) | 3 themes, strengths, concerns, opportunities, limitations + IDs | ☑ PASS |
| 2 | **Execution** | `improvement-advisor` | Analyst structured output | 5 `suggestedActions` with `ownerTeams` + `sourceFeedbackIds` | ☑ PASS |
| 3 | **Verification** | `verifier` | `analysis.json` + privacy checklist + `npm test` | 3/3 checks PASS, 26/26 tests | ☑ PASS |

**No circular delegation:** analyst did not suggest actions; advisor did not re-analyze feedback; verifier did not modify files.

---

## SUBAGENT_SUMMARY evidence (2026-09-19)

**feedback-analyst (exploration):**
```text
SUBAGENT_SUMMARY: 3 themes (delivery execution, quality/QA readiness, process discipline); all 6 feedback IDs cited (FB-0001–FB-0006); limitations include human-review disclaimer and no causal claims.
```

**improvement-advisor (execution):**
```text
SUBAGENT_SUMMARY: 5 suggested actions for RETRO-2026-001 — (1) dev-to-QA handoff cutoff [FB-0003], (2) align QA test scope before testing [FB-0005], (3) timebox syncs with fixed agenda [FB-0004], (4) two reviewers on PRs [FB-0006], (5) mid-sprint delivery checkpoints [FB-0001, FB-0002]. All ownerTeams use allowed config team ids only.
```

**verifier (verification):**
```text
SUBAGENT_SUMMARY: PASS — analysis.json schema/refs/privacy validated; generatedBy=cursor-agent confirmed; npm test 26/26 passed in retro-api/; no blockers.
```

Hook log (when configured): `.cursor/logs/subagent-activity.log`

---

## Bonus: report exploration path

| Agent | Workflow | Status |
|-------|----------|--------|
| `insights-visualizer` | `/generate-report` | ☑ Profile ready — run separately for report chart evidence |

---

## Sign-off

| Role | Name | Date | Golden path |
|------|------|------|-------------|
| Owner | Islam Fathy | 2026-09-19 | ☑ PASS |

**Related:** [`sub-agents.md`](sub-agents.md) · [`skills/verify-analyze-retrospective.md`](skills/verify-analyze-retrospective.md)
