---
origem: .agents/skills/supabase-postgres-best-practices/references/conn-pooling.md
origem_hash: a1bd7ac19cc592b0a61eb17f2126937443ab2fd6
gerado_em: 2026-06-25T23:37:30
---

# `.agents/skills/supabase-postgres-best-practices/references/conn-pooling.md`

## Connection Pooling Guide

**Purpose:** Explains why and how to implement connection pooling for Postgres to handle 10-100x more concurrent users.

**Key Concepts:**
- Postgres connections consume 1-3MB RAM each; without pooling, high concurrency crashes the database
- PgBouncer sits between app and database, reusing a small pool of actual connections

**Configuration:**
- Pool size formula: `(CPU cores × 2) + spindle_count` (e.g., 10 for 4 cores)
- **Transaction mode** (default): connection returned after each transaction
- **Session mode**: connection held for entire session (for prepared statements, temp tables)

**Reference:** [Supabase Connection Pooler Docs](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
