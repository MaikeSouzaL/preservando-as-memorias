---
origem: src/app/api/funeral-auth/bank-data/route.ts
origem_hash: 773d27eac99bcd038279122802ce53051f8fbffd
gerado_em: 2026-06-25T23:37:29
---

# `src/app/api/funeral-auth/bank-data/route.ts`

## API de Dados Bancários da Funerária

**Responsabilidade:** Endpoints para leitura e atualização dos dados bancários da funerária autenticada.

### Endpoints

- **`GET /api/funeral-auth/bank-data`** — Retorna chave PIX, titular, CPF/CNPJ e comissão administrativa da funerária logada. Requer sessão válida.
- **`PATCH /api/funeral-auth/bank-data`** — Atualiza chave PIX, titular e CPF/CNPJ. Recebe `bankPixKey`, `bankHolderName`, `bankCpfCnpj` no body (strings opcionais, trimadas).

### Fluxo

1. Ambos endpoints validam sessão via `getFuneralSession()`.
2. `GET` busca dados da funerária em `readPlatformData()`.
3. `PATCH` persiste alterações com `updateFuneralHomeBankData()`.

### Dependências

- `src/lib/funeral-auth` — autenticação da sessão.
- `src/lib/platform-data` — leitura/escrita dos dados da plataforma.

<!-- aurora:relacoes -->

## 🔗 Importa
- [[funeral-auth.ts]] — `src/lib/funeral-auth.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- **Externos/APIs:** next/server

## 📤 Exporta
`GET`, `PATCH`, `dynamic`

## 🧠 Funções/Componentes definidos
`GET`, `PATCH`

## 📞 O que cada função chama
- `GET()` → find, getFuneralSession, json, readPlatformData
- `PATCH()` → getFuneralSession, json, trim, updateFuneralHomeBankData

## 🔁 Chama (arquivos)
- [[funeral-auth.ts]] — `src/lib/funeral-auth.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`

