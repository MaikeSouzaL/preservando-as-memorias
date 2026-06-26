---
origem: src/app/(private)/homenagens/page.tsx
origem_hash: 0678be8cd7fbf40b876b59e64593fd83287591fa
gerado_em: 2026-06-25T23:37:29
---

# `src/app/(private)/homenagens/page.tsx`

# `src/app/(private)/homenagens/page.tsx`

## Página de Homenagens (Área Privada)

**Responsabilidade:** Exibe homenagens, velas, flores e corações dos memoriais do usuário logado.

### Funcionalidades principais:
- **Autenticação:** Redireciona para `/login` se não houver sessão ativa
- **Filtragem:** Exibe apenas memoriais do usuário (admin vê todos)
- **Métricas:** Calcula totais de homenagens, velas, flores e corações
- **Destaque:** Mostra a primeira homenagem como destaque, demais em lista

### APIs/Endpoints consumidos:
- `getAuthSession()` — sessão do usuário
- `readPlatformData()` — dados da plataforma (memoriais, homenagens, velas)

### Props/Parâmetros:
- Nenhum (página server-side, sem props)

### Conexões:
- **Auth:** `src/lib/auth-session.ts`
- **Dados:** `src/lib/platform-data.ts`
- **Navegação:** `next/link` para `/memoriais/lista`
- **Imagens:** `next/image` para imagem do primeiro memorial

<!-- aurora:relacoes -->

## 🔗 Importa
- [[auth-session.ts]] — `src/lib/auth-session.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- **Externos/APIs:** next/image, next/link, next/navigation

## 📤 Exporta
`HomenagensPage`, `default`, `dynamic`

## 🧩 Componentes usados
Image, Link

## 🧠 Funções/Componentes definidos
`HomenagensPage`

## 📞 O que cada função chama
- `HomenagensPage()` → filter, getAuthSession, has, map, readPlatformData, redirect, reduce, slice, toLocaleDateString, toLowerCase, toUpperCase, trim

## 🔁 Chama (arquivos)
- [[auth-session.ts]] — `src/lib/auth-session.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`

