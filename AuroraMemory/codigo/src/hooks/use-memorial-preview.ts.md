---
origem: src/hooks/use-memorial-preview.ts
origem_hash: f41eb3c36bbced07fc3dafc6c2b897ea561df069
gerado_em: 2026-06-26T00:33:19
---

# `src/hooks/use-memorial-preview.ts`

## `use-memorial-preview.ts`

**Responsabilidade:** Conjunto de hooks React para gerenciar estado e lógica de pré-visualização de memoriais.

### Hooks Exportados

- **`useMemorialPreview(isOpen, data)`** — Gerencia transição de carregamento (2.5s), controle de áudio com progresso simulado, e bloqueio de scroll do body. Retorna `{ showMemorial, isPlayingAudio, audioProgress, toggleAudio }`.

- **`useMemorialYears(birthDate?, deathDate?)`** — Extrai anos de strings de data e retorna formato `"AAAA - AAAA"`.

- **`useMemorialContent(data)`** — Filtra timeline/gallery válidos e divide biografia em parágrafos (com fallback). Retorna `{ validTimeline, validGallery, biographyParagraphs }`.

- **`useMemorialInteractions()`** — Estado mockado de interações (corações, flores, velas, tributos) com handlers vazios. Retorna dados e setters.

### Interfaces

- `MemorialPreviewData`: `{ name?, nickname?, birthDate?, deathDate?, city?, epitaph?, biography?, imageUrl?, audioUrl?, videoUrl?, timelineEvents?, gallery? }`
- `TimelineEvent`: `{ year?, title?, description?, imageUrl? }`
- `GalleryItem`: `{ url?, title? }`

### Dependências

- **React** (`useState`, `useEffect`, `useMemo`)

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** react

## 📤 Exporta
`MemorialPreviewData`, `useMemorialContent`, `useMemorialInteractions`, `useMemorialPreview`, `useMemorialYears`

## 🪝 Hooks / efeitos
useEffect, useMemo, useMemorialContent, useMemorialInteractions, useMemorialPreview, useMemorialYears, useState

## 🧠 Funções/Componentes definidos
`getYear`, `handleLeaveTribute`, `handleLightCandle`, `handleSendFlower`, `handleTouchHeart`, `toggleAudio`, `useMemorialContent`, `useMemorialInteractions`, `useMemorialPreview`, `useMemorialYears`

## 📞 O que cada função chama
- `getYear()` → getFullYear, getTime, isNaN, match, toString
- `handleLeaveTribute()` → preventDefault
- `toggleAudio()` → setIsPlayingAudio
- `useMemorialContent()` → filter, split, trim, useMemo
- `useMemorialInteractions()` → useState
- `useMemorialPreview()` → clearInterval, clearTimeout, setAudioProgress, setInterval, setIsPlayingAudio, setShowMemorial, setTimeout, useEffect, useState
- `useMemorialYears()` → getYear, useMemo

