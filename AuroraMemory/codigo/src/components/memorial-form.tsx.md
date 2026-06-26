---
origem: src/components/memorial-form.tsx
origem_hash: ff8e824be2c7f9183a138d5ae399add2aae5dae5
gerado_em: 2026-06-25T23:37:25
---

# `src/components/memorial-form.tsx`

# `memorial-form.tsx` — Formulário de Criação de Memorial

## Responsabilidade
Formulário completo para criar/editar memoriais, com upload de mídia, linha do tempo e endereço de entrega.

## Componentes e Funções Chave

- **`MemorialForm`** — Componente principal que gerencia todo o estado do formulário e submissão
- **`MediaUploadCard`** — Componente auxiliar para upload de foto, áudio e vídeo
- **`uploadFile()`** — Função que faz upload para `/api/upload` e retorna a URL

## Props Importantes

- `onSubmit: (data: MemorialFormData) => Promise<void>` — Callback de submissão
- `initialData?: Partial<MemorialFormData>` — Dados para edição
- `submitLabel?: string` — Texto do botão (padrão: "Salvar e Criar Memorial")

## Tipos Exportados

- `MemorialFormData` — Dados completos do memorial (nome, datas, mídia, galeria, timeline, endereço)
- `DeliveryAddressData` — Endereço para entrega do QR Code físico

## Integrações

- Consome: `POST /api/upload` para upload de arquivos
- Renderiza: `MemorialDesktopPreview` para visualização em tempo real
- Usado por: páginas de criação de memorial (funerária e público) e página de oferta

<!-- aurora:relacoes -->

## 🔗 Importa
- [[memorial-desktop-preview.tsx]] — `src/components/memorial-desktop-preview.tsx`
- **Externos/APIs:** date-fns/locale/pt-BR, react, react-datepicker, react-datepicker/dist/react-datepicker.css

## ⬅️ Importado por
- [[page.tsx]] — `src/app/(funeral)/funeraria/dashboard/novo-memorial/page.tsx`
- [[page.tsx]] — `src/app/(private)/memoriais/criar/page.tsx`
- [[page.tsx]] — `src/app/(public)/oferta/[slug]/page.tsx`

## 📤 Exporta
`DeliveryAddressData`, `MemorialForm`, `MemorialFormData`

## 🧩 Componentes usados
DatePicker, DeliveryAddressData, HTMLInputElement, MediaUploadCard, MemorialDesktopPreview, MemorialFormData

## 🪝 Hooks / efeitos
useState

## 📥 Props recebidas
accept, children, hint, icon, initialData, inputId, isLoading, label, loadingLabel, onFileChange, onSubmit, submitLabel, uploadLabel

## 🧠 Funções/Componentes definidos
`MediaUploadCard`, `MemorialForm`, `addTimelineEvent`, `handleChange`, `handleFileUpload`, `handleGalleryUpload`, `handleSubmit`, `handleTimelineImageUpload`, `removeTimelineEvent`, `updateTimelineEvent`, `uploadFile`

## 📞 O que cada função chama
- `MemorialForm()` → String, filter, getDate, getFullYear, getMonth, handleFileUpload, handleTimelineImageUpload, map, padStart, removeTimelineEvent, replace, setDeliveryAddress, setForm, setShowPreview, slice, toUpperCase, updateTimelineEvent, useState
- `addTimelineEvent()` → setForm
- `handleChange()` → setForm
- `handleFileUpload()` → alert, setForm, setIsUploading, uploadFile
- `handleGalleryUpload()` → alert, push, setForm, setIsUploadingGallery, slice, split, uploadFile
- `handleSubmit()` → onSubmit, preventDefault, setError, setIsSubmitting
- `handleTimelineImageUpload()` → alert, setForm, setUploadingTimelineIndex, uploadFile
- `removeTimelineEvent()` → filter, setForm
- `updateTimelineEvent()` → setForm
- `uploadFile()` → append, fetch, json

