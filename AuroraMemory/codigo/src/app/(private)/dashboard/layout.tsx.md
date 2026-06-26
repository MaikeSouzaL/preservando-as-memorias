---
origem: src/app/(private)/dashboard/layout.tsx
origem_hash: d6509b9babca105047d38cc50a5205773a2824a2
gerado_em: 2026-06-25T23:37:29
---

# `src/app/(private)/dashboard/layout.tsx`

```markdown
## `src/app/(private)/dashboard/layout.tsx`

**Responsabilidade:** Layout raiz da rota privada `/dashboard`. Envolve o conteúdo da página e executa lógica de inicialização assíncrona antes da renderização.

**Componente principal:**
- `DashboardLayout` (async): recebe `children` (ReactNode) como prop. Chama `loadDashboardBootstrap()` (atualmente retorna `null`, sem efeito) e renderiza os filhos diretamente.

**Conexões:** É o layout pai de todas as páginas dentro da rota `(private)/dashboard/*`. Não define ou consome APIs externas.
```

<!-- aurora:relacoes -->

## 📤 Exporta
`DashboardLayout`, `default`

## 📥 Props recebidas
children

## 🧠 Funções/Componentes definidos
`DashboardLayout`, `loadDashboardBootstrap`

## 📞 O que cada função chama
- `DashboardLayout()` → loadDashboardBootstrap

