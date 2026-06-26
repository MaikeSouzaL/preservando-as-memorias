---
origem: alter-db.ts
origem_hash: b51d4871148a93f46128afa34bd5e1940275db76
gerado_em: 2026-06-25T23:37:13
---

# `alter-db.ts`

# `alter-db.ts` — Script de Migração do Banco

## Responsabilidade
Adiciona a coluna `delivery_address` (JSONB) à tabela `memorials` no Supabase PostgreSQL.

## Funcionamento
- Conecta ao banco via `pg.Client` usando `DATABASE_URL` ou string montada a partir de `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`
- Executa `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` para evitar erro se coluna já existir
- Loga sucesso/erro no console

## Dependências
- **pg**: driver PostgreSQL para Node.js
- **Variáveis de ambiente**: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL` (opcional)

## Uso
Script autônomo executado via `npx ts-node alter-db.ts` para migração manual do schema.

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** pg

## 🧠 Funções/Componentes definidos
`addColumn`

## 📞 O que cada função chama
- `addColumn()` → connect, end, error, log, query

