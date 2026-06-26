---
origem: src/app/(admin)/admin/convites/page.tsx
origem_hash: 1b1a4ff35cf134501665b88a5db9fdde7029b0f6
gerado_em: 2026-06-26T00:33:20
---

# `src/app/(admin)/admin/convites/page.tsx`

```markdown
## `src/app/(admin)/admin/convites/page.tsx`

**Responsabilidade:** Página de administração de convites, servindo como entry point da rota `/admin/convites`.

**Componente principal:**
- `AdminConvitesPage` (default export): renderiza o `ConvitesPageClient` envolvido em `<Suspense>` com fallback "Carregando...".

**Configuração:**
- `dynamic = "force-dynamic"`: garante renderização dinâmica (sem cache estático).

**Relações:**
- **Importa:** `ConvitesPageClient` de `src/components/admin/convites-page-client.tsx` (componente que contém a lógica e UI da página).
- **Usa:** `Suspense` do React para lazy loading.
```

<!-- aurora:relacoes -->

## 🔗 Importa
- [[convites-page-client.tsx]] — `src/components/admin/convites-page-client.tsx`
- **Externos/APIs:** react

## 📤 Exporta
`AdminConvitesPage`, `default`, `dynamic`

## 🧩 Componentes usados
ConvitesPageClient, Suspense

## 🧠 Funções/Componentes definidos
`AdminConvitesPage`

