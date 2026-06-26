---
origem: src/app/(public)/planos/page.tsx
origem_hash: a1fe9591160247b45669ebbb344215cacd0c5d16
gerado_em: 2026-06-26T00:33:20
---

# `src/app/(public)/planos/page.tsx`

# `src/app/(public)/planos/page.tsx`

## Responsabilidade
Página pública de listagem de planos de assinatura, exibindo cards com preço, ciclo, descrição e funcionalidades de cada plano ativo.

## Componente principal
- **`PlanosPage`** (async, server component): carrega dados via `readPlatformData()`, filtra planos ativos e renderiza grid de cards ou estado vazio.

## Funcionalidades
- **Estado vazio**: quando não há planos ativos, exibe mensagem "Em breve por aqui" com links para `/contato` e `/`.
- **Cards de plano**: cada card mostra nome, preço (formatado por `centsToBRL`), ciclo (`cycleLabel`), descrição, lista de features e botão "Escolher plano" que redireciona para `/checkout?plan={id}`.
- **Destaque**: plano correspondente a `data.config.defaultPlanId` recebe badge "Mais popular" e estilo diferenciado.

## Props/Parâmetros
- Nenhum (página estática com `dynamic = "force-dynamic"`)

## Dependências
- **`readPlatformData`** (src/lib/platform-data.ts): obtém configuração de planos
- **`centsToBRL`**, **`cycleLabel`** (src/lib/platform-types.ts): formatação de preço e ciclo
- **`Link`** (next/link): navegação para `/checkout`, `/contato` e `/`

<!-- aurora:relacoes -->

## 🔗 Importa
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- [[platform-types.ts]] — `src/lib/platform-types.ts`
- **Externos/APIs:** next/link

## 📤 Exporta
`PlanosPage`, `default`, `dynamic`

## 🧩 Componentes usados
Link

## 🧠 Funções/Componentes definidos
`PlanosPage`

## 📞 O que cada função chama
- `PlanosPage()` → centsToBRL, cycleLabel, filter, map, readPlatformData

## 🔁 Chama (arquivos)
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- [[platform-types.ts]] — `src/lib/platform-types.ts`

