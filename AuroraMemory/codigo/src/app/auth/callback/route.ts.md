---
origem: src/app/auth/callback/route.ts
origem_hash: d5d44d7ebefff02b0151de45330b4f0256ef731f
gerado_em: 2026-06-25T23:37:29
---

# `src/app/auth/callback/route.ts`

# `src/app/auth/callback/route.ts` — Rota de Callback OAuth

**Responsabilidade:** Manipula o redirecionamento do Supabase após autenticação via Google (ou outro provedor OAuth), trocando o código de autorização por uma sessão.

**Função principal:**
- `GET(request: NextRequest)` — Lê parâmetros da URL (`code`, `next`, `error`). Se houver erro, redireciona para `/login` com mensagem. Se houver `code`, chama `supabase.auth.exchangeCodeForSession(code)` e redireciona para `next` (padrão: `/dashboard`). Em falha, redireciona para `/login?error=auth_callback_failed`.

**Parâmetros importantes:**
- `code` — Código de autorização do provedor OAuth.
- `next` — Rota de destino pós-login (opcional, padrão `/dashboard`).
- `error` — Erro do provedor (opcional).

**Conexões:**
- Importa `createClientServer` de `src/lib/supabase` para criar cliente Supabase no servidor.
- Usa `NextRequest`/`NextResponse` do `next/server` para manipular requisição/resposta.
- Define `dynamic = "force-dynamic"` para evitar cache estático.

<!-- aurora:relacoes -->

## 🔗 Importa
- [[supabase.ts]] — `src/lib/supabase.ts`
- **Externos/APIs:** next/server

## 📤 Exporta
`GET`, `dynamic`

## 🧠 Funções/Componentes definidos
`GET`

## 📞 O que cada função chama
- `GET()` → createClientServer, encodeURIComponent, exchangeCodeForSession, get, redirect

## 🔁 Chama (arquivos)
- [[supabase.ts]] — `src/lib/supabase.ts`

