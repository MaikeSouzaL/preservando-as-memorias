---
origem: src/app/(public)/memorial/page.tsx
origem_hash: b27090971a8772fd34cad90dca60d31d16603881
gerado_em: 2026-06-26T00:33:20
---

# `src/app/(public)/memorial/page.tsx`

# `src/app/(public)/memorial/page.tsx`

## Responsabilidade Principal
Página pública de memorial interativo com transição cinematográfica, exibindo homenagem a falecido com biografia, linha do tempo, galeria, áudio, velas, flores, tributos e corações.

## Componentes e Funcionalidades Chave

- **`TransicaoQrPage`** (default export): Componente principal que gerencia:
  - **Tela de carregamento** com animação de 10s e glow dourado
  - **Seções**: Hero (foto, nome, apelido, cidade), Biografia, Mensagem de Voz, Linha do Tempo, Galeria, Santuário de Tributos
  - **Interações**: Acender vela, enviar flor, tocar coração, deixar homenagem, compartilhar
  - **Modal de sucesso** (`SuccessModal`) para feedback visual

## Estados e Props

- **`memorial`**: Dados do homenageado (nome, anos, epitáfio, imagem, áudio opcional)
- **Modo demo** (`isDemoMode`): Interações locais sem API quando `NEXT_PUBLIC_PAYMENT_GATEWAY !== "stripe"`
- **Controles de áudio**: `Howl` para música de fundo, som de fósforo e batimento cardíaco

## APIs Consumidas

- `GET /api/memorials/:id/interactions` — carrega tributos, velas, flores, corações
- `POST /api/memorials/:id/interactions` — registra novas interações (vela, flor, coração, tributo)

## Ligações

- Importa `database` do mock para dados de demonstração
- Importa `ManagedTribute` de `src/lib/platform-data`
- Importa `SuccessModal` de `src/components/success-modal`
- Link para `/landing` (voltar) e `/` (início)

<!-- aurora:relacoes -->

## 🔗 Importa
- [[success-modal.tsx]] — `src/components/success-modal.tsx`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- **Externos/APIs:** ) === , @/src/mock-db/database, howler, next/link, react

## 📤 Exporta
`TransicaoQrPage`, `default`

## 🧩 Componentes usados
Candle, ExtendedMemorial, GalleryPhoto, HTMLDivElement, Howl, Link, ManagedTribute, SuccessModal, TimelineEvent

## 🪝 Hooks / efeitos
useCallback, useEffect, useRef, useState

## 🧠 Funções/Componentes definidos
`TransicaoQrPage`, `defaultBiography`, `fallbackGallery`, `handleLeaveTribute`, `handleLightCandle`, `handleScroll`, `handleSendFlower`, `handleShare`, `handleSubmitCandle`, `handleTouchHeart`, `scrollCarousel`

## 📞 O que cada função chama
- `TransicaoQrPage()` → abs, addEventListener, alert, ceil, clearInterval, clearTimeout, defaultBiography, encodeURIComponent, error, fallbackGallery, fetch, filter, find, floor, from, get, getTime, handleLeaveTribute, handleSubmitCandle, isArray, json, loadInteractions, map, max, min, once, open, pause, play, playing, preventDefault, querySelector, removeEventListener, revealMemorial, scrollCarousel, scrollIntoView, setActiveCandleId, setActivePhoto, setAudioProgress, setBiographyParagraphs, setCandlesList, setFlowersCount, setGalleryList, setHeartsCount, setInterval, setIsBgMuted, setIsCandleAnonymous, setIsCandleEternal, setIsPlayingAudio, setIsTributePinned, setMemorial, setNewAuthor, setNewCandleName, setNewMessage, setPixActionType, setSelectedEvent, setSelectedTag, setShowBackButton, setShowCandleModal, setShowMemorial, setShowPixModal, setShowShareModal, setShowTributeModal, setSuccessModal, setTimelineList, setTimeout, setTributesList, sin, slice, sort, toLocaleDateString, unload, useCallback, useEffect, useRef, useState, writeText
- `handleLeaveTribute()` → encodeURIComponent, fetch, json, now, play, preventDefault, setIsTributePinned, setNewAuthor, setNewMessage, setShowTributeModal, setSuccessModal, setTimeout, setTributesList, stringify, toISOString
- `handleLightCandle()` → setShowCandleModal
- `handleScroll()` → max, setScrollOpacity
- `handleSendFlower()` → encodeURIComponent, fetch, getElementById, scrollIntoView, setFlowersCount, setSuccessModal, setTimeout, stringify
- `handleShare()` → setShowShareModal
- `handleSubmitCandle()` → encodeURIComponent, fetch, getElementById, json, now, play, preventDefault, scrollIntoView, setCandlesList, setIsCandleAnonymous, setIsCandleEternal, setNewCandleName, setShowCandleModal, setSuccessModal, setTimeout, stringify, toISOString
- `handleTouchHeart()` → encodeURIComponent, fetch, play, setHeartsCount, stringify
- `scrollCarousel()` → scrollBy

