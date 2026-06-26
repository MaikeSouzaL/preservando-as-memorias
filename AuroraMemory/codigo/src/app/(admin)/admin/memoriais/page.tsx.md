---
origem: src/app/(admin)/admin/memoriais/page.tsx
origem_hash: 004f0870beae087dd1c641612dc452765441cc42
gerado_em: 2026-06-25T23:37:30
---

# `src/app/(admin)/admin/memoriais/page.tsx`

### `src/app/(admin)/admin/memoriais/page.tsx`

**Responsabilidade:** Página de listagem de memoriais (admin), renderizada no servidor.

**Função principal:**
- `AdminMemorialsPage` (async, default): Busca dados da plataforma e sessão do usuário em paralelo, então renderiza o componente cliente `MemoriaisPageClient`.

**Props passadas para `MemoriaisPageClient`:**
- `memorials`: lista de memoriais (`data.memorials`)
- `adminUserId`: ID do usuário logado (`session.userId`)

**APIs/Endpoints:** Nenhum — consome dados via `readPlatformData()` e `getAuthSession()`.

**Conexões:**
- Importa `readPlatformData` (dados da plataforma) e `getAuthSession` (sessão do usuário)
- Delega a UI interativa para `MemoriaisPageClient`
- Exporta `dynamic = "force-dynamic"` para garantir renderização sempre no servidor

<!-- aurora:relacoes -->

## 🔗 Importa
- [[memoriais-page-client.tsx]] — `src/components/admin/memoriais-page-client.tsx`
- [[auth-session.ts]] — `src/lib/auth-session.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`

## 📤 Exporta
`AdminMemorialsPage`, `default`, `dynamic`

## 🧩 Componentes usados
MemoriaisPageClient

## 🧠 Funções/Componentes definidos
`AdminMemorialsPage`

## 📞 O que cada função chama
- `AdminMemorialsPage()` → all, getAuthSession, readPlatformData

## 🔁 Chama (arquivos)
- [[auth-session.ts]] — `src/lib/auth-session.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`

