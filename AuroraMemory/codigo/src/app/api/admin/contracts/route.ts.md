---
origem: src/app/api/admin/contracts/route.ts
origem_hash: ce50e95e9a3acffbc5a99ead4623ff682a8fc972
gerado_em: 2026-06-25T23:37:29
---

# `src/app/api/admin/contracts/route.ts`

```markdown
## `src/app/api/admin/contracts/route.ts`

**Responsabilidade:** Gerencia contratos de administradores (aceitação e consulta).

**Funções:**
- **`GET`**: Retorna contratos do tipo `dev_to_admin` do admin logado. Indica se já assinou (`hasSigned`) e quando (`signedAt`).
- **`POST`**: Registra aceitação de contrato (`dev_to_admin` ou `admin_to_funeral`). Valida tipo, captura IP, e persiste via `saveContractAcceptance`.

**Parâmetros (POST):** `type`, `signerName`, `funeralHomeId`, `contractVersion`.

**Dependências:** `requireAdminSession` (autenticação), `getContractAcceptances`/`saveContractAcceptance` (persistência).
```

<!-- aurora:relacoes -->

## 🔗 Importa
- [[api-auth.ts]] — `src/lib/api-auth.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- **Externos/APIs:** next/headers, next/server

## 📤 Exporta
`GET`, `POST`, `dynamic`

## 🧠 Funções/Componentes definidos
`GET`, `POST`

## 📞 O que cada função chama
- `GET()` → filter, getContractAcceptances, json, requireAdminSession
- `POST()` → get, headers, json, requireAdminSession, saveContractAcceptance, split, toISOString, trim

## 🔁 Chama (arquivos)
- [[api-auth.ts]] — `src/lib/api-auth.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`

