---
origem: .agents/skills/supabase-postgres-best-practices/references/query-missing-indexes.md
origem_hash: 28fceef4ca2c16bae3e41501856300c39155c60a
gerado_em: 2026-06-26T00:33:20
---

# `.agents/skills/supabase-postgres-best-practices/references/query-missing-indexes.md`

## Query Missing Indexes

**Responsibility:** Documents the critical performance practice of adding indexes on columns used in WHERE clauses and JOIN conditions to prevent sequential scans.

**Key Content:**
- **Problem:** Queries on unindexed columns trigger full table scans (Seq Scan), degrading performance 100-1000x on large tables
- **Solution:** Create indexes on frequently filtered columns (`create index orders_customer_id_idx on orders (customer_id)`)
- **JOIN Rule:** Always index the foreign key column on the referencing table

**Impact:** CRITICAL — prevents exponential slowdown as tables grow

**Reference:** Supabase Query Optimization docs
