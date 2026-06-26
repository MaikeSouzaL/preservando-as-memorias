---
origem: .agents/skills/supabase-postgres-best-practices/references/data-upsert.md
origem_hash: fbd2e68c4c843ecc8ee14c38f0a565ec2117a08e
gerado_em: 2026-06-25T23:37:30
---

# `.agents/skills/supabase-postgres-best-practices/references/data-upsert.md`

## Data Upsert Best Practice

**Responsibility:** Documents the UPSERT pattern (`INSERT ... ON CONFLICT`) for atomic insert-or-update operations in PostgreSQL, eliminating race conditions from separate SELECT-then-INSERT/UPDATE approaches.

**Key Content:**
- **Problem:** Separate check-then-insert creates race conditions when concurrent requests both find no existing row
- **Solution:** Single atomic `INSERT ... ON CONFLICT DO UPDATE` statement
- **Variants:**
  - `DO UPDATE SET` — upsert with field updates (e.g., `value = excluded.value`)
  - `DO NOTHING` — insert-or-ignore pattern
  - `RETURNING *` — returns the inserted/updated row

**Parameters:** Conflict target (`(user_id, key)`), `excluded` keyword references proposed values

**Relations:** References PostgreSQL `INSERT` documentation; part of Supabase Postgres best practices skill set
