---
origem: src/mock-db/data/database.json
origem_hash: 1e53a0588a5b1f50fed987e83a7f4faecf2177ad
gerado_em: 2026-06-25T23:37:23
---

# `src/mock-db/data/database.json`

# `database.json` — Dados Mockados do Memorial

**Responsabilidade:** Fornecer dados de exemplo completos para desenvolvimento e testes da aplicação de memoriais.

**Estrutura principal:**
- **`user`** — Perfil do usuário logado (Ana Almeida)
- **`stats`** — Métricas agregadas (12 memoriais, 348 tributos, 1204 visitas)
- **`memorials`** — 4 memoriais (default, Helena, Roberto, Lucia) com status, visitas e tributos
- **`tributes`** — 5 homenagens vinculadas a memoriais via `memorialId`
- **`qrCodes`** — 3 QR codes com status (ativo/pausado) e contagem de scans
- **`familyMembers`** — 3 membros com papéis (Administrador, Editor, Leitor)
- **`gallery`** — 3 itens de mídia (foto/video) por memorial
- **`subscriptions`** — Plano atual e histórico de cobranças
- **`settings`** — Preferências de perfil, notificações e privacidade
- **`activities`** — Feed de atividades recentes
- **`candles`** — Velas acesas por memorial (com flag `isEternal`)
- **`timelineEvents`** — Linha do tempo biográfica do memorial "default"

**Consumido por:** `src/mock-db/database.ts` (importa e exporta como dados mockados)

<!-- aurora:relacoes -->

## ⬅️ Importado por
- [[database.ts]] — `src/mock-db/database.ts`

