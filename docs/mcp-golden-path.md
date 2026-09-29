# MCP golden path — checklist

**Purpose:** Prove one real agent task end-to-end through MCP (org goal 100%).  
**Primary path:** `/archive-retro {retroId}` → Google Drive backup → local `archived` → reminder export.

**Last run:** 2026-09-19 — `RETRO-2026-001` (re-upload to existing Drive archive after OAuth refresh)

---

## Prerequisites

| # | Check | Result | Notes |
|---|-------|--------|-------|
| P1 | `retro-api` running (`http://localhost:3001/api/health`) | ☑ PASS | `{"status":"ok"}` |
| P2 | Retrospective has `report.md` and status `actioned` (or later) | ☑ PASS | `RETRO-2026-001` — `archived`, `report.md` present |
| P3 | Google Drive MCP connected (Settings → MCP green) | ☑ PASS | Re-auth required (`invalid_grant` → `npx @piotr-agier/google-drive-mcp auth`) → `islamfathi145@gmail.com` |
| P4 | Skill `archive-retrospective` readable | ☑ PASS | |

---

## Golden path steps

| # | Step | Expected outcome | Result | Evidence |
|---|------|------------------|--------|----------|
| 1 | Agent archive workflow via Drive MCP | Uses skill + MCP tools | ☑ PASS | Re-upload run 2026-09-19 |
| 2 | Drive folder `Retrospective Management` exists (one parent) | Single parent folder ID | ☑ PASS | Folder ID: `1RxpMGYqkoHTkDCKHK0xWr3fT9g6cTODz` |
| 3 | Subfolder `RETRO-2026-001 - Sprint 1 Retro` | Folder under parent | ☑ PASS | Folder ID: `1g7QDaM8Jgf49YRHO60JQeIsm3r8xRVkC` |
| 4 | Files uploaded | 4 root + 6 feedback JSON | ☑ PASS | 10/10 files updated via `uploadFile` |
| 5 | `listFolder` verification | 4 files + `feedback/` subfolder | ☑ PASS | `actions.json`, `analysis.json`, `report.md`, `retro.json`, `feedback/` |
| 6 | Local API status → `archived` | `GET /api/retrospectives/RETRO-2026-001` | ☑ PASS | `status: "archived"` |
| 7 | `npm run export:reminder` | `docs/reminders/latest-reminder.json` updated | ☑ PASS | Exported from latest archived `RETRO-2026-004` |
| 8 | Local files still on disk | `repos/retro-api/data/...` unchanged | ☑ PASS | 12 local files remain |

**Overall golden path:** ☑ **PASS** (all steps 1–8)

---

## Drive links (RETRO-2026-001)

| File | Drive ID |
|------|----------|
| Parent `Retrospective Management` | `1RxpMGYqkoHTkDCKHK0xWr3fT9g6cTODz` |
| Retro folder | `1g7QDaM8Jgf49YRHO60JQeIsm3r8xRVkC` |
| `retro.json` | `1IvQ4Y1qS_f_xNx-oq1gdjet5IA7DA60U` |
| `analysis.json` | `1aA5o2OUQMYMLSd3jMx4qrR4h8bmgLdVG` |
| `actions.json` | `1r2s5loNFUvwtKYbwKfulKAEdDftyqXLL` |
| `report.md` | `1UsIXCFGnWm5KBkpwqvaovt9DpnvzU_3Z` |
| `feedback/` | `1dmLRiC43raDFkHtcttw70eWvTiaBghBW` (6 × `FB-*.json`) |

---

## Optional extension (secondary MCP)

| # | Step | Expected | Result |
|---|------|----------|--------|
| E1 | `/commit-latest-report` | Snapshot on GitHub `main` | ☐ Not run this session |
| E2 | `/weekly-action-reminder` (dry-run) | Subject + body in chat | ☐ Not run this session |
| E3 | `/weekly-action-reminder` (live) | Gmail `send_message` | ☐ Not run this session |

---

## Sign-off

| Role | Name | Date | Golden path |
|------|------|------|-------------|
| Owner | Islam Fathy | 2026-09-19 | ☑ PASS |

**Note:** OAuth token had expired (`invalid_grant`) at session start; re-auth via browser was required before MCP tools succeeded. Archive folder already existed from 2026-09-10 run — this session re-uploaded all files in place to prove live MCP connectivity.
