---
origem: src/app/(public)/recuperar-senha/page.tsx
origem_hash: 92b2f29e59023493447fd9a1d7247dacc0919f08
gerado_em: 2026-06-25T23:37:29
---

# `src/app/(public)/recuperar-senha/page.tsx`

# `src/app/(public)/recuperar-senha/page.tsx`

**Responsabilidade:** Página pública de solicitação de redefinição de senha.

**Funcionalidades:**
- Formulário para inserir e-mail e enviar solicitação de reset
- Estados: formulário (`submitted=false`) e confirmação (`submitted=true`)
- Validação e feedback de erro via `error` state

**Componente principal:** `RecuperarSenhaPage` (default export, client component)

**API consumida:**
- `POST /api/auth/reset-password/request` — envia e-mail com link de redefinição (válido por 15 min)

**Props/Parâmetros:** Nenhum (página autônoma)

**Conexões:**
- Usa `Link` do Next.js para navegação a `/login`
- Depende de `useState` do React para gerenciar estados locais

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** next/link, react

## 📤 Exporta
`RecuperarSenhaPage`, `default`

## 🧩 Componentes usados
Link

## 🪝 Hooks / efeitos
useState

## 🧠 Funções/Componentes definidos
`RecuperarSenhaPage`, `handleSubmit`

## 📞 O que cada função chama
- `RecuperarSenhaPage()` → setEmail, useState
- `handleSubmit()` → fetch, json, preventDefault, setError, setLoading, setSubmitted, stringify

