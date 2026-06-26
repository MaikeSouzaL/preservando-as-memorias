---
origem: src/app/(private)/assinaturas/page.tsx
origem_hash: e203f2dc92bbc3e16c863be4365512bc0db0dae1
gerado_em: 2026-06-26T00:33:20
---

# `src/app/(private)/assinaturas/page.tsx`

# `src/app/(private)/assinaturas/page.tsx`

## Responsabilidade
Página de planos e assinaturas (rota privada `/assinaturas`). Exibe planos ativos, assinatura atual do usuário e permite navegação para checkout.

## Componente Principal
- **`AssinaturasPage`** (async, server component): Renderiza seção hero com imagem do memorial, plano ativo do usuário e grid de planos disponíveis.

## Lógica de Negócio
- Redireciona para `/login` se não autenticado
- Filtra pedidos e memoriais por usuário (ou admin vê tudo)
- Determina plano atual: último pedido pago ou primeiro plano ativo
- Calcula data de renovação (+1 mês da criação do pedido)

## Props/Parâmetros
- Nenhum (página sem props)
- `dynamic = "force-dynamic"` (desabilita cache)

## APIs/Endpoints
- **Consome**: `getAuthSession()` (autenticação), `readPlatformData()` (dados da plataforma)
- **Define links**: `/planos`, `/checkout?plan={nome}`

## Conexões
- **Importa**: `auth-session.ts`, `platform-data.ts`
- **Componentes**: `next/image`, `next/link`

<!-- aurora:relacoes -->

## 🔗 Importa
- [[auth-session.ts]] — `src/lib/auth-session.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- **Externos/APIs:** next/image, next/link, next/navigation

## 📤 Exporta
`AssinaturasPage`, `default`, `dynamic`

## 🧩 Componentes usados
Image, Link

## 🧠 Funções/Componentes definidos
`AssinaturasPage`, `formatPrice`

## 📞 O que cada função chama
- `AssinaturasPage()` → filter, find, formatPrice, getAuthSession, getMonth, map, pop, readPlatformData, redirect, setMonth, toLocaleDateString, toLowerCase, trim
- `formatPrice()` → toLocaleString

## 🔁 Chama (arquivos)
- [[auth-session.ts]] — `src/lib/auth-session.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`

