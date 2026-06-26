---
origem: README.md
origem_hash: 63b937a14ba080106c1384909b230d2b2a8cbc02
gerado_em: 2026-06-25T23:37:23
---

# `README.md`

# README.md — Preservando as Memórias

## Responsabilidade Principal
Aplicação Next.js para criação de memoriais digitais com QR Code, permitindo que clientes cadastrem dados, história, fotos, áudio e linha do tempo de entes queridos, gerando páginas públicas acessíveis via QR Code.

## Funcionalidades Chave
- **Backend-for-frontend**: Route Handlers dentro do Next.js
- **Persistência local**: `src/data/platform-store.json`
- **Checkout sandbox**: Com cálculo de comissão de 15%
- **Autenticação**: Cadastro e login simples
- **Área privada**: Criação/edição de memorial e upload local
- **Memorial público**: Com homenagens e velas persistidas
- **Painel admin**: Comercial, usuários, memoriais, QR Codes, homenagens e denúncias

## Configuração
- **Porta padrão**: `http://localhost:3000`
- **Uploads locais**: `public/uploads`
- **Validações**: `npx tsc --noEmit`, `npm run lint`, `npm run build`

## Pagamentos
Checkout registra pedidos com:
- Valor bruto do plano
- Desconto de cupom
- Comissão da plataforma
- Repasse do operador

## Próximos Passos
1. Autenticação real com autorização admin/cliente
2. Hash de senhas
3. Migração para banco real (PostgreSQL/Prisma)
4. Storage externo para uploads
5. Gateway real com webhook
6. Remover conteúdo institucional estático
