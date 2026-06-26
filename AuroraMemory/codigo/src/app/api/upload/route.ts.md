---
origem: src/app/api/upload/route.ts
origem_hash: ddb33807aadbe935b13166c423c3beb29f4d14ba
gerado_em: 2026-06-25T23:37:29
---

# `src/app/api/upload/route.ts`

# API de Upload de Arquivos

**Responsabilidade:** Endpoint POST para upload de arquivos (imagens, áudio, vídeo) para o Supabase Storage.

**Função principal:**
- `POST(request)` — recebe arquivo via FormData, valida tipo e tamanho, faz upload ao bucket apropriado (`memorial-images`, `memorial-audio`, `memorial-video`). Fallback para base64 se upload falhar.

**Validações:**
- Tipos permitidos: JPEG, PNG, WebP, GIF (imagens); MP3, WAV, OGG, AAC, M4A (áudio); MP4, WebM, OGG, MOV, AVI (vídeo)
- Tamanho máximo: 20 MB (imagem/áudio), 100 MB (vídeo)

**Parâmetros:** FormData com campo `file` (obrigatório)

**Dependências:** `getAuthSession()` (autenticação), `createClientServer()` (cliente Supabase server-side)

<!-- aurora:relacoes -->

## 🔗 Importa
- [[auth-session.ts]] — `src/lib/auth-session.ts`
- [[supabase.ts]] — `src/lib/supabase.ts`
- **Externos/APIs:** next/server

## 📤 Exporta
`POST`, `dynamic`

## 🧠 Funções/Componentes definidos
`POST`

## 📞 O que cada função chama
- `POST()` → arrayBuffer, createClientServer, error, formData, from, get, getAuthSession, getPublicUrl, includes, json, now, pop, random, slice, split, toString, upload

## 🔁 Chama (arquivos)
- [[auth-session.ts]] — `src/lib/auth-session.ts`
- [[supabase.ts]] — `src/lib/supabase.ts`

