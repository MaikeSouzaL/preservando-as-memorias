---
origem: src/lib/supabase-browser.ts
origem_hash: 5e73d18c622c76a4c7fe49474d0ec9f83827a2f7
gerado_em: 2026-06-26T00:33:19
---

# `src/lib/supabase-browser.ts`

## `supabase-browser.ts`

**Responsabilidade:** Cria e exporta um cliente Supabase para uso exclusivo em **Componentes Cliente** (Client Components) do Next.js.

### Função principal
- **`createClientBrowser()`** — Inicializa e retorna um cliente Supabase browser-side usando `createBrowserClient` do pacote `@supabase/ssr`.

### Configuração
- Lê as variáveis de ambiente `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### Conexão com outros arquivos
- Importado por páginas de **cadastro** e **login** para autenticação e operações no banco via cliente browser.

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** @supabase/ssr

## ⬅️ Importado por
- [[page.tsx]] — `src/app/(public)/cadastro/page.tsx`
- [[page.tsx]] — `src/app/(public)/login/page.tsx`

## 📤 Exporta
`createClientBrowser`

## 🧠 Funções/Componentes definidos
`createClientBrowser`

## 📞 O que cada função chama
- `createClientBrowser()` → createBrowserClient

## 📲 Chamado por
- [[page.tsx]] — `src/app/(public)/cadastro/page.tsx`
- [[page.tsx]] — `src/app/(public)/login/page.tsx`

