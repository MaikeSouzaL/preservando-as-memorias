---
origem: .agents/skills/supabase-postgres-best-practices/references/_sections.md
origem_hash: 4d3802d8f5cfd88e2e8a1cb67a90327b61c4d52a
gerado_em: 2026-06-25T23:37:30
---

# `.agents/skills/supabase-postgres-best-practices/references/_sections.md`

# Section Definitions

Define categorias de regras para boas práticas Postgres. Cada seção é identificada por prefixo no nome do arquivo de regras.

## Seções

1. **Query Performance** (`query`) — CRÍTICO: queries lentas, índices ausentes, planos ineficientes.
2. **Connection Management** (`conn`) — CRÍTICO: pooling, limites, estratégias serverless.
3. **Security & RLS** (`security`) — CRÍTICO: RLS, privilégios, autenticação.
4. **Schema Design** (`schema`) — ALTO: tabelas, índices, partições, tipos de dados.
5. **Concurrency & Locking** (`lock`) — MÉDIO-ALTO: transações, isolamento, deadlocks.
6. **Data Access Patterns** (`data`) — MÉDIO: N+1, batch, paginação cursor.
7. **Monitoring & Diagnostics** (`monitor`) — BAIXO-MÉDIO: pg_stat_statements, EXPLAIN ANALYZE.
8. **Advanced Features** (`advanced`) — BAIXO: full-text search, JSONB, PostGIS.

Arquivo de configuração — não define APIs ou componentes. Usado pelo sistema de regras para categorizar automaticamente práticas Postgres.
