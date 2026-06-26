---
origem: src/lib/rate-limit.ts
origem_hash: 8b4daab37b4edefff47b7bef214eddc720da1344
gerado_em: 2026-06-25T23:37:23
---

# `src/lib/rate-limit.ts`

# Rate Limit Utility (`src/lib/rate-limit.ts`)

**Responsabilidade:** Middleware de rate limiting para rotas de API, com fallback entre Redis (Upstash) e armazenamento em memória.

**Função principal:**
- `checkRateLimit(request, prefix, { limit, windowSecs })` → Verifica se requisição excedeu limite. Retorna `NextResponse` (429) ou `null` (permitido).

**Lógica:**
- Extrai IP do request (`x-forwarded-for` → `x-real-ip` → `"unknown"`)
- Usa Upstash Redis (sliding window) se variáveis de ambiente configuradas
- Fallback para `memoryStore` (Map em memória, não compartilhado entre instâncias)
- Retorna headers: `Retry-After`, `X-RateLimit-Limit`, `X-RateLimit-Remaining`

**Configuração:** `{ limit: number, windowSecs: number }`

**Consumido por:** Rotas de autenticação (`login`, `register`, `reset-password/request`)

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** @upstash/ratelimit, @upstash/redis, next/server

## ⬅️ Importado por
- [[route.ts]] — `src/app/api/auth/login/route.ts`
- [[route.ts]] — `src/app/api/auth/register/route.ts`
- [[route.ts]] — `src/app/api/auth/reset-password/request/route.ts`

## 📤 Exporta
`checkRateLimit`

## 🧩 Componentes usados
NextResponse

## 🧠 Funções/Componentes definidos
`checkRateLimit`, `memoryCheck`

## 📞 O que cada função chama
- `checkRateLimit()` → String, get, json, limit, memoryCheck, slidingWindow, split, trim
- `memoryCheck()` → get, max, now, set

## 📲 Chamado por
- [[route.ts]] — `src/app/api/auth/login/route.ts`
- [[route.ts]] — `src/app/api/auth/register/route.ts`
- [[route.ts]] — `src/app/api/auth/reset-password/request/route.ts`

