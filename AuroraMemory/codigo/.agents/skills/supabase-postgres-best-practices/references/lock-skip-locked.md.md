---
origem: .agents/skills/supabase-postgres-best-practices/references/lock-skip-locked.md
origem_hash: d4e86db12d7a2d8306aa6f0d07cfa0d74b67a13d
gerado_em: 2026-06-26T00:33:20
---

# `.agents/skills/supabase-postgres-best-practices/references/lock-skip-locked.md`

# SKIP LOCKED for Non-Blocking Queue Processing

## Purpose
Prevents worker blocking in queue processing by skipping locked rows, enabling parallel processing.

## Key Pattern
- **Incorrect**: `SELECT ... FOR UPDATE` causes workers to wait for locks
- **Correct**: `SELECT ... FOR UPDATE SKIP LOCKED` skips locked rows, workers get next available

## Complete Queue Pattern
Atomic claim-and-update in one statement:
```sql
UPDATE jobs SET status = 'processing', worker_id = $1, started_at = now()
WHERE id = (
  SELECT id FROM jobs WHERE status = 'pending'
  ORDER BY created_at LIMIT 1 FOR UPDATE SKIP LOCKED
) RETURNING *;
```

## Impact
10x throughput improvement for worker queues with high concurrency.
