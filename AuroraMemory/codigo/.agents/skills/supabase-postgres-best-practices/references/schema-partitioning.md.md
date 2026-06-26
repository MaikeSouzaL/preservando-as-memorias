---
origem: .agents/skills/supabase-postgres-best-practices/references/schema-partitioning.md
origem_hash: 5f1799d1ef432e823707c1fbd94da1e992567a92
gerado_em: 2026-06-26T00:33:20
---

# `.agents/skills/supabase-postgres-best-practices/references/schema-partitioning.md`

## Partitioning for Large Tables

**Responsabilidade:** Guia de particionamento de tabelas no Supabase/PostgreSQL para melhorar performance em tabelas grandes.

**Conteúdo:**
- Demonstra particionamento por range de data (`created_at`) usando `PARTITION BY RANGE`
- Cria partições mensais (`events_2024_01`, `events_2024_02`) com `FOR VALUES FROM ... TO ...`
- Mostra benefícios: queries escaneiam apenas partições relevantes, `DROP TABLE` instantâneo vs `DELETE` lento

**Quando usar:** tabelas >100M linhas, dados time-series, necessidade de remover dados antigos eficientemente.

**Referência:** Documentação oficial PostgreSQL sobre Table Partitioning.

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** 2024-01-01, 2024-02-01

