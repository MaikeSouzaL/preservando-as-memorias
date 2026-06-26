---
origem: src/app/(funeral)/funeraria/login/page.tsx
origem_hash: b710df2830f95b928107a24a212756c643c3e95e
gerado_em: 2026-06-25T23:37:29
---

# `src/app/(funeral)/funeraria/login/page.tsx`

# Página de Login da Funerária

**Responsabilidade:** Autenticação de parceiros funerários no painel corporativo.

## Funcionalidades

- **Formulário de login** com campos de e-mail corporativo e senha
- **Validação e feedback** de erros de autenticação
- **Redirecionamento** para `/funeraria/dashboard` após sucesso

## API Consumida

- `POST /api/funeral-auth/login` — envia `{ email, password }` e recebe token de autenticação

## Estados

- `isLoading` — desabilita botão durante requisição
- `error` — exibe mensagem de erro em destaque visual
- `form` — controla campos do formulário

## Navegação

- Link para cadastro: `/funeraria/cadastro`
- Link de retorno: `/` (página inicial)
- Redireciona para dashboard após login bem-sucedido

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** next/link, next/navigation, react

## 📤 Exporta
`FunerariaLoginPage`, `default`

## 🧩 Componentes usados
Link

## 🪝 Hooks / efeitos
useRouter, useState

## 🧠 Funções/Componentes definidos
`FunerariaLoginPage`, `handleSubmit`

## 📞 O que cada função chama
- `FunerariaLoginPage()` → setForm, useRouter, useState
- `handleSubmit()` → fetch, json, preventDefault, push, setError, setIsLoading, stringify

