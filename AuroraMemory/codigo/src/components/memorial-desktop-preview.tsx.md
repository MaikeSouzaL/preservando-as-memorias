---
origem: src/components/memorial-desktop-preview.tsx
origem_hash: 4207214633ad113c3b43c56c704d4439a84a3984
gerado_em: 2026-06-26T00:33:19
---

# `src/components/memorial-desktop-preview.tsx`

# `memorial-desktop-preview.tsx`

## Responsabilidade
Componente de visualização em tela cheia do memorial, simulando o layout final do altar virtual com todas as seções.

## Props
- **`isOpen`**: controla visibilidade do preview
- **`onClose`**: callback para fechar preview
- **`data`**: objeto `MemorialPreviewData` com dados do homenageado (nome, datas, biografia, timeline, galeria, mídia)

## Funcionalidades Chave
1. **Transição de carregamento**: animação de 2.5s com barra de progresso antes de exibir o memorial
2. **Seções renderizadas**: hero, mensagem de voz, biografia, linha do tempo (polaroids), vídeo, galeria, livro de visitas, altar de velas
3. **Estado local**: controle de áudio, tributos, velas, corações e flores (simulados)
4. **Modais**: formulário de homenagem dentro do preview

## Integração
Importado por `memorial-form.tsx` para exibir preview em tempo real durante a edição do memorial.

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** react

## ⬅️ Importado por
- [[memorial-form.tsx]] — `src/components/memorial-form.tsx`

## 📤 Exporta
`MemorialDesktopPreview`, `default`

## 🪝 Hooks / efeitos
useEffect, useMemo, useState

## 📥 Props recebidas
data, isOpen, onClose

## 🧠 Funções/Componentes definidos
`MemorialDesktopPreview`, `getYear`, `handleLeaveTribute`, `handleLightCandle`, `handleSendFlower`, `handleTouchHeart`

## 📞 O que cada função chama
- `MemorialDesktopPreview()` → alert, clearInterval, clearTimeout, filter, from, getYear, map, max, setAudioProgress, setInterval, setIsPlayingAudio, setNewAuthor, setNewMessage, setShowMemorial, setShowTributeModal, setTimeout, sin, split, trim, useEffect, useMemo, useState
- `getYear()` → getFullYear, getTime, isNaN, match, toString
- `handleLeaveTribute()` → preventDefault

