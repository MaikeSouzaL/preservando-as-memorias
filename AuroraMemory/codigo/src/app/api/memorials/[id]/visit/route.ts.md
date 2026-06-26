---
origem: src/app/api/memorials/[id]/visit/route.ts
origem_hash: 0f0524685e1f8c909ea5fe58bfaa284fc922c0ef
gerado_em: 2026-06-26T00:33:19
---

# `src/app/api/memorials/[id]/visit/route.ts`

```markdown
## `src/app/api/memorials/[id]/visit/route.ts`

**Responsabilidade:** Endpoint POST para registrar visita a um memorial.

- **`POST`**: Incrementa contagem de visitas do memorial e scans do QR code associado.
- **Parâmetros**: `id` (string, via URL params) — identificador do memorial.
- **Lógica**: Busca memorial ativo no `updatePlatformData`, atualiza `visits` e `updatedAt`. Se existir QR code, incrementa `scans` e registra `lastScanAt`.
- **Retorno**: JSON com `visits`, `scans` e `lastScanAt` (200) ou erro (404/500).
- **Dependência**: `updatePlatformData` de `src/lib/platform-data.ts`.
```

<!-- aurora:relacoes -->

## 🔗 Importa
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- **Externos/APIs:** next/server

## 📤 Exporta
`POST`, `dynamic`

## 🧠 Funções/Componentes definidos
`POST`

## 📞 O que cada função chama
- `POST()` → find, json, toISOString, updatePlatformData

## 🔁 Chama (arquivos)
- [[platform-data.ts]] — `src/lib/platform-data.ts`

