---
origem: src/app/(admin)/admin/page.tsx
origem_hash: 96894d32b5db782c60e99b914aa61eaf5290bf32
gerado_em: 2026-06-25T23:37:29
---

# `src/app/(admin)/admin/page.tsx`

### Admin Index Page

**Responsabilidade:** Redireciona automaticamente da raiz `/admin` para `/admin/dashboard`.

**Componente:**
- `AdminIndexPage` (default): Componente servidor que executa `redirect("/admin/dashboard")` do Next.js.

**Parâmetros/Props:** Nenhum.

**APIs/Endpoints:** Nenhum (apenas redirecionamento interno).

**Conexões:**
- Importa `redirect` de `next/navigation`
- Redireciona para `/admin/dashboard` (página de dashboard administrativo)

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** next/navigation

## 📤 Exporta
`AdminIndexPage`, `default`

## 🧠 Funções/Componentes definidos
`AdminIndexPage`

## 📞 O que cada função chama
- `AdminIndexPage()` → redirect

