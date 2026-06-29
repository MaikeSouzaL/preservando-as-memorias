---
origem: tsconfig.tsbuildinfo
origem_hash: 678d0999aac9a2cf2e404a963be3eae3c07b59d6
gerado_em: 2026-06-29T18:00:43
---

# `tsconfig.tsbuildinfo`

## `tsconfig.tsbuildinfo` — Resumo

- **Responsabilidade**: Arquivo gerado automaticamente pelo TypeScript (`tsc`) como cache de build, contendo metadados sobre arquivos compilados, dependências e versões de tipos.
- **Não contém**: lógica de aplicação, funções, classes, interfaces, props, retornos, endpoints, tabelas, variáveis de ambiente, mensagens ao usuário, regras de validação ou efeitos colaterais.
- **Conteúdo**: Lista de paths de arquivos `.d.ts` (declarações de tipos do TypeScript, Node, React, Next, Stripe, Supabase, etc.) e arquivos-fonte do projeto (`alter-db.ts`, `test-db.ts`, `src/...`), além de metadados de versão e hash de compilação.
- **Uso**: Apenas consultado pelo compilador TypeScript para acelerar recompilações; não é lido ou executado em tempo de execução.
- **Conexões**: Nenhuma com lógica do projeto; apenas registra que os arquivos listados foram verificados na compilação.
