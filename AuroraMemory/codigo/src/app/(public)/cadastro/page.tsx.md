---
origem: src/app/(public)/cadastro/page.tsx
origem_hash: dc258d811a8e0107c8b1481734c7b38fdee6463e
gerado_em: 2026-06-26T00:33:20
---

# `src/app/(public)/cadastro/page.tsx`

# Página de Cadastro (`/cadastro`)

**Responsabilidade:** Formulário de registro de novos usuários com suporte a e-mail/senha e Google OAuth.

## Componentes

- **`CadastroPage`** — Wrapper com `Suspense` para carregamento assíncrono
- **`CadastroContent`** — Lógica principal: valida senhas, chama `POST /api/auth/register`, gerencia estados de erro/envio
- **`InputWithIcon`** — Input reutilizável com ícone Material e toggle de visibilidade para senha

## Fluxo

1. Envia dados para `/api/auth/register` (name, email, password, bio)
2. Se `emailConfirmationRequired` → tela de confirmação
3. Se sucesso → redireciona para `next` (default `/dashboard`) ou `/admin/dashboard` se admin
4. Botão Google → `supabase.auth.signInWithOAuth` com redirect para `/auth/callback`

## Props (InputWithIcon)

| Prop | Tipo | Descrição |
|------|------|-----------|
| `icon` | string | Nome do ícone Material |
| `type` | "text" \| "email" \| "password" | Tipo do input |
| `placeholder` | string | Placeholder |
| `value` | string (opcional) | Valor controlado |
| `onChange` | function (opcional) | Handler de mudança |

## Dependências

- `src/lib/supabase-browser.ts` — cliente Supabase para OAuth
- `next/navigation` — `useRouter`, `useSearchParams`

<!-- aurora:relacoes -->

## 🔗 Importa
- [[supabase-browser.ts]] — `src/lib/supabase-browser.ts`
- **Externos/APIs:** next/image, next/link, next/navigation, react

## 📤 Exporta
`CadastroPage`, `default`

## 🧩 Componentes usados
CadastroContent, HTMLFormElement, HTMLInputElement, Image, InputWithIcon, Link, Suspense

## 🪝 Hooks / efeitos
useRouter, useSearchParams, useState

## 📥 Props recebidas
icon, onChange, placeholder, type, value

## 🧠 Funções/Componentes definidos
`CadastroContent`, `CadastroPage`, `InputWithIcon`, `handleSubmit`

## 📞 O que cada função chama
- `CadastroContent()` → createClientBrowser, encodeURIComponent, get, setConfirmPassword, setEmail, setItem, setName, setPassword, signInWithOAuth, useRouter, useSearchParams, useState
- `InputWithIcon()` → setShow, useState
- `handleSubmit()` → fetch, json, preventDefault, push, setEmailSent, setErrorMsg, setIsRegistering, setItem, stringify, trim

## 🔁 Chama (arquivos)
- [[supabase-browser.ts]] — `src/lib/supabase-browser.ts`

