# Plano funcional - Preservando as Memórias

## Decisão de arquitetura

Para o MVP, o melhor caminho continua sendo manter o backend dentro do Next.js usando Route Handlers. O produto ainda é centrado em formulários, memorial público, QR Code, checkout, uploads e painel administrativo. Um backend Node separado passa a valer a pena quando houver integrações complexas, filas, workers de mídia, webhooks pesados de pagamento, processamento de arquivos ou múltiplos clientes além do app web.

## Estado atual validado

- O projeto compila com `npx tsc --noEmit`.
- O build de produção passa com `npm run build`.
- O lint passa sem erros; restam avisos de `<img>` em telas públicas e fonte customizada no layout.
- O backend atual usa `src/data/platform-store.json` como persistência local do MVP.
- O fluxo via API foi validado com dados temporários: perfil, checkout, criação de memorial, QR público, homenagem, vela e denúncia.
- O painel admin já possui rotas para comercial, usuários, memoriais, homenagens, QR Codes e denúncias.
- A criação de memorial já aceita upload local de foto, áudio e imagem da linha do tempo.
- O checkout registra pedido e calcula comissão fixa de 15% para o dono da plataforma.

## Fluxo principal do MVP

1. Visitante entra na landing, escolhe um plano e faz cadastro ou checkout.
2. Cliente acessa a área privada.
3. Cliente cria um memorial com nome, datas, cidade, foto, áudio, frase, biografia, galeria e linha do tempo.
4. Sistema grava o memorial, publica uma URL pública e gera o QR Code.
5. QR Code impresso na lápide aponta para a tela pública do memorial.
6. Visitantes veem a história, acendem velas, enviam homenagens e podem reportar conteúdo.
7. Administrador define preços, recorrência mensal/anual/pagamento único e acompanha pedidos, memoriais, usuários, QR Codes, homenagens e denúncias.

## O que manter agora

- Landing, planos, checkout, login, cadastro e área privada.
- Dashboard do cliente, lista de memoriais, criação/edição de memorial e visualização pública por QR Code.
- Memorial público com história, galeria, áudio, linha do tempo, homenagens, velas e compartilhamento.
- Painel admin enxuto com dashboard, comercial, usuários, memoriais, QR Codes, homenagens e denúncias.
- Backend dentro do Next para o MVP, com rotas em `src/app/api`.

## O que ainda não está pronto para produção

- Autenticação ainda é frágil: usa cookie simples `auth_user`, localStorage e bypass de desenvolvimento para Google quando `NEXT_PUBLIC_HAS_GOOGLE_AUTH` não está ativo.
- Senhas ficam em texto no JSON local; isso precisa virar hash antes de produção.
- Pagamento real ainda está estruturado como sandbox/mock; falta gateway ativo e webhook.
- Upload local em `public/uploads` funciona para MVP local, mas precisa migrar para storage externo antes da hospedagem.
- O banco real ainda não existe; o JSON local não é adequado para produção concorrente.
- Algumas telas públicas ainda usam dados do `mock-db` e não estão totalmente conectadas ao backend novo.
- O README ainda é o padrão do Next e deve ser substituído por instruções reais do produto.

## Próximos blocos de implementação

1. Conectar as telas públicas secundárias ao backend real ou remover as que não fazem parte do MVP.
2. Substituir o JSON por PostgreSQL com Prisma.
3. Implementar autenticação real com separação clara entre cliente e administrador.
4. Trocar senhas em texto por hash e validação segura.
5. Integrar um gateway real de pagamento, preferencialmente Asaas ou Mercado Pago para Pix/boleto/cartão no Brasil.
6. Criar webhooks para confirmar pagamentos e liberar plano/memorial.
7. Migrar uploads para storage externo, como S3, Cloudflare R2 ou Supabase Storage.
8. Revisar a tela pública do memorial para remover simulações restantes e deixar só conteúdo vindo do memorial cadastrado.
9. Limpar avisos de lint restantes e substituir o README padrão.
