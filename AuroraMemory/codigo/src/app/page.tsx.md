---
origem: src/app/page.tsx
origem_hash: 8ae381052a353a0a5e751a00f132cf5109f49270
gerado_em: 2026-06-25T23:37:29
---

# `src/app/page.tsx`

```markdown
# `src/app/page.tsx` — Página Raiz com Redirecionamento por Sessão

## Responsabilidade
Ponto de entrada da aplicação: verifica sessão do usuário e redireciona para área apropriada ou exibe landing page.

## Funcionalidade
- **`RootPage`** (async): obtém sessão via `getAuthSession()`. Se autenticado, redireciona:
  - Admin → `/admin/dashboard`
  - Usuário comum → `/dashboard`
- Caso não autenticado, renderiza `<LandingPage />`.

## Dependências
- **`getAuthSession`** (`src/lib/auth-session.ts`): retorna sessão com `isAdmin` booleano.
- **`redirect`** (`next/navigation`): redirecionamento server-side.
- **`LandingPage`** (`src/app/(public)/landing/page.tsx`): página pública para visitantes.

## Fluxo
1. Executa no servidor (async component).
2. Sessão presente → redireciona (nunca renderiza landing).
3. Sessão ausente → renderiza landing page pública.
```

<!-- aurora:relacoes -->

## 🔗 Importa
- [[page.tsx]] — `src/app/(public)/landing/page.tsx`
- [[auth-session.ts]] — `src/lib/auth-session.ts`
- **Externos/APIs:** next/navigation

## 📤 Exporta
`RootPage`, `default`

## 🧩 Componentes usados
LandingPage

## 🧠 Funções/Componentes definidos
`RootPage`

## 📞 O que cada função chama
- `RootPage()` → getAuthSession, redirect

## 🔁 Chama (arquivos)
- [[auth-session.ts]] — `src/lib/auth-session.ts`

