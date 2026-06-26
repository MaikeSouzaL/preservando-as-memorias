---
origem: tsconfig.json
origem_hash: 9a8925066349fe373cb4c5a62434cbb8b9e24928
gerado_em: 2026-06-25T23:37:23
---

# `tsconfig.json`

## tsconfig.json — Configuração TypeScript do Projeto

**Responsabilidade:** Define as regras de compilação TypeScript para um projeto Next.js.

**Configurações chave:**
- **`target: ES2017`** — Compila para ECMAScript 2017
- **`jsx: "react-jsx"`** — Suporte ao JSX do React 17+
- **`strict: true`** — Ativa verificações rigorosas de tipo
- **`moduleResolution: "bundler"`** — Resolução de módulos otimizada para bundlers (Next.js)
- **`paths: { "@/*": ["./*"] }`** — Alias `@` para a raiz do projeto

**Plugins:** Inclui o plugin `next` para integração com o Next.js.

**Escopo:** Compila todos os arquivos `.ts`, `.tsx` e `.mts` no projeto, exceto `node_modules`.
