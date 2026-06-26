---
origem: src/app/api/memorials/[id]/interactions/route.ts
origem_hash: 6d1846b89db5dd33cf1bf34961605bc30c1b6cbd
gerado_em: 2026-06-26T00:33:19
---

# `src/app/api/memorials/[id]/interactions/route.ts`

## API de Interações de Memorial

**Responsabilidade:** Gerencia interações (homenagens, velas, flores, corações) de um memorial específico.

### Endpoints

- **`GET /api/memorials/[id]/interactions`** — Retorna todas as interações de um memorial ativo (tributes aprovadas, candles, flowers, hearts)
- **`POST /api/memorials/[id]/interactions`** — Cria nova interação baseada no `type` do body:
  - `tribute`: homenagem com `author` (80 chars) e `message` (800 chars)
  - `candle`: vela comum (eternas redirecionadas para `/api/candle-payment`)
  - `flower`: incrementa contador de flores
  - `heart`: incrementa contador de corações

### Dependências

- **`src/lib/platform-data.ts`** — Leitura e escrita dos dados da plataforma
- **`next/server`** — `NextResponse` para respostas HTTP

### Tratamento de Erros

- 404: Memorial não encontrado ou inativo
- 400: Dados inválidos ou tipo de interação desconhecido
- 500: Erro interno ao carregar interações

<!-- aurora:relacoes -->

## 🔗 Importa
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- **Externos/APIs:** next/server

## 📤 Exporta
`GET`, `POST`, `dynamic`

## 🧠 Funções/Componentes definidos
`GET`, `POST`, `asString`, `limitText`

## 📞 O que cada função chama
- `GET()` → filter, find, json, readPlatformData
- `POST()` → Boolean, asString, find, json, limitText, now, some, toISOString, toString, unshift, updatePlatformData
- `asString()` → trim
- `limitText()` → slice, trim

## 🔁 Chama (arquivos)
- [[platform-data.ts]] — `src/lib/platform-data.ts`

