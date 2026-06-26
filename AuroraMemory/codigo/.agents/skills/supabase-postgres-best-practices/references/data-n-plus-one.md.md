---
origem: .agents/skills/supabase-postgres-best-practices/references/data-n-plus-one.md
origem_hash: 6089ab56c11e68181fed0bbf47585f325d45e44f
gerado_em: 2026-06-25T23:37:30
---

# `.agents/skills/supabase-postgres-best-practices/references/data-n-plus-one.md`

## N+1 Query Elimination Reference

**Responsibility:** Documents the N+1 query anti-pattern and provides batch loading solutions for Supabase/Postgres performance optimization.

**Key Content:**
- **Problem:** N+1 queries execute one query per item in a loop (e.g., 100 users → 101 round trips)
- **Solutions:**
  - `ANY(array[...])` — batch IDs into single query
  - `JOIN` — replace loops with relational joins
  - Application pattern: pass array parameter (`$1::bigint[]`)
- **Impact:** 10-100x fewer database round trips (MEDIUM-HIGH severity)

**Relations:** References Supabase query optimization guide; used by `.agents/skills/supabase-postgres-best-practices/` skill files for performance rules.
