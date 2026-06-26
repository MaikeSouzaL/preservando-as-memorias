---
origem: src/app/(public)/planos/layout.tsx
origem_hash: f9ae610db5d1f00b977e3d45e1df81cbd4e10d74
gerado_em: 2026-06-25T23:37:29
---

# `src/app/(public)/planos/layout.tsx`

```markdown
# `src/app/(public)/planos/layout.tsx`

## Responsabilidade
Layout raiz da rota `/planos` (pública). Carrega dados assíncronos antes de renderizar o conteúdo filho.

## Componente principal
- **`ScreenLayout`** (default, assíncrono): recebe `children` (ReactNode) como prop. Executa `loadScreenData()` (função que atualmente retorna `null`) e renderiza os filhos diretamente (`<>{children}</>`).

## Conexões
- Define o layout para todas as páginas dentro da rota `/planos`.
- Consome dados via `loadScreenData` (placeholder para futura carga de dados).
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

