---
origem: next.config.mjs
origem_hash: 4b7811299a8a3567fcb36b71bb47b3b85cb1f277
gerado_em: 2026-06-29T18:30:57
---

# `next.config.mjs`

```markdown
# next.config.mjs

**Responsabilidade:** Configurar o comportamento do Next.js para o projeto.

**Configuração:**  
- `images.remotePatterns`: lista de origens externas autorizadas para carregamento de imagens via componente `next/image`.  
  - `lh3.googleusercontent.com` (Google)  
  - `images.unsplash.com` (Unsplash)  
  - `res.cloudinary.com` (Cloudinary)  
  - `xpgxfcsjkubkhmvkvzcu.supabase.co` (Supabase storage do projeto)

**Bibliotecas:** `next` (framework).

**Efeitos colaterais:** Nenhum em runtime; apenas define regras de segurança para carregamento de imagens.

**Ligação com outros arquivos:** Arquivo lido automaticamente pelo Next.js durante o build/serve ([documentação Next.js](https://nextjs.org/docs/pages/api-reference/next-config-js/images)).
```

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** next

## 📤 Exporta
`default`, `nextConfig`

