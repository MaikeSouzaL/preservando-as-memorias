---
origem: src/components/admin/bank-data-panel.tsx
origem_hash: 438387301459b21b93599e6ed69b5a2d99cf0ac9
gerado_em: 2026-06-25T23:37:29
---

# `src/components/admin/bank-data-panel.tsx`

## BankDataPanel

**Responsabilidade:** Formulário de dados bancários do administrador para repasse automático de 85% da receita.

### Componentes chave:
- **BankDataPanel** (exportado): Recebe `grossRevenueCents` e `platformCommissionCents` como props. Exibe resumo financeiro (receita bruta, repasse 85%, taxa 15%) e formulário criptografado (AES-256-GCM) com campos: holderName, bankName, agency, account, accountType, cpfCnpj, pixKey.
- **Field**: Input reutilizável com label e estilização padronizada.
- **RepasseCard**: Card de resumo financeiro com opção de destaque (`highlight`).

### APIs consumidas:
- `GET /api/admin/bank-data` — carrega dados bancários existentes
- `PATCH /api/admin/bank-data` — salva/atualiza dados bancários

### Fluxo:
1. Carrega dados bancários via GET ao montar
2. Usuário preenche formulário e salva via PATCH
3. Exibe mensagens de sucesso/erro

**Importado por:** `src/app/(admin)/admin/comercial/page.tsx`

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** react

## ⬅️ Importado por
- [[page.tsx]] — `src/app/(admin)/admin/comercial/page.tsx`

## 📤 Exporta
`BankDataPanel`

## 🧩 Componentes usados
BankData, Field, HTMLInputElement, RepasseCard

## 🪝 Hooks / efeitos
useEffect, useState

## 📥 Props recebidas
className, grossRevenueCents, highlight, label, platformCommissionCents, props, sub, value

## 🧠 Funções/Componentes definidos
`BankDataPanel`, `Field`, `RepasseCard`, `formatBRL`, `handleChange`, `handleSubmit`

## 📞 O que cada função chama
- `BankDataPanel()` → catch, fetch, formatBRL, json, setForm, setLoaded, then, useEffect, useState
- `formatBRL()` → toLocaleString
- `handleChange()` → setForm
- `handleSubmit()` → fetch, json, preventDefault, setError, setMessage, setSaving, stringify

