---
origem: .agents/skills/supabase-postgres-best-practices/references/schema-foreign-key-indexes.md
origem_hash: fd35c3a263ac10905e0c668f51780105c0d912a2
gerado_em: 2026-06-26T00:33:20
---

# `.agents/skills/supabase-postgres-best-practices/references/schema-foreign-key-indexes.md`

## Foreign Key Indexing Guide

**Purpose:** Documents the critical practice of indexing foreign key columns in PostgreSQL to prevent performance degradation.

**Key Points:**
- Postgres does **not** auto-index FK columns — missing indexes cause slow JOINs and CASCADE operations
- Unindexed FKs force full table scans on lookups and lock tables during cascading deletes
- Always create explicit indexes on FK columns (e.g., `create index orders_customer_id_idx on orders (customer_id)`)
- Includes a diagnostic query to find missing FK indexes across the schema

**Impact:** HIGH — 10-100x faster JOINs and CASCADE operations when properly indexed.
