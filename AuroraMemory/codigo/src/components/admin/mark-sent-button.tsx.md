---
origem: src/components/admin/mark-sent-button.tsx
origem_hash: 34da40e9d7f58f68d8e12dfbf34e1c72163eb4d0
gerado_em: 2026-06-25T23:37:29
---

# `src/components/admin/mark-sent-button.tsx`

## MarkSentButton

Componente cliente que permite marcar um memorial como "enviado" no painel administrativo.

**Responsabilidade:** Acionar o endpoint de atualização de status de entrega e refletir visualmente a mudança.

**Props:**
- `memorialId: string` — ID do memorial a ser marcado

**Funcionamento:**
- Ao clicar, faz `PATCH` para `/api/admin/memorial/{memorialId}/delivery`
- Em caso de sucesso: exibe badge "Enviado" (verde) e chama `router.refresh()` para recarregar dados do servidor
- Estados: `loading` (desabilita botão), `done` (substitui botão por badge)

**Importado por:** `admin/dashboard/page.tsx`

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** next/navigation, react

## ⬅️ Importado por
- [[page.tsx]] — `src/app/(admin)/admin/dashboard/page.tsx`

## 📤 Exporta
`MarkSentButton`

## 🪝 Hooks / efeitos
useRouter, useState

## 📥 Props recebidas
memorialId

## 🧠 Funções/Componentes definidos
`MarkSentButton`, `handleClick`

## 📞 O que cada função chama
- `MarkSentButton()` → useRouter, useState
- `handleClick()` → fetch, refresh, setDone, setLoading

