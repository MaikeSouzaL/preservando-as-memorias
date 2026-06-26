---
origem: src/lib/platform-data.ts
origem_hash: f3efd5820bd849d86152964eb7dc83412ba38a02
gerado_em: 2026-06-26T00:33:19
---

# `src/lib/platform-data.ts`

# `src/lib/platform-data.ts`

## Responsabilidade Principal
Camada de dados da plataforma: define todos os tipos de dados gerenciados, mapeia registros do Supabase (snake_case → camelCase) e persiste alterações via diff.

## Tipos Exportados
- **`PlatformData`**: agrega todos os dados da plataforma (memoriais, QR codes, tributos, velas, pedidos, funerárias, etc.)
- **`ManagedMemorial`, `ManagedQrCode`, `ManagedTribute`, `ManagedCandle`, `PlatformOrder`, `FuneralHome`**, etc.: tipos específicos de cada entidade
- **`DeliveryAddress`**: endereço para entrega de QR Code físico

## Funções Principais
- **`readPlatformData()`**: lê todas as tabelas do Supabase em paralelo e retorna um `PlatformData` completo
- **`updatePlatformData(callback)`**: snapshot + diff → persiste apenas itens adicionados, modificados ou deletados
- **`saveContractAcceptance()`**, **`getContractAcceptances()`**: operações específicas para aceitação de contratos
- **`updateFuneralHomeCommission()`**, **`updateFuneralHomeBankData()`**: atualiza dados de comissionamento e bancários de funerárias

## APIs/Banco
Consome 17 tabelas do Supabase via `createAdminClient()`: `memorials`, `qr_codes`, `tributes`, `candles`, `orders`, `profiles`, `funeral_homes`, `funeral_home_offer_links`, `funeral_services`, `funeral_schedules`, `inventory_items`, `staff_members`, `funeral_documents`, `complaints`, `platform_config`, `platform_settings`, `contract_acceptances`.

## Conexões
Importado por ~50 arquivos (páginas, APIs, componentes). Depende de `platform-types.ts` (tipos base) e `supabase.ts` (cliente admin).

<!-- aurora:relacoes -->

## 🔗 Importa
- [[platform-types.ts]] — `src/lib/platform-types.ts`
- [[supabase.ts]] — `src/lib/supabase.ts`
- **Externos/APIs:** candles, complaints, contract_acceptances, funeral_documents, funeral_home_offer_links, funeral_homes, funeral_schedules, funeral_services, inventory_items, memorials, orders, platform_config, platform_settings, profiles, qr_codes, staff_members, tributes

## ⬅️ Importado por
- [[page.tsx]] — `src/app/(admin)/admin/comercial/page.tsx`
- [[page.tsx]] — `src/app/(admin)/admin/dashboard/page.tsx`
- [[page.tsx]] — `src/app/(admin)/admin/memoriais/page.tsx`
- [[page.tsx]] — `src/app/(admin)/admin/ofertas/page.tsx`
- [[page.tsx]] — `src/app/(admin)/admin/qr-codes/page.tsx`
- [[page.tsx]] — `src/app/(admin)/admin/usuarios/page.tsx`
- [[page.tsx]] — `src/app/(dev)/dev/page.tsx`
- [[page.tsx]] — `src/app/(funeral)/funeraria/dashboard/page.tsx`
- [[page.tsx]] — `src/app/(private)/assinaturas/page.tsx`
- [[page.tsx]] — `src/app/(private)/dashboard/page.tsx`
- [[page.tsx]] — `src/app/(private)/homenagens/page.tsx`
- [[page.tsx]] — `src/app/(public)/convite/[slug]/page.tsx`
- [[page.tsx]] — `src/app/(public)/criar-memorial/page.tsx`
- [[page.tsx]] — `src/app/(public)/descobrir-memoriais/page.tsx`
- [[page.tsx]] — `src/app/(public)/homenagens-publicas/page.tsx`
- [[page.tsx]] — `src/app/(public)/memorial/page.tsx`
- [[page.tsx]] — `src/app/(public)/oferta/[slug]/page.tsx`
- [[page.tsx]] — `src/app/(public)/planos/page.tsx`
- [[page.tsx]] — `src/app/(public)/qr-publico/page.tsx`
- [[route.ts]] — `src/app/api/admin/bank-data/route.ts`
- [[route.ts]] — `src/app/api/admin/complaints/route.ts`
- [[route.ts]] — `src/app/api/admin/contracts/route.ts`
- [[route.ts]] — `src/app/api/admin/funeral-home-invites/[id]/route.ts`
- [[route.ts]] — `src/app/api/admin/funeral-home-invites/route.ts`
- [[route.ts]] — `src/app/api/admin/funeral-homes/[id]/route.ts`
- [[route.ts]] — `src/app/api/admin/funeral-homes/route.ts`
- [[route.ts]] — `src/app/api/admin/memorial/[id]/delivery/route.ts`
- [[route.ts]] — `src/app/api/admin/memorial/route.ts`
- [[route.ts]] — `src/app/api/admin/offer-links/route.ts`
- [[route.ts]] — `src/app/api/admin/stats/route.ts`
- [[route.ts]] — `src/app/api/admin/tributes/route.ts`
- [[route.ts]] — `src/app/api/candle-payment/confirm/route.ts`
- [[route.ts]] — `src/app/api/candle-payment/route.ts`
- [[route.ts]] — `src/app/api/checkout/route.ts`
- [[route.ts]] — `src/app/api/dev/backup/route.ts`
- [[route.ts]] — `src/app/api/dev/platform-admin/route.ts`
- [[route.ts]] — `src/app/api/dev/repasse/route.ts`
- [[route.ts]] — `src/app/api/dev/stats/route.ts`
- [[route.ts]] — `src/app/api/funeral-auth/bank-data/route.ts`
- [[route.ts]] — `src/app/api/funeral-auth/documents/route.ts`
- [[route.ts]] — `src/app/api/funeral-auth/inventory/route.ts`
- [[route.ts]] — `src/app/api/funeral-auth/login/route.ts`
- [[route.ts]] — `src/app/api/funeral-auth/me/route.ts`
- [[route.ts]] — `src/app/api/funeral-auth/memorials/route.ts`
- [[route.ts]] — `src/app/api/funeral-auth/register/route.ts`
- [[route.ts]] — `src/app/api/funeral-auth/schedules/route.ts`
- [[route.ts]] — `src/app/api/funeral-auth/services/route.ts`
- [[route.ts]] — `src/app/api/funeral-auth/staff/route.ts`
- [[route.ts]] — `src/app/api/funeral-home-invite/[slug]/route.ts`
- [[route.ts]] — `src/app/api/me/stats/route.ts`
- [[route.ts]] — `src/app/api/memorial-publico/route.ts`
- [[route.ts]] — `src/app/api/memorials/[id]/interactions/route.ts`
- [[route.ts]] — `src/app/api/memorials/[id]/route.ts`
- [[route.ts]] — `src/app/api/memorials/[id]/visit/route.ts`
- [[route.ts]] — `src/app/api/memorials/route.ts`
- [[route.ts]] — `src/app/api/offer-links/[slug]/route.ts`
- [[route.ts]] — `src/app/api/platform-config/route.ts`
- [[route.ts]] — `src/app/api/tribute-donation/route.ts`
- [[route.ts]] — `src/app/api/webhooks/stripe/route.ts`
- [[page.tsx]] — `src/app/memorial-publico/page.tsx`
- [[funerarias-page-client.tsx]] — `src/components/admin/funerarias-page-client.tsx`
- [[memoriais-page-client.tsx]] — `src/components/admin/memoriais-page-client.tsx`
- [[repasse-panel.tsx]] — `src/components/dev/repasse-panel.tsx`
- [[funeraria-dashboard-client.tsx]] — `src/components/funeral/funeraria-dashboard-client.tsx`

## 📤 Exporta
`AdminBankData`, `ContractAcceptance`, `CuratorProfile`, `DeliveryAddress`, `FuneralDocument`, `FuneralHome`, `FuneralHomeOfferLink`, `FuneralSchedule`, `FuneralService`, `InventoryItem`, `ManagedCandle`, `ManagedComplaint`, `ManagedGalleryItem`, `ManagedMemorial`, `ManagedQrCode`, `ManagedTimelineEvent`, `ManagedTribute`, `PlatformData`, `PlatformOrder`, `StaffMember`, `getContractAcceptances`, `readPlatformData`, `saveContractAcceptance`, `updateFuneralHomeBankData`, `updateFuneralHomeCommission`, `updatePlatformData`

## 🧩 Componentes usados
ContractAcceptance, PlatformData, T

## 🧠 Funções/Componentes definidos
`diffItems`, `getContractAcceptances`, `mapCandle`, `mapComplaint`, `mapContractAcceptance`, `mapFuneralDocument`, `mapFuneralHome`, `mapFuneralSchedule`, `mapFuneralService`, `mapInventoryItem`, `mapMemorial`, `mapOfferLink`, `mapOrder`, `mapProfile`, `mapQrCode`, `mapStaffMember`, `mapTribute`, `persistChanges`, `readPlatformData`, `saveContractAcceptance`, `toDbCandle`, `toDbMemorial`, `toDbOrder`, `toDbQrCode`, `toDbTribute`, `updateFuneralHomeBankData`, `updateFuneralHomeCommission`, `updatePlatformData`

## 📞 O que cada função chama
- `diffItems()` → filter, get, has, map, stringify
- `getContractAcceptances()` → createAdminClient, eq, from, map, order, select
- `mapFuneralSchedule()` → isArray
- `mapFuneralService()` → isArray
- `mapMemorial()` → isArray
- `persistChanges()` → all, createAdminClient, delete, diffItems, eq, from, in, insert, map, push, stringify, toDbMemorial, toDbOrder, toDbQrCode, toDbTribute, update, upsert
- `readPlatformData()` → all, createAdminClient, eq, filter, from, fromEntries, isArray, map, order, select
- `saveContractAcceptance()` → createAdminClient, from, insert, mapContractAcceptance, select, single
- `updateFuneralHomeBankData()` → createAdminClient, eq, from, update
- `updateFuneralHomeCommission()` → createAdminClient, eq, from, update
- `updatePlatformData()` → callback, parse, persistChanges, readPlatformData, resolve, stringify

## 🔁 Chama (arquivos)
- [[supabase.ts]] — `src/lib/supabase.ts`

## 📲 Chamado por
- [[page.tsx]] — `src/app/(admin)/admin/comercial/page.tsx`
- [[page.tsx]] — `src/app/(admin)/admin/dashboard/page.tsx`
- [[page.tsx]] — `src/app/(admin)/admin/memoriais/page.tsx`
- [[page.tsx]] — `src/app/(admin)/admin/qr-codes/page.tsx`
- [[page.tsx]] — `src/app/(admin)/admin/usuarios/page.tsx`
- [[page.tsx]] — `src/app/(dev)/dev/page.tsx`
- [[page.tsx]] — `src/app/(funeral)/funeraria/dashboard/page.tsx`
- [[page.tsx]] — `src/app/(private)/assinaturas/page.tsx`
- [[page.tsx]] — `src/app/(private)/dashboard/page.tsx`
- [[page.tsx]] — `src/app/(private)/homenagens/page.tsx`
- [[page.tsx]] — `src/app/(public)/convite/[slug]/page.tsx`
- [[page.tsx]] — `src/app/(public)/descobrir-memoriais/page.tsx`
- [[page.tsx]] — `src/app/(public)/homenagens-publicas/page.tsx`
- [[page.tsx]] — `src/app/(public)/planos/page.tsx`
- [[page.tsx]] — `src/app/(public)/qr-publico/page.tsx`
- [[route.ts]] — `src/app/api/admin/bank-data/route.ts`
- [[route.ts]] — `src/app/api/admin/complaints/route.ts`
- [[route.ts]] — `src/app/api/admin/contracts/route.ts`
- [[route.ts]] — `src/app/api/admin/funeral-home-invites/[id]/route.ts`
- [[route.ts]] — `src/app/api/admin/funeral-home-invites/route.ts`
- [[route.ts]] — `src/app/api/admin/funeral-homes/[id]/route.ts`
- [[route.ts]] — `src/app/api/admin/funeral-homes/route.ts`
- [[route.ts]] — `src/app/api/admin/memorial/[id]/delivery/route.ts`
- [[route.ts]] — `src/app/api/admin/memorial/route.ts`
- [[route.ts]] — `src/app/api/admin/offer-links/route.ts`
- [[route.ts]] — `src/app/api/admin/stats/route.ts`
- [[route.ts]] — `src/app/api/admin/tributes/route.ts`
- [[route.ts]] — `src/app/api/candle-payment/confirm/route.ts`
- [[route.ts]] — `src/app/api/candle-payment/route.ts`
- [[route.ts]] — `src/app/api/checkout/route.ts`
- [[route.ts]] — `src/app/api/dev/backup/route.ts`
- [[route.ts]] — `src/app/api/dev/platform-admin/route.ts`
- [[route.ts]] — `src/app/api/dev/repasse/route.ts`
- [[route.ts]] — `src/app/api/dev/stats/route.ts`
- [[route.ts]] — `src/app/api/funeral-auth/bank-data/route.ts`
- [[route.ts]] — `src/app/api/funeral-auth/documents/route.ts`
- [[route.ts]] — `src/app/api/funeral-auth/inventory/route.ts`
- [[route.ts]] — `src/app/api/funeral-auth/login/route.ts`
- [[route.ts]] — `src/app/api/funeral-auth/me/route.ts`
- [[route.ts]] — `src/app/api/funeral-auth/memorials/route.ts`
- [[route.ts]] — `src/app/api/funeral-auth/register/route.ts`
- [[route.ts]] — `src/app/api/funeral-auth/schedules/route.ts`
- [[route.ts]] — `src/app/api/funeral-auth/services/route.ts`
- [[route.ts]] — `src/app/api/funeral-auth/staff/route.ts`
- [[route.ts]] — `src/app/api/funeral-home-invite/[slug]/route.ts`
- [[route.ts]] — `src/app/api/me/stats/route.ts`
- [[route.ts]] — `src/app/api/memorial-publico/route.ts`
- [[route.ts]] — `src/app/api/memorials/[id]/interactions/route.ts`
- [[route.ts]] — `src/app/api/memorials/[id]/route.ts`
- [[route.ts]] — `src/app/api/memorials/[id]/visit/route.ts`
- [[route.ts]] — `src/app/api/memorials/route.ts`
- [[route.ts]] — `src/app/api/offer-links/[slug]/route.ts`
- [[route.ts]] — `src/app/api/platform-config/route.ts`
- [[route.ts]] — `src/app/api/tribute-donation/route.ts`
- [[route.ts]] — `src/app/api/webhooks/stripe/route.ts`

