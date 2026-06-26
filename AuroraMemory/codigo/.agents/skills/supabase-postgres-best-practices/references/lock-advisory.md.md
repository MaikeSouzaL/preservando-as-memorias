---
origem: .agents/skills/supabase-postgres-best-practices/references/lock-advisory.md
origem_hash: b59f954349025b59945f3f0e67beae716be8ab0d
gerado_em: 2026-06-25T23:37:30
---

# `.agents/skills/supabase-postgres-best-practices/references/lock-advisory.md`

# Advisory Lock Reference

## Purpose
Documents PostgreSQL advisory locks for application-level coordination without row-level locking overhead.

## Key Functions
- **`pg_advisory_lock(key)`** — Session-level lock, released on disconnect or explicit unlock
- **`pg_advisory_unlock(key)`** — Releases session-level lock
- **`pg_advisory_xact_lock(key)`** — Transaction-level lock, auto-released on commit/rollback
- **`pg_try_advisory_lock(key)`** — Non-blocking try-lock, returns boolean immediately

## Usage Pattern
- Use `hashtext('name')` to generate integer keys from string identifiers
- Prefer transaction-level locks for work within a single transaction
- Use try-lock for non-blocking coordination (skip/retry logic)

## Anti-Pattern
Creating dummy rows solely for row-level locking (`SELECT ... FOR UPDATE` on lock table)

## Integration
Referenced by `.agents/skills/supabase-postgres-best-practices/` as a best practice for efficient application coordination.
