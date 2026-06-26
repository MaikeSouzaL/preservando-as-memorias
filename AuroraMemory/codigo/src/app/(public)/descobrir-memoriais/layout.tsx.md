---
origem: src/app/(public)/descobrir-memoriais/layout.tsx
origem_hash: b052c52f94f768b04fa985aa735320c39c7e560a
gerado_em: 2026-06-25T23:37:29
---

# `src/app/(public)/descobrir-memoriais/layout.tsx`

```markdown
## `src/app/(public)/descobrir-memoriais/layout.tsx`

**Responsabilidade:** Layout raiz da rota `/descobrir-memoriais`. Atua como wrapper assíncrono para carregar dados antes da renderização dos filhos.

**Componente principal:**
- `ScreenLayout` (default): componente assíncrono que recebe `children` como prop. Executa `loadScreenData()` (atualmente retorna `null`) e renderiza os filhos sem qualquer estrutura adicional.

**Props:**
- `children: React.ReactNode` — conteúdo aninhado da rota.

**Integração:** Serve como layout pai para todas as páginas sob `/descobrir-memoriais`, permitindo carregamento de dados compartilhados (placeholder no momento).
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

