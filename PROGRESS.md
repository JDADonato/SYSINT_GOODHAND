# Project Progress: GoodHand Store + Field Service Integration

## Phase Status

| Phase | Description | Status |
|---|---|---|
| Phase 0 | Preflight, clone site / fallback seed, UI tokens | done |
| Phase 1 | Foundation, contract, migrations, seeds | done |
| Phase 2 | System B core | not started |
| Phase 3 | System A store & outbox | not started |
| Phase 4 | Completion, stock ledger, warranty | not started |
| Phase 5 | Feedback, demo panel, emails | not started |
| Phase 6 | Deploy, harden, freeze | not started |
| Phase 7 | Rehearsal & final demo check | not started |

## Session Details
- **Last Completed Item:** Phase 1 Foundation & Contract completed. Both Next.js 15 apps (`store` and `fsm`) scaffolded and build successfully with safety banners and `noindex`. OpenAPI 3.1 contract fully validated by Spectral with zero errors. All Zod generated schemas, logger redaction tests, and contract checks (`CL-01` to `CL-16`) pass.
- **Decisions Made:**
  - Sourced product specifications directly from GoodHand verified catalog TSV in `..\goodhand`.
  - Configured `@prototype/logger` with strict Pino redaction rules covering all PII and sensitive headers.
  - Configured `@prototype/contract` OpenAPI 3.1 specification for `OP-01` to `OP-12` with tagged namespaces.
  - Aligned Philippine phone number validation to accept `^\+63[0-9]{8,10}$` to accommodate both mobile and landlines per TC-31.
  - Scaffolding CI workflow (`ci.yml`) and 5-minute drain scheduler workflow (`drain.yml`).
- **Assumptions Added:**
  - See `docs/assumptions.md`.
- **Open Blockers:**
  - H1-H5 pending human action (non-blocking for Phase 2 implementation).
- **Last Command That Ran Successfully:**
  - `pnpm test` (all workspace tests passing).

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
