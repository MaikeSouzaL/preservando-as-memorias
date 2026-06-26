---
origem: src/components/success-modal.tsx
origem_hash: 5fa95db4c640c4e8cdbd4f940aebd811598eb423
gerado_em: 2026-06-25T23:37:25
---

# `src/components/success-modal.tsx`

# SuccessModal

**Responsabilidade:** Modal de confirmação visual para ações realizadas em um memorial (homenagem, vela ou flor).

## Funcionalidade
- Exibe modal condicional baseado em `isOpen` e `type`
- Renderiza conteúdo dinâmico conforme o tipo (`tribute`, `candle`, `flower`)
- Cada tipo possui: ícone, título e mensagem personalizada com nome do memorial
- Fundo escuro com blur e clique externo fecha o modal
- Botão "Entendido" dispara `onClose`

## Props
- `isOpen: boolean` — controla visibilidade
- `type: "tribute" | "candle" | "flower" | null` — define conteúdo exibido
- `memorialName: string` — nome do memorial (inserido na mensagem)
- `onClose: () => void` — callback para fechar modal

## Integração
- Importado por páginas de memorial (`/memorial/page.tsx`, `/memorial-publico/page.tsx`)
- Utiliza classes Tailwind com tema dourado (`#e9c349`) e ícones Material Symbols

<!-- aurora:relacoes -->

## ⬅️ Importado por
- [[page.tsx]] — `src/app/(public)/memorial/page.tsx`
- [[page.tsx]] — `src/app/memorial-publico/page.tsx`

## 📤 Exporta
`SuccessModal`, `default`

## 📥 Props recebidas
isOpen, memorialName, onClose, type

## 🧠 Funções/Componentes definidos
`SuccessModal`

