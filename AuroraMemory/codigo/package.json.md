---
origem: package.json
origem_hash: ff973c1eee42bbd2d169c2afdcaa81822f0f4e51
gerado_em: 2026-06-25T23:37:23
---

# `package.json`

```markdown
# package.json — Aurora Memorial

**Responsabilidade:** Configuração e gerenciamento do projeto Next.js.

**Scripts principais:**
- `dev` / `build` / `start`: ciclo de vida Next.js.
- `lint` / `lint:fix`: verificação e correção ESLint.
- `type-check`: checagem TypeScript sem emitir arquivos.
- `format` / `format:check`: formatação Prettier.
- `test` / `test:watch` / `test:ci`: execução de testes com Jest (CI com cobertura).
- `clean`: remove `.next` e `node_modules`.
- `docker:dev` / `docker:build`: orquestração Docker Compose.

**Dependências:** Next 14, React 18, ReactDOM 18.

**DevDependencies:** TypeScript 5, Prettier 3, Jest 29, Testing Library React 14, tipos Node/React.

**Conexões:** Define o ponto de entrada do projeto; scripts `docker:*` referenciam `docker-compose.yml` (não incluso). Testes e formatação são executados via CLI.
```
