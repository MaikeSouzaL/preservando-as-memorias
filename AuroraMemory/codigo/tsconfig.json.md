---
origem: tsconfig.json
origem_hash: 0ffbd574d567df533c22dd772242054a7eb690b0
gerado_em: 2026-06-29T18:31:25
---

# `tsconfig.json`

```markdown
# `tsconfig.json` — Configuração do TypeScript

- **Responsabilidade principal:** Configurar o compilador TypeScript para o projeto Next.js.
- **Definições-chave:**
  - `target`: ES2017
  - `lib`: `dom`, `dom.iterable`, `esnext`
  - `strict`: `true` (todas verificações rigorosas ativadas)
  - `module`: `esnext` / `moduleResolution`: `bundler`
  - `jsx`: `preserve` (delega para o Next.js)
  - `noEmit`: `true` (apenas verificação, sem saída)
  - `esModuleInterop`, `resolveJsonModule`, `isolatedModules`, `incremental` habilitados
- **Plugins:** `{ "name": "next" }` (integração com o Next.js)
- **Alias de caminho:** `@/*` → `./*` (toda a raiz do projeto)
- **Arquivos incluídos:** `next-env.d.ts`, todos os `.ts`/`.tsx`, `.next/types/**/*.ts`, `**/*.mts`
- **Arquivos excluídos:** `node_modules`
- **Uso:** Este arquivo é lido pelo compilador `tsc` e pelo VS Code (através do `typescript.tsdk`) para validar e fornecer IntelliSense. Não define rotas, tabelas, mensagens ou validações.
```
