---
origem: src/mock-db/public-content.ts
origem_hash: 305a61dcbe56ab04e8c1323e6e639ef577ca3d3f
gerado_em: 2026-06-25T23:37:23
---

# `src/mock-db/public-content.ts`

# `src/mock-db/public-content.ts`

**Responsabilidade:** Define e exporta o tipo `PublicContent` e o objeto `publicContent` com dados mockados de conteúdo público do site (landing, planos, FAQ, contato, etc.).

**Tipos exportados:**
- `PublicContent` — estrutura completa do conteúdo público, incluindo `brand`, `landing`, `plansPreview`, `about`, `plans`, `contact` e `faq`
- Tipos auxiliares: `PublicSocialProof`, `PublicLanding`, `PublicPlanPreview`, `PublicAbout`, `PublicPlan`, `PublicContactChannel`, `PublicFaq`

**Objeto exportado:**
- `publicContent` — instância tipada de `PublicContent`, carregada do JSON em `./data/public-content.json`

**Relações:**
- Importa dados de `src/mock-db/data/public-content.json`
- Exportado para páginas públicas (`/contato`, `/faq`, `/sobre`, `/splash`) e reexportado via `src/mock-db/public-index.ts`

<!-- aurora:relacoes -->

## 🔗 Importa
- [[public-content.json]] — `src/mock-db/data/public-content.json`

## ⬅️ Importado por
- [[page.tsx]] — `src/app/(public)/contato/page.tsx`
- [[page.tsx]] — `src/app/(public)/faq/page.tsx`
- [[page.tsx]] — `src/app/(public)/sobre/page.tsx`
- [[page.tsx]] — `src/app/(public)/splash/page.tsx`
- [[public-index.ts]] — `src/mock-db/public-index.ts`

## 📤 Exporta
`PublicContent`, `publicContent`

## 📲 Chamado por
- [[page.tsx]] — `src/app/(public)/contato/page.tsx`
- [[page.tsx]] — `src/app/(public)/faq/page.tsx`
- [[page.tsx]] — `src/app/(public)/sobre/page.tsx`

