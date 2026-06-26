---
origem: src/app/(public)/landing/layout.tsx
origem_hash: f27d99bcf5f703ae5657e83612961aa7ebd5243b
gerado_em: 2026-06-26T00:33:20
---

# `src/app/(public)/landing/layout.tsx`

```markdown
# `src/app/(public)/landing/layout.tsx`

## Responsabilidade
Layout raiz da rota `/landing`, responsável por carregar dados assíncronos antes de renderizar o conteúdo da página.

## Estrutura
- **`ScreenLayout`** (default export): Componente assíncrono que:
  - Aguarda `loadScreenData()` (atualmente retorna `null`, sem efeito real)
  - Renderiza `{children}` diretamente (sem wrapper HTML adicional)

## Props
- `children: React.ReactNode` — conteúdo da página aninhada na rota `/landing`

## Conexões
- Consumido pelo roteamento Next.js como layout da rota `/landing`
- Envolve páginas filhas (ex.: `page.tsx` em `/landing`)
```

<!-- aurora:relacoes -->

## 📤 Exporta
`ScreenLayout`, `default`

## 📥 Props recebidas
children

## 🧠 Funções/Componentes definidos
`ScreenLayout`, `loadScreenData`

## 📞 O que cada função chama
- `ScreenLayout()` → loadScreenData

