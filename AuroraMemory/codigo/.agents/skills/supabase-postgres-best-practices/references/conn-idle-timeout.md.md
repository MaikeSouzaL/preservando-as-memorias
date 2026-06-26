---
origem: .agents/skills/supabase-postgres-best-practices/references/conn-idle-timeout.md
origem_hash: 5d2a0d4949438c0ed468e15ebbe4f4adede0fa1a
gerado_em: 2026-06-26T00:33:20
---

# `.agents/skills/supabase-postgres-best-practices/references/conn-idle-timeout.md`

# Idle Connection Timeout Configuration

## Purpose
Reclaims 30-50% of connection slots by automatically terminating idle database connections.

## Key Configuration

### PostgreSQL Settings
- `idle_in_transaction_session_timeout = '30s'` — kills transactions idle for 30+ seconds
- `idle_session_timeout = '10min'` — kills completely idle connections after 10 minutes
- Apply via `alter system set` + `pg_reload_conf()`

### Connection Pooler (PgBouncer)
- `server_idle_timeout = 60` — pooler-side idle cleanup
- `client_idle_timeout = 300` — client-side idle cleanup

## Anti-Pattern
Default `0` (disabled) keeps connections open indefinitely, wasting slots and holding locks.
