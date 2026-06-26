---
origem: src/app/(public)/oferta/[slug]/page.tsx
origem_hash: f6057fb4430ba40720dd150e0bbe3d2e3df5ae91
gerado_em: 2026-06-26T00:33:20
---

# `src/app/(public)/oferta/[slug]/page.tsx`

## `src/app/(public)/oferta/[slug]/page.tsx`

**Responsabilidade:** Página pública de oferta de funerária parceira para criação de memorial digital.

**Componente principal:** `OfertaPage` (default export)

**Funcionalidades:**
- Carrega dados da oferta via `GET /api/offer-links/[slug]`
- Exibe formulário `MemorialForm` para preenchimento dos dados do falecido
- Envia dados via `POST /api/offer-links/[slug]` para criar memorial
- Após criação, exibe tela de sucesso com link de pagamento e opção de copiar

**Estados:** `isLoading` (carregamento), `error` (erro), `createdMemorial` + `paymentLink` (sucesso), formulário (padrão)

**Integrações:**
- `MemorialForm` → recebe `onSubmit` e `submitLabel`
- `FuneralHomeOfferLink` → tipo do objeto de oferta
- `useParams` → captura `slug` da URL
- `useRouter` → navegação para `/checkout`

<!-- aurora:relacoes -->

## 🔗 Importa
- [[memorial-form.tsx]] — `src/components/memorial-form.tsx`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- **Externos/APIs:** next/navigation, react

## 📤 Exporta
`OfertaPage`, `default`

## 🧩 Componentes usados
FuneralHomeOfferLink, MemorialForm

## 🪝 Hooks / efeitos
useEffect, useParams, useRouter, useState

## 🧠 Funções/Componentes definidos
`OfertaPage`, `handleCopyPaymentLink`, `handleSubmit`

## 📞 O que cada função chama
- `OfertaPage()` → catch, encodeURIComponent, fetch, finally, json, push, setError, setIsLoading, setOffer, then, useEffect, useParams, useRouter, useState
- `handleCopyPaymentLink()` → alert, writeText
- `handleSubmit()` → encodeURIComponent, fetch, json, setCreatedMemorial, setPaymentLink, stringify

