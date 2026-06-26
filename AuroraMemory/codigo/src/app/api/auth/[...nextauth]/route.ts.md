---
origem: src/app/api/auth/[...nextauth]/route.ts
origem_hash: 3f52088678358aac0cd04ce2f8c3beac048bd62c
gerado_em: 2026-06-26T00:33:20
---

# `src/app/api/auth/[...nextauth]/route.ts`

# `src/app/api/auth/[...nextauth]/route.ts`

**Responsabilidade:** Rota legada de autenticação NextAuth que redireciona para OAuth do Google via Supabase.

**Função principal:**
- `GET(request)`: Inicia fluxo OAuth Google pelo Supabase, redirecionando para URL de autorização ou para `/login?error=oauth_failed` em caso de falha.

**Parâmetros:**
- `callbackUrl` (query string): URL de redirecionamento pós-login (padrão: `/dashboard`)

**APIs consumidas:**
- `supabase.auth.signInWithOAuth()` (provedor Google)
- `createClientServer()` de `src/lib/supabase`

**Integração:** Rota de fallback — frontend deve usar `/api/auth/google-login` diretamente. Redireciona para `/auth/callback` com `next` como parâmetro.

<!-- aurora:relacoes -->

## 🔗 Importa
- [[supabase.ts]] — `src/lib/supabase.ts`
- **Externos/APIs:** next/server

## 📤 Exporta
`GET`, `dynamic`

## 🧠 Funções/Componentes definidos
`GET`

## 📞 O que cada função chama
- `GET()` → createClientServer, encodeURIComponent, get, redirect, signInWithOAuth

## 🔁 Chama (arquivos)
- [[supabase.ts]] — `src/lib/supabase.ts`

