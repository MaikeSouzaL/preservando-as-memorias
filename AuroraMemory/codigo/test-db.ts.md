---
origem: test-db.ts
origem_hash: c8b3ba4759cb3982dfb8166a03cd09cd0db2a3ad
gerado_em: 2026-06-26T00:33:19
---

# `test-db.ts`

### `test-db.ts` — Teste de Conexão com Supabase

**Responsabilidade:** Script de teste para verificar conexão com banco Supabase e existência de registros na tabela `profiles`.

**Funcionamento:**
- Cria cliente Supabase usando `NEXT_PUBLIC_SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`
- Consulta tabela `profiles` buscando `id` de um único registro
- Se nenhum perfil encontrado, encerra com erro (exit code 1)
- Se encontrado, exibe instrução para usar driver PostgreSQL nativo

**Observações:**
- Script incompleto — apenas valida conexão e existência de dados
- Depende de variáveis de ambiente para credenciais Supabase
- Consome API REST do Supabase via `@supabase/supabase-js`

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** @supabase/supabase-js, profiles

## 🧠 Funções/Componentes definidos
`test`

## 📞 O que cada função chama
- `test()` → exit, from, limit, log, select, single

