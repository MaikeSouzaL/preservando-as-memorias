---
origem: .agents/skills/supabase-postgres-best-practices/references/conn-prepared-statements.md
origem_hash: d7c37a93276cffd98a9157d7ca7cb5ec5c8dd652
gerado_em: 2026-06-25T23:37:30
---

# `.agents/skills/supabase-postgres-best-practices/references/conn-prepared-statements.md`

## Prepared Statements with Connection Pooling

**Responsibility:** Documents how to avoid prepared statement conflicts in Supabase's transaction-mode connection pooling.

**Key Points:**
- Prepared statements are **connection-specific** — they fail when reused across pooled connections
- Transaction-mode pooling (default) shares connections between requests, causing "prepared statement does not exist" errors

**Solutions:**
1. Use **unnamed prepared statements** (most ORMs do this automatically)
2. Explicitly `DEALLOCATE` after each use in transaction mode
3. Switch to **session mode pooling** (port 6543) for persistent prepared statements

**Driver Configuration:**
- Node.js pg: `{ prepare: false }`
- JDBC: `prepareThreshold=0`

**Links to:** Supabase connection pooling docs; affects all database drivers using prepared statements with pooled connections.
