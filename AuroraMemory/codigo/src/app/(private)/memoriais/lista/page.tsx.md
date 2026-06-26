---
origem: src/app/(private)/memoriais/lista/page.tsx
origem_hash: 0288e777d3f4abd242b21585a3725d5baf9ca5b9
gerado_em: 2026-06-26T00:33:20
---

# `src/app/(private)/memoriais/lista/page.tsx`

# `src/app/(private)/memoriais/lista/page.tsx`

## Página de Listagem de Memoriais

**Responsabilidade:** Exibe e gerencia a lista de memoriais do usuário logado, com busca e ações rápidas.

### Componente Principal
- **`MemoriaisListaPage`** (default export): Página client-side que:
  - **Busca dados** via `GET /api/memorials` no `useEffect`
  - **Normaliza** os memoriais (converte datas em anos, fallback de campos)
  - **Filtra** por nome/ano com `useMemo` e estado `search`
  - **Renderiza grid** de cards com: imagem, nome, anos, epitáfio, estatísticas (visitas/homenagens/velas)
  - **Ações por card**: link público, editar (`/memoriais/criar?edit={id}`), compartilhar (copia URL), QR code
  - **Card "Criar Novo"** no final do grid
  - **Estado vazio** quando filtro não encontra resultados

### Integrações
- **API**: Consome `/api/memorials` (GET)
- **Rotas**: Links para `/memoriais/criar` e `/memorial-publico?memorial={id}`
- **Componentes**: `Image` (Next.js), `Link` (Next.js)

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** next/image, next/link, react

## 📤 Exporta
`MemoriaisListaPage`, `default`

## 🧩 Componentes usados
Image, Link, Memorial

## 🪝 Hooks / efeitos
useEffect, useMemo, useState

## 🧠 Funções/Componentes definidos
`MemoriaisListaPage`

## 📞 O que cada função chama
- `MemoriaisListaPage()` → alert, catch, fetch, filter, getFullYear, includes, isArray, join, json, map, setMemorials, setSearch, then, toLowerCase, useEffect, useMemo, useState, writeText

