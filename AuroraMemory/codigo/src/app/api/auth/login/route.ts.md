---
origem: src/app/api/auth/login/route.ts
origem_hash: e33ec484b7e553cddd57debd88a4559d704ee412
gerado_em: 2026-06-25T23:37:29
---

# `src/app/api/auth/login/route.ts`

# `POST /api/auth/login` — Autenticação de usuário

**Responsabilidade:** Endpoint de login que autentica usuário via e-mail/senha e retorna perfil e sessão.

**Função principal:**
- `POST(request)`: Processa login com rate limit (5 tentativas/15min), valida credenciais via Supabase Auth, busca perfil na tabela `profiles` e retorna dados do usuário.

**Retorno (JSON):**
- `profile`: Dados completos do perfil (nome, email, bio, tema, privacidade, notificações, idioma, fuso, áudio, roles admin, avatar)
- `session`: Dados reduzidos para sessão (email, roles admin, userId)

**Dependências:**
- `src/lib/rate-limit.ts` — Controle de taxa de requisições
- `src/lib/supabase.ts` — Cliente Supabase server-side
- Tabela `profiles` — Busca dados complementares do usuário

<!-- aurora:relacoes -->

## 🔗 Importa
- [[rate-limit.ts]] — `src/lib/rate-limit.ts`
- [[supabase.ts]] — `src/lib/supabase.ts`
- **Externos/APIs:** next/server, profiles

## 📤 Exporta
`POST`, `dynamic`

## 🧠 Funções/Componentes definidos
`POST`, `asString`

## 📞 O que cada função chama
- `POST()` → asString, checkRateLimit, createClientServer, eq, error, from, json, select, signInWithPassword, single, toLowerCase
- `asString()` → trim

## 🔁 Chama (arquivos)
- [[rate-limit.ts]] — `src/lib/rate-limit.ts`
- [[supabase.ts]] — `src/lib/supabase.ts`

