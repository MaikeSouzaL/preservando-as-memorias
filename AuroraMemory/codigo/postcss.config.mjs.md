---
origem: postcss.config.mjs
origem_hash: a6cba5e494fcd184e50b1894c95e9799e0753dfd
gerado_em: 2026-06-26T00:33:19
---

# `postcss.config.mjs`

# postcss.config.mjs

Configuração do PostCSS para processamento de CSS no projeto.

- **Responsabilidade**: Define os plugins do PostCSS utilizados durante o build.
- **Plugin principal**: `@tailwindcss/postcss` — habilita o processamento das diretivas do Tailwind CSS (como `@tailwind`, `@apply`, etc.).
- **Exportação**: Exporta um objeto `config` como default, consumido automaticamente pelo PostCSS (via convenção de nome do arquivo).
- **Ligação**: Conecta-se ao pipeline de build (Vite, Next.js, etc.) que lê este arquivo para aplicar transformações CSS.

<!-- aurora:relacoes -->

## 📤 Exporta
`config`, `default`

