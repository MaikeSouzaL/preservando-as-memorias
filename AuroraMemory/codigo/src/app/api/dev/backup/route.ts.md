---
origem: src/app/api/dev/backup/route.ts
origem_hash: de2e3d2ed6c03d73b186f65628e431315272b478
gerado_em: 2026-06-25T23:37:29
---

# `src/app/api/dev/backup/route.ts`

# API de Backup do Sistema

**Responsabilidade:** Endpoint exclusivo para administradores gerarem backup completo da plataforma.

## Componentes

- **`GET`**: Rota protegida que exporta todos os dados do sistema em JSON
- **`dynamic = "force-dynamic"`**: Garante execução em tempo real (sem cache)

## Funcionalidades

- Autenticação via `getAuthSession()`
- Restrição a `isDevAdmin` (status 401/403)
- Leitura completa via `readPlatformData()`
- Sanitização de dados sensíveis (bankPixKey, bankCpfCnpj)
- Redução de perfis (remove campos sensíveis como senhas)
- Metadados: `exportedAt`, `exportedBy`, `version: "1.0"`

## Dependências

- **`src/lib/auth-session.ts`**: Sessão do usuário
- **`src/lib/platform-data.ts`**: Leitura de todos os dados da plataforma

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
- `GET()` → getAuthSession, json, map, readPlatformData, toISOString

## 🔁 Chama (arquivos)
- [[auth-session.ts]] — `src/lib/auth-session.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`

