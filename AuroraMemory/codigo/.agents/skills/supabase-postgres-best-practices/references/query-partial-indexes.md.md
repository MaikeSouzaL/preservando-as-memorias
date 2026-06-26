---
origem: .agents/skills/supabase-postgres-best-practices/references/query-partial-indexes.md
origem_hash: 627f5234ff9d6ee69d0d29b95d4b6f50d5fac891
gerado_em: 2026-06-25T23:37:30
---

# `.agents/skills/supabase-postgres-best-practices/references/query-partial-indexes.md`

## Partial Indexes for Filtered Queries

**Responsibility:** Documents how to optimize PostgreSQL queries using partial indexes that only include rows matching a WHERE condition.

**Key Points:**
- Partial indexes are 5-20x smaller than full indexes, improving write and query performance
- Best for queries that consistently filter on the same condition (e.g., `deleted_at is null`)

**Examples:**
- **Incorrect:** Full index on `users(email)` when queries always filter `deleted_at is null`
- **Correct:** Partial index `users_active_email_idx` with `WHERE deleted_at is null`
- **Common use cases:** Pending orders (`WHERE status = 'pending'`), non-null SKUs (`WHERE sku is not null`)

**Reference:** PostgreSQL docs on [Partial Indexes](https://www.postgresql.org/docs/current/indexes-partial.html)
