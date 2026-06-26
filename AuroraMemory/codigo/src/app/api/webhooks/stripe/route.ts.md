---
origem: src/app/api/webhooks/stripe/route.ts
origem_hash: 86a63014822ec1167f34d046712c7e82afde1394
gerado_em: 2026-06-26T00:33:19
---

# `src/app/api/webhooks/stripe/route.ts`

# Webhook Stripe — `src/app/api/webhooks/stripe/route.ts`

**Responsabilidade:** Processa eventos do Stripe (pagamento confirmado/expirado) e atualiza o sistema.

## Funções principais

- **`POST`** — Endpoint que recebe webhooks do Stripe, valida assinatura e roteia eventos
- **`handlePaymentConfirmed`** — Lida com `checkout.session.completed`:
  1. Atualiza status do pedido para `paid` e memorial para `ativo`
  2. Transfere 85% para conta Stripe Connect do admin (se configurada)
  3. Dispara e-mails de confirmação e notificação ao admin

## Eventos tratados

- `checkout.session.completed` → confirma pagamento, atualiza dados, transfere repasse
- `checkout.session.expired` → marca pedido como `cancelled`

## Dependências

- **`src/lib/platform-data`** — leitura/escrita de pedidos e memoriais
- **`src/lib/email`** — envio de e-mails transacionais
- **Stripe SDK** — validação de webhook e criação de transferências

<!-- aurora:relacoes -->

## 🔗 Importa
- [[email.ts]] — `src/lib/email.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- **Externos/APIs:** next/server, stripe

## 📤 Exporta
`POST`, `dynamic`

## 🧠 Funções/Componentes definidos
`POST`, `getStripe`, `handlePaymentConfirmed`

## 📞 O que cada função chama
- `POST()` → constructEvent, find, get, getStripe, handlePaymentConfirmed, json, text, updatePlatformData
- `handlePaymentConfirmed()` → allSettled, create, error, find, getStripe, readPlatformData, sendAdminPaymentNotification, sendOrderConfirmationEmail, toISOString, updatePlatformData

## 🔁 Chama (arquivos)
- [[email.ts]] — `src/lib/email.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`

