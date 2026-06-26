---
origem: src/app/(private)/dashboard/page.tsx
origem_hash: 6221f4d7a00b82bf4000a3c756168a66f330df5d
gerado_em: 2026-06-26T00:33:20
---

# `src/app/(private)/dashboard/page.tsx`

# DashboardPage

## Responsabilidade
Página principal do dashboard privado que lista os memoriais do usuário autenticado, com QR codes, contadores de tributos/velas e ações de gerenciamento.

## Funções auxiliares
- **fmtDate()**: Formata data ISO para "DD/MM/AAAA" (padrão brasileiro)
- **shortName()**: Abrevia nome para ~13 caracteres (cabe no QR heart)

## Funcionalidades principais
- **Autenticação**: Redireciona para login se não autenticado; verifica necessidade de senha
- **Filtragem**: Exibe apenas memoriais do usuário (por ownerId ou email) + admins veem todos
- **QR Codes**: Gera QR heart (dark/light) para cada memorial ativo via `generateHeartQr()`
- **Contadores**: Agrega tributos e velas por memorial a partir dos dados da plataforma

## Props/Parâmetros
- Nenhum (página server-side, sem props)
- Consome `NEXT_PUBLIC_URL` do ambiente

## Dependências
- **Importa**: `MemorialCard`, `getAuthSession`, `readPlatformData`, `generateHeartQr`
- **Navegação**: Links para `/criar-memorial`, `/memoriais/criar?edit=`, `/memorial-publico?memorial=`
- **Redireciona**: `/login`, `/definir-senha`

<!-- aurora:relacoes -->

## 🔗 Importa
- [[memorial-card.tsx]] — `src/components/private/memorial-card.tsx`
- [[auth-session.ts]] — `src/lib/auth-session.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- [[qr-heart.ts]] — `src/lib/qr-heart.ts`
- **Externos/APIs:** next/link, next/navigation

## 📤 Exporta
`DashboardPage`, `default`, `dynamic`

## 🧩 Componentes usados
Link, MemorialCard

## 🧠 Funções/Componentes definidos
`DashboardPage`, `fmtDate`, `shortName`

## 📞 O que cada função chama
- `DashboardPage()` → filter, fmtDate, generateHeartQr, getAuthSession, getFullYear, map, readPlatformData, redirect, replace, shortName, toLowerCase, trim
- `fmtDate()` → String, getTime, getUTCDate, getUTCFullYear, getUTCMonth, isNaN, join, padStart
- `shortName()` → slice, split, trim

## 🔁 Chama (arquivos)
- [[auth-session.ts]] — `src/lib/auth-session.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- [[qr-heart.ts]] — `src/lib/qr-heart.ts`

