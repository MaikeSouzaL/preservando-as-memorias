---
origem: src/app/(public)/login/acesso/page.tsx
origem_hash: 1f174e0256959a21fe4e03a401d2524a9c1241f6
gerado_em: 2026-06-26T00:33:20
---

# `src/app/(public)/login/acesso/page.tsx`

### `src/app/(public)/login/acesso/page.tsx`

**Responsabilidade:** Redireciona a rota `/login/acesso` para `/login`.

**Componente:**
- `LegacyLoginAcessoPage` (default): Componente de servidor Next.js que chama `redirect("/login")` imediatamente.

**Parâmetros/Props:** Nenhum.

**APIs/Endpoints:** Não define nem consome APIs externas; usa `redirect` do `next/navigation`.

**Conexões:** Serve como rota de fallback/legado, redirecionando para a rota principal de login (`/login`).

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** next/navigation

## 📤 Exporta
`LegacyLoginAcessoPage`, `default`

## 🧠 Funções/Componentes definidos
`LegacyLoginAcessoPage`

## 📞 O que cada função chama
- `LegacyLoginAcessoPage()` → redirect

