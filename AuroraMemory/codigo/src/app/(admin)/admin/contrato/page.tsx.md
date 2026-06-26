---
origem: src/app/(admin)/admin/contrato/page.tsx
origem_hash: ab1ee9d958a6f6ad5c4854577eb5bc9e402f4423
gerado_em: 2026-06-25T23:37:30
---

# `src/app/(admin)/admin/contrato/page.tsx`

# Página de Contrato de Parceria (Admin)

**Responsabilidade:** Gerenciar o aceite do contrato de parceria comercial entre o Admin e a Plataforma, e permitir a geração de contratos para funerárias parceiras.

## Componentes

- **`ContratoPage`** (default): Página principal que exibe o texto do contrato, gerencia o aceite do admin via `POST /api/admin/contracts` e renderiza a seção de contratos com funerárias.
- **`FuneralContractsSection`**: Lista funerárias aprovadas e permite gerar contratos (`POST /api/admin/contracts` com `type: "admin_to_funeral"`). Consome `GET /api/admin/funeral-homes` e `GET /api/admin/contracts`.

## Funcionalidades

- Exibe contrato fixo (versão `1.0`) em formato de texto
- Checkbox de aceite + botão para registrar assinatura
- Indicador visual de contrato já aceito (data e versão)
- Geração individual de contratos para funerárias aprovadas
- Estados de loading, erro e desabilitado

## Integrações

- **`AdminShell`**: Layout administrativo que envolve a página
- **API `/api/admin/contracts`**: GET (status/contratos) e POST (assinatura/geração)
- **API `/api/admin/funeral-homes`**: GET (lista de funerárias aprovadas)

<!-- aurora:relacoes -->

## 🔗 Importa
- [[admin-shell.tsx]] — `src/components/admin/admin-shell.tsx`
- **Externos/APIs:** react

## 📤 Exporta
`ContratoPage`, `default`

## 🧩 Componentes usados
AdminShell, ContractStatus, FuneralContractsSection

## 🪝 Hooks / efeitos
useEffect, useState

## 🧠 Funções/Componentes definidos
`ContratoPage`, `FuneralContractsSection`, `generate`, `handleSign`

## 📞 O que cada função chama
- `ContratoPage()` → catch, fetch, json, setChecked, setStatus, then, toLocaleString, useEffect, useState
- `FuneralContractsSection()` → all, fetch, filter, find, generate, json, map, setContracts, setHomes, setLoading, then, toLocaleDateString, useEffect, useState
- `generate()` → fetch, filter, json, setContracts, setGenerating, stringify
- `handleSign()` → fetch, json, setError, setSigning, setStatus, stringify, toISOString

