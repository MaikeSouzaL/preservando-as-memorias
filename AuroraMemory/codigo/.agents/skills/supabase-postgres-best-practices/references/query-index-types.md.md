---
origem: .agents/skills/supabase-postgres-best-practices/references/query-index-types.md
origem_hash: 3c36dc8dcbb70b53b7429a7cdfed37c1eba991e0
gerado_em: 2026-06-25T23:37:30
---

# `.agents/skills/supabase-postgres-best-practices/references/query-index-types.md`

## Query Index Types Reference

**Purpose:** Guide for selecting optimal PostgreSQL index types based on query patterns and data characteristics.

**Key Content:**
- **B-tree (default):** Best for equality, range, and sorting operations (`=`, `<`, `>`, `BETWEEN`, `IN`)
- **GIN:** Optimized for JSONB containment (`@>`), arrays, and full-text search
- **GiST:** Supports geometric data, range types, and KNN nearest-neighbor queries
- **BRIN:** Ideal for large time-series tables (10-100x smaller than B-tree)
- **Hash:** Slightly faster than B-tree for equality-only lookups

**Impact:** Correct index selection yields 10-100x performance improvement. Links to PostgreSQL official documentation for detailed reference.
