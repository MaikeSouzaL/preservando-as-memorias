# Preservando as Memórias

Memoriais digitais acessíveis por QR Code. A família preenche a história do ente querido; o sistema publica uma página pública e gera um QR Code que vai gravado numa placa fixada no local de descanso. Quem escaneia abre o memorial no celular.

## Os três atores

| Ator | Onde entra | O que faz |
|---|---|---|
| **Familiar** | `/criar-memorial` | Preenche os dados do falecido, paga e recebe o QR. Depois só acompanha a entrega da placa. Sem painel administrativo. |
| **Funerária** | `/funeraria` | Parceira revendedora: inclui o memorial no plano funerário, cadastra o falecido, gera e imprime o QR para a família. |
| **Dono** | `/painel` | Painel único: preços, funerárias, planos de cobrança, faturas, métricas, entregas e moderação. |

O papel de "representante/operador", que ficava com 85% de cada venda, foi extinto. A venda ao familiar é integralmente da plataforma; a funerária é cobrada por assinatura.

## Como a funerária é cobrada

Configurável em `/painel/planos-cobranca`, com plano padrão global e override por parceira:

- **Mensalidade** — valor fixo por mês, com uma cota de memoriais inclusos e preço por memorial excedente.
- **Por QR Code** — sem mensalidade, cobra por memorial gerado.

Tabelas: `funeral_billing_plans`, `funeral_invoices`, `funeral_homes.billing_plan_id` (NULL herda o padrão).

## Stack

Next.js 14 (App Router) · React 18 · Tailwind v4 · Supabase (Postgres + Auth + Storage) · Stripe · Resend · Upstash Redis (rate limit)

## Rodando localmente

```bash
npm install
```

```bash
npm run dev
```

Sobe em `http://localhost:3001` (porta definida em `.claude/launch.json`).

## Validações

```bash
npx tsc --noEmit
```

```bash
npm run build
```

## Variáveis de ambiente

Obrigatórias em `.env`:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
- `FUNERAL_SESSION_SECRET` — assina o cookie de sessão da funerária (HMAC-SHA256, mínimo 32 caracteres). Sem ele o login de funerária falha fechado, de propósito.
- `NEXT_PUBLIC_URL`

Recomendadas:

- `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN` — sem elas o rate limit cai para memória do processo, o que **não funciona em serverless**: cada invocação tem seu próprio contador e o limite nunca se aplica de fato.
- `RESEND_API_KEY` — e-mails transacionais.

Gerar o segredo da sessão:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Autenticação

Dois mecanismos convivem:

- **Familiar e dono** — Supabase Auth (cookies `sb-*`). O dono é identificado por `profiles.is_dev_admin`.
- **Funerária** — tabela própria `funeral_homes` com hash scrypt e cookie `funeral_session` assinado com HMAC e validade de 12 horas.

`src/middleware.ts` barra o acesso óbvio às rotas protegidas; a autorização real fica em cada layout e handler.

## Dados

Toda persistência é Supabase. Não há mais store em JSON local. Nenhuma tela deve exibir número inventado: sem dado, mostre estado vazio.
