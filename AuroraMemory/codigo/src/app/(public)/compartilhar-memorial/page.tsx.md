---
origem: src/app/(public)/compartilhar-memorial/page.tsx
origem_hash: 782b96471438add56d590686b76ccd88e94e127f
gerado_em: 2026-06-25T23:37:29
---

# `src/app/(public)/compartilhar-memorial/page.tsx`

# CompartilharMemorialPage

Página de compartilhamento de memoriais. Responsável por gerar e distribuir links públicos.

## Funcionalidades

- **Seleção de memorial**: Busca em `/api/memorials` e seleciona por ID (query param `?memorial=`) ou primeiro ativo
- **Geração de link**: Monta URL pública no formato `/memorial-publico?memorial={id}`
- **Compartilhamento**: Botão copiar link + atalhos para WhatsApp, Facebook e Email
- **Navegação**: Links para QR público e volta ao memorial

## Estados

- **Carregando**: Texto "Carregando memorial..."
- **Vazio**: Mensagem "Nenhum memorial disponível" + link para criar
- **Sucesso**: Formulário com link + botões de compartilhamento

## Props/Parâmetros

- Query param `?memorial=` para selecionar memorial específico

## APIs

- **GET /api/memorials**: Retorna lista de memoriais (`{ memorials: MemorialSummary[] }`)

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** next/link, react

## 📤 Exporta
`CompartilharMemorialPage`, `default`

## 🧩 Componentes usados
Link, MemorialSummary

## 🪝 Hooks / efeitos
useEffect, useMemo, useState

## 🧠 Funções/Componentes definidos
`CompartilharMemorialPage`, `copyLink`

## 📞 O que cada função chama
- `CompartilharMemorialPage()` → catch, encodeURIComponent, fetch, finally, find, get, isArray, json, map, setIsLoading, setMemorial, then, useEffect, useMemo, useState
- `copyLink()` → setCopied, setTimeout, writeText

