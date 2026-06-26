---
origem: src/app/api/dev/users/route.ts
origem_hash: 8f66d88a2cdffc8f2d4275e0af36fb345b712913
gerado_em: 2026-06-25T23:37:29
---

# `src/app/api/dev/users/route.ts`

```markdown
## API de Listagem de Usuários (Dev/Admin)

**Responsabilidade:** Endpoint GET para listar usuários não-dev-admin, restrito a sessões dev/admin.

**Função principal:**
- `GET()`: Requer sessão dev/admin via `requireDevAdminSession()`. Usa `createAdminClient()` (service role) para consultar tabela `profiles`, filtrando `is_dev_admin = false`, ordenando por `created_at` decrescente. Retorna JSON com `users` e `diagnostic` (status da chave de serviço, contagem, timestamp).

**Parâmetros/Props:** Nenhum.

**APIs/Endpoints:** Define `GET /api/dev/users`.

**Conexões:** Depende de `src/lib/dev-auth` (autenticação) e `src/lib/supabase` (cliente admin). Consome tabela `profiles` do Supabase.
```

<!-- aurora:relacoes -->

## 🔗 Importa
- [[dev-auth.ts]] — `src/lib/dev-auth.ts`
- [[supabase.ts]] — `src/lib/supabase.ts`
- **Externos/APIs:** next/server, profiles

## 📤 Exporta
`GET`, `dynamic`

## 🧠 Funções/Componentes definidos
`GET`

## 📞 O que cada função chama
- `GET()` → createAdminClient, eq, from, json, now, order, requireDevAdminSession, select

## 🔁 Chama (arquivos)
- [[dev-auth.ts]] — `src/lib/dev-auth.ts`
- [[supabase.ts]] — `src/lib/supabase.ts`

