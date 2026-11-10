# Project Progress: GoodHand Store + Field Service Integration

## Phase Status

| Phase | Description | Status |
|---|---|---|
| Phase 0 | Preflight, clone site / fallback seed, UI tokens | done |
| Phase 1 | Foundation, contract, migrations, seeds | done |
| Phase 2 | System B core | done |
| Phase 3 | System A store & outbox | done |
| Phase 4 | Completion, stock ledger, warranty | not started |
| Phase 5 | Feedback, demo panel, emails | not started |
| Phase 6 | Deploy, harden, freeze | not started |
| Phase 7 | Rehearsal & final demo check | not started |

## Session Details
- **Last Completed Item:** Phase 3 System A Store & Outbox completed and verified.
  - Implemented Cart, Checkout, Order Detail, and Lead capture pages in System A (`store`).
  - Implemented Stock Ledger mathematical state machine enforcing `0 <= reserved <= on_hand` per SKU.
  - Implemented Transactional Outbox engine with immediate dispatch attempt, exponential retry backoff, circuit breaker, and 6-second budget guard on drain worker (`POST /api/internal/drain`).
  - Implemented Failed Message Queue (W-04) with idempotent replay reusing the original `Idempotency-Key`.
  - Implemented OP-05 webhook consumer (`POST /api/v1/webhooks/schedule-confirmations`) with HMAC `X-Signature` verification and timestamp skew check.
  - Verified test cases TC-06, TC-09, TC-10, TC-13, TC-30, and TC-31.
- **Decisions Made:**
  - Implemented transactional ledger supporting reservations for installations, direct sales for pickups, and parts adjustments.
  - Outbox drain engine respects Vercel 10s ceiling via 6s cutoff timer.
- **Assumptions Added:**
  - See `docs/assumptions.md`.
- **Open Blockers:**
  - H1-H5 pending human action (non-blocking for Phase 4 implementation).
- **Last Command That Ran Successfully:**
  - `pnpm build` & `vitest run` (18/18 tests passing).

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
