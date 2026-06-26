---
origem: src/app/(public)/compartilhar-memorial/layout.tsx
origem_hash: 7d7570e77b86b3b20ca5839109f4742163dbdc1e
gerado_em: 2026-06-25T23:37:29
---

# `src/app/(public)/compartilhar-memorial/layout.tsx`

### `layout.tsx` — Layout da Rota "Compartilhar Memorial"

**Responsabilidade:** Layout raiz da rota `/compartilhar-memorial`, servindo como wrapper para todas as páginas filhas.

**Componente principal:**
- `ScreenLayout` (default export): Função assíncrona que recebe `children` (ReactNode) e os renderiza sem alterações.

**Detalhes:**
- Executa `loadScreenData()` (atualmente retorna `null`) antes de renderizar — preparado para futura carga de dados compartilhados.
- Não adiciona estrutura visual (sem `<div>`, `<main>`, etc.), apenas repassa os filhos.

**Conexões:** Ponto de entrada para páginas aninhadas sob `/compartilhar-memorial/*`.

<!-- aurora:relacoes -->

## 📤 Exporta
`ScreenLayout`, `default`

## 📥 Props recebidas
children

## 🧠 Funções/Componentes definidos
`ScreenLayout`, `loadScreenData`

## 📞 O que cada função chama
- `ScreenLayout()` → loadScreenData

