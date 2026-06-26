---
origem: .agents/skills/supabase-postgres-best-practices/references/lock-short-transactions.md
origem_hash: e5ec7f8e78902731cb609620583213bb70d88590
gerado_em: 2026-06-26T00:33:20
---

# `.agents/skills/supabase-postgres-best-practices/references/lock-short-transactions.md`

# Keep Transactions Short to Reduce Lock Contention

## Purpose
Performance optimization guide for reducing database lock contention by minimizing transaction duration.

## Key Points
- **Impact**: 3-5x throughput improvement, fewer deadlocks
- **Problem**: Long transactions hold locks that block other queries
- **Solution**: Keep transactions as short as possible

## Best Practices
1. **Move external calls outside transactions** - Don't include HTTP calls, API requests, or other I/O operations within transaction blocks
2. **Acquire locks only for actual updates** - Minimize the time between `BEGIN` and `COMMIT`
3. **Use `statement_timeout`** to prevent runaway transactions:
   - Session-level: `SET statement_timeout = '30s'`
   - Per-query: `SET LOCAL statement_timeout = '5s'`

## Example
- **Incorrect**: Lock held for 2-5 seconds while making payment API call
- **Correct**: Lock held for milliseconds, API call made before transaction

## Reference
[PostgreSQL Transaction Management](https://www.postgresql.org/docs/current/tutorial-transactions.html)
