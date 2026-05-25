# Preservando as Memórias

Aplicação Next.js para criação de memoriais digitais com QR Code. O cliente cadastra dados, história, fotos, áudio e linha do tempo de um ente querido; o sistema gera uma página pública acessível por QR Code para uso em placa ou lápide.

## Estado do MVP

- Backend-for-frontend em Route Handlers dentro do Next.js.
- Persistência local em `src/data/platform-store.json`.
- Checkout sandbox com cálculo de comissão de 15%.
- Cadastro, login simples, área privada, criação/edição de memorial e upload local.
- Memorial público com homenagens e velas persistidas.
- Painel admin para comercial, usuários, memoriais, QR Codes, homenagens e denúncias.

## Rodando localmente

```bash
npm install
npm run dev
```

Por padrão o app roda em `http://localhost:3000`. Se a porta estiver ocupada:

```bash
npm run dev -- -p 3001
```

## Validações

```bash
npx tsc --noEmit
npm run lint
npm run build
```

## Dados e uploads

- Dados persistidos: `src/data/platform-store.json`.
- Uploads locais: `public/uploads`.
- Em produção, substituir JSON por PostgreSQL/Prisma e uploads locais por storage externo.

## Pagamentos

O checkout atual registra pedidos e calcula:

- valor bruto do plano;
- desconto de cupom;
- comissão da plataforma;
- repasse do operador.

O gateway real ainda precisa ser ativado por integração com Asaas, Mercado Pago ou Stripe e confirmado por webhook.

## Próximos passos antes de hospedar

1. Implementar autenticação real e autorização de admin/cliente.
2. Trocar senhas em texto por hash.
3. Migrar o JSON local para banco real.
4. Migrar uploads para storage externo.
5. Integrar gateway real com webhook.
6. Remover ou conectar telas que ainda usam conteúdo institucional estático.
