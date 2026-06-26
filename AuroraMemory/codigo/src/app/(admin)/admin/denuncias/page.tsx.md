---
origem: src/app/(admin)/admin/denuncias/page.tsx
origem_hash: 1423a813d4759e3565e16ec900e74cb5a1baafc8
gerado_em: 2026-06-26T00:33:20
---

# `src/app/(admin)/admin/denuncias/page.tsx`

## AdminComplaintsPage

Página de administração para gerenciar denúncias de moderação. Exibe uma tabela com todas as denúncias registradas, permitindo ao admin alternar status (Pendente/Resolvido) ou excluir registros.

**Funcionalidades principais:**
- **Listagem de denúncias**: carrega dados via `GET /api/admin/complaints` ao montar o componente
- **Alternar status**: `PATCH /api/admin/complaints` com `{ id, status }` — alterna entre "Pendente" e "Resolvido"
- **Excluir denúncia**: `DELETE /api/admin/complaints?id={id}` com confirmação via `confirm()`

**Estado local:**
- `reports`: array de `Complaint` (`id`, `target`, `reason`, `reporter`, `status`, `createdAt`)
- `loading`: controle de carregamento inicial
- `updatingId`: ID da denúncia sendo alterada (desabilita botões durante operação)

**Layout:** tabela responsiva com colunas (ID, alvo, motivo, autor, data, ações) em container com backdrop blur.

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** react

## 📤 Exporta
`AdminComplaintsPage`, `default`

## 🧩 Componentes usados
Complaint

## 🪝 Hooks / efeitos
useEffect, useState

## 🧠 Funções/Componentes definidos
`AdminComplaintsPage`, `handleDelete`, `handleToggleStatus`, `init`

## 📞 O que cada função chama
- `AdminComplaintsPage()` → handleDelete, handleToggleStatus, init, map, toLocaleDateString, useEffect, useState
- `handleDelete()` → confirm, fetch, json, setReports, setUpdatingId
- `handleToggleStatus()` → fetch, json, setReports, setUpdatingId, stringify
- `init()` → fetch, json, setLoading, setReports

