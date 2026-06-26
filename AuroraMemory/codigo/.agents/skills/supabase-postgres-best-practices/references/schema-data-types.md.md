---
origem: .agents/skills/supabase-postgres-best-practices/references/schema-data-types.md
origem_hash: 3bf1ac02415c27fc1f16114ac165e522adef5f1d
gerado_em: 2026-06-25T23:37:30
---

# `.agents/skills/supabase-postgres-best-practices/references/schema-data-types.md`

## Schema Data Types Guide

**Responsabilidade:** Guia de boas práticas para escolha de tipos de dados em PostgreSQL, visando redução de armazenamento e performance.

**Conteúdo principal:**
- Demonstra tipos incorretos vs. corretos para tabelas (ex: `int` → `bigint`, `varchar` → `text`, `timestamp` → `timestamptz`)
- Diretrizes: `bigint` para IDs, `text` para strings, `timestamptz` para datas, `numeric` para valores monetários
- Recomenda `check constraint` ou tipos enum para campos com valores fixos

**Conexões:** Referencia documentação oficial do PostgreSQL; faz parte do conjunto de práticas de schema do agente Supabase.
