---
origem: src/app/(private)/memoriais/criar/page.tsx
origem_hash: 95782ee049a5777a39da81e3b44125c8cf6a409e
gerado_em: 2026-06-25T23:37:29
---

# `src/app/(private)/memoriais/criar/page.tsx`

## Página de Criação/Edição de Memorial

**Responsabilidade:** Formulário para criar ou editar memoriais, com fluxo pós-salvamento.

### Funcionalidades principais:
- **Modo criação/edição:** Detecta `?edit=id` na URL para carregar dados existentes via `GET /api/memorials/{id}`
- **Submissão:** Envia dados para `POST /api/memorials` (criação) ou `PATCH /api/memorials/{id}` (edição)
- **Pós-salvamento:** Exibe tela de sucesso com:
  - Link para memorial público
  - Botão de pagamento (se `status !== "ativo"`)
  - Geração de placa QR decorada via canvas

### Estados:
- **Carregando:** Spinner enquanto busca dados para edição
- **Erro:** Mensagem de erro com link de retorno
- **Sucesso:** Tela com ações baseadas no status do memorial

### Integrações:
- **`MemorialForm`:** Componente de formulário recebendo `onSubmit` e `initialData`
- **APIs:** Consome `/api/memorials` (POST/PATCH) e `/api/memorials/{id}` (GET)
- **Navegação:** Links para dashboard e página pública do memorial

<!-- aurora:relacoes -->

## 🔗 Importa
- [[memorial-form.tsx]] — `src/components/memorial-form.tsx`
- **Externos/APIs:** next/link, react

## 📤 Exporta
`CriarMemorialPage`, `default`

## 🧩 Componentes usados
Link, MemorialForm, MemorialFormData, Partial, SavedMemorial

## 🪝 Hooks / efeitos
useEffect, useState

## 🧠 Funções/Componentes definidos
`CriarMemorialPage`, `downloadFramedQRCode`, `handleSubmit`

## 📞 O que cada função chama
- `CriarMemorialPage()` → Boolean, catch, downloadFramedQRCode, fetch, finally, get, json, map, setEditId, setInitialData, setIsLoadingEdit, setLoadError, setTimeout, then, useEffect, useState
- `downloadFramedQRCode()` → addColorStop, click, createElement, createLinearGradient, drawImage, fillRect, fillText, getContext, replace, slice, strokeRect, toDataURL, toLowerCase, toUpperCase
- `handleSubmit()` → fetch, json, setSaved, stringify

