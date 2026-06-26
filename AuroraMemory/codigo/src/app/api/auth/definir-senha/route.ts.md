---
origem: src/app/api/auth/definir-senha/route.ts
origem_hash: 9379a83ca4b3ccb67e07b10d3ba38b7b5f802f36
gerado_em: 2026-06-26T00:33:20
---

# `src/app/api/auth/definir-senha/route.ts`

# `src/app/api/auth/definir-senha/route.ts`

**Responsabilidade:** Endpoint POST para definir/alterar senha do usuário autenticado.

**Função principal:**
- `POST(request)`: Recebe senha no body, valida mínimo de 8 caracteres, e atualiza via `supabase.auth.updateUser()`.

**Parâmetros importantes:**
- `request.body.password`: string com a nova senha.

**Fluxo:**
1. Verifica sessão via `getAuthSession()` (401 se não autenticado).
2. Valida senha (mín. 8 caracteres, 400 se inválida).
3. Conecta Supabase via `createClientServer()` e atualiza senha.
4. Retorna `{ success: true }` ou erro apropriado (400/500).

**Dependências:** `auth-session.ts` (autenticação), `supabase.ts` (cliente server-side).

<!-- aurora:relacoes -->

## 🔗 Importa
- [[auth-session.ts]] — `src/lib/auth-session.ts`
- [[supabase.ts]] — `src/lib/supabase.ts`
- **Externos/APIs:** next/server

## 📤 Exporta
`POST`, `dynamic`

## 🧠 Funções/Componentes definidos
`POST`

## 📞 O que cada função chama
- `POST()` → createClientServer, getAuthSession, json, trim, updateUser

## 🔁 Chama (arquivos)
- [[auth-session.ts]] — `src/lib/auth-session.ts`
- [[supabase.ts]] — `src/lib/supabase.ts`

