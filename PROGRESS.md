# Project Progress: GoodHand Store + Field Service Integration

## Phase Status

| Phase | Description | Status |
|---|---|---|
| Phase 0 | Preflight, clone site / fallback seed, UI tokens | done |
| Phase 1 | Foundation, contract, migrations, seeds | done |
| Phase 2 | System B core | done |
| Phase 3 | System A store & outbox | done |
| Phase 4 | Completion, stock ledger, warranty | done |
| Phase 5 | Feedback, demo panel, emails | done |
| Phase 6 | Deploy, harden, freeze | not started |
| Phase 7 | Rehearsal & final demo check | not started |

## Session Details
- **Last Completed Item:** Phase 5 Feedback, Demo Panels, Mail Log, and Follow-up Workflows completed and verified (34/34 tests passing).
- **Current Focus:** Ready for Phase 6 - Deploy, harden, freeze (documentation, runbook, deployment guide, stock-ledger docs, demo script).
- **Decisions Made:**
  - Store tags never leave System A; only technician ratings, technician tags, and customer first name sent via OP-10/OP-11 (CL-15, TC-19, TC-32).
  - Outage simulation toggle reads from `simulation_flags` table and triggers 503 SERVICE_UNAVAILABLE to verify outbox buffering.
  - Strict 7-day editing window on feedback (D13, TC-27, TC-29).
  - IDOR security guard on technician feedback view: querying another technician's reviews returns 404 (TC-28).
  - Low ratings (≤ 2) automatically flag for review, create open follow-up tickets, and send email alerts (TC-24, D14).
- **Assumptions Added:**
  - See `docs/assumptions.md`.
- **Open Blockers:**
  - H1-H5 pending human action (ready for Phase 6 deployment).
- **Last Command That Ran Successfully:**
  - Vitest test suite (34/34 passing).

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
