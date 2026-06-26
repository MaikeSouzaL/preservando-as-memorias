---
origem: src/components/funeral/funeraria-dashboard-client.tsx
origem_hash: e622e0824162b899c18e36ee63caa890d66a0e59
gerado_em: 2026-06-25T23:37:29
---

# `src/components/funeral/funeraria-dashboard-client.tsx`

# FunerariaDashboardClient

## Responsabilidade
Painel administrativo para funerárias gerenciarem memoriais digitais, assinatura e QR codes.

## Componentes

- **`FunerariaDashboardClient`**: Componente principal que exibe:
  - Cabeçalho com dados da funerária e ações (logout, dados PIX)
  - Card do plano de assinatura com cota mensal
  - Estatísticas (total, publicados, pendentes)
  - Lista de memoriais com ações por status (publicar, ver, baixar QR)
  - Modal de QR code

- **`QrModal`**: Portal para visualizar/baixar QR code nos temas escuro e claro

## Props Principais
- `funeralHome`: Dados da funerária (nome, email, contato)
- `memorials`: Lista de memoriais com contagens (tributes, candles)
- `qrMap`: QR codes por memorial (dark/light)
- `activePlan`: Plano de assinatura com limites
- `subscriptionExpired`: Flag de expiração

## APIs Consumidas
- `POST /api/funeral-auth/logout` - Logout
- `POST /api/checkout` - Publicar memorial via plano

## Ligações
- Importa `ManagedMemorial` de `src/lib/platform-data`
- Importado por `src/app/(funeral)/funeraria/dashboard/page.tsx`
- Navega para `/funeraria/dashboard/novo-memorial`, `/checkout`, `/memorial-publico`

<!-- aurora:relacoes -->

## 🔗 Importa
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- **Externos/APIs:** next/image, next/link, next/navigation, react, react-dom

## ⬅️ Importado por
- [[page.tsx]] — `src/app/(funeral)/funeraria/dashboard/page.tsx`

## 📤 Exporta
`FunerariaDashboardClient`

## 🧩 Componentes usados
Image, Link, QrModal

## 🪝 Hooks / efeitos
useRouter

## 📥 Props recebidas
activePlan, funeralHome, memorialCountMonth, memorialName, memorials, onClose, qrDark, qrLight, qrMap, subscriptionExpired, subscriptionRenewsAt

## 🧠 Funções/Componentes definidos
`FunerariaDashboardClient`, `QrModal`, `handleLogout`, `handlePublishWithQuota`

## 📞 O que cada função chama
- `FunerariaDashboardClient()` → filter, getFullYear, handlePublishWithQuota, map, max, min, setQrModal, toLocaleDateString, useRouter, useState
- `QrModal()` → createPortal, replace, setTheme, stopPropagation, toLowerCase, useState
- `handleLogout()` → fetch, push
- `handlePublishWithQuota()` → fetch, refresh, setPublishing, stringify

