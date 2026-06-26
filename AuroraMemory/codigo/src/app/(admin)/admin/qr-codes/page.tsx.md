---
origem: src/app/(admin)/admin/qr-codes/page.tsx
origem_hash: e4f84187b48fc852a630a0e3a9c3389e59fac4c3
gerado_em: 2026-06-25T23:37:30
---

# `src/app/(admin)/admin/qr-codes/page.tsx`

# Admin QR Codes Page

Página administrativa que lista e gerencia todos os QR codes de memoriais.

## Responsabilidade
- Exibe tabela com todos os QR codes (reais e virtuais) da plataforma
- Gera QR codes visuais em tempo real para cada memorial usando `generateHeartQr`

## Funcionalidades Chave
- **QR Codes Virtuais**: Cria automaticamente QR codes para memoriais sem registro explícito
- **Tabela Interativa**: Mostra identificador, memorial associado, caminho, scans, data, status e ação
- **Visualização**: Componente `QrCodeViewer` para exibir QR codes em dark/light mode

## Props/Parâmetros
- `dynamic = "force-dynamic"`: Garante renderização server-side sempre atualizada

## APIs/Endpoints
- Consome `readPlatformData()` para obter dados da plataforma
- Gera URLs: `/qr-publico?memorial=${id}` e `/memorial-publico?memorial=${id}`

## Integração
- Depende de `src/lib/platform-data` para dados
- Usa `src/lib/qr-heart` para geração de QR codes
- Renderiza componente `QrCodeViewer` para cada linha

<!-- aurora:relacoes -->

## 🔗 Importa
- [[qr-code-viewer.tsx]] — `src/components/admin/qr-code-viewer.tsx`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- [[qr-heart.ts]] — `src/lib/qr-heart.ts`

## 📤 Exporta
`AdminQrCodesPage`, `default`, `dynamic`

## 🧩 Componentes usados
QrCodeViewer

## 🧠 Funções/Componentes definidos
`AdminQrCodesPage`, `format`, `short`

## 📞 O que cada função chama
- `AdminQrCodesPage()` → filter, find, format, generateHeartQr, getTime, has, map, readPlatformData, replace, short, sort, substring, toLocaleDateString
- `format()` → String, getTime, getUTCDate, getUTCFullYear, getUTCMonth, isNaN, join, padStart
- `short()` → slice, split, trim

## 🔁 Chama (arquivos)
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- [[qr-heart.ts]] — `src/lib/qr-heart.ts`

