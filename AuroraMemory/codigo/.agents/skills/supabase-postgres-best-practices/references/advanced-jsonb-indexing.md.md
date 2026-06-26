---
origem: .agents/skills/supabase-postgres-best-practices/references/advanced-jsonb-indexing.md
origem_hash: 215a797bef34bf67fa9bd27eb3b6875e42eb05bd
gerado_em: 2026-06-25T23:37:30
---

# `.agents/skills/supabase-postgres-best-practices/references/advanced-jsonb-indexing.md`

## Advanced JSONB Indexing

**Responsabilidade:** Guia de otimização de consultas JSONB no PostgreSQL via índices GIN.

**Conteúdo chave:**
- **GIN index (`products_attrs_gin`):** Acelera operadores de contenção (`@>`, `?`, `?&`, `?|`) — 10-100x mais rápido que full scan
- **Expression index (`products_brand_idx`):** Otimiza buscas por chave específica (`->>'brand'`)
- **Operator classes:** `jsonb_ops` (padrão, suporta todos operadores) vs `jsonb_path_ops` (2-3x menor, apenas `@>`)

**Ligações:** Documento de referência para boas práticas de modelagem JSONB; usado por regras de linting e revisão de schema.
