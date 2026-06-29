---
origem: next-env.d.ts
origem_hash: a81c05a357c1ed6943561b9ab8c47685c5d65a04
gerado_em: 2026-06-29T18:00:37
---

# `next-env.d.ts`

```markdown
# `next-env.d.ts` — Ambiente TypeScript do Next.js

- **Responsabilidade principal**: Fornecer declarações de tipos globais para o ecossistema Next.js, garantindo que o TypeScript reconheça APIs específicas do framework (como `next/image`, `next/link`, etc.) sem erros.
- **Conteúdo**: Apenas duas diretivas `/// <reference types="...">` que referenciam os pacotes `next` e `next/image-types/global`.
- **Observações**: Arquivo gerado automaticamente pelo Next.js (`npx next dev` / `npx next build`). **Não deve ser editado manualmente**, pois é sobrescrito a cada inicialização ou build.
- **Tipos/Interfaces**: Nenhum definido; apenas importa os tipos existentes dos pacotes referenciados.
- **Ligações com outros arquivos**: É incluído implicitamente via `tsconfig.json` (configuração `include: ["next-env.d.ts"]`) para que todos os arquivos `.ts`/`.tsx` do projeto tenham acesso aos tipos globais do Next.
- **Efeitos colaterais**: Nenhum (apenas declaração de tipos, sem execução runtime).
```
