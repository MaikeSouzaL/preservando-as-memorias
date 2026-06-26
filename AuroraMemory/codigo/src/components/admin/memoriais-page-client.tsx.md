---
origem: src/components/admin/memoriais-page-client.tsx
origem_hash: d78b5c57ea22cc43963d1fb49f521c5157170a19
gerado_em: 2026-06-25T23:37:29
---

# `src/components/admin/memoriais-page-client.tsx`

# `memoriais-page-client.tsx` — Painel de Gerenciamento de Memoriais

**Responsabilidade:** Componente cliente que exibe e gerencia a listagem de memoriais no painel administrativo.

## Componentes Principais

- **`MemoriaisPageClient`** — Componente principal que recebe `memorials` e `adminUserId` como props. Renderiza:
  - Cabeçalho com total de memoriais e botão "Criar memorial"
  - Seção "Criados por mim" (filtrados por `ownerId === adminUserId`)
  - Seção "Memoriais de clientes" (filtrados por `ownerId !== adminUserId`)
  - Seção de endereços de entrega (`EntregasSection`)
  - Modal de criação com `CriarMemorialForm`

- **`MemorialTable`** — Tabela com colunas: nome, epitáfio, datas, cidade, visitas, status, ações. Exibe link para `/memorial-publico` e badge de entrega.

- **`EntregasSection`** — Grid de cards com endereços de entrega dos memoriais que possuem `deliveryAddress.recipientName`.

- **`AddressCard`** — Card individual com nome do memorial, destinatário e endereço completo.

## APIs/Endpoints

- Consome `/memorial-publico?memorial={id}` (link externo para visualização)

## Conexões

- Importa `CriarMemorialForm` e tipos `ManagedMemorial`, `DeliveryAddress`
- Importado por `src/app/(admin)/admin/memoriais/page.tsx`
- Usa `useState` para controle do modal e `window.location.reload()` ao fechar

<!-- aurora:relacoes -->

## 🔗 Importa
- [[criar-memorial-form.tsx]] — `src/components/admin/criar-memorial-form.tsx`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- **Externos/APIs:** next/image, react

## ⬅️ Importado por
- [[page.tsx]] — `src/app/(admin)/admin/memoriais/page.tsx`

## 📤 Exporta
`MemoriaisPageClient`

## 🧩 Componentes usados
AddressCard, CriarMemorialForm, EntregasSection, Image, MemorialTable

## 🪝 Hooks / efeitos
useState

## 📥 Props recebidas
adminUserId, emptyLabel, memorial, memorials, rows

## 🧠 Funções/Componentes definidos
`AddressCard`, `EntregasSection`, `MemoriaisPageClient`, `MemorialTable`, `handleClose`

## 📞 O que cada função chama
- `AddressCard()` → filter, join
- `EntregasSection()` → filter, map
- `MemoriaisPageClient()` → filter, setShowForm, useState
- `MemorialTable()` → map, toLocaleDateString
- `handleClose()` → reload, setShowForm

