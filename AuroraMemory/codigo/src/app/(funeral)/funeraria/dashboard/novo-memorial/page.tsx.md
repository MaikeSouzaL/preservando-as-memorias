---
origem: src/app/(funeral)/funeraria/dashboard/novo-memorial/page.tsx
origem_hash: 7fe0e65f64b48629be0b67dac8aef84ed79abe8d
gerado_em: 2026-06-26T00:33:20
---

# `src/app/(funeral)/funeraria/dashboard/novo-memorial/page.tsx`

# Novo Memorial Page

**Responsabilidade:** Página de criação de memoriais para funerárias. Gerencia o formulário e o fluxo pós-criação com link de pagamento.

## Funcionalidades

- **Formulário de Memorial:** Renderiza `<MemorialForm>` e envia dados via `POST /api/funeral-auth/memorials`
- **Pós-criação:** Exibe tela de sucesso com duas ações:
  - Link "Pagar Agora" → `/checkout?memorialId={id}&payerType=funeral_home`
  - Botão "Copiar Link de Pagamento" → copia URL completa para área de transferência
- **Estados:** Gerencia `paymentLink` e `createdName` com `useState`

## Props/Parâmetros

- **handleSubmit:** Callback que recebe `MemorialFormData`, faz POST e atualiza estado
- **submitLabel:** `"Salvar Memorial"` (passado ao `MemorialForm`)

## Conexões

- **Importa:** `MemorialForm` de `@/src/components/memorial-form`
- **Navegação:** `Link` para `/funeraria/dashboard` (voltar) e `/checkout` (pagamento)
- **API:** Consome endpoint `/api/funeral-auth/memorials`

<!-- aurora:relacoes -->

## 🔗 Importa
- [[memorial-form.tsx]] — `src/components/memorial-form.tsx`
- **Externos/APIs:** next/link, react

## 📤 Exporta
`NovoMemorialPage`, `default`

## 🧩 Componentes usados
Link, MemorialForm

## 🪝 Hooks / efeitos
useState

## 🧠 Funções/Componentes definidos
`NovoMemorialPage`, `handleCopyLink`, `handleSubmit`

## 📞 O que cada função chama
- `NovoMemorialPage()` → useState
- `handleCopyLink()` → alert, writeText
- `handleSubmit()` → fetch, json, setCreatedName, setPaymentLink, stringify

