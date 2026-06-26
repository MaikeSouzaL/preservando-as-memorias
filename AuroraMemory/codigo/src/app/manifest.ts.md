---
origem: src/app/manifest.ts
origem_hash: 16a818525b36267aa7376debf0f3ede37075290c
gerado_em: 2026-06-26T00:33:19
---

# `src/app/manifest.ts`

```markdown
# src/app/manifest.ts

## Responsabilidade
Define o manifesto PWA (Progressive Web App) da aplicação "Preservando Memórias".

## O que faz
- Exporta uma função `manifest()` que retorna um objeto `MetadataRoute.Manifest` do Next.js.
- Configura nome, descrição, cores e ícones do PWA.
- Define `display: "standalone"` para experiência de aplicativo nativo.

## Parâmetros/Props
- Nenhum (função sem parâmetros).

## APIs/Endpoints
- Consome: `next` (tipo `MetadataRoute.Manifest`).
- Não define endpoints.

## Conexões
- Usado pelo Next.js para gerar o arquivo `/manifest.json` automaticamente.
- Ícones referenciam `/images/logo.png` (deve existir em `public/`).
```

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** next

## 📤 Exporta
`default`, `manifest`

## 🧠 Funções/Componentes definidos
`manifest`

