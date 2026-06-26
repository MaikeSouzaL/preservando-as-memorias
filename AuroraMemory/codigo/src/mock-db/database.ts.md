---
origem: src/mock-db/database.ts
origem_hash: d770d8674fd099ae8d23298da2b3fe3b41be8890
gerado_em: 2026-06-25T23:37:23
---

# `src/mock-db/database.ts`

# `src/mock-db/database.ts` — Banco de Dados Mockado

## Responsabilidade
Define e exporta todos os tipos de dados e o objeto `database` que simula o banco de dados da aplicação, carregado a partir de `database.json`.

## Tipos Exportados
- **`Memorial`**: memorial com id, nome, anos, epitáfio, imagem, visitas, tributos, velas, status e data de criação.
- **`Tribute`**: homenagem com id, memorialId, autor, mensagem, status e tag opcional.
- **`Candle`**: vela com id, memorialId, nome, eternidade e data.
- **`QrCodeItem`**: QR code com id, memorialId, label, scans, último scan e status.
- **`FamilyMember`**: membro familiar com id, nome, papel, email e status.
- **`GalleryItem`**: item de galeria (foto/vídeo) com id, memorialId, título, tipo e url.
- **`TimelineEvent`**: evento de linha do tempo com ano, título, descrição, história longa e imagem.
- **`BillingItem`**: item de cobrança com descrição, valor, data e status.
- **`Activity`**: atividade com timestamp, texto e ícone.
- **`Database`**: tipo raiz que agrupa todos os dados (user, stats, memorials, tributes, qrCodes, familyMembers, gallery, subscriptions, settings, activities, candles, timelineEvents).

## Estrutura
- Importa `databaseJson` de `./data/database.json`.
- Exporta a constante `database` tipada como `Database`.

## Conexões
- **Importado por**: páginas de memorial (público e privado) e `src/mock-db/index.ts`.
- **Depende de**: `src/mock-db/data/database.json` para os dados mockados.

<!-- aurora:relacoes -->

## 🔗 Importa
- [[database.json]] — `src/mock-db/data/database.json`

## ⬅️ Importado por
- [[page.tsx]] — `src/app/(public)/memorial/page.tsx`
- [[page.tsx]] — `src/app/memorial-publico/page.tsx`
- [[index.ts]] — `src/mock-db/index.ts`

## 📤 Exporta
`Activity`, `BillingItem`, `Candle`, `Database`, `FamilyMember`, `GalleryItem`, `Memorial`, `QrCodeItem`, `TimelineEvent`, `Tribute`, `database`

## 📲 Chamado por
- [[page.tsx]] — `src/app/(public)/memorial/page.tsx`

