---
origem: tsconfig.tsbuildinfo
origem_hash: a674672822594d7d96d76ddd48e88ea8e7162ebe
gerado_em: 2026-06-25T23:37:23
---

# `tsconfig.tsbuildinfo`

# `tsconfig.tsbuildinfo`

## O que é

Arquivo de cache gerado automaticamente pelo compilador TypeScript (`tsc`) para acelerar recompilações incrementais.

## Responsabilidade Principal

Armazenar metadados sobre o estado da compilação, incluindo:
- Lista completa de arquivos `.d.ts` e `.ts` do projeto e dependências
- Informações de dependência entre arquivos
- Versões e timestamps para detectar mudanças

## Como se Liga aos Outros

- **Gerado por**: `tsconfig.json` (configuração do TypeScript)
- **Consumido por**: Compilador TypeScript em execuções subsequentes
- **Não deve ser versionado** (está no `.gitignore`)

## Observações

- Arquivo binário/JSON, não editável manualmente
- Pode ser deletado com segurança (será recriado na próxima compilação)
- Seu conteúdo é truncado por ser muito extenso
