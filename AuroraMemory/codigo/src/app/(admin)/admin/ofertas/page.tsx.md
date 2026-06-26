---
origem: src/app/(admin)/admin/ofertas/page.tsx
origem_hash: ae30f03577f741e2fbfb2779499bccd51153de0c
gerado_em: 2026-06-25T23:37:30
---

# `src/app/(admin)/admin/ofertas/page.tsx`

# AdminOfertasPage

Página administrativa para gerenciamento de ofertas (links de cadastro) para funerárias.

## Responsabilidade
CRUD de ofertas com preço próprio para funerárias, gerando links públicos para cadastro de falecidos e geração de QR Code pós-pagamento.

## Funcionalidades
- **Listagem**: exibe ofertas com status, preço, acessos e conversões
- **Criação**: formulário com seleção de funerária, título, ciclo (mensal/anual/único), preço em centavos e descrição
- **Ações**: copiar link público, pausar/ativar status, excluir oferta
- **Métricas**: cards com total de ofertas ativas, acessos e conversões

## APIs consumidas
- `GET /api/admin/offer-links` — carrega ofertas e funerárias
- `POST /api/admin/offer-links` — cria nova oferta
- `PATCH /api/admin/offer-links` — altera status (ativo/pausado)
- `DELETE /api/admin/offer-links?id=` — exclui oferta

## Props do componente interno `Metric`
- `label: string` — nome da métrica
- `value: string` — valor exibido
- `highlight?: boolean` — destaca com cor terciária

## Dependências
- `FuneralHomeOfferLink` (src/lib/platform-data)
- `centsToBRL`, `cycleLabel` (src/lib/platform-types)

<!-- aurora:relacoes -->

## 🔗 Importa
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- [[platform-types.ts]] — `src/lib/platform-types.ts`
- **Externos/APIs:** react

## 📤 Exporta
`AdminOfertasPage`, `default`

## 🧩 Componentes usados
FuneralHome, FuneralHomeOfferLink, Metric

## 🪝 Hooks / efeitos
useCallback, useEffect, useState

## 📥 Props recebidas
highlight, label, value

## 🧠 Funções/Componentes definidos
`AdminOfertasPage`, `Metric`, `handleCopyLink`, `handleCreate`, `handleDelete`, `handlePriceBlur`, `handlePriceChange`, `handleToggleStatus`, `init`

## 📞 O que cada função chama
- `AdminOfertasPage()` → Boolean, centsToBRL, cycleLabel, fetch, filter, find, handleCopyLink, handleDelete, handlePriceChange, handleToggleStatus, init, isArray, json, map, reduce, setFormData, setFuneralHomes, setIsLoading, setOffers, setShowForm, toString, useCallback, useEffect, useState
- `handleCopyLink()` → setCopiedId, setTimeout, writeText
- `handleCreate()` → fetch, loadOffers, preventDefault, setFormData, setPriceInput, setShowForm, stringify
- `handleDelete()` → confirm, fetch, loadOffers
- `handlePriceBlur()` → setPriceInput, toLocaleString
- `handlePriceChange()` → isNaN, parseFloat, replace, round, setFormData, setPriceInput
- `handleToggleStatus()` → fetch, loadOffers, stringify
- `init()` → loadOffers

## 🔁 Chama (arquivos)
- [[platform-types.ts]] — `src/lib/platform-types.ts`

