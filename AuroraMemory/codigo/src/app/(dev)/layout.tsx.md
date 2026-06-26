---
origem: src/app/(dev)/layout.tsx
origem_hash: 7188669f8f233cdd6e8381342b64fe41a86100f7
gerado_em: 2026-06-25T23:37:29
---

# `src/app/(dev)/layout.tsx`

# Layout de Proteção para Rotas de Desenvolvimento

**Responsabilidade:** Protege todas as rotas sob `/(dev)` garantindo que apenas usuários autenticados com permissão de desenvolvedor (`isDevAdmin`) possam acessá-las.

**Funcionamento:**
- `DevRootLayout` (async): Componente servidor que:
  1. Obtém sessão via `getAuthSession()` (de `src/lib/auth-session`)
  2. Redireciona para `/login` se não autenticado
  3. Redireciona para `/dashboard` se não for `isDevAdmin`
  4. Renderiza `{children}` apenas se ambas condições forem satisfeitas

**Props:** `children` (ReactNode) — conteúdo das rotas filhas

**Conexões:** Importa `getAuthSession` do módulo de autenticação; usa `redirect` do Next.js para navegação condicional.

<!-- aurora:relacoes -->

## 🔗 Importa
- [[auth-session.ts]] — `src/lib/auth-session.ts`
- **Externos/APIs:** next/navigation

## 📤 Exporta
`DevRootLayout`, `default`

## 📥 Props recebidas
children

## 🧠 Funções/Componentes definidos
`DevRootLayout`

## 📞 O que cada função chama
- `DevRootLayout()` → getAuthSession, redirect

## 🔁 Chama (arquivos)
- [[auth-session.ts]] — `src/lib/auth-session.ts`

