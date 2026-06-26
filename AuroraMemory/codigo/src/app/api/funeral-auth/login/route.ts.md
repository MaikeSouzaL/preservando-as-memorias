---
origem: src/app/api/funeral-auth/login/route.ts
origem_hash: aae2dbcb145e38b49ee94aeaf7afbbf4fce83ac4
gerado_em: 2026-06-26T00:33:20
---

# `src/app/api/funeral-auth/login/route.ts`

# API de Login para Funerárias

**Responsabilidade:** Autenticar funerárias e criar sessão segura via cookie.

## Função Principal

- **`POST /api/funeral-auth/login`** — Recebe `email` e `password` no body JSON, valida credenciais e retorna dados da funerária com cookie de sessão.

## Fluxo de Validação

1. Verifica campos obrigatórios (400 se ausentes)
2. Busca funerária por email no `platformData`
3. Rejeita se: não encontrada (401), pendente/rejeitada/desativada (403)
4. Autentica senha com suporte a hash legado SHA256 (faz upgrade automático para scrypt)
5. Cria cookie `funeral_session` (httpOnly, 7 dias) via `serializeFuneralSession`

## Dependências

- **`readPlatformData`/`updatePlatformData`** — acesso ao banco de dados
- **`hashPassword`/`verifyPassword`** — gerenciamento de hash scrypt
- **`serializeFuneralSession`** — serialização da sessão para cookie

<!-- aurora:relacoes -->

## 🔗 Importa
- [[funeral-auth.ts]] — `src/lib/funeral-auth.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- **Externos/APIs:** @/src/lib/password, next/server, node:crypto

## 📤 Exporta
`POST`, `dynamic`

## 🧠 Funções/Componentes definidos
`POST`, `asString`

## 📞 O que cada função chama
- `POST()` → asString, createHash, digest, find, hashPassword, json, readPlatformData, serializeFuneralSession, set, startsWith, toLowerCase, update, updatePlatformData, verifyPassword
- `asString()` → trim

## 🔁 Chama (arquivos)
- [[funeral-auth.ts]] — `src/lib/funeral-auth.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`

