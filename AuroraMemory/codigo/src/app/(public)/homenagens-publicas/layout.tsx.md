---
origem: src/app/(public)/homenagens-publicas/layout.tsx
origem_hash: 04e9f414f46aed751834d9f849342022f068ac40
gerado_em: 2026-06-26T00:33:20
---

# `src/app/(public)/homenagens-publicas/layout.tsx`

### `src/app/(public)/homenagens-publicas/layout.tsx`

**Responsabilidade:** Layout raiz da rota `/homenagens-publicas`, servindo como wrapper estrutural para todas as páginas filhas.

**Componente principal:**
- `ScreenLayout` (default, async): recebe `children` (React nodes) e renderiza-os diretamente, sem adicionar elementos visuais.

**Detalhes:**
- `loadScreenData()`: função assíncrona que atualmente retorna `null` (placeholder para futura carga de dados).
- O layout é executado no servidor (async component) e pode ser estendido para incluir providers, headers ou lógica de autenticação.

**Conexões:** Ponto de entrada para páginas filhas da rota `/homenagens-publicas`.

<!-- aurora:relacoes -->

## 📤 Exporta
`ScreenLayout`, `default`

## 📥 Props recebidas
children

## 🧠 Funções/Componentes definidos
`ScreenLayout`, `loadScreenData`

## 📞 O que cada função chama
- `ScreenLayout()` → loadScreenData

