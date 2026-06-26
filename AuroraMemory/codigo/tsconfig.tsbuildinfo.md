---
origem: tsconfig.tsbuildinfo
origem_hash: 678d0999aac9a2cf2e404a963be3eae3c07b59d6
gerado_em: 2026-06-26T00:33:19
---

# `tsconfig.tsbuildinfo`

# `tsconfig.tsbuildinfo` — Cache de Compilação TypeScript

## Responsabilidade Principal
Arquivo de cache gerado automaticamente pelo compilador TypeScript (`tsc`) para acelerar compilações incrementais. Contém metadados sobre o estado da compilação, dependências entre arquivos e versões dos tipos.

## Conteúdo
- **`fileNames`**: Lista completa de todos os arquivos `.d.ts` e `.ts` do projeto e suas dependências (node_modules, libs, código fonte)
- **`fileVersions`**: Mapas de versões/hashes de cada arquivo para detectar alterações
- **`program`**: Configuração do programa TypeScript (opções do compilador, rootDir, etc.)
- **`semanticDiagnostics`**: Diagnósticos semânticos armazenados para evitar reanálise

## Relações com o Projeto
- **Não é editável manualmente** — gerado automaticamente pelo `tsc`
- **Depende de**: `tsconfig.json` (configuração), todos os arquivos `.ts`/`.tsx` do projeto
- **Usado por**: Compilador TypeScript para compilações incrementais rápidas
- **Deve ser ignorado no Git** (adicionado ao `.gitignore`)

## Bibliotecas Detectadas
- TypeScript (libs nativas)
- React, React DOM, Next.js
- Supabase (client, auth, storage, realtime)
- Stripe, Resend, date-fns
- PostgreSQL (pg, pg-types)
- Upstash (redis, rate-limit)
- Sharp, qrcode
