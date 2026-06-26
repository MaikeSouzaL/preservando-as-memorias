---
origem: src/app/(public)/qr-publico/layout.tsx
origem_hash: cd71fc30e7b70be899846673cd2820a542b5deed
gerado_em: 2026-06-25T23:37:29
---

# `src/app/(public)/qr-publico/layout.tsx`

### `src/app/(public)/qr-publico/layout.tsx`

**Responsabilidade:** Layout raiz da rota `/qr-publico`, servindo como wrapper para páginas públicas de QR.

**Componente principal:**
- **`ScreenLayout`** (default, async): Renderiza `children` sem estrutura adicional (apenas fragmento `<></>`). Executa `loadScreenData()` assíncrono (atualmente retorna `null`).

**Props:**
- `children: React.ReactNode` — conteúdo das páginas aninhadas na rota.

**Conexões:**
- Define o layout para todas as páginas sob `/(public)/qr-publico/`.
- `loadScreenData()` é placeholder para futura carga de dados compartilhados (ex.: configurações de QR público).

<!-- aurora:relacoes -->

## 📤 Exporta
`ScreenLayout`, `default`

## 📥 Props recebidas
children

## 🧠 Funções/Componentes definidos
`ScreenLayout`, `loadScreenData`

## 📞 O que cada função chama
- `ScreenLayout()` → loadScreenData

