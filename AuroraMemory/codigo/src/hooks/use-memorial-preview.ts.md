---
origem: src/hooks/use-memorial-preview.ts
origem_hash: f41eb3c36bbced07fc3dafc6c2b897ea561df069
gerado_em: 2026-06-29T18:00:49
---

# `src/hooks/use-memorial-preview.ts`

## `src/hooks/use-memorial-preview.ts`

**Responsabilidade:** Hooks React para gerenciar o estado e a lógica de pré‑visualização de um memorial interativo (transição de abertura, áudio, scroll bloqueado, extração de anos, filtragem de conteúdo e interações simuladas).

### Interfaces/Types
- `MemorialPreviewData` – dados do memorial (name, birthDate, deathDate, biography, etc.)
- `TimelineEvent` (year?, title?, description?, imageUrl?)
- `GalleryItem` (url?, title?)

### Funções Exportadas
| Função | Parâmetros | Retorno | O que chama |
|--------|------------|---------|-------------|
| `useMemorialPreview

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

