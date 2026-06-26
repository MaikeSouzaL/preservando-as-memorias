---
origem: src/app/api/admin/bank-data/route.ts
origem_hash: 15939f92693c3808004a66694a69e73c55e3f02f
gerado_em: 2026-06-25T23:37:29
---

# `src/app/api/admin/bank-data/route.ts`

```markdown
## `src/app/api/admin/bank-data/route.ts`

**Responsabilidade:** API para administradores gerenciarem dados bancários (GET/PATCH).

**Funções:**
- **`GET`**: Retorna dados bancários descriptografados (`AdminBankData`) ou `null` se não existirem. Requer sessão de admin.
- **`PATCH`**: Valida e criptografa dados bancários recebidos, salvando-os via `updatePlatformData`. Requer sessão de admin.

**Parâmetros (PATCH):** `holderName`, `bankName`, `agency`, `account`, `accountType`, `cpfCnpj` (obrigatórios); `pixKey` (opcional).

**Dependências:** `requireAdminSession` (auth), `readPlatformData`/`updatePlatformData` (persistência), `encrypt`/`decrypt` (criptografia).
```

<!-- aurora:relacoes -->

## 🔗 Importa
- [[api-auth.ts]] — `src/lib/api-auth.ts`
- [[encrypt.ts]] — `src/lib/encrypt.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- **Externos/APIs:** next/server

## 📤 Exporta
`GET`, `PATCH`, `dynamic`

## 🧠 Funções/Componentes definidos
`GET`, `PATCH`

## 📞 O que cada função chama
- `GET()` → decrypt, json, parse, readPlatformData, requireAdminSession
- `PATCH()` → String, encrypt, json, requireAdminSession, stringify, trim, updatePlatformData

## 🔁 Chama (arquivos)
- [[api-auth.ts]] — `src/lib/api-auth.ts`
- [[encrypt.ts]] — `src/lib/encrypt.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`

