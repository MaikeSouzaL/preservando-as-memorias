---
origem: src/app/(admin)/admin/layout.tsx
origem_hash: ff977bd22fca09e3f38964474ef501b1c4e82cbf
gerado_em: 2026-06-25T23:37:29
---

# `src/app/(admin)/admin/layout.tsx`

### `src/app/(admin)/admin/layout.tsx`

**Responsabilidade:** Layout de proteção de rota para área administrativa. Verifica autenticação e permissão de admin antes de renderizar o conteúdo.

**Funcionalidades:**
- `ScreenLayout` (async): Componente de layout que:
  - Obtém sessão via `getAuthSession()`
  - Redireciona para `/login` se não autenticado
  - Redireciona para `/dashboard` se não for admin
  - Renderiza `children` apenas se autorizado

**Props:** `children` (ReactNode) — conteúdo aninhado da rota admin

**Conexões:**
- Importa `getAuthSession` de `src/lib/auth-session.ts`
- Usa `redirect` do Next.js para navegação condicional
- Atua como guarda de rota para todas as páginas sob `/admin`

<!-- aurora:relacoes -->

## 🔗 Importa
- [[auth-session.ts]] — `src/lib/auth-session.ts`
- **Externos/APIs:** next/navigation

## 📤 Exporta
`ScreenLayout`, `default`

## 📥 Props recebidas
children

## 🧠 Funções/Componentes definidos
`ScreenLayout`

## 📞 O que cada função chama
- `ScreenLayout()` → getAuthSession, redirect

## 🔁 Chama (arquivos)
- [[auth-session.ts]] — `src/lib/auth-session.ts`

