---
origem: src/app/(public)/convite/[slug]/page.tsx
origem_hash: 02a476cdc11946106e58988bcbf1f9de4cca4dd3
gerado_em: 2026-06-26T00:33:20
---

# `src/app/(public)/convite/[slug]/page.tsx`

# ConvitePage

**Responsabilidade:** Página pública de convite para funerárias se cadastrarem na plataforma.

## Funcionalidades

- **Leitura de dados:** Busca dados da plataforma via `readPlatformData()`
- **Validação de convite:** Localiza convite por `slug` e verifica se está ativo; caso contrário, retorna 404
- **Exibição de condições:** Mostra comissão, plano ativo (com nome, descrição, limite de memoriais e validade) ou mensagem padrão
- **Redirecionamento:** Link para cadastro (`/funeraria/cadastro?invite={slug}`) e login (`/funeraria/login`)

## Props

- `params`: `Promise<{ slug: string }>` — slug do convite (rota dinâmica)

## Relações

- **Importa:** `readPlatformData` (leitura de dados), `cycleLabel` (formatação de ciclo)
- **Renderiza:** `Link` do Next.js para navegação interna
- **Exporta:** Componente padrão com `dynamic = "force-dynamic"`

<!-- aurora:relacoes -->

## 🔗 Importa
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- [[platform-types.ts]] — `src/lib/platform-types.ts`
- **Externos/APIs:** next/link, next/navigation

## 📤 Exporta
`ConvitePage`, `default`, `dynamic`

## 🧩 Componentes usados
Link

## 📥 Props recebidas
params

## 🧠 Funções/Componentes definidos
`ConvitePage`

## 📞 O que cada função chama
- `ConvitePage()` → cycleLabel, find, notFound, readPlatformData, toLocaleDateString

## 🔁 Chama (arquivos)
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- [[platform-types.ts]] — `src/lib/platform-types.ts`

