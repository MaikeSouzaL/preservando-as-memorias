---
origem: src/lib/encrypt.ts
origem_hash: 2e8a95d8c31a26e7c23257fa56354d8dcf0c6a02
gerado_em: 2026-06-25T23:37:23
---

# `src/lib/encrypt.ts`

# `src/lib/encrypt.ts` — Criptografia AES-256-GCM para dados bancários

**Responsabilidade:** Prover funções de criptografia/descriptografia simétrica para proteger dados bancários sensíveis.

**Funções chave:**
- `encrypt(plaintext: string): string` — Criptografa texto com AES-256-GCM, retornando string concatenada: `iv(24 hex) + tag(32 hex) + ciphertext(hex)`
- `decrypt(encoded: string): string` — Descriptografa a string codificada, extraindo IV, tag e ciphertext

**Parâmetros importantes:**
- Chave de 32 bytes (64 hex) via env var `BANK_DATA_ENCRYPTION_KEY`
- IV aleatório de 12 bytes; tag de autenticação de 16 bytes

**Conexões:** Importado por `src/app/(dev)/dev/page.tsx` (interface dev) e `src/app/api/admin/bank-data/route.ts` (API admin)

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** crypto, node:crypto

## ⬅️ Importado por
- [[page.tsx]] — `src/app/(dev)/dev/page.tsx`
- [[route.ts]] — `src/app/api/admin/bank-data/route.ts`

## 📤 Exporta
`decrypt`, `encrypt`

## 🧠 Funções/Componentes definidos
`decrypt`, `encrypt`, `getKey`

## 📞 O que cada função chama
- `decrypt()` → createDecipheriv, final, from, getKey, setAuthTag, slice, update
- `encrypt()` → concat, createCipheriv, final, getAuthTag, getKey, randomBytes, toString, update
- `getKey()` → from

## 📲 Chamado por
- [[page.tsx]] — `src/app/(dev)/dev/page.tsx`
- [[route.ts]] — `src/app/api/admin/bank-data/route.ts`

