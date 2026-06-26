---
origem: src/app/(admin)/admin/funerarias/page.tsx
origem_hash: d7fcd275fc0062bc799a87ec439c2505438047d4
gerado_em: 2026-06-25T23:37:30
---

# `src/app/(admin)/admin/funerarias/page.tsx`

```markdown
# `admin/funerarias/page.tsx` — Página de Listagem de Funerárias (Admin)

**Responsabilidade:** Rota `/admin/funerarias` que renderiza a listagem de funerárias com carregamento lazy.

**Estrutura:**
- `AdminFunerariasPage` (default export): Componente de página que envolve `FunerariasPageClient` em um `Suspense` com fallback "Carregando...".
- `dynamic = "force-dynamic"`: Garante renderização no servidor a cada requisição (sem cache estático).

**Dependências:**
- `FunerariasPageClient` (importado de `@/src/components/admin/funerarias-page-client`): Componente cliente que contém a lógica de listagem e interação.

**Fluxo:** A página servidor renderiza um placeholder de carregamento enquanto o componente cliente é carregado assincronamente.
```

<!-- aurora:relacoes -->

## 🔗 Importa
- [[funerarias-page-client.tsx]] — `src/components/admin/funerarias-page-client.tsx`
- **Externos/APIs:** react

## 📤 Exporta
`AdminFunerariasPage`, `default`, `dynamic`

## 🧩 Componentes usados
FunerariasPageClient, Suspense

## 🧠 Funções/Componentes definidos
`AdminFunerariasPage`

