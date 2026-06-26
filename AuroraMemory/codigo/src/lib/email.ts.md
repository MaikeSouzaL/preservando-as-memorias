---
origem: src/lib/email.ts
origem_hash: ce5b691c85a5840b9aa292e822b33d5edb251294
gerado_em: 2026-06-25T23:37:23
---

# `src/lib/email.ts`

# `src/lib/email.ts` — Serviço de e-mails transacionais

**Responsabilidade:** Enviar e-mails de confirmação de pedido e notificações administrativas via Resend.

## Funções exportadas

- **`sendOrderConfirmationEmail(order)`** — Envia e-mail de confirmação ao cliente com detalhes do pedido (ID, plano, valor, forma de pagamento) e link para o painel.
- **`sendAdminPaymentNotification(order)`** — Notifica o administrador sobre novo pagamento, exibindo valores (total, comissão da plataforma de 15%, repasse de 85%) e link para o painel admin.

## Parâmetros (`OrderEmailData`)

`id`, `userName`, `userEmail`, `planId`, `planName`, `grossAmountCents`, `platformCommissionCents`, `operatorAmountCents`, `paymentMethod`, `createdAt`

## Configuração

- `RESEND_API_KEY` (obrigatório) — chave da API Resend
- `EMAIL_FROM` (opcional) — remetente padrão
- `ADMIN_NOTIFICATION_EMAIL` (opcional) — destinatário das notificações admin

## Consumido por

`src/app/api/webhooks/stripe/route.ts` — dispara os e-mails após confirmação de pagamento.

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** resend

## ⬅️ Importado por
- [[route.ts]] — `src/app/api/webhooks/stripe/route.ts`

## 📤 Exporta
`sendAdminPaymentNotification`, `sendOrderConfirmationEmail`

## 🧠 Funções/Componentes definidos
`brl`, `formatDate`, `getResend`, `sendAdminPaymentNotification`, `sendOrderConfirmationEmail`

## 📞 O que cada função chama
- `brl()` → toLocaleString
- `formatDate()` → toLocaleDateString
- `sendAdminPaymentNotification()` → brl, formatDate, getResend, send
- `sendOrderConfirmationEmail()` → brl, formatDate, getResend, send

## 📲 Chamado por
- [[route.ts]] — `src/app/api/webhooks/stripe/route.ts`

