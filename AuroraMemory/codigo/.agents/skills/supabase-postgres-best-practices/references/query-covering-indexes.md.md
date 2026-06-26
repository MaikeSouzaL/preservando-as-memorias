---
origem: .agents/skills/supabase-postgres-best-practices/references/query-covering-indexes.md
origem_hash: ad21beafe4f0765c8d7cd5a5ba153b409cb5bcc4
gerado_em: 2026-06-26T00:33:20
---

# `.agents/skills/supabase-postgres-best-practices/references/query-covering-indexes.md`

## Query Covering Indexes

**Responsabilidade:** Otimizar consultas eliminando buscas na tabela (heap fetches) através de índices cobertos.

**Conceito chave:** Índices com `INCLUDE` armazenam colunas extras não filtráveis, permitindo *index-only scans*.

**Exemplos:**
- `create index users_email_idx on users (email) include (name, created_at)` — consulta `SELECT email, name, created_at WHERE email = ?` lê apenas o índice
- `create index orders_status_idx on orders (status) include (customer_id, total)` — filtro por `status`, retorna `customer_id` e `total` sem tocar na tabela

**Regra:** Use `INCLUDE` para colunas de `SELECT` que não estão no `WHERE`.

**Impacto:** 2-5x mais rápido em consultas filtradas.
