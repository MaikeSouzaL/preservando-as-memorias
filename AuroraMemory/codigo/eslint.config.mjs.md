---
origem: eslint.config.mjs
origem_hash: 60016b2ac108e8469bec195756fc9bfb2eed725d
gerado_em: 2026-06-25T23:37:19
---

# `eslint.config.mjs`

# eslint.config.mjs

**Responsabilidade:** Configuração ESLint para o projeto Next.js.

**Estrutura:**
- Importa `defineConfig` e `globalIgnores` de `eslint/config`
- Importa presets `nextVitals` (core-web-vitals) e `nextTs` (TypeScript) de `eslint-config-next`
- Combina os presets com regras de ignorância global via `globalIgnores()`
- Exporta a configuração como default

**Ignora:** `.next/**`, `out/**`, `build/**`, `next-env.d.ts`

**Conexões:** Consome pacotes `eslint-config-next` para aplicar regras específicas do Next.js e TypeScript.

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** eslint-config-next/core-web-vitals, eslint-config-next/typescript, eslint/config

## 📤 Exporta
`default`, `eslintConfig`

