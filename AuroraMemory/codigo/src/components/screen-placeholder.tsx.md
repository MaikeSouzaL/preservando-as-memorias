---
origem: src/components/screen-placeholder.tsx
origem_hash: 2a5df1671c77104a419c373e0bf4d5c7a5872bd6
gerado_em: 2026-06-25T23:37:25
---

# `src/components/screen-placeholder.tsx`

# ScreenPlaceholder

Componente de placeholder para telas em desenvolvimento. Exibe título, descrição, área funcional e rota associada, com links de navegação.

## Props

- `title`: Título da tela
- `description`: Descrição do conteúdo
- `area`: Categoria/área funcional (ex: "Dashboard")
- `routePath`: Caminho da rota associada

## Estrutura

- Cabeçalho com área, título e descrição
- Card informativo exibindo a rota em `<code>`
- Links para `/dashboard` e `/login` usando `next/link`

## Uso

Utilizado como placeholder visual durante desenvolvimento, indicando telas ainda não implementadas.

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** next/link

## 📤 Exporta
`ScreenPlaceholder`

## 🧩 Componentes usados
Link

## 📥 Props recebidas
area, description, routePath, title

## 🧠 Funções/Componentes definidos
`ScreenPlaceholder`

