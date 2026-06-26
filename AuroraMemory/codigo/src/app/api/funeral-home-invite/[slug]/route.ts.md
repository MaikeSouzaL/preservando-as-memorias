---
origem: src/app/api/funeral-home-invite/[slug]/route.ts
origem_hash: b8e7f878ccf1e23207f8b7121acd4bdc021405a3
gerado_em: 2026-06-25T23:37:29
---

# `src/app/api/funeral-home-invite/[slug]/route.ts`

## `GET /api/funeral-home-invite/[slug]`

**Responsabilidade:** Endpoint público que retorna dados de um convite de funerária ativo.

**Função principal:**
- `GET()`: Busca convite por `slug` nos dados da plataforma (`readPlatformData`)

**Fluxo:**
1. Extrai `slug` dos parâmetros da rota
2. Lê dados da plataforma via `readPlatformData()`
3. Procura convite com `slug` correspondente em `data.config.funeralHomeInvites`
4. Valida existência (404) e status ativo (410)
5. Se `activePlanId` existe, busca plano correspondente em `data.config.funeralPlans`
6. Retorna JSON com dados do convite (id, slug, label, comissão, plano, status)

**Respostas:**
- `200`: Dados do convite
- `404`: Convite não encontrado
- `410`: Convite expirado/indisponível

**Dependências:** `src/lib/platform-data.ts` (leitura de dados da plataforma)

<!-- aurora:relacoes -->

## 🔗 Importa
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- **Externos/APIs:** next/server

## 📤 Exporta
`GET`, `dynamic`

## 🧠 Funções/Componentes definidos
`GET`

## 📞 O que cada função chama
- `GET()` → find, json, readPlatformData

## 🔁 Chama (arquivos)
- [[platform-data.ts]] — `src/lib/platform-data.ts`

