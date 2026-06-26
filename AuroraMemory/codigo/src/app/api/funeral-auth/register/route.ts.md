---
origem: src/app/api/funeral-auth/register/route.ts
origem_hash: c7a0addd38d56ac4067eb5834da45254a156c441
gerado_em: 2026-06-26T00:33:20
---

# `src/app/api/funeral-auth/register/route.ts`

# `POST /api/funeral-auth/register`

Registra uma nova funerária na plataforma.

## Funcionalidade

- **Valida campos obrigatórios**: nome, email, senha (≥8 caracteres), contato e telefone
- **Valida formato do email** com regex
- **Gera slug único** a partir do nome + timestamp
- **Processa convite** (`inviteSlug`): aplica comissão, plano ativo e data de renovação do convite, marcando-o como `used`
- **Cria funerária** com status `pending` e `isActive: false`
- **Retorna** dados da funerária (sem `passwordHash`) + mensagem de aprovação pendente

## Dependências

- `updatePlatformData` (src/lib/platform-data): mutação atômica dos dados da plataforma
- `hashPassword` (src/lib/password): hash da senha antes de armazenar

<!-- aurora:relacoes -->

## 🔗 Importa
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- **Externos/APIs:** @/src/lib/password, next/server

## 📤 Exporta
`POST`, `dynamic`

## 🧠 Funções/Componentes definidos
`POST`, `asString`

## 📞 O que cada função chama
- `POST()` → asString, find, hashPassword, json, normalize, now, push, replace, slice, test, toISOString, toLowerCase, toString, updatePlatformData
- `asString()` → trim

## 🔁 Chama (arquivos)
- [[platform-data.ts]] — `src/lib/platform-data.ts`

