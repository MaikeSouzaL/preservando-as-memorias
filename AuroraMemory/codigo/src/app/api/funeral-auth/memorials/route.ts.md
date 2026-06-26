---
origem: src/app/api/funeral-auth/memorials/route.ts
origem_hash: 06eb0abde3712cae3c633ceb86c2c2b7db76bce5
gerado_em: 2026-06-25T23:37:29
---

# `src/app/api/funeral-auth/memorials/route.ts`

# API de Criação de Memorial (Funerária)

**Responsabilidade:** Endpoint `POST /api/funeral-auth/memorials` para funerárias autenticadas criarem memoriais.

## Funcionalidades

- **Autenticação:** Verifica sessão da funerária via `getFuneralSession()`
- **Validação:** Campos obrigatórios (nome, epitáfio, biografia) com limites de caracteres
- **Galeria:** Aceita array de objetos ou texto com linhas `título|url` (máx. 12 itens)
- **Timeline:** Aceita array de eventos ou campos únicos para criar evento único
- **Persistência:** Usa `updatePlatformData()` para adicionar memorial ao array `data.memorials`

## Estrutura do Memorial Criado

- Status inicial: `pending_payment` com `paymentStatus: "pending"`
- Vinculado à funerária autenticada via `funeralHomeId`
- Gera IDs únicos para memorial, galeria e eventos

## Respostas

- **201:** Memorial criado com sucesso
- **400:** Erro de validação ou funerária inativa
- **401:** Não autenticado

<!-- aurora:relacoes -->

## 🔗 Importa
- [[funeral-auth.ts]] — `src/lib/funeral-auth.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- **Externos/APIs:** next/server

## 📤 Exporta
`POST`, `dynamic`

## 🧠 Funções/Componentes definidos
`POST`, `asString`, `limitText`, `parseLines`

## 📞 O que cada função chama
- `POST()` → String, asString, find, getFullYear, getFuneralSession, includes, isArray, json, limitText, map, now, parseLines, push, replace, slice, split, toISOString, toLowerCase, toString, trim, updatePlatformData
- `asString()` → trim
- `limitText()` → slice, trim
- `parseLines()` → asString, filter, map, split, trim

## 🔁 Chama (arquivos)
- [[funeral-auth.ts]] — `src/lib/funeral-auth.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`

