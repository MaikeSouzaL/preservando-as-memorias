---
origem: .agents/skills/supabase-postgres-best-practices/SKILL.md
origem_hash: 987cbcc4d91984a6465b23acce79b9af2d85a474
gerado_em: 2026-06-26T00:33:20
---

# `.agents/skills/supabase-postgres-best-practices/SKILL.md`

# Supabase Postgres Best Practices Skill

**Responsabilidade:** Guia de otimização de performance para Postgres no Supabase, com regras priorizadas para geração e revisão automatizada de queries e schemas.

**Estrutura:** 8 categorias de regras, cada uma com prefixo próprio, priorizadas por impacto (CRITICAL a LOW). Cada regra reside em arquivo Markdown separado em `references/`.

**Categorias-chave:**
- `query-*` (CRITICAL): Performance de queries, índices
- `conn-*` (CRITICAL): Gerenciamento de conexões/pooling
- `security-*` (CRITICAL): Row-Level Security
- `schema-*` (HIGH): Design de schema
- `lock-*` (MEDIUM-HIGH): Concorrência e locking
- `data-*` (MEDIUM): Padrões de acesso a dados
- `monitor-*` (LOW-MEDIUM): Monitoramento e diagnóstico
- `advanced-*` (LOW): Features avançadas do Postgres

**Uso:** Referenciar ao escrever SQL, revisar performance, configurar pooling ou trabalhar com RLS. Cada regra contém exemplos SQL incorretos vs. corretos, análise de planos e métricas.
