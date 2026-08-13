---
name: adr-2026-08-11-three-actor-schema-redesign
description: Schema redesign for the 3-actor business model (FAMILIAR / FUNERÁRIA / DONO) — billing plans, invoices, QR delivery tracking, commission-column cleanup, orders PK switch, RLS rewrite.
metadata:
  type: adr
  status: proposed
  date: 2026-08-11
  supabase_project_id: xpgxfcsjkubkhmvkvzcu
  supabase_region: sa-east-1
---

# ADR: Schema redesign for 3-actor business model — billing plans, invoices, QR delivery tracking, commission-column cleanup

- **Status:** Proposed — migrations written and reviewed, **NOT applied** to the live database. Awaiting execution approval.
- **Date:** 2026-08-11
- **Author:** Database specialist (schema audit via Supabase MCP tools against the live `xpgxfcsjkubkhmvkvzcu` project, sa-east-1)
- **Artifacts of record** (in apply order):
  1. `supabase/migrations/20260811100000_phase1_additive_new_business_model.sql`
  2. `supabase/migrations/20260811110000_phase2_orders_pk_switch.sql`
  3. `supabase/migrations/20260811120000_phase3_drop_legacy.sql`
  4. `supabase/migrations/20260811130000_phase4_rls_rewrite.sql`

## Context

The business model is being simplified from a 4-actor model to a 3-actor model:

- **FAMILIAR** — creates a memorial, pays for it, tracks physical QR-plate delivery.
- **FUNERÁRIA** — resells memorial+QR as a funeral-package add-on; billed by the platform either monthly or per-QR-generated, configurable globally or per-funerária.
- **DONO** — single platform owner; configures pricing, views metrics, manages funerárias and what's charged to each.

The **operador/representante** role (which took an 85% commission) is eliminated entirely. The live schema still carries the scar tissue of at least 3 historical business-model iterations (2-tier, cascade/operador, and now 3-actor), which this ADR resolves. The full audit was performed with Supabase MCP (`list_tables`, `execute_sql`, `get_advisors`) against the live project, plus a code search across `src/` to confirm which backend routes have zero frontend consumers before proposing drops.

## Decision

### 1. Drop the 5 funeral-home ERP tables (dead feature surface)

`funeral_services`, `funeral_schedules`, `inventory_items`, `staff_members`, `funeral_documents` have complete CRUD API routes (`src/app/api/funeral-auth/{services,schedules,inventory,staff,documents}/route.ts`) but **zero** frontend pages reference them — only `login`, `cadastro`, `dashboard`, `novo-memorial`, `dados-bancarios` exist under `src/app/(funeral)/`. Finished backend, no UI, out of scope for a "sell QR codes" business. All 5 tables have 0 rows in production. Dropped in phase 3, after phase 1/2 have shipped and the app no longer depends on anything downstream.

### 2. Replace ad hoc subscription fields with relational billing plans + an invoice ledger

`funeral_homes` previously carried ad hoc subscription fields: `active_plan_id` (text pointer into a `platform_config.funeral_plans` JSONB array), `admin_commission_percent`, `plan_started_at`, `plan_renews_at`. These are replaced by:

- **`funeral_home_billing_plans`** — real relational table: `billing_mode` (`'monthly'` | `'per_qr'`), `monthly_fee_cents`, `memorial_included_qty`, `per_qr_price_cents`, `is_default`. Referenced via `funeral_homes.billing_plan_id` (`NULL` = inherit the `is_default` plan).
- **`funeral_home_invoices`** — the actual DONO↔funerária billing ledger (period, amount, status, `qr_count`). This is a first-class concept that did not exist before; it was being conflated into `orders`' commission columns.

Both introduced in phase 1 (additive).

### 3. Collapse `orders`' 5 overlapping commission columns to 2

`orders` had 5 overlapping/redundant commission columns accumulated across 3 historical business-model iterations: `platform_commission_cents`, `operator_amount_cents` (literal leftover of the eliminated 85%-commission operador role), `funeral_home_commission_cents`, `funeral_home_amount_cents`, `admin_parceiro_amount_cents`.

**Root cause:** `calculateCascadeOrderTotals()` in `src/lib/platform-types.ts` aliases cascade-model fields onto the old 2-tier column names, so the *same column* means different things depending on `order.source`.

**Resolution (phase 1 additive, phase 3 drops the old columns):** collapsed to `platform_amount_cents` (DONO's cut) + `funeral_home_amount_cents` (kept, meaning unchanged: net transferred to the funerária's connected Stripe account), with `gross_amount_cents = platform_amount_cents + COALESCE(funeral_home_amount_cents, 0)` enforced as a CHECK constraint.

**Related app-code bug found, NOT fixable by migration alone:** `src/lib/platform-data.ts`'s `toDbOrder()` hardcodes `user_id: null` on every write, so `orders.user_id` (FK to `profiles`) and its RLS policy (`orders_owner_all`: `auth.uid() = user_id`) have never worked for any order ever created. This needs an app-code fix (the checkout route and `toDbOrder` must pass the authenticated user's id) — **flagged for backend-developer follow-up**, tracked as an open item below.

### 4. Switch `orders.id` from app-generated text to a database-generated UUID

`orders.id` is `text` with no DB-side default, app-generated as `` ord_${Date.now().toString(36)} `` in `src/app/api/checkout/route.ts` — millisecond resolution, no random component, real collision risk under the concurrent-execution model of serverless functions. `information_schema` confirms nothing FKs to `orders.id`, so the migration is safe from a referential-integrity standpoint.

Phase 2 swaps in a `uuid` PK (`new_id` → `id`) while preserving the old value as `order_number` for support/CS continuity. **This is a breaking migration requiring a coordinated app deploy**: it must ship after phase 1, and the checkout code must stop writing app-generated text ids before or atomically with phase 2.

### 5. Merge `platform_settings` into `platform_config`

`platform_config` (columns + 2 JSONB blobs: `plans`, `funeral_plans`) and `platform_settings` (a parallel 2-row key/value EAV table holding only `adminBankDataEncrypted` and `platformAdminEmail`) were two competing patterns for "the one platform singleton config row." `platform_settings`'s 2 keys are merged into `platform_config` as real columns in phase 1; `platform_settings` is dropped in phase 3.

### 6. Add `qr_deliveries` as a real delivery state machine

Replaces `memorials.delivery_address` + `memorials.qr_sent_at` (two loose columns with no state machine). New table: `memorial_id` (unique FK), `address` (JSONB), `responsible_party`, `status` (`pending → address_confirmed → printed → shipped → delivered/failed`), `tracking_code`. This is what lets FAMILIAR "acompanhar a entrega da placa física" per the new business requirements, and gives DONO a real pending-deliveries metric. Added in phase 1.

### 7. RLS audit findings

No table currently has RLS-enabled-with-zero-policies (all 18 tables have ≥1 policy), but the real finding is worse than that framing suggests:

- **(a) `funeral_homes` had a permissive open INSERT policy** (`WITH CHECK true`, role `public`) and **no** select/update/delete policy at all — any anon/authenticated caller could insert arbitrary `funeral_homes` rows (e.g. `approval_status = 'approved'`) if the anon key ever touched this table directly. Removed in phase 4.
- **(b) All funeral_home-scoped `owner_all` policies** (`funeral_services`, `funeral_schedules`, `inventory_items`, `staff_members`, `funeral_documents`, `funeral_home_offer_links`) compare `funeral_home_id = auth.uid()` — but funerária sessions are a custom cookie (`src/lib/funeral-auth.ts`, `password_hash`/scrypt column on `funeral_homes`, never touches `auth.users`), so `auth.uid()` never equals a `funeral_home` id. These policies are **permanently dead/unreachable**, not just today but structurally, until `funeral_homes` gets a real `auth.users` link. Phase 1 adds `funeral_homes.auth_user_id` (nullable FK to `auth.users`); phase 4 adds a `current_funeral_home_id()` SECURITY DEFINER helper, so policies resolve correctly the moment that auth migration happens. Until then they're intentionally inert (fail-closed), which is acceptable.
- **(c) The deeper architectural point:** literally 100% of app traffic goes through `src/lib/supabase.ts#createAdminClient()` (service_role key, bypasses RLS), via `src/lib/platform-data.ts`'s `readPlatformData()`/`updatePlatformData()`. RLS today is pure defense-in-depth, not the live authorization boundary — the real boundary is application code + httpOnly session cookies. Phase 4 adds an `is_platform_owner()` SECURITY DEFINER helper (checks `profiles.is_admin OR is_dev_admin`) and DONO-bypass policies on every table, so the admin panel *could* move off service-role onto session-bound, RLS-respecting queries in the future without losing access.

### 8. Security-advisor findings fixed in phase 1

- `public.update_updated_at()` had a mutable `search_path` — pinned to `pg_catalog, public`.
- `public.handle_new_user()` (SECURITY DEFINER trigger, creates a `profiles` row on `auth.users` signup) was directly EXECUTE-able by anon/authenticated via PostgREST RPC — revoked.
- **Flagged but NOT fixed by SQL** (a Supabase Auth dashboard setting, not DDL): "Leaked Password Protection Disabled." Recommend enabling HaveIBeenPwned checking for Supabase Auth passwords. This only protects `auth.users` (profiles / family+owner logins), not the separate `funeral_homes.password_hash` scheme, which has no such protection — a second argument for eventually migrating funerária auth onto Supabase Auth (see point 7b).

## Non-schema finding (biggest one, not fixed by these migrations)

`src/lib/platform-data.ts`'s `readPlatformData()` does a `Promise.all` of **17 unfiltered `select("*")` full-table-scans** across every table in the database, on *every* request that touches any data — even a PATCH to a single `funeral_documents` row calls `readPlatformData()` first. `updatePlatformData()` then diffs an in-memory JSON snapshot against a mutated copy and writes back via `persistChanges()`. No pagination, no per-row locking/transaction, and a read-modify-diff-write race window between concurrent requests (last-write-wins across the whole diffed dataset, not per-row).

This works today only because the DB is nearly empty (`profiles` = 3, `memorials` = 1, most tables = 0). It will not scale and should be replaced with targeted, indexed, per-entity queries — which is also why the FK indexes added in phase 1 don't matter operationally yet: nothing issues a WHERE-filtered query against them today. **Flagged for backend-developer follow-up; out of scope for this schema ADR.**

## Consequences

- Phases 1, 3, and 4 are additive/cleanup and low-risk in isolation; **phase 2 (orders PK switch) is breaking** and requires a coordinated app deploy — the checkout route must stop writing app-generated text ids before or atomically with applying phase 2.
- Phase 3 (drops) must not run before phase 1 has been applied and verified, and before confirming no code path still reads the dropped ERP tables or `platform_settings`.
- Phase 4's new `owner_all` policies for funerária-scoped tables remain dead until `funeral_homes.auth_user_id` is populated and funerária login is migrated onto Supabase Auth — this is intentional (fail-closed), not a bug, but should not be mistaken for "funerária RLS now works."
- RLS is defense-in-depth only; the live authorization boundary is `createAdminClient()` + application code. This ADR does not change that boundary.
- This ADR does not fix the `orders.user_id: null` app bug (point 3) or the `readPlatformData()` full-scan architecture (see above) — both require app-code changes tracked separately.

## Open follow-ups (not covered by these migrations)

1. **App-code fix:** `src/lib/platform-data.ts#toDbOrder()` and the checkout route must pass the authenticated user's id instead of hardcoding `user_id: null`, so `orders_owner_all` RLS becomes meaningful.
2. **App-code fix:** checkout route must stop generating `ord_${Date.now().toString(36)}` text ids, coordinated with phase 2's PK switch.
3. **Architecture follow-up:** replace `readPlatformData()`/`updatePlatformData()`'s 17-table full-scan + diff-write pattern with targeted, indexed, per-entity queries.
4. **Supabase Auth dashboard setting:** enable leaked-password protection (HaveIBeenPwned) for `auth.users`.
5. **Longer-term:** migrate funerária authentication from the custom `password_hash`/scrypt cookie scheme (`src/lib/funeral-auth.ts`) onto Supabase Auth + `funeral_homes.auth_user_id`, to activate the phase-4 owner-scoped RLS policies and gain the leaked-password protection referenced in (4).

## References

- Supabase project: `xpgxfcsjkubkhmvkvzcu` (region `sa-east-1`)
- Migrations (apply order): see "Artifacts of record" above
- Related app code: `src/lib/platform-types.ts` (`calculateCascadeOrderTotals`), `src/lib/platform-data.ts` (`toDbOrder`, `readPlatformData`, `updatePlatformData`), `src/lib/supabase.ts` (`createAdminClient`), `src/lib/funeral-auth.ts`, `src/app/api/checkout/route.ts`, `src/app/api/funeral-auth/{services,schedules,inventory,staff,documents}/route.ts`
