---
origem: .agents/skills/supabase-postgres-best-practices/references/schema-primary-keys.md
origem_hash: d140b4d368a6045805d1a46c98bdb62c149e71ae
gerado_em: 2026-06-25T23:37:30
---

# `.agents/skills/supabase-postgres-best-practices/references/schema-primary-keys.md`

## Primary Key Strategy Selection Guide

**Responsibility:** Documents optimal primary key choices for PostgreSQL tables, focusing on performance, index locality, and fragmentation avoidance.

**Key Recommendations:**
- **Sequential IDs:** Use `bigint generated always as identity` (SQL-standard, 8 bytes)
- **Distributed UUIDs:** Use UUIDv7 (time-ordered, requires `pg_uuidv7` extension) or time-prefixed text IDs
- **Avoid:** Random UUIDv4 (causes index fragmentation) and `serial` (use `identity` instead)

**Code Examples:** Shows incorrect (serial, UUIDv4) vs correct (identity, UUIDv7, time-prefixed) patterns with SQL DDL.

**Guidelines:** Single database → `bigint identity`; distributed systems → UUIDv7/ULID; large tables → avoid random UUIDs.

**References:** PostgreSQL docs on identity columns.
