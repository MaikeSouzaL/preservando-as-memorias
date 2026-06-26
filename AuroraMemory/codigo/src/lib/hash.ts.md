---
origem: src/lib/hash.ts
origem_hash: 1c2cb05b609be00af6537b54e8de3dc0fafff8bc
gerado_em: 2026-06-26T00:33:19
---

# `src/lib/hash.ts`

## `src/lib/hash.ts`

**Responsabilidade:** Utilitário de hashing de senhas usando SHA-256.

**Funções:**
- `hashPassword(password: string): string` — Gera hash SHA-256 hex da senha
- `verifyPassword(password: string, hash: string): boolean` — Compara senha com hash existente

**Dependências:** `node:crypto` (módulo nativo Node.js)

**Conexões:** Exportado para uso em autenticação/login.

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** node:crypto

## 📤 Exporta
`hashPassword`, `verifyPassword`

## 🧠 Funções/Componentes definidos
`hashPassword`, `verifyPassword`

## 📞 O que cada função chama
- `hashPassword()` → createHash, digest, update
- `verifyPassword()` → hashPassword

