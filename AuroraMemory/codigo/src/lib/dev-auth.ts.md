---
origem: src/lib/dev-auth.ts
origem_hash: 15188c2209bf32f07cfca5433d2950494d290bac
gerado_em: 2026-06-25T23:37:23
---

# `src/lib/dev-auth.ts`

# `src/lib/dev-auth.ts` — Guarda de Autenticação para Desenvolvedor

## Responsabilidade
Protege rotas e páginas administrativas, garantindo que apenas usuários com sessão ativa e permissão `isDevAdmin` possam acessá-las.

## Função Principal
- **`requireDevAdminSession()`**: Função assíncrona que verifica a sessão do usuário via `getAuthSession()`. Retorna um objeto do tipo `DevAdminGuard`:
  - Se sessão inexistente → `401` ("Sessão obrigatória.")
  - Se sessão sem `isDevAdmin` → `403` ("Acesso restrito ao desenvolvedor.")
  - Se autorizado → `{ session, response: null }`

## Tipo Auxiliar
- **`DevAdminGuard`**: Union type que força o tratamento dos dois cenários (sucesso ou erro com `NextResponse`).

## Conexões
- **Importa**: `getAuthSession` e `AuthSession` de `src/lib/auth-session.ts`
- **Exporta**: `requireDevAdminSession`
- **Consumido por**: Rotas API (`/api/dev/*`, `/api/platform-config`) e páginas em `(dev)/dev/`

<!-- aurora:relacoes -->

## 🔗 Importa
- [[auth-session.ts]] — `src/lib/auth-session.ts`
- **Externos/APIs:** next/server

## ⬅️ Importado por
- [[page.tsx]] — `src/app/(dev)/dev/page.tsx`
- [[route.ts]] — `src/app/api/dev/platform-admin/route.ts`
- [[route.ts]] — `src/app/api/dev/repasse/route.ts`
- [[route.ts]] — `src/app/api/dev/stats/route.ts`
- [[route.ts]] — `src/app/api/dev/users/route.ts`
- [[route.ts]] — `src/app/api/platform-config/route.ts`

## 📤 Exporta
`requireDevAdminSession`

## 🧩 Componentes usados
DevAdminGuard

## 🧠 Funções/Componentes definidos
`requireDevAdminSession`

## 📞 O que cada função chama
- `requireDevAdminSession()` → getAuthSession, json

## 🔁 Chama (arquivos)
- [[auth-session.ts]] — `src/lib/auth-session.ts`

## 📲 Chamado por
- [[page.tsx]] — `src/app/(dev)/dev/page.tsx`
- [[route.ts]] — `src/app/api/dev/platform-admin/route.ts`
- [[route.ts]] — `src/app/api/dev/repasse/route.ts`
- [[route.ts]] — `src/app/api/dev/stats/route.ts`
- [[route.ts]] — `src/app/api/dev/users/route.ts`
- [[route.ts]] — `src/app/api/platform-config/route.ts`

