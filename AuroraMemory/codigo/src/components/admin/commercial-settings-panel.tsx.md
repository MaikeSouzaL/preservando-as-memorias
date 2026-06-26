---
origem: src/components/admin/commercial-settings-panel.tsx
origem_hash: 0ad569d7bb6c9b84c791554f6f69a68a53a81e1c
gerado_em: 2026-06-25T23:37:29
---

# `src/components/admin/commercial-settings-panel.tsx`

## CommercialSettingsPanel

**Responsabilidade:** Painel administrativo para gerenciar planos de cobrança da plataforma.

### Componentes

- **`CommercialSettingsPanel`** — Componente principal. Recebe `initialConfig: PlatformConfig`. Gerencia estado local do config, plano selecionado, mensagens e salvamento. Renderiza seletor de planos, formulário de edição e simulação financeira.
- **`PlanForm`** — Formulário de edição de um plano. Props: `plan`, `plans`, `defaultPlanId`, `saving`, `onSubmit`. Campos: nome, descrição, valor, ciclo, plano padrão, ativo.
- **`Line`** — Componente de exibição de linha com label e valor. Props: `label`, `value`, `strong?`.

### API

- **`PATCH /api/platform-config`** — Salva alterações do plano selecionado. Envia `planId`, `defaultPlanId`, `name`, `description`, `price`, `cycle`, `active`. Retorna config atualizado.

### Integração

- Importa tipos (`PlatformConfig`, `PlatformPlan`) e utilitários (`centsToBRL`, `cycleLabel`) de `src/lib/platform-types`.
- Consome API interna para persistir configurações.

<!-- aurora:relacoes -->

## 🔗 Importa
- [[platform-types.ts]] — `src/lib/platform-types.ts`
- **Externos/APIs:** react

## 📤 Exporta
`CommercialSettingsPanel`

## 🧩 Componentes usados
HTMLFormElement, Line, PlanForm

## 🪝 Hooks / efeitos
useMemo, useState

## 📥 Props recebidas
defaultPlanId, initialConfig, label, onSubmit, plan, plans, saving, strong, value

## 🧠 Funções/Componentes definidos
`CommercialSettingsPanel`, `Line`, `PlanForm`, `savePlan`

## 📞 O que cada função chama
- `CommercialSettingsPanel()` → centsToBRL, cycleLabel, find, map, round, setSelectedPlanId, useMemo, useState
- `PlanForm()` → map, toFixed
- `savePlan()` → Number, String, fetch, get, json, preventDefault, setConfig, setMessage, setSaving, stringify

## 🔁 Chama (arquivos)
- [[platform-types.ts]] — `src/lib/platform-types.ts`

