---
origem: src/components/dev/platform-admin-panel.tsx
origem_hash: 58b87aa8518111993ba9997e8e799ced08587948
gerado_em: 2026-06-26T00:33:19
---

# `src/components/dev/platform-admin-panel.tsx`

# PlatformAdminPanel

## Responsabilidade
Painel administrativo para gerenciar o admin da plataforma e exibir receitas do sistema.

## Props
- `grossRevenueCents`, `systemCutCents`, `adminRepasseCents` (number): valores de receita em centavos
- `commissionPercent` (number): percentual de comissão do sistema

## Funcionalidades
- **Exibe resumo financeiro**: receita bruta, repasse do sistema e do admin (formatados em BRL)
- **Gerencia admin da plataforma**: designar/revogar admin via PATCH/DELETE em `/api/dev/platform-admin`
- **Lista usuários**: busca por nome/email e permite designar como admin
- **Feedback visual**: mensagens de sucesso/erro e estados de carregamento

## APIs consumidas
- `GET /api/dev/platform-admin` — dados do admin atual
- `GET /api/dev/users` — lista de usuários
- `PATCH /api/dev/platform-admin` — designar novo admin
- `DELETE /api/dev/platform-admin` — remover admin

## Componentes internos
- `Stat`: exibe label e valor formatado, com opção de destaque (highlight)

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** react

## ⬅️ Importado por
- [[page.tsx]] — `src/app/(dev)/dev/page.tsx`

## 📤 Exporta
`PlatformAdminPanel`

## 🧩 Componentes usados
AdminInfo, Stat, UserProfile

## 🪝 Hooks / efeitos
useEffect, useState

## 📥 Props recebidas
adminRepasseCents, commissionPercent, grossRevenueCents, highlight, label, systemCutCents, value

## 🧠 Funções/Componentes definidos
`PlatformAdminPanel`, `Stat`, `brl`, `handleDesignar`, `handleRevogar`

## 📞 O que cada função chama
- `PlatformAdminPanel()` → String, all, brl, catch, fetch, filter, finally, handleDesignar, includes, json, map, setAdmin, setLoading, setMessage, setSearch, setUsers, then, toLowerCase, toUpperCase, useEffect, useState
- `brl()` → toLocaleString
- `handleDesignar()` → fetch, json, map, setAdmin, setMessage, setSaving, setUsers, stringify
- `handleRevogar()` → confirm, fetch, map, setAdmin, setMessage, setSaving, setUsers

