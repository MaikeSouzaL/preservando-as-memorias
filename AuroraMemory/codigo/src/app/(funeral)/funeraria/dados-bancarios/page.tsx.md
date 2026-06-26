---
origem: src/app/(funeral)/funeraria/dados-bancarios/page.tsx
origem_hash: 2d55f5548a012eccd958b143d8deada5ff43c158
gerado_em: 2026-06-25T23:37:29
---

# `src/app/(funeral)/funeraria/dados-bancarios/page.tsx`

# Dados Bancários - Funerária

Página de configuração de chave PIX para recebimento de repasses.

## Responsabilidade
Permite que a funerária cadastre/edite seus dados bancários (PIX) para receber repasses de vendas.

## Funcionalidades
- **Carregamento inicial**: Busca dados bancários via `GET /api/funeral-auth/bank-data`
- **Formulário**: Campos para titular, CPF/CNPJ e chave PIX
- **Salvamento**: Envia `PATCH /api/funeral-auth/bank-data` com os dados do formulário
- **Exibição de comissão**: Mostra percentuais de repasse (adminCommissionPercent vs. recebido)

## Props/Parâmetros
- Nenhum (página autônoma)

## Conexões
- Redireciona para `/funeraria/login` se 401 (não autenticado)
- Link de volta para `/funeraria/dashboard`
- Consome API interna de autenticação/autorização

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** next/link, next/navigation, react

## 📤 Exporta
`DadosBancariosPage`, `default`

## 🧩 Componentes usados
BankData, Link

## 🪝 Hooks / efeitos
useCallback, useEffect, useRouter, useState

## 🧠 Funções/Componentes definidos
`DadosBancariosPage`, `handleSave`

## 📞 O que cada função chama
- `DadosBancariosPage()` → fetch, json, load, push, setData, setForm, useCallback, useEffect, useRouter, useState
- `handleSave()` → fetch, json, load, preventDefault, setError, setSaved, setSaving, stringify

