---
origem: src/components/admin/qr-delivery-panel.tsx
origem_hash: 801519076e1afc67a0a8b10e086802b8abcabbdc
gerado_em: 2026-06-25T23:37:29
---

# `src/components/admin/qr-delivery-panel.tsx`

# `QrDeliveryPanel` — Painel de Configuração de Entrega de QR Codes

## Responsabilidade
Permite ao admin configurar globalmente e por funerária **quem entrega o QR Code físico** (admin ou família/funerária), com suporte a sobrescritas individuais.

## Props
- `initialMode?: QrDeliveryMode` — modo global inicial para famílias
- `initialFuneralHomeMode?: QrDeliveryMode` — modo global inicial para funerárias

## Funcionalidades Chave
1. **Configuração global para famílias** — PATCH `/api/platform-config` com `target: "qr_delivery"`
2. **Configuração global para funerárias** — PATCH `/api/platform-config` com `target: "funeral_home_qr_delivery"`
3. **Override por funerária** — PATCH `/api/admin/funeral-homes/{id}` com `action: "set_qr_delivery"`
4. **Listagem de funerárias** — GET `/api/admin/funeral-homes` para exibir exceções individuais

## Lógica de Modo Efetivo
- Se funerária tem override (`qrDeliveryMode`) diferente de `"inherit"`, usa o override
- Caso contrário, herda o modo global (`globalMode`)

## Integração
Importado por `funerarias-page-client.tsx`; consome tipos `QrDeliveryMode`, `QrDeliveryOverride` e `PlatformConfig` de `platform-types.ts`.

<!-- aurora:relacoes -->

## 🔗 Importa
- [[platform-types.ts]] — `src/lib/platform-types.ts`
- **Externos/APIs:** react

## ⬅️ Importado por
- [[funerarias-page-client.tsx]] — `src/components/admin/funerarias-page-client.tsx`

## 📤 Exporta
`QrDeliveryPanel`

## 🧩 Componentes usados
FuneralHomeRow, QrDeliveryMode, QrDeliveryOverride

## 🪝 Hooks / efeitos
useCallback, useEffect, useState

## 📥 Props recebidas
initialFuneralHomeMode, initialMode

## 🧠 Funções/Componentes definidos
`QrDeliveryPanel`, `effectiveMode`, `saveFuneralHome`, `saveFuneralHomeGlobal`, `saveGlobal`

## 📞 O que cada função chama
- `QrDeliveryPanel()` → effectiveMode, fetch, filter, json, loadHomes, map, saveFuneralHome, saveFuneralHomeGlobal, saveGlobal, setHomes, setLoadingHomes, useCallback, useEffect, useState
- `saveFuneralHome()` → fetch, map, setHomes, setSavingFh, stringify
- `saveFuneralHomeGlobal()` → fetch, setFuneralHomeMode, setSavedFhMsg, setSavingFhMode, setTimeout, stringify
- `saveGlobal()` → fetch, setGlobalMode, setSavedMsg, setSaving, setTimeout, stringify

## 🔁 Chama (arquivos)
- [[platform-types.ts]] — `src/lib/platform-types.ts`

