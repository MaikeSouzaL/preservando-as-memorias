---
origem: src/app/(public)/homenagens-publicas/page.tsx
origem_hash: ac2e9e4062656ce690ecd5e52d18152d0276fc27
gerado_em: 2026-06-25T23:37:29
---

# `src/app/(public)/homenagens-publicas/page.tsx`

# `src/app/(public)/homenagens-publicas/page.tsx`

**Responsabilidade:** Página pública que exibe o feed de homenagens aprovadas, com métricas e listagem de mensagens.

## Componentes e Funções

- **`HomenagensPublicasPage`** (default export, async): Página principal que carrega dados via `readPlatformData()`, filtra memoriais ativos e homenagens aprovadas, ordena por data decrescente e renderiza métricas + feed.
- **`Metric`**: Componente interno que exibe um card com `label` e `value` (ex: "Mensagens exibidas", "Memoriais ativos").
- **`formatDate`**: Formata data ISO para o padrão pt-BR (dd/mm/aaaa hh:mm).

## Props/Parâmetros

- `Metric`: `{ label: string; value: string }`

## Fluxo

1. Lê dados da plataforma via `readPlatformData()` (src/lib/platform-data.ts)
2. Filtra memoriais com `status === "ativo"` e homenagens com `status === "aprovada"`
3. Enriquece cada homenagem com o nome do memorial correspondente
4. Renderiza métricas, feed de mensagens ou estado vazio com link para `/descobrir-memoriais`

## Observações

- `dynamic = "force-dynamic"` garante renderização no servidor a cada requisição
- Usa `next/link` para navegação interna

<!-- aurora:relacoes -->

## 🔗 Importa
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- **Externos/APIs:** next/link

## 📤 Exporta
`HomenagensPublicasPage`, `default`, `dynamic`

## 🧩 Componentes usados
Link, Metric

## 📥 Props recebidas
label, value

## 🧠 Funções/Componentes definidos
`HomenagensPublicasPage`, `Metric`, `formatDate`

## 📞 O que cada função chama
- `HomenagensPublicasPage()` → filter, find, formatDate, getTime, map, readPlatformData, sort, toString
- `formatDate()` → format, getTime, isNaN

## 🔁 Chama (arquivos)
- [[platform-data.ts]] — `src/lib/platform-data.ts`

