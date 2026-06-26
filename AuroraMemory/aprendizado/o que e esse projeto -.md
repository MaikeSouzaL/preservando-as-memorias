---
pergunta: o que e esse projeto ?
gerado_em: 2026-06-25T19:16:23
---

# o que e esse projeto ?

Olá! 👋 Este projeto é uma **aplicação web para criação de memoriais digitais com QR Code**, construída com Next.js.

Em resumo, a ideia é:

- **Para quem perdeu um ente querido:** você pode cadastrar a história, fotos, áudios e uma linha do tempo da pessoa.
- **Como funciona:** o sistema gera uma página pública para esse memorial, que pode ser acessada através de um QR Code.
- **Onde usar:** esse QR Code pode ser colocado em uma placa ou lápide, permitindo que visitantes acessem as memórias da pessoa.

**Estado atual do projeto (MVP):**

- ✅ Backend integrado ao frontend (usando Route Handlers do Next.js).
- ✅ Persistência local em arquivo JSON (`src/data/platform-store.json`).
- ✅ Checkout em modo de teste (sandbox) com cálculo de comissão.
- ✅ Cadastro, login, área privada, criação/edição de memoriais e upload de arquivos.
- ✅ Memorial público com funcionalidades de homenagens e "velas acesas".
- ✅ Painel administrativo para gerenciar usuários, memoriais, QR Codes e denúncias.

**Próximos passos (antes de ir para produção):**

- Implementar autenticação segura (com hash de senhas).
- Migrar o banco de dados de JSON para um banco real (como PostgreSQL).
- Integrar um gateway de pagamento real (como Stripe ou Mercado Pago).
- Migrar os uploads de arquivos para um serviço de armazenamento externo (como S3).

Em resumo, é um projeto funcional, mas que ainda precisa de alguns ajustes para estar pronto para o mundo real. Precisa de ajuda com alguma parte específica?

## Arquivos consultados
- [[README.md]] — `README.md`
