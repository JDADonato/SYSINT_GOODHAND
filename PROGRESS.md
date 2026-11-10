# Project Progress: GoodHand Store + Field Service Integration

## Phase Status

| Phase | Description | Status |
|---|---|---|
| Phase 0 | Preflight, clone site / fallback seed, UI tokens | done |
| Phase 1 | Foundation, contract, migrations, seeds | done |
| Phase 2 | System B core | done |
| Phase 3 | System A store & outbox | done |
| Phase 4 | Completion, stock ledger, warranty | done |
| Phase 5 | Feedback, demo panel, emails | not started |
| Phase 6 | Deploy, harden, freeze | not started |
| Phase 7 | Rehearsal & final demo check | not started |

## Session Details
- **Last Completed Item:** Phase 4 Completion, Stock Ledger Adjustments & Warranty completed and verified.
  - Implemented hardware loading verification gate in System B (TC-34) preventing starting a job until all ordered SKUs are confirmed loaded.
  - Implemented job start with OP-06 (`webhooks:status`) outbox notification.
  - Implemented field installation completion form with serial number recording, units used/returned validation, and parts adjustments (TC-14).
  - Implemented OP-07 completion webhook dispatch and consumer activating 12-month warranties on System A and fulfilling orders (TC-02, TC-04).
  - Implemented OP-08 inventory adjustment webhooks updating stock ledger with mathematical invariants and idempotent transaction IDs (TC-04, TC-09, TC-30).
  - Implemented OP-09 catalog synchronization provider (`GET /api/v1/catalog`).
  - Implemented OP-12 stock availability endpoint (`GET /api/v1/stock/availability`).
  - Verified test cases TC-02, TC-04, TC-12, TC-14, TC-30, and TC-34 (22/22 tests passing).
- **Decisions Made:**
  - Enforced that job completion requires `used + returned == ordered` and `serials.length == used` count with non-empty serial strings.
  - OP-07 completion immediately schedules feedback invitation (due in 1 hour in production, 1 minute in demo mode per D13).
- **Assumptions Added:**
  - See `docs/assumptions.md`.
- **Open Blockers:**
  - H1-H5 pending human action (non-blocking for Phase 5 implementation).
- **Last Command That Ran Successfully:**
  - `pnpm build` (Store: 15 routes, FSM: 10 routes) & `vitest run` (22/22 tests passing).

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
