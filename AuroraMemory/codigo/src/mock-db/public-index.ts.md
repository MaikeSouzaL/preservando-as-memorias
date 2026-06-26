---
origem: src/mock-db/public-index.ts
origem_hash: 72350d0c93670afaa6e964a7db3d212d99839af6
gerado_em: 2026-06-25T23:37:23
---

# `src/mock-db/public-index.ts`

# `src/mock-db/public-index.ts`

## Responsabilidade
Re-exporta o módulo `publicContent` do arquivo `public-content.ts`, servindo como ponto de entrada unificado para dados mock públicos.

## Funcionalidade
- **Exporta**: `publicContent` (de `./public-content`)

## Conexões
- **Importa de**: `src/mock-db/public-content.ts` (dados mock)
- **Consumido por**: outros módulos que importam deste barrel index

## Propósito
Barrel file que simplifica imports, permitindo que outros módulos acessem `publicContent` via `import { publicContent } from "./mock-db/public-index"` em vez de especificar o caminho completo do arquivo de conteúdo.

<!-- aurora:relacoes -->

## 🔗 Importa
- [[public-content.ts]] — `src/mock-db/public-content.ts`

## 📤 Exporta
`publicContent`

