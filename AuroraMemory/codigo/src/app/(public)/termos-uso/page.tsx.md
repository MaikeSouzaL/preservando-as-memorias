---
origem: src/app/(public)/termos-uso/page.tsx
origem_hash: ffa5c677a09f5f4451c3f515fe4f442ea440a1d8
gerado_em: 2026-06-26T00:33:20
---

# `src/app/(public)/termos-uso/page.tsx`

# Termos de Uso — Página Legal

Página estática de Termos de Uso da plataforma Preservando Memórias, acessível em `/termos-uso`.

**Responsabilidade:** Exibir o documento legal de Termos de Uso com navegação de retorno ao site.

**Componentes chave:**
- `TermosUsoPage` (default): página completa com header, índice, 8 seções legais e footer com links para `/contato` e `/politica-privacidade`
- `Section`: componente interno que renderiza seção numerada (`num`, `title`, `children`)
- `BulletItem`: componente interno para itens de lista com bullet decorativo

**Detalhes técnicos:**
- `export const dynamic = "force-dynamic"` — força renderização dinâmica
- Navegação via `next/link` para `/`, `/contato` e `/politica-privacidade`
- Layout responsivo com tema escuro e paleta amarelo/dourado (`#e9c349`)

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** next/link

## 📤 Exporta
`TermosUsoPage`, `default`, `dynamic`

## 🧩 Componentes usados
BulletItem, Link, Section

## 📥 Props recebidas
children, num, title

## 🧠 Funções/Componentes definidos
`BulletItem`, `Section`, `TermosUsoPage`

## 📞 O que cada função chama
- `TermosUsoPage()` → map

