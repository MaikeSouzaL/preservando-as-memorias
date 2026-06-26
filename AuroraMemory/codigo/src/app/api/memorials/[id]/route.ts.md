---
origem: src/app/api/memorials/[id]/route.ts
origem_hash: d3d00e5d8eeabdb3227cef247584aa054bb3912b
gerado_em: 2026-06-25T23:37:29
---

# `src/app/api/memorials/[id]/route.ts`

## API Route: `/api/memorials/[id]`

**Responsabilidade:** Gerencia operações CRUD em um memorial específico.

### Funções exportadas

- **`GET`** — Retorna memorial, QR code associado e anos formatados. Verifica autenticação para memoriais inativos (404 se não autorizado).
- **`PATCH`** — Atualiza memorial (nome, biografia, datas, galeria, timeline). Requer autenticação e ownership ou admin.

### Funções auxiliares internas

- **`canManageMemorial`** — Verifica se sessão é admin ou owner do memorial.
- **`buildYears`** — Formata anos de nascimento/falecimento.
- **`parseLines`** / **`asString`** — Parsing de campos textuais.

### Parâmetros

- **`id`** (URL param) — ID do memorial alvo.

### APIs consumidas

- **`readPlatformData`** / **`updatePlatformData`** — Leitura/escrita atômica dos dados da plataforma.
- **`getAuthSession`** — Sessão de autenticação do usuário.

### Conexões

- **`src/lib/platform-data.ts`** — Fonte de dados principal.
- **`src/lib/auth-session.ts`** — Controle de acesso.

<!-- aurora:relacoes -->

## 🔗 Importa
- [[auth-session.ts]] — `src/lib/auth-session.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- **Externos/APIs:** next/server

## 📤 Exporta
`GET`, `PATCH`, `dynamic`

## 🧩 Componentes usados
ReturnType

## 🧠 Funções/Componentes definidos
`GET`, `PATCH`, `asString`, `buildYears`, `canManageMemorial`, `parseLines`

## 📞 O que cada função chama
- `GET()` → buildYears, canManageMemorial, find, getAuthSession, json, readPlatformData
- `PATCH()` → String, asString, buildYears, canManageMemorial, find, findIndex, getAuthSession, getFullYear, includes, isArray, json, map, now, parseLines, slice, split, toISOString, toString, trim, unshift, updatePlatformData
- `asString()` → trim
- `buildYears()` → getFullYear
- `canManageMemorial()` → Boolean
- `parseLines()` → asString, filter, map, split, trim

## 🔁 Chama (arquivos)
- [[auth-session.ts]] — `src/lib/auth-session.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`

