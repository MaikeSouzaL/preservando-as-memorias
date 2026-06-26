---
origem: src/app/(admin)/admin/homenagens/page.tsx
origem_hash: c7c0f94a8bddc3e974cbc8ef6dfd97a8d8b69909
gerado_em: 2026-06-25T23:37:30
---

# `src/app/(admin)/admin/homenagens/page.tsx`

## AdminTributesPage

Página administrativa para gerenciamento de homenagens/tributos.

**Responsabilidade:** Listar, aprovar/reprovar e excluir homenagens enviadas por usuários.

**Funcionalidades:**
- Carrega homenagens via `GET /api/admin/tributes`
- Aprova/reabre homenagens via `PATCH /api/admin/tributes`
- Exclui homenagens via `DELETE /api/admin/tributes?id=...`
- Exibe contagem total e pendentes (calculada com `useMemo`)
- Tabela responsiva com autor, mensagem, memorial, tag, data e status

**Estado:** `tributes[]`, `loading`, `updatingId`, `error`

**Integração:** Consome APIs administrativas; componente cliente da rota `/admin/homenagens`.

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** react

## 📤 Exporta
`AdminTributesPage`, `default`

## 🧩 Componentes usados
AdminTribute

## 🪝 Hooks / efeitos
useEffect, useMemo, useState

## 🧠 Funções/Componentes definidos
`AdminTributesPage`, `deleteTribute`, `loadTributes`, `updateStatus`

## 📞 O que cada função chama
- `AdminTributesPage()` → deleteTribute, filter, loadTributes, map, toLocaleDateString, updateStatus, useEffect, useMemo, useState
- `deleteTribute()` → confirm, encodeURIComponent, fetch, isArray, json, setError, setTributes, setUpdatingId
- `loadTributes()` → fetch, isArray, json, setError, setLoading, setTributes
- `updateStatus()` → fetch, isArray, json, setError, setTributes, setUpdatingId, stringify

