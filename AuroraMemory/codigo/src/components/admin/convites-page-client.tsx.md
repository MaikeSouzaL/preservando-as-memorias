---
origem: src/components/admin/convites-page-client.tsx
origem_hash: 46cb75234525186099d60c70516e478bfbab4389
gerado_em: 2026-06-26T00:33:19
---

# `src/components/admin/convites-page-client.tsx`

## ConvitesPageClient

**Responsabilidade:** Página de gerenciamento de convites para funerárias no painel admin.

### Funcionalidades principais:
- **Listagem de convites** com status (ativo/usado/expirado), plano associado e metadados
- **Criação de convites** via formulário com campos: label, slug, comissão, plano, renovação e notas
- **Ações por convite:** copiar link, expirar/reativar, remover permanentemente

### APIs consumidas:
- `GET /api/admin/funeral-home-invites` — carrega convites e planos
- `POST /api/admin/funeral-home-invites` — cria novo convite
- `PATCH /api/admin/funeral-home-invites/:id` — altera status
- `DELETE /api/admin/funeral-home-invites/:id` — remove convite

### Integração:
- Importa tipos `FuneralHomeInvite` e `FuneralPlan` de `platform-types`
- Renderizado em `(admin)/admin/convites/page.tsx`
- Reutilizado em `funerarias-page-client.tsx`

<!-- aurora:relacoes -->

## 🔗 Importa
- [[platform-types.ts]] — `src/lib/platform-types.ts`
- **Externos/APIs:** react

## ⬅️ Importado por
- [[page.tsx]] — `src/app/(admin)/admin/convites/page.tsx`
- [[funerarias-page-client.tsx]] — `src/components/admin/funerarias-page-client.tsx`

## 📤 Exporta
`ConvitesPageClient`

## 🧩 Componentes usados
FuneralPlan, InviteWithPlan

## 🪝 Hooks / efeitos
useEffect, useState

## 🧠 Funções/Componentes definidos
`ConvitesPageClient`, `buildInviteUrl`, `copyLink`, `deleteInvite`, `handleCreate`, `setStatus`, `statusLabel`

## 📞 O que cada função chama
- `ConvitesPageClient()` → catch, copyLink, deleteInvite, fetch, filter, finally, forEach, json, map, replace, setActivePlanId, setCommissionPct, setError, setInvites, setLabel, setLoading, setNotes, setPlanRenewsAt, setPlans, setSaveError, setShowForm, setSlug, setStatus, slice, statusLabel, then, toISOString, toLocaleDateString, toLowerCase, useEffect, useState
- `copyLink()` → buildInviteUrl, setCopied, setTimeout, writeText
- `deleteInvite()` → confirm, fetch, filter, setInvites
- `handleCreate()` → Number, fetch, find, json, preventDefault, setActivePlanId, setCommissionPct, setInvites, setLabel, setNotes, setPlanRenewsAt, setSaveError, setSaving, setShowForm, setSlug, stringify
- `setStatus()` → fetch, map, setInvites, stringify

