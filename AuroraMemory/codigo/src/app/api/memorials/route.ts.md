---
origem: src/app/api/memorials/route.ts
origem_hash: 48ff7c0be6e76e8f90e3e5a6c741d43bc9a772d0
gerado_em: 2026-06-25T23:37:29
---

# `src/app/api/memorials/route.ts`

# API de Memoriais (`/api/memorials`)

**Responsabilidade:** CRUD de memoriais (GET lista, POST cria).

## Funções exportadas

- **`GET()`** — Lista memoriais conforme permissão:
  - Usuário logado: seus memoriais + todos (se admin)
  - Visitante: apenas memoriais `status: "ativo"`
  - Retorna também QR codes vinculados
- **`POST(request)`** — Cria memorial + QR code:
  - Requer autenticação
  - Valida `name` e `biography` (obrigatórios)
  - Processa `gallery` (array ou texto) e `timelineEvents`
  - Admin: `status: "ativo"`; demais: `pending_payment`

## Funções auxiliares

- `slugify()` — normaliza string para ID
- `parseLines()` — converte texto multilinha em array
- `asString()` — sanitiza valor para string

## Dependências

- `src/lib/platform-data` — leitura/escrita dos dados
- `src/lib/auth-session` — autenticação do usuário

<!-- aurora:relacoes -->

## 🔗 Importa
- [[auth-session.ts]] — `src/lib/auth-session.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- **Externos/APIs:** next/server

## 📤 Exporta
`GET`, `POST`, `dynamic`

## 🧠 Funções/Componentes definidos
`GET`, `POST`, `asString`, `parseLines`, `slugify`

## 📞 O que cada função chama
- `GET()` → filter, getAuthSession, has, json, map, readPlatformData
- `POST()` → String, asString, getAuthSession, getFullYear, includes, isArray, json, map, now, parseLines, randomUUID, slice, slugify, split, toISOString, toString, trim, unshift, updatePlatformData
- `asString()` → trim
- `parseLines()` → asString, filter, map, split, trim
- `slugify()` → normalize, replace, slice, toLowerCase

## 🔁 Chama (arquivos)
- [[auth-session.ts]] — `src/lib/auth-session.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`

