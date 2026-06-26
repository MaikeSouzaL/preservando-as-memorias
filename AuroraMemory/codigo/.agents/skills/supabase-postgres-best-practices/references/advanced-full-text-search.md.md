---
origem: .agents/skills/supabase-postgres-best-practices/references/advanced-full-text-search.md
origem_hash: 6a1536025088fb10c1ddbfdef66f571bf5592494
gerado_em: 2026-06-26T00:33:20
---

# `.agents/skills/supabase-postgres-best-practices/references/advanced-full-text-search.md`

# Advanced Full-Text Search with tsvector

## Purpose
Replaces slow `LIKE` pattern matching with PostgreSQL's full-text search using `tsvector` and GIN indexes for 100x faster performance with ranking support.

## Key Components

- **`to_tsvector()`**: Converts text into searchable lexemes (normalized tokens)
- **`to_tsquery()`**: Parses search terms with boolean operators (`&`, `|`)
- **`ts_rank()`**: Ranks results by relevance
- **GIN index**: Enables fast lookups on `tsvector` column

## Implementation

1. Add generated `tsvector` column combining title + content
2. Create GIN index on the vector column
3. Query with `@@` operator against `to_tsquery()`

## Search Operators

- `&` (AND), `|` (OR), `:*` (prefix matching)

## Relations
- Referenced by: `supabase-postgres-best-practices` skill
- Links to: Supabase Full Text Search documentation
