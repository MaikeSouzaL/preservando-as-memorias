---
origem: docs/plano-funcional.md
origem_hash: 97e9bafbf6df971f228b5b38a02184d215ef9076
gerado_em: 2026-06-26T00:33:20
---

# `docs/plano-funcional.md`

# Plano Funcional - Preservando as Memórias

## Responsabilidade Principal
Documenta a arquitetura, estado atual e próximos passos do MVP do sistema de memoriais online.

## Estrutura do Documento
- **Decisão de Arquitetura**: Backend mantido no Next.js (Route Handlers) para MVP; backend separado postergado
- **Estado Atual**: Compilação, build e lint OK; persistência via `platform-store.json`; fluxos validados (perfil, checkout, memorial, QR, homenagens, denúncias)
- **Fluxo Principal**: Landing → plano → cadastro/checkout → área privada → criação de memorial → URL pública + QR Code → interações públicas (velas, homenagens, denúncias) → admin
- **O que Manter**: Landing, planos, checkout, área privada, memorial público, painel admin enxuto
- **Não Pronto**: Autenticação frágil (cookie `auth_user`), senhas em texto, pagamento mock, upload local, JSON como banco, telas desconectadas
- **Próximos Blocos**: Conectar telas públicas, migrar para PostgreSQL + Prisma, autenticação real, hash de senhas, gateway de pagamento (Asaas/Mercado Pago), webhooks, storage externo (S3/R2/Supabase), limpar avisos e README

## Relações com Outros Arquivos
- Guia o desenvolvimento de `src/app/api/`, `src/data/`, componentes de tela e painel admin
- Define prioridades para implementação de autenticação, pagamento e banco de dados
