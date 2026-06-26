---
origem: src/components/dev/commission-config-panel.tsx
origem_hash: 31baae8e130de037c47b9c37d4065e59633ea647
gerado_em: 2026-06-26T00:33:19
---

# `src/components/dev/commission-config-panel.tsx`

## CommissionConfigPanel

**Responsabilidade:** Componente de formulário para configurar a taxa de comissão do sistema (percentual retido pelo owner em cada venda).

**Funcionalidades:**
- Exibe campo numérico para definir a taxa do owner (0-100%)
- Calcula e mostra automaticamente o repasse ao admin (100% - taxa do owner)
- Envia PATCH para `/api/platform-config` com `target: "commission"` e `ownerCommissionPercent`
- Exibe feedback visual de sucesso/erro após o salvamento

**Props:**
- `initialCommission: number` — valor inicial da taxa

**Integração:** Importado por `src/app/(dev)/dev/page.tsx`, consome a API interna `/api/platform-config`.

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** react

## ⬅️ Importado por
- [[page.tsx]] — `src/app/(dev)/dev/page.tsx`

## 📤 Exporta
`CommissionConfigPanel`

## 🪝 Hooks / efeitos
useState

## 📥 Props recebidas
initialCommission

## 🧠 Funções/Componentes definidos
`CommissionConfigPanel`, `handleSave`

## 📞 O que cada função chama
- `CommissionConfigPanel()` → String, isFinite, parseFloat, replace, setValue, toFixed, useState
- `handleSave()` → String, fetch, json, parseFloat, preventDefault, setMessage, setSaving, setValue, stringify

