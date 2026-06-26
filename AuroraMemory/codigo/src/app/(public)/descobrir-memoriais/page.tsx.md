---
origem: src/app/(public)/descobrir-memoriais/page.tsx
origem_hash: 2f4884fa4a8285ad9ad036be20544eafd0f4c8fd
gerado_em: 2026-06-25T23:37:29
---

# `src/app/(public)/descobrir-memoriais/page.tsx`

## `src/app/(public)/descobrir-memoriais/page.tsx`

**Responsabilidade:** Página pública que lista todos os memoriais ativos para descoberta.

**Componentes chave:**
- **`DescobrirMemoriaisPage`** (async, default): Busca dados via `readPlatformData()`, filtra memoriais ativos ordenados por criação, e renderiza grid com cards de cada memorial
- **`Metric`**: Componente interno que exibe indicador numérico (label + valor)

**Props:** `Metric` recebe `label: string` e `value: string`

**Funcionalidades:**
- Exibe 3 métricas: total de memoriais públicos, visitas registradas, homenagens aprovadas
- Cada card de memorial mostra: foto, nome, datas, epitáfio, visitas, homenagens
- Links para `/memorial-publico` e `/qr-publico` (com `memorial.id` como query param)
- Estado vazio com link para `/planos`

**Integrações:** Consome `readPlatformData()` de `src/lib/platform-data.ts`; usa `next/image` e `next/link`

<!-- aurora:relacoes -->

## 🔗 Importa
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- **Externos/APIs:** next/image, next/link

## 📤 Exporta
`DescobrirMemoriaisPage`, `default`, `dynamic`

## 🧩 Componentes usados
Image, Link, Metric

## 📥 Props recebidas
label, value

## 🧠 Funções/Componentes definidos
`DescobrirMemoriaisPage`, `Metric`, `getYears`

## 📞 O que cada função chama
- `DescobrirMemoriaisPage()` → filter, getTime, getYears, map, readPlatformData, reduce, sort, toString
- `getYears()` → getFullYear

## 🔁 Chama (arquivos)
- [[platform-data.ts]] — `src/lib/platform-data.ts`

