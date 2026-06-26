---
origem: src/app/api/auth/reset-password/request/route.ts
origem_hash: f947c176ef4eeaf302cd51a83c941608a6447252
gerado_em: 2026-06-26T00:33:20
---

# `src/app/api/auth/reset-password/request/route.ts`

```markdown
## `src/app/api/auth/reset-password/request/route.ts`

**Responsabilidade:** Endpoint POST para solicitar redefinição de senha.

- **POST:** Aplica rate limit (3 req/hora), valida e-mail, e chama `supabase.auth.resetPasswordForEmail()` com redirect para `/auth/callback?next=/nova-senha`. Retorna sempre `{ success: true }` para evitar enumeração de e-mails.
- **Rate limit:** Usa `checkRateLimit` com chave `rl:reset-request`.
- **Dependências:** `createClientServer` (Supabase server client), `checkRateLimit`.
- **Config:** Lê `NEXT_PUBLIC_URL` para base do redirect.
```

<!-- aurora:relacoes -->

## 🔗 Importa
- [[rate-limit.ts]] — `src/lib/rate-limit.ts`
- [[supabase.ts]] — `src/lib/supabase.ts`
- **Externos/APIs:** next/server

## 📤 Exporta
`POST`, `dynamic`

## 🧠 Funções/Componentes definidos
`POST`

## 📞 O que cada função chama
- `POST()` → checkRateLimit, createClientServer, json, resetPasswordForEmail, toLowerCase, trim

## 🔁 Chama (arquivos)
- [[rate-limit.ts]] — `src/lib/rate-limit.ts`
- [[supabase.ts]] — `src/lib/supabase.ts`

