---
origem: src/app/(admin)/admin/dashboard/layout.tsx
origem_hash: e4cecb5018b2d7f3d639a5eaf8eec9f7d90be004
gerado_em: 2026-06-25T23:37:30
---

# `src/app/(admin)/admin/dashboard/layout.tsx`

### `src/app/(admin)/admin/dashboard/layout.tsx`

**Responsabilidade:** Layout assíncrono para a rota `/admin/dashboard`.

- **`ScreenLayout`** (componente padrão, assíncrono):  
  - **Props:** `children` (`React.ReactNode`) — conteúdo da página filha.  
  - **Função:** Executa `loadScreenData()` (atualmente retorna `null`, sem efeito) e renderiza os filhos diretamente, sem estrutura extra.  
  - **Conexão:** Atua como layout do Next.js para todas as páginas sob `/admin/dashboard`, recebendo o conteúdo renderizado pelas rotas filhas.

<!-- aurora:relacoes -->

## 📤 Exporta
`ScreenLayout`, `default`

## 📥 Props recebidas
children

## 🧠 Funções/Componentes definidos
`ScreenLayout`, `loadScreenData`

## 📞 O que cada função chama
- `ScreenLayout()` → loadScreenData

