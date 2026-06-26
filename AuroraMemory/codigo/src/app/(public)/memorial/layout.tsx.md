---
origem: src/app/(public)/memorial/layout.tsx
origem_hash: 6986fdc9443f89d350790629b2ebbd7af336b80c
gerado_em: 2026-06-25T23:37:29
---

# `src/app/(public)/memorial/layout.tsx`

### `src/app/(public)/memorial/layout.tsx`

**Responsabilidade:** Layout raiz da rota `/memorial`, servindo como wrapper para páginas de memorial.

**Componente principal:**
- `ScreenLayout` (default, assíncrono): recebe `children` (ReactNode) e renderiza apenas o conteúdo filho, sem estrutura adicional.

**Detalhes:**
- `loadScreenData()`: função assíncrona que atualmente retorna `null` (placeholder para futura carga de dados).
- O layout é um *pass-through* puro, sem adicionar elementos visuais ou lógica extra.

**Conexões:** Layout intermediário na hierarquia de rotas do Next.js; páginas dentro de `/memorial` serão renderizadas como `children` deste componente.

<!-- aurora:relacoes -->

## 📤 Exporta
`ScreenLayout`, `default`

## 📥 Props recebidas
children

## 🧠 Funções/Componentes definidos
`ScreenLayout`, `loadScreenData`

## 📞 O que cada função chama
- `ScreenLayout()` → loadScreenData

