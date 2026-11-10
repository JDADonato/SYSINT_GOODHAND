# Project Progress: GoodHand Store + Field Service Integration

## Phase Status

| Phase | Description | Status |
|---|---|---|
| Phase 0 | Preflight, clone site / fallback seed, UI tokens | done |
| Phase 1 | Foundation, contract, migrations, seeds | done |
| Phase 2 | System B core | done |
| Phase 3 | System A store & outbox | not started |
| Phase 4 | Completion, stock ledger, warranty | not started |
| Phase 5 | Feedback, demo panel, emails | not started |
| Phase 6 | Deploy, harden, freeze | not started |
| Phase 7 | Rehearsal & final demo check | not started |

## Session Details
- **Last Completed Item:** Phase 2 System B Core completed and verified.
  - Implemented service-to-service OAuth token verification (`/api/oauth/token`) with scope enforcement (`installations:create`, `installations:read`, etc.).
  - Implemented OP-01 provider route (`POST /api/v1/installations`) with strict schema validation and idempotency handling (201 on creation, 200 on identical replay, 409 `IDEMPOTENCY_KEY_CONFLICT` on conflicting body).
  - Implemented technician assignment endpoint (`POST /api/v1/jobs/[jobNumber]/assign`) with exclusion constraint check preventing overlapping appointments (409 `SCHEDULE_CONFLICT`) and writing OP-05 outbox message upon confirmed schedule.
  - Implemented technician mobile-first "My Jobs" view (`/technician`) with hardware loading verification checklist.
  - Verified test cases TC-03, TC-05, TC-07, TC-08, TC-10, and TC-11.
- **Decisions Made:**
  - Implemented in-memory resilient jobs store singleton for System B supporting idempotent operation caching and overlap conflict detection.
  - Added `@/*` path mapping in tsconfig for clean modular imports.
- **Assumptions Added:**
  - See `docs/assumptions.md`.
- **Open Blockers:**
  - H1-H5 pending human action (non-blocking for Phase 3 implementation).
- **Last Command That Ran Successfully:**
  - `pnpm --filter @prototype/fsm build` & `vitest run` (13/13 tests passing).

## Human Gates Status
- **H1 (Vercel & GitHub linked):** `pending human`
- **H2 (Neon Postgres databases & test branches):** `pending human`
- **H3 (Domain purchased in Vercel):** `pending human`
- **H4 (Resend installed & DNS configured):** `pending human`
- **H5 (GitHub secrets CRON_SECRET & base URLs):** `pending human`
- **H6 (Message to GoodHand):** `pending human` (optional/recommended)
- **H7 (Rehearsal & backup screen recording):** `pending human` (Day 7)

## Not Built (SHOULD / COULD items deferred)
- None yet.
