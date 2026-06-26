---
origem: src/components/admin/funeral-settings-panel.tsx
origem_hash: 879743857f0af239c92e13b0a4f94f9cfbd8d514
gerado_em: 2026-06-25T23:37:29
---

# `src/components/admin/funeral-settings-panel.tsx`

# FuneralSettingsPanel

## Responsabilidade
Painel administrativo para gerenciar **planos de assinatura mensal** de funerárias, com cotas de memoriais e preços excedentes.

## Componente Principal
- **`FuneralSettingsPanel`**: Gerencia CRUD completo de planos (criar, editar, excluir, definir padrão)
  - Props: `initialConfig: PlatformConfig`
  - Estados: formulário, salvamento, exclusão, mensagens de feedback

## Funcionalidades Chave
- **Formulário de plano**: nome, preço (R$), recorrência (mensal/anual/único), limite de memoriais, preço excedente, ativo/inativo
- **Preview de receita**: calcula automaticamente taxa do sistema e repasse
- **Lista de planos**: exibe cards com preço, cota, status (padrão/inativo)
- **Ações**: editar, tornar padrão, excluir (com confirmação)

## API Consumida
- `PATCH /api/platform-config` com `target: "funeral"` (salvar/atualizar) ou `"funeral_delete"` (excluir)

## Subcomponentes
- `Field`: label + input estilizado
- `Row`: linha de label/valor para preview financeiro

## Dependências
- Importa tipos de `@/src/lib/platform-types` (`BillingCycle`, `FuneralPlan`, `PlatformConfig`)
- Importado por `funerarias-page-client.tsx`

<!-- aurora:relacoes -->

## 🔗 Importa
- [[platform-types.ts]] — `src/lib/platform-types.ts`
- **Externos/APIs:** react

## ⬅️ Importado por
- [[funerarias-page-client.tsx]] — `src/components/admin/funerarias-page-client.tsx`

## 📤 Exporta
`FuneralSettingsPanel`

## 🧩 Componentes usados
Field, FormState, PlatformConfig, Row

## 🪝 Hooks / efeitos
useMemo, useState

## 📥 Props recebidas
children, className, initialConfig, label, value, valueClass

## 🧠 Funções/Componentes definidos
`Field`, `FuneralSettingsPanel`, `Row`, `brlToCents`, `closeForm`, `normalizePlans`, `openCreate`, `openEdit`, `removePlan`, `setAsDefault`, `submitForm`

## 📞 O que cada função chama
- `FuneralSettingsPanel()` → brlToCents, centsToBRL, cycleLabel, isFinite, map, normalizePlans, openEdit, parseInt, removePlan, round, setAsDefault, setForm, useMemo, useState
- `brlToCents()` → String, isFinite, parseFloat, replace, round
- `closeForm()` → setEditingId, setForm, setIsCreating
- `normalizePlans()` → filter, isArray
- `openCreate()` → setEditingId, setForm, setIsCreating, setMessage
- `openEdit()` → String, replace, setEditingId, setForm, setIsCreating, setMessage, toFixed
- `removePlan()` → closeForm, confirm, fetch, json, setConfig, setDeletingId, setMessage, stringify
- `setAsDefault()` → fetch, json, setConfig, setMessage, stringify
- `submitForm()` → String, brlToCents, closeForm, fetch, json, max, parseInt, preventDefault, randomUUID, setConfig, setMessage, setSaving, stringify, trim

## 🔁 Chama (arquivos)
- [[platform-types.ts]] — `src/lib/platform-types.ts`

