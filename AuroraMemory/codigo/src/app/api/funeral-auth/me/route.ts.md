---
origem: src/app/api/funeral-auth/me/route.ts
origem_hash: 30f4562b5a6c348a4b5159d36e22ebc3f84f7553
gerado_em: 2026-06-26T00:33:20
---

# `src/app/api/funeral-auth/me/route.ts`

Este arquivo define a rota de API `GET /api/funeral-auth/me`, que retorna dados da funerária autenticada.

**Responsabilidade:** Endpoint protegido que expõe perfil, estatísticas e dados da funerária logada.

**Funcionamento:**
- Obtém sessão via `getFuneralSession()`
- Se não autenticado → `401`
- Busca a funerária em `readPlatformData()` pelo `session.funeralHomeId`
- Se não encontrada → `404`
- Filtra memoriais e pedidos vinculados à funerária
- Calcula estatísticas (total/ativos/pendentes, receita)
- Retorna JSON com `funeralHome`, `stats`, `memorials` e `orders`

**Dependências:** `getFuneralSession` (sessão), `readPlatformData` (dados da plataforma).

<!-- aurora:relacoes -->

## 🔗 Importa
- [[funeral-auth.ts]] — `src/lib/funeral-auth.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- **Externos/APIs:** next/server

## 📤 Exporta
`GET`, `dynamic`

## 🧠 Funções/Componentes definidos
`GET`

## 📞 O que cada função chama
- `GET()` → filter, find, getFuneralSession, json, readPlatformData, reduce

## 🔁 Chama (arquivos)
- [[funeral-auth.ts]] — `src/lib/funeral-auth.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`

