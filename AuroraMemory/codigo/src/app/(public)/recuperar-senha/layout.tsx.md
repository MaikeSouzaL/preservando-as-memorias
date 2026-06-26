---
origem: src/app/(public)/recuperar-senha/layout.tsx
origem_hash: 2fbe6cd49e327eb8d657f690c0c8dd0b2e891624
gerado_em: 2026-06-25T23:37:29
---

# `src/app/(public)/recuperar-senha/layout.tsx`

```markdown
# `src/app/(public)/recuperar-senha/layout.tsx`

**Responsabilidade:** Layout raiz da rota `/recuperar-senha` (pública). Envolve o conteúdo da página sem adicionar estrutura visual extra.

- **`ScreenLayout`** (default, async): Componente servidor que recebe `children` (ReactNode) e renderiza diretamente `<>{children}</>`.
- **`loadScreenData`** (async): Função auxiliar que retorna `null` (sem carregamento de dados externos).

**Props:** Apenas `children` (conteúdo aninhado da rota).

**Ligações:** Serve como layout pai para a página de recuperação de senha, herdando o grupo público `(public)`.
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

