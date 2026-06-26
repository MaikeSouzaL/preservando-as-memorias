---
origem: .agents/skills/supabase-postgres-best-practices/references/data-pagination.md
origem_hash: d0e57f660b06c0c25d554ecab0430b0b6473273f
gerado_em: 2026-06-25T23:37:30
---

# `.agents/skills/supabase-postgres-best-practices/references/data-pagination.md`

# Cursor-Based Pagination Guide

## Purpose
Documents best practices for implementing cursor-based (keyset) pagination over OFFSET pagination in PostgreSQL.

## Key Points
- **Problem**: OFFSET pagination degrades performance on deep pages (scans all skipped rows)
- **Solution**: Cursor pagination provides O(1) performance regardless of page depth

## Implementation Examples
- **Single column**: `WHERE id > last_id ORDER BY id LIMIT 20`
- **Multi-column**: `WHERE (created_at, id) > (timestamp, id) ORDER BY created_at, id LIMIT 20`

## Impact
- **Severity**: MEDIUM-HIGH
- **Tags**: pagination, cursor, keyset, offset, performance

## Reference
Links to Supabase pagination documentation
