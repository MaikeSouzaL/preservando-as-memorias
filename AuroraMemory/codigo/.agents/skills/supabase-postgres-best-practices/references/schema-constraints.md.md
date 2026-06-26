---
origem: .agents/skills/supabase-postgres-best-practices/references/schema-constraints.md
origem_hash: 1d17f96901ce9874412782cd6d9d6011b3cf0675
gerado_em: 2026-06-26T00:33:20
---

# `.agents/skills/supabase-postgres-best-practices/references/schema-constraints.md`

# Schema Constraints — Safe Migration Patterns

**Responsabilidade principal:** Documentar como adicionar constraints no PostgreSQL de forma segura e idempotente em migrações.

## Conteúdo chave

- **Problema:** PostgreSQL não suporta `ADD CONSTRAINT IF NOT EXISTS` — causa erro de sintaxe
- **Solução:** Usar blocos `DO $$` com verificação em `pg_constraint` antes de alterar tabelas
- **Exemplos práticos:**
  - UNIQUE constraint com verificação por `conname` e `conrelid`
  - CHECK constraint com verificação por nome
  - FOREIGN KEY com verificação por nome

## Consulta auxiliar

```sql
-- Verificar constraints existentes
select conname, contype, pg_get_constraintdef(oid)
from pg_constraint
where conrelid = 'public.profiles'::regclass;
```

**Conexões:** Relaciona-se com arquivos de migração que alteram tabelas (`.sql`), prevenindo falhas em deploys.
