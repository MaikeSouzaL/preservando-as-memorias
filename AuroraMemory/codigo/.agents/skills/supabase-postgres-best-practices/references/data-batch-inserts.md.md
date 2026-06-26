---
origem: .agents/skills/supabase-postgres-best-practices/references/data-batch-inserts.md
origem_hash: 1c0f8213b7db2e122dc3c77794b50f171ec5425c
gerado_em: 2026-06-25T23:37:30
---

# `.agents/skills/supabase-postgres-best-practices/references/data-batch-inserts.md`

## Batch INSERT Statements for Bulk Data

**Responsabilidade:** Otimizar inserções em massa no PostgreSQL, reduzindo overhead de transações e round trips.

**Conteúdo:**
- **Incorreto:** INSERTs individuais (1 por linha) — 1000 round trips, lento.
- **Correto:** INSERT em lote com múltiplas linhas em uma única declaração — até ~1000 linhas por lote, 1 round trip.
- **COPY:** Método mais rápido para grandes importações, usando arquivo CSV ou stdin.

**Parâmetros importantes:**
- `format csv`, `header true` para COPY com arquivo.
- `stdin` para COPY via aplicação.

**Conexões:**
- Consome arquivo externo: `/path/to/data.csv`.
- Referência: [PostgreSQL COPY](https://www.postgresql.org/docs/current/sql-copy.html).

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** /path/to/data.csv

