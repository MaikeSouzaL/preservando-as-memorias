---
origem: src/app/(public)/nova-senha/page.tsx
origem_hash: e36a453b78c823d369367d15c101164b7b2dcfff
gerado_em: 2026-06-25T23:37:29
---

# `src/app/(public)/nova-senha/page.tsx`

# Página de Redefinição de Senha (`nova-senha/page.tsx`)

**Responsabilidade:** Formulário para criar nova senha após solicitação de redefinição.

## Componentes

- **`NovaSenhaPage`** (export default): Envolve `NovaSenhaContent` em `Suspense` para carregamento assíncrono.
- **`NovaSenhaContent`**: Lógica principal — extrai `token` da URL (`useSearchParams`), gerencia estados (`password`, `confirm`, `loading`, `done`, `error`) e submete o formulário.
- **`Section`**: Layout responsivo centralizado com cartão estilizado.

## Funcionalidades

- **Validação client-side**: senha ≥ 8 caracteres e confirmação igual.
- **Requisição POST** para `/api/auth/reset-password/confirm` com `{ token, password }`.
- **Três estados de UI**: token ausente (link inválido), sucesso (tela de confirmação com link para `/login`), formulário ativo.

## Conexões

- **Entrada**: Recebe `token` via query string (`?token=...`).
- **Saída**: Chama API interna de confirmação de reset; links para `/recuperar-senha` e `/login`.

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** next/link, next/navigation, react

## 📤 Exporta
`NovaSenhaPage`, `default`

## 🧩 Componentes usados
Link, NovaSenhaContent, Section, Suspense

## 🪝 Hooks / efeitos
useSearchParams, useState

## 📥 Props recebidas
children

## 🧠 Funções/Componentes definidos
`NovaSenhaContent`, `NovaSenhaPage`, `Section`, `handleSubmit`

## 📞 O que cada função chama
- `NovaSenhaContent()` → get, setConfirm, setPassword, useSearchParams, useState
- `handleSubmit()` → fetch, json, preventDefault, setDone, setError, setLoading, stringify

