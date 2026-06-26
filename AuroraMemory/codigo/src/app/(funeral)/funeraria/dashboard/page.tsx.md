---
origem: src/app/(funeral)/funeraria/dashboard/page.tsx
origem_hash: 1eb9941d79b4ee5f3d55aadead6cdd1240ad81b4
gerado_em: 2026-06-26T00:33:20
---

# `src/app/(funeral)/funeraria/dashboard/page.tsx`

# Página do Dashboard da Funerária

**Responsabilidade:** Página servidora que carrega dados da funerária autenticada e prepara props para o componente cliente `FunerariaDashboardClient`.

## Funções auxiliares
- **`fmtDate`** – Formata data ISO para DD/MM/YYYY (UTC)
- **`shortName`** – Abrevia nome para no máximo 13 caracteres

## Fluxo principal
1. Obtém sessão via `getFuneralSession()`; redireciona para login se ausente
2. Lê dados da plataforma com `readPlatformData()` e localiza a funerária pelo `funeralHomeId`
3. Filtra memoriais da funerária e enriquece com contagem de tributos/velas
4. Gera QR codes (dark/light) para memoriais ativos via `generateHeartQr()`
5. Resolve plano ativo e verifica reset mensal do contador de memoriais
6. Renderiza `<FunerariaDashboardClient>` com todos os dados preparados

## Props passadas ao cliente
- `funeralHome` – dados cadastrais da funerária
- `memorials` – lista de memoriais com contagens
- `qrMap` – QR codes por memorial (dark/light)
- `activePlan` – plano ativo ou `null`
- `memorialCountMonth` – contagem de memoriais no mês
- `subscriptionRenewsAt` / `subscriptionExpired` – status da assinatura

<!-- aurora:relacoes -->

## 🔗 Importa
- [[funeraria-dashboard-client.tsx]] — `src/components/funeral/funeraria-dashboard-client.tsx`
- [[funeral-auth.ts]] — `src/lib/funeral-auth.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- [[qr-heart.ts]] — `src/lib/qr-heart.ts`
- **Externos/APIs:** next/navigation

## 📤 Exporta
`FunerariaDashboardPage`, `default`, `dynamic`

## 🧩 Componentes usados
FunerariaDashboardClient

## 🧠 Funções/Componentes definidos
`FunerariaDashboardPage`, `fmtDate`, `shortName`

## 📞 O que cada função chama
- `FunerariaDashboardPage()` → filter, find, fmtDate, generateHeartQr, getFullYear, getFuneralSession, getMonth, map, readPlatformData, redirect, replace, shortName
- `fmtDate()` → String, getTime, getUTCDate, getUTCFullYear, getUTCMonth, isNaN, join, padStart
- `shortName()` → slice, split, trim

## 🔁 Chama (arquivos)
- [[funeral-auth.ts]] — `src/lib/funeral-auth.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- [[qr-heart.ts]] — `src/lib/qr-heart.ts`

