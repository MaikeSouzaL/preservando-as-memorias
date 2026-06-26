---
origem: src/components/admin/admin-shell.tsx
origem_hash: 6d627658b39f98b0eb02cdce361744586ed32e10
gerado_em: 2026-06-26T00:33:19
---

# `src/components/admin/admin-shell.tsx`

# AdminShell — Layout do Painel Administrativo

**Responsabilidade:** Componente de layout principal da área administrativa, fornecendo sidebar de navegação, header com notificações e gerenciamento de perfil do admin.

## Funcionalidades Principais

- **Sidebar de navegação** com links para Dashboard, Comercial, Funerárias, Contrato, Usuários, Memoriais, QR Codes e Denúncias
- **Sistema de notificações** com dropdown para pendências:
  - Aprovação de funerárias (aprovar/rejeitar)
  - Entregas de QR Code (marcar como enviado)
  - Atividade de parceiros admin (visível apenas para devAdmin)
- **Modal de configurações** do perfil do admin (nome, email, senha, avatar)
- **Controle de acesso** — redireciona para `/admin/contrato` se contrato não assinado
- **Banner de entregas pendentes** persistente no topo do conteúdo

## Props

| Prop | Tipo | Descrição |
|------|------|-----------|
| `children` | `React.ReactNode` | Conteúdo da página atual |

## APIs Consumidas

- `GET /api/profile` — dados do admin logado
- `PATCH /api/profile` — atualizar perfil
- `GET /api/admin/contracts` — verificar contrato assinado
- `GET /api/admin/stats` — pendências (funerárias, entregas, parceiros)
- `POST /api/admin/ping` — registrar acesso do admin parceiro
- `PATCH /api/admin/funeral-homes/:id` — aprovar/rejeitar funerária
- `PATCH /api/admin/memorial/:id/delivery` — marcar entrega como enviada
- `POST /api/upload` — upload de avatar
- `POST /api/auth/logout` — logout

## Integração

Importado por `src/app/(admin)/layout.tsx` e `src/app/(admin)/admin/contrato/page.tsx`. Utiliza `UserAvatar` para exibir foto do admin.

<!-- aurora:relacoes -->

## 🔗 Importa
- [[user-avatar.tsx]] — `src/components/ui/user-avatar.tsx`
- **Externos/APIs:** next/link, next/navigation, react

## ⬅️ Importado por
- [[page.tsx]] — `src/app/(admin)/admin/contrato/page.tsx`
- [[layout.tsx]] — `src/app/(admin)/layout.tsx`

## 📤 Exporta
`AdminShell`

## 🧩 Componentes usados
HTMLInputElement, Link, UserAvatar

## 🪝 Hooks / efeitos
useEffect, usePathname, useState

## 📥 Props recebidas
children

## 🧠 Funções/Componentes definidos
`AdminShell`, `handleApproval`, `handleAvatarChange`, `handleLogout`, `handleMarkSent`, `handleSaveSettings`, `isActive`, `loadAdminData`

## 📞 O que cada função chama
- `AdminShell()` → floor, getTime, handleApproval, handleMarkSent, isActive, join, loadAdminData, map, now, setDropdownOpen, setFormEmail, setFormName, setFormPassword, setMobileOpen, setModalOpen, setNotifOpen, slice, toLocaleDateString, useEffect, usePathname, useState
- `handleApproval()` → fetch, filter, setApproving, setHasNotifications, setNotifOpen, setPendingFuneralHomes, stringify
- `handleAvatarChange()` → append, fetch, json, setFormAvatarUrl, setUploading
- `handleLogout()` → catch, fetch, removeItem
- `handleMarkSent()` → fetch, filter, setHasNotifications, setMarkingSent, setPendingDeliveries
- `handleSaveSettings()` → fetch, json, preventDefault, setModalOpen, setProfile, setSaving, stringify
- `isActive()` → startsWith
- `loadAdminData()` → catch, fetch, includes, json, setAdminPartners, setFormAvatarUrl, setFormEmail, setFormName, setFormPassword, setHasNotifications, setHasSignedContract, setIsDevAdmin, setPendingDeliveries, setPendingFuneralHomes, setProfile

