---
origem: .agents/skills/supabase-postgres-best-practices/references/monitor-pg-stat-statements.md
origem_hash: 72360842b6bcf5438a684bf399493852766c0026
gerado_em: 2026-06-25T23:37:30
---

# `.agents/skills/supabase-postgres-best-practices/references/monitor-pg-stat-statements.md`

# `monitor-pg-stat-statements.md`

## Responsabilidade Principal
Guia para habilitar e usar `pg_stat_statements` no PostgreSQL/Supabase para monitoramento de performance de queries.

## Conteúdo Chave
- **Habilitação**: `create extension if not exists pg_stat_statements`
- **Consultas de análise**:
  - `pg_stat_statements` ordenado por `total_exec_time` → queries mais lentas
  - `pg_stat_statements` ordenado por `calls` → queries mais frequentes
  - Filtro por `mean_exec_time > 100ms` → candidatos a otimização
- **Reset**: `pg_stat_statements_reset()` após otimizações

## Métricas Monitoradas
`calls`, `total_exec_time`, `mean_exec_time`, `query` — para identificar gargalos de performance.

## Conexões com Outros Arquivos
- Referencia documentação oficial do Supabase sobre extensões
- Complementa práticas de monitoramento de banco de dados no ecossistema Supabase
