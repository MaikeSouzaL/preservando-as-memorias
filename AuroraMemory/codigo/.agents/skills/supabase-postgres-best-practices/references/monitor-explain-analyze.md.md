---
origem: .agents/skills/supabase-postgres-best-practices/references/monitor-explain-analyze.md
origem_hash: 87e686c12e94715716f593f70674992a165b1417
gerado_em: 2026-06-25T23:37:30
---

# `.agents/skills/supabase-postgres-best-practices/references/monitor-explain-analyze.md`

# monitor-explain-analyze.md

## Responsabilidade Principal
Guia prático para diagnosticar queries lentas no PostgreSQL usando `EXPLAIN ANALYZE`, com foco em identificar gargalos reais de performance.

## Conteúdo Chave
- **EXPLAIN ANALYZE**: Executa a query e mostra timings reais, revelando gargalos de performance
- **Exemplo Incorreto**: Adivinhar problemas de performance sem diagnóstico
- **Exemplo Correto**: Usar `explain (analyze, buffers, format text)` para diagnóstico preciso
- **Indicadores Críticos**:
  - `Seq Scan` em tabelas grandes → índice faltando
  - `Rows Removed by Filter` alta → baixa seletividade ou índice faltando
  - `Buffers: read >> hit` → dados não cacheados, precisa de mais memória
  - `Nested Loop` com loops altos → considerar estratégia de join diferente
  - `Sort Method: external merge` → `work_mem` muito baixo

## Conexões
- Referência externa: [EXPLAIN](https://supabase.com/docs/guides/database/inspect) (documentação Supabase)
- Impacto: LOW-MEDIUM — identifica gargalos exatos na execução de queries
