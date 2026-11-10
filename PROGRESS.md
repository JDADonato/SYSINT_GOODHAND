# Project Progress: GoodHand Store + Field Service Integration

## Phase Status

| Phase | Description | Status |
|---|---|---|
| Phase 0 | Preflight, clone site / fallback seed, UI tokens | done |
| Phase 1 | Foundation, contract, migrations, seeds | not started |
| Phase 2 | System B core | not started |
| Phase 3 | System A store & outbox | not started |
| Phase 4 | Completion, stock ledger, warranty | not started |
| Phase 5 | Feedback, demo panel, emails | not started |
| Phase 6 | Deploy, harden, freeze | not started |
| Phase 7 | Rehearsal & final demo check | not started |

## Session Details
- **Last Completed Item:** Phase 0 Preflight & Clone complete. Extracted 24 verified GoodHand products across all 7 categories into `apps/store/public/_clone/products.json`, generated UI tokens in `packages/ui-tokens/tokens.json` & `index.ts`, and documented constraints in `docs/constraints.md`.
- **Decisions Made:**
  - Initialized isolated git repository in `SYSINT_GOODHAND`.
  - Installed pnpm 9 globally via npm.
  - Sourced product specifications directly from GoodHand verified catalog TSV in `..\goodhand`.
  - Generated offline vector SVG assets for all 24 products under `apps/store/public/_clone/images/` to prevent broken images and avoid live site hotlinking.
- **Assumptions Added:**
  - Recorded in `docs/assumptions.md`.
- **Open Blockers:**
  - H1-H5 pending human action (non-blocking for Phase 1 contract and foundation scaffolding).
- **Last Command That Ran Successfully:**
  - `node scripts/clone-site.mjs`

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
