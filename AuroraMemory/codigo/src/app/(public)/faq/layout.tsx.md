---
origem: src/app/(public)/faq/layout.tsx
origem_hash: b1f48ea58e7395c6e1bc4a5138c58d036c746c6c
gerado_em: 2026-06-26T00:33:20
---

# `src/app/(public)/faq/layout.tsx`

```markdown
# `src/app/(public)/faq/layout.tsx`

**Responsabilidade:** Layout raiz da rota `/faq` (pública). Carrega dados assíncronos antes de renderizar o conteúdo filho.

- **`ScreenLayout`** (componente assíncrono default): recebe `children` (ReactNode) como prop. Executa `loadScreenData()` (atualmente retorna `null`, sem efeito real) e renderiza apenas `{children}` — layout transparente, sem estrutura extra.

**Ligações:** É o layout da rota `/faq`, envolvendo o conteúdo da página FAQ. Não consome ou define APIs; apenas passa adiante os filhos.
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

