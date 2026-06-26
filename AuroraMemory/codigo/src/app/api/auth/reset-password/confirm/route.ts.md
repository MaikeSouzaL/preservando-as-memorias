---
origem: src/app/api/auth/reset-password/confirm/route.ts
origem_hash: a007f8960b54c51419ba102d79fb18fe0e1b6658
gerado_em: 2026-06-25T23:37:29
---

# `src/app/api/auth/reset-password/confirm/route.ts`

```markdown
# `src/app/api/auth/reset-password/confirm/route.ts`

**Responsabilidade:** Endpoint POST para confirmar a redefinição de senha, atualizando a senha do usuário no Supabase Auth.

**Função principal:**
- `POST(request)`: Lê `password` do corpo da requisição, valida mínimo de 8 caracteres, chama `supabase.auth.updateUser({ password })` e retorna sucesso ou erro.

**Parâmetros importantes:**
- `request.body.password` (string): nova senha do usuário.

**APIs/endpoints:**
- Define: `POST /api/auth/reset-password/confirm`
- Consome: `supabase.auth.updateUser()` (Supabase Auth)

**Conexões:**
- Importa `createClientServer` de `src/lib/supabase` para obter cliente autenticado do Supabase.
- Retorna `NextResponse` com JSON de erro ou sucesso.
```

<!-- aurora:relacoes -->

## 🔗 Importa
- [[supabase.ts]] — `src/lib/supabase.ts`
- **Externos/APIs:** next/server

## 📤 Exporta
`POST`, `dynamic`

## 🧠 Funções/Componentes definidos
`POST`

## 📞 O que cada função chama
- `POST()` → createClientServer, json, updateUser

## 🔁 Chama (arquivos)
- [[supabase.ts]] — `src/lib/supabase.ts`

