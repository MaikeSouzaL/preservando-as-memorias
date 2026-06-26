---
origem: src/data/platform-store.json
origem_hash: 8331d89348c94c8c3ce0a83f42428e8762022d54
gerado_em: 2026-06-26T00:33:19
---

# `src/data/platform-store.json`

# `platform-store.json` — Configuração da Loja da Plataforma

## Responsabilidade Principal
Arquivo de configuração central que define parâmetros de negócio da plataforma, incluindo planos de assinatura, comissões e preços.

## Estrutura e Campos Chave

- **`config`**: Objeto de configuração global
  - `ownerCommissionPercent`: 15 — comissão do proprietário (15%)
  - `defaultPlanId`: "essencial" — plano padrão para novos usuários
  - `candlePriceCents`: 100 — preço unitário de vela em centavos
  - `plans`: array de planos de assinatura disponíveis

- **Planos**: Cada plano possui `id` e `name` (ex.: "essencial")

## Relacionamentos
- Consumido por serviços que gerenciam assinaturas e cálculos de comissão
- Define valores usados em lógicas de precificação e planos padrão
- Serve como fonte única de verdade para configurações de negócio
