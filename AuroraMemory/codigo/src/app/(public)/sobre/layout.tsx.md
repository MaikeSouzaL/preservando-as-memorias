---
origem: src/app/(public)/sobre/layout.tsx
origem_hash: 673df5dc2cac2b7687ebd169b28a9c1a50b2a7a3
gerado_em: 2026-06-26T00:33:20
---

# `src/app/(public)/sobre/layout.tsx`

```markdown
## `src/app/(public)/sobre/layout.tsx`

**Responsabilidade:** Layout raiz da rota `/sobre`, servindo como wrapper para páginas filhas.

- **`ScreenLayout`** (componente assíncrono): Renderiza `{children}` diretamente, sem estrutura visual própria. Executa `loadScreenData()` (atualmente retorna `null`) para carregamento de dados antes da renderização.
- **Props:** `children` (React.ReactNode) — conteúdo das páginas aninhadas.
- **Ligações:** Consumido pelo Next.js como layout da rota `/sobre`; páginas filhas são injetadas via `children`.
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

