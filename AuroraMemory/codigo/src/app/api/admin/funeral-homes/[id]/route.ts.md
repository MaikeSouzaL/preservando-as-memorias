---
origem: src/app/api/admin/funeral-homes/[id]/route.ts
origem_hash: eb45f452a89f9f31c98e7f98c8f370aea058d067
gerado_em: 2026-06-26T00:33:20
---

# `src/app/api/admin/funeral-homes/[id]/route.ts`

# Admin Funeral Homes API Route

**Responsabilidade:** Gerencia operações administrativas em funerárias específicas via PATCH.

**Função principal:**
- `PATCH(request, { params })`: Atualiza dados de uma funerária por ID, autenticando como admin.

**Ações suportadas:**
- `approve`/`reject`: Altera `approvalStatus` e `isActive`
- `set_qr_delivery`: Define modo de entrega QR (`inherit`, `admin`, `self`)
- `set_plan`: Atribui/remove plano ativo com `planId` e `planRenewsAt`
- `set_commission`: Define percentual de comissão (0–100)

**Dependências:**
- `requireAdminSession()`: Protege rota (src/lib/api-auth)
- `updatePlatformData()`: Persiste alterações (src/lib/platform-data)

**Retorno:** `{ success: true, funeralHome: { id, name, ... } }` ou erro 400/401.

<!-- aurora:relacoes -->

## 🔗 Importa
- [[api-auth.ts]] — `src/lib/api-auth.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- **Externos/APIs:** next/server

## 📤 Exporta
`PATCH`, `dynamic`

## 🧠 Funções/Componentes definidos
`PATCH`

## 📞 O que cada função chama
- `PATCH()` → Number, String, find, includes, isNaN, json, requireAdminSession, toISOString, updatePlatformData

## 🔁 Chama (arquivos)
- [[api-auth.ts]] — `src/lib/api-auth.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`

