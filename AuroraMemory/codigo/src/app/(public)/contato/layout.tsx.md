---
origem: src/app/(public)/contato/layout.tsx
origem_hash: 46717dcbfb973331bc1a9d3b36d696f936e9b51b
gerado_em: 2026-06-26T00:33:20
---

# `src/app/(public)/contato/layout.tsx`

### `src/app/(public)/contato/layout.tsx`

**Responsabilidade:** Layout raiz da rota `/contato`, servindo como wrapper para páginas filhas.

- **`ScreenLayout`** (componente assíncrono): Carrega dados da tela via `loadScreenData()` (atualmente retorna `null`) e renderiza apenas `{children}` sem estrutura adicional.
- **Props:** `children` (`React.ReactNode`) — conteúdo das páginas aninhadas.
- **Relações:** Define layout para a rota `/contato`; `children` é injetado pelo Next.js a partir das páginas filhas.

<!-- aurora:relacoes -->

## 📤 Exporta
`ScreenLayout`, `default`

## 📥 Props recebidas
children

## 🧠 Funções/Componentes definidos
`ScreenLayout`, `loadScreenData`

## 📞 O que cada função chama
- `ScreenLayout()` → loadScreenData

