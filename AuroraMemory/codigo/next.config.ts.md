---
origem: next.config.ts
origem_hash: deb12e66bb42b3213e944232bc937811de724fb5
gerado_em: 2026-06-26T00:33:19
---

# `next.config.ts`

### `next.config.ts` — Configuração do Next.js

**Responsabilidade:** Define configurações globais do framework Next.js para o projeto.

**Configurações principais:**
- `reactCompiler: true` — Habilita o compilador React otimizado do Next.js
- `images.remotePatterns` — Lista de domínios externos permitidos para carregamento de imagens via componente `next/image`:
  - `lh3.googleusercontent.com` (Google)
  - `images.unsplash.com` (Unsplash)
  - `res.cloudinary.com` (Cloudinary)
  - `xpgxfcsjkubkhmvkvzcu.supabase.co` (Supabase storage)

**Conexões:** Arquivo de configuração raiz consumido automaticamente pelo Next.js durante build e runtime. Não exporta componentes ou funções — apenas a configuração default.

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** next

## 📤 Exporta
`default`, `nextConfig`

