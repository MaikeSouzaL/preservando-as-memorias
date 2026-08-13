# Architecture

System-level architecture notes and ADRs for **preservando-as-memorias** (digital-memorial + QR-code-for-tombstones app). Next.js 14 + Supabase (project `xpgxfcsjkubkhmvkvzcu`, region `sa-east-1`).

## Actors (current model, as of 2026-08-11)

Business model is 3-actor:

- **FAMILIAR** — creates a memorial, pays, tracks physical QR-plate delivery.
- **FUNERÁRIA** — resells memorial+QR as a funeral-package add-on; billed by the platform (monthly or per-QR, configurable globally or per-funerária).
- **DONO** — single platform owner; configures pricing, views metrics, manages funerárias and billing.

The prior **operador/representante** role (85% commission) has been eliminated. See the ADR below for the schema consequences of this change.

## Data access boundary

100% of app traffic goes through `src/lib/supabase.ts#createAdminClient()` (service_role key, bypasses RLS) via `src/lib/platform-data.ts`. RLS policies exist as defense-in-depth; they are **not** the live authorization boundary today. See the ADR below (point 7c) before assuming an RLS policy protects anything in production.

## ADRs

| Date | Title | Status | File |
|------|-------|--------|------|
| 2026-08-11 | Schema redesign for 3-actor business model — billing plans, invoices, QR delivery tracking, commission-column cleanup | Proposed (migrations not yet applied) | [adr-2026-08-11-three-actor-schema-redesign.md](adr-2026-08-11-three-actor-schema-redesign.md) |

## Known architectural debt (tracked, not yet fixed)

- `src/lib/platform-data.ts#readPlatformData()` performs 17 unfiltered full-table scans on every request touching any data; `updatePlatformData()` does an in-memory diff-and-write-back with a race window. See the ADR's "Non-schema finding" section. Needs a rewrite to targeted, indexed, per-entity queries.
- Funerária auth (`src/lib/funeral-auth.ts`) is a custom cookie + scrypt scheme that never touches `auth.users`, which keeps several funerária-scoped RLS policies structurally dead. See the ADR's point 7b.
