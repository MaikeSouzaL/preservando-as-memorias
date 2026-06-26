---
origem: src/components/admin/funerarias-page-client.tsx
origem_hash: 33d8aa21b654ab3c6c282812f0849ffd3712a0bb
gerado_em: 2026-06-26T00:33:19
---

# `src/components/admin/funerarias-page-client.tsx`

# `funerarias-page-client.tsx`

## Responsabilidade Principal
Página administrativa de gerenciamento de funerárias com sistema de abas (tabs) para cadastros, planos, ofertas, convites e configuração de entrega de QR Codes.

## Componentes Chave

- **`FunerariasPageClient`** — Componente principal exportado. Gerencia navegação entre 5 abas via `useSearchParams` e renderiza cada aba com `TabErrorBoundary` isolado.
- **`CadastrosTab`** — Lista funerárias (pendentes/ativas/rejeitadas). Permite aprovar/rejeitar, atribuir planos de assinatura e configurar comissão percentual via PATCH em `/api/admin/funeral-homes/:id`.
- **`OfertasTab`** — CRUD de links de oferta personalizados por funerária. Consome `/api/admin/offer-links` (GET, POST, PATCH, DELETE). Exibe métricas de acessos/conversões.
- **`PlanosTab`** — Carrega `PlatformConfig` de `/api/platform-config` e renderiza `FuneralSettingsPanel` para gerenciar planos de assinatura.
- **`QrCodesTab`** — Carrega configuração de modo de entrega de QR Code e renderiza `QrDeliveryPanel`.
- **`ConvitesTab`** — Renderiza `ConvitesPageClient` para gerenciar links de convite para funerárias.
- **`TabErrorBoundary`** — Error boundary por aba, com botão "Tentar novamente".
- **`FuneralCard`** — Card de funerária com ações de aprovação, edição de plano e comissão.

## Props/Parâmetros
- **`tab`** — Controlado via query string `?tab=cadastros|planos|ofertas|convites|qrcodes`.

## APIs Consumidas
- `GET /api/admin/funeral-homes` — Lista funerárias e planos
- `PATCH /api/admin/funeral-homes/:id` — Aprovar/rejeitar, definir plano, comissão
- `GET/POST/PATCH/DELETE /api/admin/offer-links` — CRUD de ofertas
- `GET /api/platform-config` — Configurações de planos e entrega QR

## Conexões
Importa `FuneralSettingsPanel`, `QrDeliveryPanel`, `ConvitesPageClient` e tipos de `platform-types`/`platform-data`. É importado por `src/app/(admin)/admin/funerarias/page.tsx`.

<!-- aurora:relacoes -->

## 🔗 Importa
- [[convites-page-client.tsx]] — `src/components/admin/convites-page-client.tsx`
- [[funeral-settings-panel.tsx]] — `src/components/admin/funeral-settings-panel.tsx`
- [[qr-delivery-panel.tsx]] — `src/components/admin/qr-delivery-panel.tsx`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- [[platform-types.ts]] — `src/lib/platform-types.ts`
- **Externos/APIs:** next/navigation, react

## ⬅️ Importado por
- [[page.tsx]] — `src/app/(admin)/admin/funerarias/page.tsx`

## 📤 Exporta
`FunerariasPageClient`

## 🧩 Componentes usados
CadastrosTab, ConvitesPageClient, ConvitesTab, FuneralCard, FuneralHome, FuneralHomeOfferLink, FuneralPlanSummary, FuneralSettingsPanel, Metric, OfertasTab, PlanosTab, PlatformConfig, QrCodesTab, QrDeliveryPanel, Record, TabErrorBoundary, TabInfo

## 🪝 Hooks / efeitos
useCallback, useEffect, useRouter, useSearchParams, useState

## 📥 Props recebidas
acting, color, commissionEditing, commissionValue, description, fh, funeralPlans, icon, label, onAct, onCommissionCancel, onCommissionChange, onCommissionEdit, onCommissionSave, onPlanCancel, onPlanEdit, onPlanRenewsAtChange, onPlanSave, planEditing, planRenewsAtValue, showActions, showApprove, showReject, tip, title, value

## 🧠 Funções/Componentes definidos
`CadastrosTab`, `ConvitesTab`, `FuneralCard`, `FunerariasPageClient`, `Metric`, `OfertasTab`, `PlanosTab`, `QrCodesTab`, `TabInfo`, `act`, `constructor`, `copyLink`, `getDerivedStateFromError`, `handleCreate`, `handlePriceBlur`, `handlePriceChange`, `init`, `remove`, `render`, `saveCommission`, `savePlan`, `setTab`, `toggle`

## 📞 O que cada função chama
- `CadastrosTab()` → String, fetch, filter, init, json, map, setCommissionEditing, setCommissionValue, setFuneralPlans, setHomes, setLoading, setPlanEditing, setPlanRenewsAt, useCallback, useEffect, useState
- `FuneralCard()` → centsToBRL, find, getElementById, map, onAct, onCommissionChange, onCommissionEdit, onCommissionSave, onPlanEdit, onPlanRenewsAtChange, onPlanSave, toLocaleDateString
- `FunerariasPageClient()` → get, includes, map, setTab, useRouter, useSearchParams
- `OfertasTab()` → Boolean, centsToBRL, copyLink, cycleLabel, fetch, filter, find, handlePriceChange, init, json, map, reduce, remove, setFormData, setFuneralHomes, setLoading, setOffers, setShowForm, toggle, useCallback, useEffect, useState
- `PlanosTab()` → catch, fetch, json, setConfig, setLoadError, then, useEffect, useState
- `QrCodesTab()` → catch, fetch, json, setConfig, then, useEffect, useState
- `act()` → fetch, load, setActing, setLoading, stringify
- `copyLink()` → catch, setCopiedId, setTimeout, writeText
- `handleCreate()` → fetch, load, preventDefault, setFormData, setPriceInput, setShowForm, stringify
- `handlePriceBlur()` → setPriceInput, toLocaleString
- `handlePriceChange()` → isNaN, parseFloat, replace, round, setFormData, setPriceInput
- `init()` → load
- `remove()` → confirm, fetch, load
- `render()` → setState
- `saveCommission()` → Number, fetch, isNaN, load, setActing, setCommissionEditing, setLoading, stringify
- `savePlan()` → fetch, load, setActing, setLoading, setPlanEditing, stringify
- `setTab()` → entries, from, push, set, toString
- `toggle()` → fetch, load, stringify

## 🔁 Chama (arquivos)
- [[platform-types.ts]] — `src/lib/platform-types.ts`

