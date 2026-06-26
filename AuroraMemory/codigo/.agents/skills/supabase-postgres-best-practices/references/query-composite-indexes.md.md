---
origem: .agents/skills/supabase-postgres-best-practices/references/query-composite-indexes.md
origem_hash: 7d8c141ca06d124ea85dfa56202f471b6240bef7
gerado_em: 2026-06-26T00:33:20
---

# `.agents/skills/supabase-postgres-best-practices/references/query-composite-indexes.md`

## Composite Indexes for Multi-Column Queries

**Responsibility:** Optimizes queries filtering on multiple columns by creating composite indexes, avoiding slower bitmap scans from separate indexes.

**Key Points:**
- **Composite index** (e.g., `orders (status, created_at)`) enables single efficient index scan
- **Column order matters:** equality columns first (`=`), range columns last (`>`, `<`)
- **Leftmost prefix rule:** index works for queries starting with leftmost column(s); fails for queries skipping the first column

**Example:**
- ❌ Separate indexes: `orders_status_idx` + `orders_created_idx` → bitmap scan (slower)
- ✅ Composite: `orders_status_created_idx` on `(status, created_at)` → single index scan

**Reference:** PostgreSQL [Multicolumn Indexes](https://www.postgresql.org/docs/current/indexes-multicolumn.html)
