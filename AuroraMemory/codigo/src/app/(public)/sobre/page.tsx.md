---
origem: src/app/(public)/sobre/page.tsx
origem_hash: a48ad95b597badc40ce34598e98a643b5d3d01e9
gerado_em: 2026-06-25T23:37:29
---

# `src/app/(public)/sobre/page.tsx`

```markdown
# src/app/(public)/sobre/page.tsx

## Responsabilidade
Página "Sobre" pública da plataforma, apresentando a história, missão e valores institucionais.

## Componente principal
- **SobrePage** (default): Página estática que renderiza:
  - Header com título e texto de história (`publicContent.about.story`)
  - Seção "Nossa missão" (`publicContent.about.mission`)
  - Grid de cards de valores (`publicContent.about.values`)
  - Links de navegação para `/planos` e `/contato`

## Dependências
- **`publicContent`** (de `@/src/mock-db/public-content`): fornece dados de conteúdo estático (about.story, about.mission, about.values)
- **`Link`** (Next.js): navegação interna para páginas de planos e contato

## Conexões
- Consome dados mockados de `public-content.ts`
- Navega para rotas públicas `/planos` e `/contato`
```

<!-- aurora:relacoes -->

## 🔗 Importa
- [[public-content.ts]] — `src/mock-db/public-content.ts`
- **Externos/APIs:** next/link

## 📤 Exporta
`SobrePage`, `default`

## 🧩 Componentes usados
Link

## 🧠 Funções/Componentes definidos
`SobrePage`

## 📞 O que cada função chama
- `SobrePage()` → map

## 🔁 Chama (arquivos)
- [[public-content.ts]] — `src/mock-db/public-content.ts`

