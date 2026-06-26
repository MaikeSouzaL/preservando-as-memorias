---
origem: src/mock-db/index.ts
origem_hash: 6a82a052bc57da470b78523b3ecc12f8b68b57e1
gerado_em: 2026-06-25T23:37:23
---

# `src/mock-db/index.ts`

# `src/mock-db/index.ts`

**Responsabilidade:** Ponto de entrada do módulo de banco de dados mock, reexportando a instância central do banco.

**Exportações:**
- `database`: instância do banco de dados mock (reexportada de `./database`)

**Conexões:**
- **Importa de:** `src/mock-db/database.ts` — onde `database` é definido
- **Usado por:** componentes que consomem dados mockados (importam `database` deste módulo)

<!-- aurora:relacoes -->

## 🔗 Importa
- [[database.ts]] — `src/mock-db/database.ts`

## 📤 Exporta
`database`

