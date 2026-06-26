---
origem: src/components/admin/criar-memorial-form.tsx
origem_hash: 40688189c54602ee30a9cb00974b80165cbc000e
gerado_em: 2026-06-26T00:33:19
---

# `src/components/admin/criar-memorial-form.tsx`

# `CriarMemorialForm` — Formulário multi-etapas para criação de memoriais

**Responsabilidade:** Guia o usuário por 9 etapas para criar um memorial completo (foto, identificação, biografia, galeria, linha do tempo, áudio, vídeo, responsável e endereço de entrega).

## Componentes chave

- **`CriarMemorialForm`** — Componente principal com estado do formulário (`FormData`), navegação entre etapas e submissão via `POST /api/admin/memorial`
- **Sub-componentes de etapa:** `PhotoUpload`, `GalleryStep`, `TimelineStep`, `AudioStep`, `VideoStep`, `Field`, `TextArea`, `DateField`
- **Upload de arquivos:** Função `uploadFile()` envia para `POST /api/upload`

## Props

- `onClose: () => void` — Callback para fechar o formulário após criação bem-sucedida

## Fluxo

1. Usuário preenche dados em 9 etapas sequenciais
2. Arquivos são enviados via `/api/upload` antes da submissão
3. Ao final, faz `POST /api/admin/memorial` com todos os dados
4. Em caso de sucesso, exibe tela com link público e opções de ação

## Integrações

- Consome: `/api/upload` (upload de arquivos), `/api/admin/memorial` (criação do memorial)
- Importado por: `memoriais-page-client.tsx`, `criar-memorial-button.tsx`

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** date-fns/locale/pt-BR, next/image, react, react-datepicker, react-datepicker/dist/react-datepicker.css

## ⬅️ Importado por
- [[memoriais-page-client.tsx]] — `src/components/admin/memoriais-page-client.tsx`
- [[criar-memorial-button.tsx]] — `src/components/dev/criar-memorial-button.tsx`

## 📤 Exporta
`CriarMemorialForm`

## 🧩 Componentes usados
AudioStep, DateField, DatePicker, DeliveryAddress, Field, FormData, GalleryStep, HTMLInputElement, Image, K, PhotoUpload, StepWrapper, TextArea, TimelineItem, TimelineStep, VideoStep

## 🪝 Hooks / efeitos
useState

## 📥 Props recebidas
audioUrl, children, ev, events, gallery, imageUrl, label, onAdd, onChange, onClose, onImageUpload, onRemove, onUpdate, onUpdateTitle, onUpload, placeholder, rows, subtitle, title, type, uploading, value, videoUrl

## 🧠 Funções/Componentes definidos
`AudioStep`, `CriarMemorialForm`, `DateField`, `Field`, `GalleryStep`, `PhotoUpload`, `StepWrapper`, `TextArea`, `TimelineItem`, `TimelineStep`, `VideoStep`, `back`, `handleSubmit`, `next`, `set`, `uploadFile`, `validateStep`

## 📞 O que cada função chama
- `AudioStep()` → click, onUpload, useRef
- `CriarMemorialForm()` → filter, map, push, replace, set, setDeliveryAddress, setError, setForm, setStep, setSuccess, setUploading, slice, toUpperCase, uploadFile, useState
- `DateField()` → String, getDate, getFullYear, getMonth, onChange, padStart
- `Field()` → onChange
- `GalleryStep()` → click, from, map, onRemove, onUpdateTitle, onUpload, useRef
- `PhotoUpload()` → click, onUpload, useRef
- `TextArea()` → onChange
- `TimelineItem()` → click, onImageUpload, onUpdate, useRef
- `TimelineStep()` → map, onImageUpload, onRemove, onUpdate
- `VideoStep()` → click, onUpload, useRef
- `back()` → max, setError, setStep
- `handleSubmit()` → fetch, json, setError, setSaving, setSuccess, stringify, validateStep
- `next()` → min, setError, setStep, validateStep
- `set()` → setForm
- `uploadFile()` → append, fetch, json
- `validateStep()` → trim

