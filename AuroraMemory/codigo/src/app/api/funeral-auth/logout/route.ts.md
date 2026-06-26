---
origem: src/app/api/funeral-auth/logout/route.ts
origem_hash: 27cdd144ca85b412d569106c6d8795d8a86814bb
gerado_em: 2026-06-25T23:37:29
---

# `src/app/api/funeral-auth/logout/route.ts`

Este arquivo implementa a rota de logout da API de autenticação funerária.

**Responsabilidade:** Encerrar sessão do usuário removendo o cookie `funeral_session`.

**Componentes:**
- `dynamic = "force-dynamic"`: Garante execução em tempo real (sem cache estático)
- `POST()`: Handler que cria resposta JSON de sucesso e define o cookie `funeral_session` com `maxAge: 0` (expirado imediatamente)

**Configurações do cookie:** `httpOnly`, `secure` em produção, `sameSite: lax`, path raiz.

**Relações:** Consome `NextResponse` do `next/server`. É chamado pelo frontend para deslogar usuários do sistema funerário. Complementa a rota de login que define o mesmo cookie.

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** next/server

## 📤 Exporta
`POST`, `dynamic`

## 🧠 Funções/Componentes definidos
`POST`

## 📞 O que cada função chama
- `POST()` → json, set

