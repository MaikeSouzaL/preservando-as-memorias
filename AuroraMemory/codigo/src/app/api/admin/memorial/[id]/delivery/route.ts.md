---
origem: src/app/api/admin/memorial/[id]/delivery/route.ts
origem_hash: 6a7ad16da4f4aa4a1fdd536e5bca747e0fca23fc
gerado_em: 2026-06-25T23:37:29
---

# `src/app/api/admin/memorial/[id]/delivery/route.ts`

## `route.ts` — Admin: Controle de Entrega de QR Code

**Responsabilidade:** Endpoints administrativos para marcar/desmarcar o envio físico do QR Code de um memorial.

### Endpoints

- **`PATCH`** — Marca QR Code como enviado: define `qrSentAt` com timestamp atual no memorial especificado.
- **`DELETE`** — Desfaz o envio: remove `qrSentAt` do memorial.

### Parâmetros

- **`id`** (URL param) — ID do memorial a ser atualizado.

### Fluxo

1. `requireAdminSession()` valida sessão de administrador.
2. `updatePlatformData()` aplica mutação atômica nos dados da plataforma.
3. Retorna `{ ok: true }` ou erro 400 com mensagem.

### Dependências

- `src/lib/api-auth` — autenticação admin
- `src/lib/platform-data` — manipulação centralizada dos dados

<!-- aurora:relacoes -->

## 🔗 Importa
- [[api-auth.ts]] — `src/lib/api-auth.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- **Externos/APIs:** next/server

## 📤 Exporta
`DELETE`, `PATCH`, `dynamic`

## 🧠 Funções/Componentes definidos
`DELETE`, `PATCH`

## 📞 O que cada função chama
- `DELETE()` → find, json, requireAdminSession, toISOString, updatePlatformData
- `PATCH()` → find, json, requireAdminSession, toISOString, updatePlatformData

## 🔁 Chama (arquivos)
- [[api-auth.ts]] — `src/lib/api-auth.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`

