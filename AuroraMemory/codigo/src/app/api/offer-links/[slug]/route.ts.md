---
origem: src/app/api/offer-links/[slug]/route.ts
origem_hash: 4d14f594694edf74c2563a30a3f2fd4cc6c00a84
gerado_em: 2026-06-25T23:37:29
---

# `src/app/api/offer-links/[slug]/route.ts`

# API de Offer Links (`/api/offer-links/[slug]`)

**Responsabilidade:** Gerencia ofertas de memoriais via slug, permitindo consulta e criação de memoriais vinculados.

## Endpoints

- **`GET`** — Busca oferta ativa pelo slug, incrementa `accessCount`. Retorna `404` se não encontrada ou pausada.
- **`POST`** — Cria memorial vinculado à oferta ativa. Valida campos obrigatórios (nome, epitáfio, biografia). Gera galeria (array ou linhas `|`), timeline e metadados. Incrementa `conversionCount` da oferta.

## Funções auxiliares

- `slugify()` — Normaliza string para slug (48 chars max).
- `parseLines()` — Divide texto em linhas não vazias.
- `limitText()` — Trunca string no limite informado.

## Dependências

- `updatePlatformData` (de `platform-data`) — Mutação atômica dos dados da plataforma.
- `ManagedMemorial` — Tipo do memorial criado.

## Integração

Consome e modifica `data.offerLinks` e `data.memorials` via `updatePlatformData`.

<!-- aurora:relacoes -->

## 🔗 Importa
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- **Externos/APIs:** next/server

## 📤 Exporta
`GET`, `POST`, `dynamic`

## 🧠 Funções/Componentes definidos
`GET`, `POST`, `asString`, `limitText`, `parseLines`, `slugify`

## 📞 O que cada função chama
- `GET()` → find, json, updatePlatformData
- `POST()` → String, asString, find, getFullYear, includes, isArray, json, limitText, map, now, parseLines, push, slice, slugify, split, toISOString, toString, trim, updatePlatformData
- `asString()` → trim
- `limitText()` → slice, trim
- `parseLines()` → asString, filter, map, split, trim
- `slugify()` → normalize, replace, slice, toLowerCase

## 🔁 Chama (arquivos)
- [[platform-data.ts]] — `src/lib/platform-data.ts`

