---
origem: src/app/globals.css
origem_hash: 4ab46426f7222dcf66210ef7db7a0cf1994ddc27
gerado_em: 2026-06-25T23:37:29
---

# `src/app/globals.css`

# `globals.css` — Estilos Globais e Tema

## Responsabilidade
Define o sistema de design completo do projeto: variáveis CSS de tema escuro/claro, tipografia, espaçamento, cores e animações globais.

## Componentes Chave

- **`:root`** — Tema escuro padrão com paleta Material Design (`--pm-*`), tipografia (Inter, Noto Serif), espaçamentos e bordas
- **`[data-theme="claro"]`** — Tema claro que sobrescreve todas as variáveis `--pm-*` para fundo claro
- **`@theme inline`** — Mapeia variáveis CSS para tokens do Tailwind (`--color-*`, `--spacing-*`, `--radius-*`, `--font-*`)
- **Animações** — `fade-rise` (fade-in com translateY) e classe utilitária `.fade-rise`
- **Estilos de formulário** — `.input-line` (input minimalista com borda inferior)
- **Customização do react-datepicker** — Tema escuro completo para o componente DatePicker

## Conexões
- Importado por `src/app/layout.tsx` como estilo global
- Importa fontes do Google Fonts (Material Symbols, Outfit, Playfair Display, Plus Jakarta Sans)
- Importa Tailwind CSS via `@import "tailwindcss"`

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** tailwindcss

## ⬅️ Importado por
- [[layout.tsx]] — `src/app/layout.tsx`

