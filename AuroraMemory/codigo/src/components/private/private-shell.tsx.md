---
origem: src/components/private/private-shell.tsx
origem_hash: 5aa3a16de0c9797477d3b55a1a6be6c1809619ae
gerado_em: 2026-06-26T00:33:19
---

# `src/components/private/private-shell.tsx`

# PrivateShell — Layout Privado da Aplicação

**Responsabilidade:** Fornece o layout principal para todas as páginas autenticadas (sidebar + header + área de conteúdo).

## Componentes e Funcionalidades

- **Sidebar fixa** com navegação principal (Meus Memoriais, Homenagens, Configurações) e links condicionais para Admin/Dev Console
- **Header superior** com busca, notificações e avatar do usuário com dropdown
- **Modal de configurações de perfil** para editar nome, email, senha e foto

## Props

| Prop | Tipo | Descrição |
|------|------|-----------|
| `children` | `ReactNode` | Conteúdo da página |
| `isDevAdmin` | `boolean` | Exibe link para Dev Console |
| `isAdmin` | `boolean` | Exibe link para Painel Admin |

## APIs Consumidas

- `GET /api/profile` — carrega dados do usuário
- `GET /api/me/stats` — verifica notificações pendentes
- `PATCH /api/profile` — salva alterações de perfil
- `POST /api/upload` — upload de avatar
- `POST /api/auth/logout` — encerra sessão

## Integração

Importado por `src/app/(private)/layout.tsx` como wrapper de todas as rotas privadas. Utiliza `UserAvatar` para exibir foto do perfil.

<!-- aurora:relacoes -->

## 🔗 Importa
- [[user-avatar.tsx]] — `src/components/ui/user-avatar.tsx`
- **Externos/APIs:** next/link, next/navigation, react

## ⬅️ Importado por
- [[layout.tsx]] — `src/app/(private)/layout.tsx`

## 📤 Exporta
`PrivateShell`

## 🧩 Componentes usados
HTMLInputElement, Link, UserAvatar

## 🪝 Hooks / efeitos
useEffect, usePathname, useState

## 📥 Props recebidas
children, isAdmin, isDevAdmin

## 🧠 Funções/Componentes definidos
`PrivateShell`, `handleAvatarChange`, `handleLogout`, `handleSaveSettings`, `isActive`, `loadUserData`

## 📞 O que cada função chama
- `PrivateShell()` → isActive, loadUserData, map, setDropdownOpen, setFormEmail, setFormName, setFormPassword, setMobileOpen, setModalOpen, useEffect, usePathname, useState
- `handleAvatarChange()` → append, fetch, json, setFormAvatarUrl, setUploading
- `handleLogout()` → catch, fetch, removeItem
- `handleSaveSettings()` → fetch, json, preventDefault, setModalOpen, setProfile, setSaving, stringify
- `isActive()` → startsWith
- `loadUserData()` → fetch, json, setFormAvatarUrl, setFormEmail, setFormName, setFormPassword, setHasNotifications, setProfile

