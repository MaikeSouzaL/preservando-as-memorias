---
origem: src/components/dev/criar-memorial-button.tsx
origem_hash: 1c2b915b218644a4bd66df78737dd1a2c9cfa3f7
gerado_em: 2026-06-26T00:33:19
---

# `src/components/dev/criar-memorial-button.tsx`

## `CriarMemorialButton`

**Responsabilidade:** Botão que abre um modal para criação de memoriais (ambiente dev).

**Funcionalidades:**
- Botão "Criar memorial gratuito" com ícone e estilo amarelo
- Modal com backdrop escuro e formulário de criação
- Ao fechar, recarrega a página (`window.location.reload()`)

**Props:** Nenhuma

**Componentes utilizados:**
- `CriarMemorialForm` — formulário de criação, recebe `onClose` para callback de fechamento

**Estado:** `open` (boolean) controla visibilidade do modal

**Importado por:** `src/app/(dev)/dev/page.tsx`

<!-- aurora:relacoes -->

## 🔗 Importa
- [[criar-memorial-form.tsx]] — `src/components/admin/criar-memorial-form.tsx`
- **Externos/APIs:** react

## ⬅️ Importado por
- [[page.tsx]] — `src/app/(dev)/dev/page.tsx`

## 📤 Exporta
`CriarMemorialButton`

## 🧩 Componentes usados
CriarMemorialForm

## 🪝 Hooks / efeitos
useState

## 🧠 Funções/Componentes definidos
`CriarMemorialButton`, `handleClose`

## 📞 O que cada função chama
- `CriarMemorialButton()` → setOpen, useState
- `handleClose()` → reload, setOpen

