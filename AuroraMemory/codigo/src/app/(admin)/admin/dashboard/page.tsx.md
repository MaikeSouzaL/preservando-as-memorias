---
origem: src/app/(admin)/admin/dashboard/page.tsx
origem_hash: 77453ff2602aab9f35dbd52cee9c1d7aa6122c3a
gerado_em: 2026-06-26T00:33:20
---

# `src/app/(admin)/admin/dashboard/page.tsx`

# Admin Dashboard Page

## Responsabilidade
Página principal do painel administrativo que exibe métricas da plataforma, entregas pendentes e estatísticas em tempo real.

## Componentes Chave

- **AdminDashboardPage** (async): Componente principal que carrega dados via `readPlatformData()` e renderiza todo o dashboard
- **StatCard**: Card de métrica com ícone, valor, delta e efeito glow opcional
- **ProgressItem**: Barra de progresso com label e valor

## Funcionalidades

- **Entregas Pendentes**: Lista memoriais com endereço de entrega sem QR Code enviado (`!m.qrSentAt`)
- **Estatísticas**: Usuários, memoriais, QR codes, receita, homenagens e interações
- **Gráfico de Crescimento**: Receita dos últimos 6 meses em barras
- **Tabela de Usuários Recentes**: Últimos 4 pedidos com plano e status
- **Armazenamento**: Círculo de progresso (10 GB limite)
- **IA Premium**: Restaurações de fotos e biografias geradas

## Dados Consumidos
- `readPlatformData()`: Função que retorna dados completos da plataforma (memoriais, pedidos, QR codes, etc.)

<!-- aurora:relacoes -->

## 🔗 Importa
- [[mark-sent-button.tsx]] — `src/components/admin/mark-sent-button.tsx`
- [[platform-data.ts]] — `src/lib/platform-data.ts`

## 📤 Exporta
`AdminDashboardPage`, `default`, `dynamic`

## 🧩 Componentes usados
MarkSentButton, ProgressItem, StatCard

## 📥 Props recebidas
delta, glow, icon, label, title, value, width

## 🧠 Funções/Componentes definidos
`AdminDashboardPage`, `ProgressItem`, `StatCard`

## 📞 O que cada função chama
- `AdminDashboardPage()` → filter, find, forEach, from, getFullYear, getMonth, getTime, map, max, min, readPlatformData, reduce, replace, reverse, round, setMonth, slice, toFixed, toLocaleDateString, toLocaleString, toString, toUpperCase

## 🔁 Chama (arquivos)
- [[platform-data.ts]] — `src/lib/platform-data.ts`

