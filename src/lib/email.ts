import { Resend } from "resend";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY não configurada.");
  return new Resend(key);
}

const FROM = process.env.EMAIL_FROM ?? "Preservando as Memórias <noreply@preservandasmemorias.com.br>";
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL ?? "";

function brl(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type OrderEmailData = {
  id: string;
  userName: string;
  userEmail: string;
  planId: string;
  planName: string;
  grossAmountCents: number;
  platformCommissionCents: number;
  operatorAmountCents: number;
  paymentMethod: string;
  createdAt: string;
};

export async function sendOrderConfirmationEmail(order: OrderEmailData) {
  const resend = getResend();

  await resend.emails.send({
    from: FROM,
    to: order.userEmail,
    subject: `Pedido ${order.id} confirmado — Preservando as Memórias`,
    html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#101414;font-family:Arial,sans-serif;color:#e0e3e2">
  <div style="max-width:560px;margin:40px auto;padding:32px;background:#1c2020;border-radius:16px;border:1px solid rgba(233,195,73,0.15)">
    <div style="text-align:center;margin-bottom:28px">
      <div style="width:64px;height:64px;background:rgba(233,195,73,0.1);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px">
        <span style="font-size:32px">✓</span>
      </div>
      <h1 style="margin:0;font-size:24px;font-weight:300;color:#e5e2e1">Pagamento confirmado</h1>
      <p style="margin:8px 0 0;color:#c4c7c7;font-size:14px">Obrigado, ${order.userName}!</p>
    </div>

    <div style="background:rgba(11,15,15,0.5);border-radius:12px;padding:20px;margin-bottom:24px">
      <table style="width:100%;font-size:14px;border-collapse:collapse">
        <tr><td style="padding:8px 0;color:#c4c7c7">Pedido</td><td style="padding:8px 0;text-align:right;color:#e9c349;font-weight:600">${order.id}</td></tr>
        <tr><td style="padding:8px 0;color:#c4c7c7">Plano</td><td style="padding:8px 0;text-align:right;color:#e5e2e1">${order.planName}</td></tr>
        <tr><td style="padding:8px 0;color:#c4c7c7">Forma de pagamento</td><td style="padding:8px 0;text-align:right;color:#e5e2e1;text-transform:uppercase">${order.paymentMethod}</td></tr>
        <tr><td style="padding:8px 0;color:#c4c7c7">Data</td><td style="padding:8px 0;text-align:right;color:#e5e2e1;font-size:12px">${formatDate(order.createdAt)}</td></tr>
        <tr style="border-top:1px solid rgba(255,255,255,0.05)">
          <td style="padding:12px 0 0;color:#e5e2e1;font-weight:600">Total pago</td>
          <td style="padding:12px 0 0;text-align:right;color:#e9c349;font-size:18px;font-weight:700">${brl(order.grossAmountCents)}</td>
        </tr>
      </table>
    </div>

    <p style="font-size:13px;color:#c4c7c7;line-height:1.6;margin:0 0 20px">
      Seu memorial digital está sendo preparado. Acesse o painel para acompanhar o status
      e começar a adicionar fotos, memórias e a linha do tempo.
    </p>

    <div style="text-align:center">
      <a href="${process.env.NEXT_PUBLIC_URL ?? "https://preservandasmemorias.com.br"}/dashboard"
         style="display:inline-block;padding:14px 32px;background:#e9c349;color:#1c1b1b;text-decoration:none;border-radius:50px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase">
        Acessar o painel
      </a>
    </div>

    <p style="margin-top:32px;font-size:11px;color:rgba(196,199,199,0.4);text-align:center">
      Preservando as Memórias · Este é um email automático, não responda.
    </p>
  </div>
</body>
</html>`,
  });
}

export async function sendAdminPaymentNotification(order: OrderEmailData) {
  if (!ADMIN_EMAIL) return;
  const resend = getResend();

  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `💰 Novo pagamento: ${brl(order.grossAmountCents)} — Pedido ${order.id}`,
    html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0f0f;font-family:Arial,sans-serif;color:#e0e3e2">
  <div style="max-width:560px;margin:40px auto;padding:32px;background:#1c2020;border-radius:16px;border:1px solid rgba(233,195,73,0.15)">
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:400;color:#e9c349">Novo pagamento recebido</h1>
    <p style="margin:0 0 24px;color:#c4c7c7;font-size:13px">${formatDate(order.createdAt)}</p>

    <div style="background:rgba(11,15,15,0.5);border-radius:12px;padding:20px;margin-bottom:24px">
      <table style="width:100%;font-size:14px;border-collapse:collapse">
        <tr><td style="padding:8px 0;color:#c4c7c7">Pedido</td><td style="padding:8px 0;text-align:right;color:#e9c349">${order.id}</td></tr>
        <tr><td style="padding:8px 0;color:#c4c7c7">Cliente</td><td style="padding:8px 0;text-align:right;color:#e5e2e1">${order.userName} &lt;${order.userEmail}&gt;</td></tr>
        <tr><td style="padding:8px 0;color:#c4c7c7">Plano</td><td style="padding:8px 0;text-align:right;color:#e5e2e1">${order.planName}</td></tr>
        <tr><td style="padding:8px 0;color:#c4c7c7">Pagamento</td><td style="padding:8px 0;text-align:right;color:#e5e2e1;text-transform:uppercase">${order.paymentMethod}</td></tr>
      </table>
    </div>

    <div style="display:grid;gap:12px">
      <div style="background:rgba(233,195,73,0.08);border:1px solid rgba(233,195,73,0.2);border-radius:10px;padding:16px;text-align:center">
        <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#c4c7c7">Seu repasse (85%)</p>
        <p style="margin:6px 0 0;font-size:28px;font-weight:700;color:#e9c349">${brl(order.operatorAmountCents)}</p>
        <p style="margin:4px 0 0;font-size:11px;color:rgba(196,199,199,0.5)">Transferido automaticamente para sua conta Stripe</p>
      </div>
      <div style="display:flex;gap:12px">
        <div style="flex:1;background:rgba(11,15,15,0.5);border-radius:10px;padding:14px;text-align:center">
          <p style="margin:0;font-size:11px;color:#c4c7c7">Total cobrado</p>
          <p style="margin:4px 0 0;font-size:18px;color:#e5e2e1;font-weight:600">${brl(order.grossAmountCents)}</p>
        </div>
        <div style="flex:1;background:rgba(11,15,15,0.5);border-radius:10px;padding:14px;text-align:center">
          <p style="margin:0;font-size:11px;color:#c4c7c7">Taxa do sistema (15%)</p>
          <p style="margin:4px 0 0;font-size:18px;color:#e5e2e1">${brl(order.platformCommissionCents)}</p>
        </div>
      </div>
    </div>

    <div style="margin-top:20px;text-align:center">
      <a href="${process.env.NEXT_PUBLIC_URL ?? "https://preservandasmemorias.com.br"}/admin/dashboard/comercial"
         style="display:inline-block;padding:12px 28px;background:#e9c349;color:#1c1b1b;text-decoration:none;border-radius:50px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase">
        Ver no painel admin
      </a>
    </div>
  </div>
</body>
</html>`,
  });
}
