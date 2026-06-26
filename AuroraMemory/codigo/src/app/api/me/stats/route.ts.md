---
origem: src/app/api/me/stats/route.ts
origem_hash: 4406558a92072ffa6f87fae4578aecebf814b5ec
gerado_em: 2026-06-25T23:37:29
---

# `src/app/api/me/stats/route.ts`

```markdown
## `src/app/api/me/stats/route.ts`

**Responsabilidade:** Endpoint GET `/api/me/stats` que retorna estatísticas do usuário autenticado.

**Funcionalidades:**
- **GET:** Verifica sessão (401 se ausente), filtra dados da plataforma (memoriais, tributos, velas, pedidos) pelo usuário logado (ou admin vê tudo). Retorna contagens e flag `hasNotifications` (tributos/velas pendentes ou pedidos com status "pending").

**Dependências:**
- `getAuthSession()` (auth-session) – obtém sessão do usuário.
- `readPlatformData()` (platform-data) – carrega dados completos da plataforma.

**Saída:** JSON com `hasNotifications`, `memorialsCount`, `tributesCount`, `candlesCount`, `ordersCount`.
```

<!-- aurora:relacoes -->

## 🔗 Importa
- [[auth-session.ts]] — `src/lib/auth-session.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- **Externos/APIs:** next/server

## 📤 Exporta
`GET`, `dynamic`

## 🧠 Funções/Componentes definidos
`GET`

## 📞 O que cada função chama
- `GET()` → filter, getAuthSession, has, json, map, readPlatformData, some, toLowerCase, trim

## 🔁 Chama (arquivos)
- [[auth-session.ts]] — `src/lib/auth-session.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`

