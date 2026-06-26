---
origem: src/app/(public)/splash/layout.tsx
origem_hash: 328bb54e99adac9935f383ead23d2daf226c83fe
gerado_em: 2026-06-26T00:33:20
---

# `src/app/(public)/splash/layout.tsx`

```markdown
# `src/app/(public)/splash/layout.tsx`

## Responsabilidade
Layout raiz da rota `/splash`, responsável por carregar dados assíncronos antes de renderizar o conteúdo filho.

## Componente principal
- **`ScreenLayout`** (default export): componente assíncrono que:
  - Aguarda `loadScreenData()` (atualmente retorna `null`, sem efeito real)
  - Renderiza `{children}` sem qualquer wrapper ou estrutura adicional

## Props
- `children: React.ReactNode` — conteúdo da página filha (rota aninhada)

## Relações
- Consumido pelo roteador Next.js como layout da rota `/splash`
- Envolve páginas filhas (ex.: `page.tsx` dentro da mesma pasta)
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

