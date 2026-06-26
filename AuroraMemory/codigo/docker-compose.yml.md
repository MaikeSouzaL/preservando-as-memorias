---
origem: docker-compose.yml
origem_hash: 2f5fe19d70bd259ffda0d784eb244c7accdca4b0
gerado_em: 2026-06-26T00:33:19
---

# `docker-compose.yml`

# docker-compose.yml

**Responsabilidade:** Orquestra o ambiente de desenvolvimento local do projeto.

**Serviço principal (`app`):**
- Constrói a imagem a partir de `Dockerfile.dev`
- Expõe a porta `3000` (Next.js)
- Monta o diretório atual em `/app` com hot-reload
- Mantém `node_modules` e `.next` como volumes anônimos (não sobrescritos pelo bind mount)
- Define `NODE_ENV=development` e `NEXT_PUBLIC_APP_URL=http://localhost:3000`
- Executa `npm run dev` como comando padrão

**Serviço comentado (`db`):**
- PostgreSQL 15 Alpine (porta `5432`)
- Banco `memorial`, usuário `memorial`, senha `memorial_dev`
- Volume persistente `pgdata`

**Relações:** Serve como ponto de entrada para desenvolvimento; o serviço `app` depende do Dockerfile.dev para configuração de build.
