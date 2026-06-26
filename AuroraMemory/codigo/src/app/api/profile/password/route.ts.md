---
origem: src/app/api/profile/password/route.ts
origem_hash: c4ed422acffcf60fd3dedadc76a765f2d0aa2b3a
gerado_em: 2026-06-25T23:37:29
---

# `src/app/api/profile/password/route.ts`

```markdown
## `src/app/api/profile/password/route.ts`

**Responsabilidade:** Endpoint para alteração de senha do usuário autenticado.

**Função principal:**
- `PATCH(request)`: Atualiza a senha do usuário via Supabase Admin API.

**Parâmetros/Validação:**
- `body.newPassword`: string, mínimo 8 caracteres.

**Fluxo:**
1. Obtém sessão do usuário via `getAuthSession()`.
2. Valida a nova senha.
3. Usa `createAdminClient()` para chamar `supabase.auth.admin.updateUserById()`.
4. Retorna `{ success: true }` ou erro apropriado.

**Dependências:** `auth-session.ts`, `supabase.ts`.
```

<!-- aurora:relacoes -->

## 🔗 Importa
- [[auth-session.ts]] — `src/lib/auth-session.ts`
- [[supabase.ts]] — `src/lib/supabase.ts`
- **Externos/APIs:** next/server

## 📤 Exporta
`PATCH`, `dynamic`

## 🧠 Funções/Componentes definidos
`PATCH`

## 📞 O que cada função chama
- `PATCH()` → createAdminClient, getAuthSession, json, trim, updateUserById

## 🔁 Chama (arquivos)
- [[auth-session.ts]] — `src/lib/auth-session.ts`
- [[supabase.ts]] — `src/lib/supabase.ts`

