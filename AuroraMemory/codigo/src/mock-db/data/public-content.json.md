---
origem: src/mock-db/data/public-content.json
origem_hash: ad2cf88ea38ab6f3740b02f9b33d46292af7841b
gerado_em: 2026-06-25T23:37:23
---

# `src/mock-db/data/public-content.json`

# `src/mock-db/data/public-content.json`

**Responsabilidade:** Dados mockados de conteúdo público do site institucional (landing page, planos, FAQ, contato).

**Estrutura principal:**
- `brand` — Identidade visual (nome e tagline)
- `landing` — Seção hero com headline, subheadline, benefícios e prova social
- `plansPreview` — Cards resumidos dos 3 planos (Essencial, Família, Legado)
- `about` — Missão, história e valores da empresa
- `plans` — Detalhamento completo dos planos com features, preço e CTA
- `contact` — Canais de contato (email, WhatsApp, horário)
- `faq` — Array de perguntas frequentes (question/answer)

**Consumo:** Importado por `src/mock-db/public-content.ts` para servir como dados mockados em desenvolvimento.

<!-- aurora:relacoes -->

## ⬅️ Importado por
- [[public-content.ts]] — `src/mock-db/public-content.ts`

