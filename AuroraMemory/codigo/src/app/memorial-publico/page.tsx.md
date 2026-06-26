---
origem: src/app/memorial-publico/page.tsx
origem_hash: f93a2c2b31eba09884b98f9d483e4195c4e5f2b7
gerado_em: 2026-06-25T23:37:29
---

# `src/app/memorial-publico/page.tsx`

# Página Pública de Memorial

**Responsabilidade:** Renderiza o memorial público interativo de um ente querido, acessado via QR Code ou link.

## Funcionalidades Principais

- **Carregamento do Memorial:** Busca dados via `/api/memorials/[id]` e interações via `/api/memorials/[id]/interactions`
- **Interações do Visitante:** Acender velas (gratuitas ou eternas via Stripe), enviar flores, tocar coração, deixar homenagens com doação opcional
- **Áudio Ambiente:** Reproduz música de fundo ou áudio personalizado do memorial via Howler.js
- **Seções:** Hero com foto/biografia, mensagem de voz, linha do tempo, galeria de fotos com carrossel, santuário de homenagens

## Props/Parâmetros

- **URL:** `?memorial=[id]` ou `?id=[id]` — ID do memorial a ser exibido
- **Ambiente:** `NEXT_PUBLIC_PAYMENT_GATEWAY` — se não for "stripe", opera em modo demo (interações locais)

## Estados Gerenciados

- `memorial`, `candlesList`, `tributesList`, `heartsCount`, `flowersCount`
- Modais: vela, homenagem, PIX, compartilhar, sucesso
- Áudio: `isBgMuted`, `audioProgress`

## Integrações

- **API:** endpoints de memorial, interações, visita, pagamento de vela eterna e doação de homenagem
- **Stripe:** fluxo de checkout para velas eternas e doações
- **Componentes:** `SuccessModal` para feedback visual

<!-- aurora:relacoes -->

## 🔗 Importa
- [[success-modal.tsx]] — `src/components/success-modal.tsx`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- [[database.ts]] — `src/mock-db/database.ts`
- **Externos/APIs:** ) === , howler, next/link, react

## 📤 Exporta
`MemorialPublicoPage`, `default`

## 🧩 Componentes usados
Candle, ExtendedMemorial, GalleryPhoto, HTMLDivElement, Howl, Link, ManagedTribute, SuccessModal, TimelineEvent

## 🪝 Hooks / efeitos
useCallback, useEffect, useRef, useState

## 🧠 Funções/Componentes definidos
`MemorialPublicoPage`, `defaultBiography`, `fallbackGallery`, `handleLeaveTribute`, `handleLightCandle`, `handleScroll`, `handleSendFlower`, `handleShare`, `handleStartEternalCandlePayment`, `handleSubmitFreeCandle`, `handleTouchHeart`, `scrollCarousel`

## 📞 O que cada função chama
- `MemorialPublicoPage()` → abs, addEventListener, alert, catch, ceil, clearInterval, clearTimeout, defaultBiography, encodeURIComponent, error, fallbackGallery, fetch, filter, floor, from, get, getElementById, getFullYear, getItem, getTime, handleLeaveTribute, handleStartEternalCandlePayment, handleSubmitFreeCandle, isArray, join, json, loadInteractions, map, max, min, once, open, pause, play, playing, preventDefault, querySelector, registerVisit, removeEventListener, replace, replaceState, revealMemorial, scrollCarousel, scrollIntoView, setActiveCandleId, setActivePhoto, setAudioProgress, setBiographyParagraphs, setCandlesList, setGalleryList, setHasError, setHeartsCount, setInterval, setIsBgMuted, setIsCandleAnonymous, setIsCandleEternal, setIsTributePinned, setItem, setMemorial, setNewAuthor, setNewCandleName, setNewMessage, setSelectedEvent, setSelectedTag, setShowBackButton, setShowCandleModal, setShowMemorial, setShowPixModal, setShowShareModal, setShowTributeDonationModal, setShowTributeModal, setSuccessModal, setTimelineList, setTimeout, setTributeDonationCents, setTributesList, sin, slice, sort, split, stringify, then, toFixed, toLocaleDateString, trim, unload, useCallback, useEffect, useRef, useState, writeText
- `handleLeaveTribute()` → encodeURIComponent, fetch, json, max, now, play, preventDefault, setIsTributePinned, setNewAuthor, setNewMessage, setShowTributeDonationModal, setShowTributeModal, setSuccessModal, setTimeout, setTributeDonationCents, setTributePaymentError, setTributePaymentLoading, setTributesList, stringify, toISOString
- `handleLightCandle()` → setCandlePaymentError, setShowCandleModal
- `handleScroll()` → max, setScrollOpacity
- `handleSendFlower()` → getElementById, scrollIntoView, setFlowersCount, setSuccessModal, setTimeout
- `handleShare()` → setShowShareModal
- `handleStartEternalCandlePayment()` → fetch, getElementById, json, now, play, scrollIntoView, setCandlePaymentError, setCandlePaymentLoading, setCandlesList, setIsCandleAnonymous, setIsCandleEternal, setNewCandleName, setShowCandleModal, setShowPixModal, setSuccessModal, setTimeout, stringify, toISOString
- `handleSubmitFreeCandle()` → encodeURIComponent, fetch, getElementById, json, now, play, preventDefault, scrollIntoView, setCandlesList, setIsCandleAnonymous, setNewCandleName, setShowCandleModal, setSuccessModal, setTimeout, stringify, toISOString
- `handleTouchHeart()` → play, setHeartsCount
- `scrollCarousel()` → scrollBy

