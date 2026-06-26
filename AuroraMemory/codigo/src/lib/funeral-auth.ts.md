---
origem: src/lib/funeral-auth.ts
origem_hash: d1ae1e466506fdbc23138348da8be923b7920a1a
gerado_em: 2026-06-26T00:33:19
---

# `src/lib/funeral-auth.ts`

## `src/lib/funeral-auth.ts`

**Responsabilidade:** Gerenciar sessão de autenticação de funerárias via cookies.

### Tipos
- **`FuneralSession`**: Objeto com `funeralHomeId`, `email` e `name` (opcional).

### Funções
- **`getFuneralSession()`**: Lê e valida o cookie `funeral_session`, retornando `FuneralSession` ou `null` se inválido/ausente.
- **`serializeFuneralSession(session)`**: Serializa e codifica a sessão para armazenamento em cookie.

### Dependências
- **Importa**: `cookies` do `next/headers`
- **Importado por**: Rotas da API de autenticação (`/api/funeral-auth/*`) e página do dashboard da funerária.

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** next/headers

## ⬅️ Importado por
- [[page.tsx]] — `src/app/(funeral)/funeraria/dashboard/page.tsx`
- [[route.ts]] — `src/app/api/funeral-auth/bank-data/route.ts`
- [[route.ts]] — `src/app/api/funeral-auth/documents/route.ts`
- [[route.ts]] — `src/app/api/funeral-auth/inventory/route.ts`
- [[route.ts]] — `src/app/api/funeral-auth/login/route.ts`
- [[route.ts]] — `src/app/api/funeral-auth/me/route.ts`
- [[route.ts]] — `src/app/api/funeral-auth/memorials/route.ts`
- [[route.ts]] — `src/app/api/funeral-auth/schedules/route.ts`
- [[route.ts]] — `src/app/api/funeral-auth/services/route.ts`
- [[route.ts]] — `src/app/api/funeral-auth/staff/route.ts`

## 📤 Exporta
`FuneralSession`, `getFuneralSession`, `serializeFuneralSession`

## 🧩 Componentes usados
FuneralSession

## 🧠 Funções/Componentes definidos
`getFuneralSession`, `serializeFuneralSession`

## 📞 O que cada função chama
- `getFuneralSession()` → cookies, decodeURIComponent, get, parse
- `serializeFuneralSession()` → encodeURIComponent, stringify

## 📲 Chamado por
- [[page.tsx]] — `src/app/(funeral)/funeraria/dashboard/page.tsx`
- [[route.ts]] — `src/app/api/funeral-auth/bank-data/route.ts`
- [[route.ts]] — `src/app/api/funeral-auth/documents/route.ts`
- [[route.ts]] — `src/app/api/funeral-auth/inventory/route.ts`
- [[route.ts]] — `src/app/api/funeral-auth/login/route.ts`
- [[route.ts]] — `src/app/api/funeral-auth/me/route.ts`
- [[route.ts]] — `src/app/api/funeral-auth/memorials/route.ts`
- [[route.ts]] — `src/app/api/funeral-auth/schedules/route.ts`
- [[route.ts]] — `src/app/api/funeral-auth/services/route.ts`
- [[route.ts]] — `src/app/api/funeral-auth/staff/route.ts`

