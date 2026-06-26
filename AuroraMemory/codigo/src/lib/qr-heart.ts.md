---
origem: src/lib/qr-heart.ts
origem_hash: b45d06cbc4965cc2684d2067cea963ee62c3586b
gerado_em: 2026-06-25T23:37:23
---

# `src/lib/qr-heart.ts`

# `qr-heart.ts` — Gerador de QR Code em Formato de Coração

## Responsabilidade
Gera um QR code SVG em formato de coração, codificado como `data:image/svg+xml;base64`, pronto para uso em tags `<img>`.

## Função Principal
- **`generateHeartQr(url, opts?)`**: Síncrona, sem dependência de canvas. Cria matriz QR via `qrcode.create()`, renderiza módulos escuros como retângulos agrupados por linha, rotaciona 45° (formando diamante) e adiciona semicírculos superiores para formar o coração.

## Props/Parâmetros (HeartQrOptions)
- `moduleSize` (8), `marginModules` (2), `dark`/`light` — cores dos módulos
- `overlay` — texto opcional nos "ombros" do coração: `leftLine1`/`leftLine2` (nome + nascimento), `rightLine1`/`rightLine2` (morte), `color` (dourado `#e9c349`)
- `bottomUrl` — label URL acima do coração
- `bgColor` — fundo sólido opcional

## APIs/Endpoints
- **Consome**: `qrcode.create()` (módulo npm `qrcode`) — geração da matriz QR síncrona

## Conexões
Importado por páginas admin, dashboard e pública de QR codes. Gera SVG inline sem chamadas de rede.

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** qrcode

## ⬅️ Importado por
- [[page.tsx]] — `src/app/(admin)/admin/qr-codes/page.tsx`
- [[page.tsx]] — `src/app/(funeral)/funeraria/dashboard/page.tsx`
- [[page.tsx]] — `src/app/(private)/dashboard/page.tsx`
- [[page.tsx]] — `src/app/(public)/qr-publico/page.tsx`

## 📤 Exporta
`generateHeartQr`

## 🧠 Funções/Componentes definidos
`bumpText`, `escXml`, `generateHeartQr`

## 📞 O que cada função chama
- `bumpText()` → escXml
- `escXml()` → replace
- `generateHeartQr()` → bumpText, create, escXml, from, join, max, push, round, toString

## 📲 Chamado por
- [[page.tsx]] — `src/app/(admin)/admin/qr-codes/page.tsx`
- [[page.tsx]] — `src/app/(funeral)/funeraria/dashboard/page.tsx`
- [[page.tsx]] — `src/app/(private)/dashboard/page.tsx`
- [[page.tsx]] — `src/app/(public)/qr-publico/page.tsx`

