---
origem: src/app/api/admin/funeral-homes/route.ts
origem_hash: 05ea8dfff50834291e24d2110603d9ced08e7fb8
gerado_em: 2026-06-26T00:33:20
---

# `src/app/api/admin/funeral-homes/route.ts`

Este arquivo define uma **rota de API administrativa** (`GET /api/admin/funeral-homes`) que lista todas as funerárias cadastradas na plataforma.

**Responsabilidade principal:** Retornar dados de funerárias e planos funerários para o painel administrativo.

**Função chave:**
- `GET()`: Handler assíncrono que:
  1. Verifica sessão de administrador via `requireAdminSession()`
  2. Lê dados da plataforma com `readPlatformData()`
  3. Mapeia funerárias selecionando campos específicos (id, name, email, contactName, phone, cnpj, city, state, isActive, approvalStatus, adminCommissionPercent, activePlanId, planRenewsAt, memorialCountMonth, createdAt)
  4. Retorna JSON com `{ funeralHomes, funeralPlans }`

**Conexões:** Importa `requireAdminSession` (autenticação) e `readPlatformData` (fonte de dados) de módulos internos.

<!-- aurora:relacoes -->

## 🔗 Importa
- [[api-auth.ts]] — `src/lib/api-auth.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- **Externos/APIs:** next/server

## 📤 Exporta
`GET`, `dynamic`

## 🧠 Funções/Componentes definidos
`GET`

## 📞 O que cada função chama
- `GET()` → json, map, readPlatformData, requireAdminSession

## 🔁 Chama (arquivos)
- [[api-auth.ts]] — `src/lib/api-auth.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`

