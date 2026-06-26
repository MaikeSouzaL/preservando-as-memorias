---
origem: src/app/(admin)/layout.tsx
origem_hash: 3378e9f5a7bdf6a59a1b465c9e3296c829a95436
gerado_em: 2026-06-25T23:37:29
---

# `src/app/(admin)/layout.tsx`

# Admin Layout (`layout.tsx`)

**Responsabilidade:** Layout raiz da seção administrativa (`/admin`), envolvendo todo o conteúdo em um shell administrativo.

- **`AdminRootLayout`** (default export): Componente funcional que renderiza `<AdminShell>` como wrapper, passando `children` como conteúdo aninhado.
- **Props:** `children: React.ReactNode` — conteúdo das páginas filhas da rota admin.
- **Dependência:** Importa `AdminShell` de `@/src/components/admin/admin-shell.tsx`, que provê navegação, header e estrutura visual do painel admin.
- **Integração:** Atua como layout pai para todas as páginas sob `/(admin)`, aplicando o shell administrativo automaticamente via Next.js Layout Router.

<!-- aurora:relacoes -->

## 🔗 Importa
- [[admin-shell.tsx]] — `src/components/admin/admin-shell.tsx`

## 📤 Exporta
`AdminRootLayout`, `default`

## 🧩 Componentes usados
AdminShell

## 📥 Props recebidas
children

## 🧠 Funções/Componentes definidos
`AdminRootLayout`

