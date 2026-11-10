# Recorded Assumptions & Decisions

This file tracks architectural and implementation assumptions made during development as per Section 0.4 of `task.md`.

## Initial Assumptions (Phase 0)

1. **Monorepo Structure:** Monorepo uses pnpm workspaces (`pnpm-workspace.yaml`) with packages (`contract`, `logger`, `ui-tokens`, `ui`) and apps (`store`, `fsm`).
2. **Environment & Runtime:** Windows development running Node.js 20+ with native PowerShell. All custom tooling scripts are `.mjs` modules executed via pnpm.
3. **Session Cookie Separation:** `store_session` on System A (`localhost:3000` / `shop.<domain>`) and `fsm_session` on System B (`localhost:3100` / `field.<domain>`). Cookies are scoped as host-only (no wildcard domain) for strict security isolation between store customers/admins and field dispatchers/technicians.
4. **Site Clone & Fallback Strategy:** If live crawling of `shop.goodhand88.com` encounters anti-bot shields, rate limits, or connectivity issues, `scripts/clone-site.mjs` will fall back to generating synthetic but realistic GoodHand catalog fixtures matching the 7 designated security equipment categories (CCTV, Alarms, Smart Locks, Access Control, Electric Fence, Radios, Networking/Storage) with 24 products and extracted branding tokens.
5. **Database Availability:** While Neon Postgres (H2) test branches are provisioned by the user, local schema validation and unit tests will run using mock contract fixtures, and Neon test branch connection strings will be used for all integration test runs requiring `btree_gist` exclusion constraints.
