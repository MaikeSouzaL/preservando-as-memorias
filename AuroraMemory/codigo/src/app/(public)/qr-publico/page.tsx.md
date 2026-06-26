---
origem: src/app/(public)/qr-publico/page.tsx
origem_hash: a79ed8f0acd3428d77af8d303834493c30b94a11
gerado_em: 2026-06-26T00:33:20
---

# `src/app/(public)/qr-publico/page.tsx`

# `src/app/(public)/qr-publico/page.tsx`

**Responsabilidade:** Página pública que exibe um QR Code em formato de coração para um memorial específico, permitindo download e compartilhamento.

**Componente principal:**
- `QrPublicoPage` (async, server component): recebe `searchParams.memorial` (ID opcional), busca o memorial nos dados da plataforma (fallback para o primeiro ativo), gera QR Code via `generateHeartQr` e renderiza:
  - Estado vazio: link para criar memorial
  - Estado normal: QR SVG, botões de download, simulação e compartilhamento

**Funções auxiliares:**
- `fmtDate`: formata ISO para DD/MM/YYYY
- `shortName`: trunca nome para ~13 caracteres (usa nome+sobrenome ou primeiro nome)

**APIs/endpoints:** Consome `readPlatformData()` (dados estáticos); gera URL pública `/memorial-publico?memorial={id}`

**Conexões:** Importa `readPlatformData` (dados) e `generateHeartQr` (geração QR); usa `Link` do Next.js para navegação interna.

<!-- aurora:relacoes -->

## 🔗 Importa
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- [[qr-heart.ts]] — `src/lib/qr-heart.ts`
- **Externos/APIs:** next/link

## 📤 Exporta
`QrPublicoPage`, `default`, `dynamic`

## 🧩 Componentes usados
Link

## 📥 Props recebidas
searchParams

## 🧠 Funções/Componentes definidos
`QrPublicoPage`, `fmtDate`, `shortName`

## 📞 O que cada função chama
- `QrPublicoPage()` → find, fmtDate, generateHeartQr, readPlatformData, replace, shortName, toLowerCase
- `fmtDate()` → String, getTime, getUTCDate, getUTCFullYear, getUTCMonth, isNaN, join, padStart
- `shortName()` → slice, split, trim

## 🔁 Chama (arquivos)
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- [[qr-heart.ts]] — `src/lib/qr-heart.ts`

