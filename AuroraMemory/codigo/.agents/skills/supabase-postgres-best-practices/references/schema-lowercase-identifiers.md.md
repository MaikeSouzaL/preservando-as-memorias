---
origem: .agents/skills/supabase-postgres-best-practices/references/schema-lowercase-identifiers.md
origem_hash: 71f326b67aa3ef9a0ad58d0e3ce5479bbb7708aa
gerado_em: 2026-06-26T00:33:20
---

# `.agents/skills/supabase-postgres-best-practices/references/schema-lowercase-identifiers.md`

# Schema: Lowercase Identifiers for Compatibility

**Responsibility:** Enforces PostgreSQL identifier naming convention to prevent case-sensitivity bugs.

**Key points:**
- PostgreSQL folds unquoted identifiers to lowercase; quoted mixed-case identifiers require permanent quoting
- Mixed-case identifiers cause failures with tools, ORMs, and AI assistants that don't quote identifiers
- Common sources: ORMs generating camelCase, database migrations, GUI tools with default quoting

**Examples:**
- **Incorrect:** `"Users"` with `"userId"` — requires quotes everywhere, `SELECT firstName FROM Users` fails
- **Correct:** `users` with `user_id` — works without quotes, universally recognized

**Mitigation:** Configure ORMs for snake_case; create views as compatibility layer for existing mixed-case schemas (`CREATE VIEW users AS SELECT "userId" AS user_id FROM "Users"`)

**Reference:** PostgreSQL docs on identifiers and key words
