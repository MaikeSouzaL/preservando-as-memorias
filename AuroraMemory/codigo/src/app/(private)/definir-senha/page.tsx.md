---
origem: src/app/(private)/definir-senha/page.tsx
origem_hash: 07e59b94464cee65e02148b9b7e4aafa9f31e69c
gerado_em: 2026-06-25T23:37:29
---

# `src/app/(private)/definir-senha/page.tsx`

# `definir-senha/page.tsx`

Página de definição de senha para primeiro acesso ao dashboard de um memorial recém-criado.

## Funcionalidade

- **Formulário de senha**: campos para nova senha (mín. 8 caracteres) e confirmação
- **Validação client-side**: verifica tamanho mínimo e correspondência entre os campos
- **Envio para API**: faz `POST /api/auth/definir-senha` com a senha no body
- **Redirecionamento**: em caso de sucesso, navega para `/dashboard`
- **Tratamento de erros**: exibe mensagens de erro da API ou de conexão

## Estados

- `password`, `confirm`: valores dos inputs
- `saving`: desabilita botão durante requisição
- `error`: mensagem de erro exibida em destaque visual

## Layout

- Fundo com gradiente decorativo e ícone de cadeado
- Card centralizado com formulário estilizado (tema escuro, tons dourados)

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** next/navigation, react

## 📤 Exporta
`DefinirSenhaPage`, `default`

## 🪝 Hooks / efeitos
useRouter, useState

## 🧠 Funções/Componentes definidos
`DefinirSenhaPage`, `handleSubmit`

## 📞 O que cada função chama
- `DefinirSenhaPage()` → setConfirm, setPassword, useRouter, useState
- `handleSubmit()` → fetch, json, preventDefault, push, setError, setSaving, stringify

