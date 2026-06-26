---
origem: src/app/(private)/layout.tsx
origem_hash: 3c90ab47a3a66e0c2daa3d4bdb607c286790d935
gerado_em: 2026-06-26T00:33:20
---

# `src/app/(private)/layout.tsx`

# `src/app/(private)/layout.tsx`

**Responsabilidade:** Layout raiz da área privada (autenticada) da aplicação.

**Funcionamento:**
- Obtém sessão do usuário via `getAuthSession()`
- Redireciona para `/login` se não houver sessão ativa
- Renderiza `PrivateShell` passando flags de permissão (`isDevAdmin`, `isAdmin`) extraídas da sessão

**Props:** `children` (conteúdo aninhado das rotas privadas)

**Conexões:**
- Consome `getAuthSession` (autenticação)
- Envolve conteúdo no `PrivateShell` (layout com navegação/sidebar)
- Depende de `next/navigation` para redirecionamento

<!-- aurora:relacoes -->

## 🔗 Importa
- [[private-shell.tsx]] — `src/components/private/private-shell.tsx`
- [[auth-session.ts]] — `src/lib/auth-session.ts`
- **Externos/APIs:** next/navigation

## 📤 Exporta
`PrivateRootLayout`, `default`

## 🧩 Componentes usados
PrivateShell

## 📥 Props recebidas
children

## 🧠 Funções/Componentes definidos
`PrivateRootLayout`

## 📞 O que cada função chama
- `PrivateRootLayout()` → getAuthSession, redirect

## 🔁 Chama (arquivos)
- [[auth-session.ts]] — `src/lib/auth-session.ts`

