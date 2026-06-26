---
origem: .agents/skills/supabase-postgres-best-practices/references/monitor-vacuum-analyze.md
origem_hash: f76a89f47d269357f3c940d6fe057fd39cc5a3ff
gerado_em: 2026-06-26T00:33:20
---

# `.agents/skills/supabase-postgres-best-practices/references/monitor-vacuum-analyze.md`

# monitor-vacuum-analyze.md

**Responsabilidade:** Guia de manutenção de estatísticas de tabelas PostgreSQL via VACUUM e ANALYZE para otimizar planos de consulta.

**Conteúdo chave:**
- **ANALYZE:** Atualiza estatísticas de tabelas/colunas usadas em WHERE (ex.: `analyze orders (status, created_at)`)
- **VACUUM:** Recupera espaço e prepara para ANALYZE
- **Autovacuum tuning:** Ajuste de `scale_factor` para tabelas com alta rotatividade (ex.: `autovacuum_vacuum_scale_factor = 0.05`)
- **Consultas de monitoramento:** `pg_stat_user_tables` (última análise) e `pg_stat_progress_vacuum` (status atual)

**Conexões:** Referencia documentação externa da Supabase sobre VACUUM.
