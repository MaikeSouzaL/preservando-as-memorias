---
origem: src/app/(private)/configuracoes/page.tsx
origem_hash: c5798f89696fa8dfab35eda2782112b12525030a
gerado_em: 2026-06-26T00:33:20
---

# `src/app/(private)/configuracoes/page.tsx`

## ConfiguraçõesPage

Página de configurações do curador, com abas para gerenciar perfil, conta, privacidade, segurança, memorial, notificações, aparência e backup (dev admin).

### Funcionalidades principais

- **7 abas de configuração**: Perfil (nome, email, bio, avatar), Conta (idioma, fuso, exclusão), Privacidade (público/protegido/privado), Segurança (senha, 2FA em breve), Memorial (áudio global), Notificações (velas, tributos), Aparência (tema claro/noturno)
- **Aba extra "Backup e Exportação"** visível apenas para `isDevAdmin: true`
- **Upload de avatar** via `/api/upload` e salvamento automático
- **Alteração de senha** com validação de 8+ caracteres e confirmação
- **Sidebar de status** com indicador visual de proteção

### APIs consumidas

- `GET /api/profile` — carrega dados do perfil
- `PATCH /api/profile` — salva campos do perfil
- `PATCH /api/profile/password` — altera senha
- `POST /api/upload` — upload de avatar
- `GET /api/dev/backup` — exporta backup JSON (dev admin)

### Props/Estado

- `CuratorProfile` — tipo que define todos os campos do perfil
- `activeTab` — aba ativa (0-7)
- `profile` — estado principal com dados do curador
- `formAvatarUrl`, `memorialPwd` — estados auxiliares para formulários

### Integração

- Importa `UserAvatar` de `@/src/components/ui/user-avatar`
- Aplica tema ao DOM via `data-theme` no `<html>`

<!-- aurora:relacoes -->

## 🔗 Importa
- [[user-avatar.tsx]] — `src/components/ui/user-avatar.tsx`
- **Externos/APIs:** react

## 📤 Exporta
`ConfiguracoesPage`, `default`

## 🧩 Componentes usados
CuratorProfile, HTMLInputElement, UserAvatar

## 🪝 Hooks / efeitos
useEffect, useState

## 🧠 Funções/Componentes definidos
`ConfiguracoesPage`, `applyThemeToDom`, `handleAvatarChange`, `handleBackupExport`, `handlePasswordChange`, `handleThemeChange`, `loadData`, `saveProfileFields`, `showError`, `showSuccess`

## 📞 O que cada função chama
- `ConfiguracoesPage()` → String, alert, get, handleThemeChange, loadData, map, preventDefault, saveProfileFields, setActiveTab, setConfirmPassword, setMemorialPwd, setNewPassword, setShowNewPwd, useEffect, useState
- `handleAvatarChange()` → append, fetch, json, saveProfileFields, setFormAvatarUrl, setUploading, showError
- `handleBackupExport()` → appendChild, click, createElement, createObjectURL, fetch, json, removeChild, revokeObjectURL, setIsSaving, showError, showSuccess, slice, stringify, toISOString
- `handlePasswordChange()` → fetch, json, preventDefault, setConfirmPassword, setIsSaving, setNewPassword, showError, showSuccess, stringify
- `handleThemeChange()` → applyThemeToDom, saveProfileFields
- `loadData()` → applyThemeToDom, error, fetch, json, setFormAvatarUrl, setLoading, setMemorialPwd, setProfile
- `saveProfileFields()` → fetch, json, setIsSaving, setProfile, showError, showSuccess, stringify
- `showError()` → setErrorMsg, setSuccessMsg, setTimeout
- `showSuccess()` → setErrorMsg, setSuccessMsg, setTimeout

