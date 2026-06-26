---
origem: src/app/api/auth/logout/route.ts
origem_hash: f45b327f0dfec375c7e47044953958504d5e95b5
gerado_em: 2026-06-26T00:33:20
---

# `src/app/api/auth/logout/route.ts`

```markdown
# API de Logout

## Responsabilidade
Endpoint de logout que invalida a sessão do usuário no Supabase.

## Componentes

- **`POST()`**: Handler assíncrono que:
  1. Cria cliente Supabase server-side
  2. Executa `signOut()` para encerrar sessão
  3. Retorna `{ success: true }` em JSON

## Configuração
- `dynamic = "force-dynamic"`: Garante execução em runtime (sem cache)

## Conexões
- **Importa**: `createClientServer` de `src/lib/supabase.ts`
- **Consome**: API interna do Supabase Auth
- **Usa**: `NextResponse` do Next.js
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
- `POST()` → createClientServer, json, signOut

## 🔁 Chama (arquivos)
- [[supabase.ts]] — `src/lib/supabase.ts`

