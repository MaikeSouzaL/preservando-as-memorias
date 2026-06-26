---
origem: src/app/(public)/login/page.tsx
origem_hash: c5da384772e9f150d4a2dbd39bafb5a5784b3bd6
gerado_em: 2026-06-26T00:33:20
---

# `src/app/(public)/login/page.tsx`

# Página de Login (`/login`)

**Responsabilidade:** Autenticação de usuários com formulário de email/senha e login social Google.

## Componentes

- **`LoginPage`** → Wrapper com `Suspense` para `LoginContent`
- **`LoginContent`** → Formulário completo de login:
  - Gerencia estados: `email`, `password`, `rememberMe`, `errorMsg`
  - Lê `?next=` dos search params para redirecionamento pós-login
  - Envia POST para `/api/auth/login` com `{ email, password }`
  - Redireciona: `/dev` (devAdmin), `/admin/dashboard` (admin), ou `next`
  - Login Google via `supabase.auth.signInWithOAuth` com redirect para `/auth/callback`
- **`InputWithIcon`** → Input estilizado com ícone e toggle de visibilidade para senha

## Props (InputWithIcon)
- `icon`, `type` (`email|password`), `placeholder`, `value`, `onChange`

## Conexões
- **Importa:** `createClientBrowser` de `src/lib/supabase-browser`
- **Consome:** `POST /api/auth/login` (autenticação email/senha)
- **Links:** `/` (voltar), `/recuperar-senha`, `/cadastro`, `/auth/callback` (Google OAuth)

<!-- aurora:relacoes -->

## 🔗 Importa
- [[supabase-browser.ts]] — `src/lib/supabase-browser.ts`
- **Externos/APIs:** next/image, next/link, next/navigation, react

## 📤 Exporta
`LoginPage`, `default`

## 🧩 Componentes usados
HTMLFormElement, HTMLInputElement, Image, InputWithIcon, Link, LoginContent, Suspense

## 🪝 Hooks / efeitos
useRouter, useSearchParams, useState

## 📥 Props recebidas
icon, onChange, placeholder, type, value

## 🧠 Funções/Componentes definidos
`InputWithIcon`, `LoginContent`, `LoginPage`, `handleSubmit`

## 📞 O que cada função chama
- `InputWithIcon()` → setShow, useState
- `LoginContent()` → Boolean, createClientBrowser, encodeURIComponent, get, getItem, setEmail, setItem, setPassword, setRememberMe, signInWithOAuth, useRouter, useSearchParams, useState
- `handleSubmit()` → fetch, json, preventDefault, push, removeItem, setErrorMsg, setItem, stringify, trim

## 🔁 Chama (arquivos)
- [[supabase-browser.ts]] — `src/lib/supabase-browser.ts`

