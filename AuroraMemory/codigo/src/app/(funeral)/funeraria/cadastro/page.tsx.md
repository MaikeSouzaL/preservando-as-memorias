---
origem: src/app/(funeral)/funeraria/cadastro/page.tsx
origem_hash: bc5ab0f9e69e5826050b69606fa5226d41e873a0
gerado_em: 2026-06-26T00:33:20
---

# `src/app/(funeral)/funeraria/cadastro/page.tsx`

# Página de Cadastro de Funerária

**Responsabilidade:** Formulário multi-etapas para registro de novas funerárias na plataforma.

## Componentes Principais

- **`Step1`** — Busca dados da empresa via CNPJ (BrasilAPI) e exibe resultado
- **`Step2`** — Coleta dados do responsável (nome, email, telefone)
- **`Step3`** — Criação de senha com confirmação e validação
- **`StepBar`** — Indicador visual de progresso (3 etapas)
- **`PendingScreen`** — Tela exibida após cadastro bem-sucedido (`?status=pendente`)

## Fluxo

1. Usuário informa CNPJ → consulta `https://brasilapi.com.br/api/cnpj/v1/{cnpj}`
2. Preenche dados do responsável
3. Define senha (mín. 8 caracteres)
4. Envia POST para `/api/funeral-auth/register` com todos os dados
5. Redireciona para tela de "Aguardando aprovação"

## Props/Parâmetros

- **`invite`** (query param) — Slug de convite para condições comerciais especiais
- **`status=pendente`** (query param) — Exibe tela de sucesso

## Integrações

- **BrasilAPI** — Consulta de CNPJ (externa)
- **`/api/funeral-auth/register`** — Endpoint interno de registro
- **`next/navigation`** — Redirecionamento pós-cadastro

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** next/link, next/navigation, react

## 📤 Exporta
`FunerariaCadastroPage`, `default`

## 🧩 Componentes usados
CadastroContent, CompanyData, InputField, Link, PendingScreen, ReadonlyField, Step1, Step2, Step3, StepBar, Suspense

## 🪝 Hooks / efeitos
useRouter, useSearchParams, useState

## 📥 Props recebidas
cnpj, company, confirmPassword, contactName, current, email, error, icon, isLoading, label, onBack, onChange, onNext, onSubmit, password, phone, placeholder, required, setCnpj, setCompany, setConfirmPassword, setContactName, setEmail, setPassword, setPhone, type, value

## 🧠 Funções/Componentes definidos
`CadastroContent`, `FunerariaCadastroPage`, `InputField`, `PendingScreen`, `ReadonlyField`, `Step1`, `Step2`, `Step3`, `StepBar`, `cleanCnpj`, `handleCnpjChange`, `handleSubmit`, `lookup`, `maskCnpj`

## 📞 O que cada função chama
- `CadastroContent()` → get, setStep, useRouter, useSearchParams, useState
- `InputField()` → onChange
- `Step1()` → cleanCnpj, handleCnpjChange, lookup, useState
- `Step3()` → setConfirmPassword, setPassword, setShowConfirm, setShowPwd, useState
- `StepBar()` → map
- `cleanCnpj()` → replace
- `handleCnpjChange()` → maskCnpj, setCnpj, setCompany, setFetchError
- `handleSubmit()` → cleanCnpj, fetch, json, onNext, onSubmit, preventDefault, push, setError, setIsLoading, stringify
- `lookup()` → cleanCnpj, fetch, json, setCompany, setFetchError, setFetching
- `maskCnpj()` → replace, slice

