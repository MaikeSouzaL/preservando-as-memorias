---
origem: src/app/(public)/criar-memorial/page.tsx
origem_hash: a0c28e8752ddfe35793c6dca9794bd354765cd12
gerado_em: 2026-06-25T23:37:29
---

# `src/app/(public)/criar-memorial/page.tsx`

# Página de Criação de Memorial (Público)

**Responsabilidade:** Formulário multi-etapas para criação pública de memoriais, com upload de mídia e coleta de dados para pagamento.

## Componentes Principais

- **`CriarMemorialPage`** — Componente principal com 9 etapas (foto, identificação, biografia, galeria, linha do tempo, áudio, vídeo, dados do usuário, entrega do QR)
- **Step components** (`StepPhoto`, `StepIdentificacao`, `StepBiografia`, etc.) — Cada etapa encapsula um grupo de campos do formulário
- **`StepWrapper`** — Layout padronizado com título e subtítulo para cada etapa
- **`Field`/`TextArea`/`DateField`** — Componentes de input reutilizáveis com estilização consistente

## Funcionalidades Chave

- Upload de imagens via `/api/upload` com feedback visual
- Validação por etapa antes de avançar
- Admin pode pular etapa de dados pessoais (etapa 8)
- Ao finalizar: verifica preço configurado (`/api/platform-config`), cria memorial (`/api/memorial-publico`), redireciona para `/checkout` ou `/dashboard`

## Props/Parâmetros

- **`FormData`** — Estado centralizado com todos os dados do memorial
- **`DeliveryAddress`** — Endereço para entrega do QR Code físico
- **`GalleryItem`/`TimelineEvent`** — Tipos para galeria e linha do tempo

## APIs Consumidas

- `GET /api/platform-config` — Modo de entrega do QR e preço do memorial
- `GET /api/profile` — Verifica se usuário é admin
- `POST /api/upload` — Upload de arquivos de mídia
- `POST /api/memorial-publico` — Criação do memorial

<!-- aurora:relacoes -->

## 🔗 Importa
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- **Externos/APIs:** date-fns/locale/pt-BR, next/image, next/navigation, react, react-datepicker, react-datepicker/dist/react-datepicker.css

## 📤 Exporta
`CriarMemorialPage`, `default`

## 🧩 Componentes usados
DateField, DatePicker, DeliveryAddress, Field, FormData, HTMLInputElement, Image, K, StepAudio, StepBiografia, StepEntrega, StepGaleria, StepIdentificacao, StepPhoto, StepSeusDados, StepTimeline, StepVideo, StepWrapper, TextArea, TimelineCard

## 🪝 Hooks / efeitos
useEffect, useRouter, useState

## 📥 Props recebidas
address, audioUrl, biography, children, email, epitaph, event, events, familyName, form, gallery, imageUrl, index, label, onAdd, onBiography, onChange, onEmail, onEpitaph, onImageChange, onImageUpload, onName, onRemove, onUpdate, onUpdateTitle, onUpload, placeholder, rows, subtitle, title, type, uploading, value, videoUrl

## 🧠 Funções/Componentes definidos
`CriarMemorialPage`, `DateField`, `Field`, `StepAudio`, `StepBiografia`, `StepEntrega`, `StepGaleria`, `StepIdentificacao`, `StepPhoto`, `StepSeusDados`, `StepTimeline`, `StepVideo`, `StepWrapper`, `TextArea`, `TimelineCard`, `back`, `handleSubmit`, `next`, `set`, `uploadImage`, `validateStep`

## 📞 O que cada função chama
- `CriarMemorialPage()` → catch, fetch, filter, json, map, push, replace, set, setDeliveryAddress, setError, setForm, setIsAdmin, setQrDeliveryMode, setUploading, then, uploadImage, useEffect, useRouter, useState
- `DateField()` → String, getDate, getFullYear, getMonth, onChange, padStart
- `Field()` → onChange
- `StepAudio()` → click, onUpload, useRef
- `StepEntrega()` → onChange, replace, slice, toUpperCase
- `StepGaleria()` → click, from, map, onRemove, onUpdateTitle, onUpload, useRef
- `StepIdentificacao()` → onChange
- `StepPhoto()` → click, onUpload, useRef
- `StepSeusDados()` → onEmail
- `StepTimeline()` → map, onImageUpload, onRemove, onUpdate
- `StepVideo()` → click, onUpload, useRef
- `TextArea()` → onChange
- `TimelineCard()` → click, onChange, useRef
- `back()` → max, setError, setStep
- `handleSubmit()` → encodeURIComponent, fetch, json, push, setError, setSaving, stringify, validateStep
- `next()` → min, setError, setStep, validateStep
- `set()` → setForm
- `uploadImage()` → append, fetch, json
- `validateStep()` → includes, match, replace, trim

