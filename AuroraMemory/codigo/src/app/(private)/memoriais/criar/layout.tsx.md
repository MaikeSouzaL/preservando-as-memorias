---
origem: src/app/(private)/memoriais/criar/layout.tsx
origem_hash: da9ba0d0c5de133a6b6ee6dc0be090f27ba19b1e
gerado_em: 2026-06-25T23:37:29
---

# `src/app/(private)/memoriais/criar/layout.tsx`

```markdown
## `src/app/(private)/memoriais/criar/layout.tsx`

**Responsabilidade:** Layout assíncrono para a rota de criação de memoriais.

- **`ScreenLayout` (default export):** Componente assíncrono que recebe `children` como prop. Executa `loadScreenData()` (atualmente retorna `null`, sem efeito) e renderiza os filhos diretamente, sem estrutura adicional.
- **Props:** `children: React.ReactNode` — conteúdo da página aninhada.
- **Conexão:** Envolve as páginas da rota `/memoriais/criar`, servindo como ponto para futura injeção de dados ou providers.
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

