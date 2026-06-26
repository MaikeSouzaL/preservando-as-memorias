---
origem: Dockerfile.dev
origem_hash: 9448c08cc169a9bcdf9b6d12f3470a3c87c2e76c
gerado_em: 2026-06-25T23:37:19
---

# `Dockerfile.dev`

```markdown
# Dockerfile.dev — Ambiente de Desenvolvimento

**Responsabilidade:** Configurar container Node.js para desenvolvimento local com hot-reload.

- **FROM node:20-alpine:** Imagem base leve.
- **WORKDIR /app:** Define diretório de trabalho.
- **COPY package*.json ./ && RUN npm ci --only=development:** Instala dependências de desenvolvimento (apenas package.json primeiro para cache de layers).
- **COPY . .:** Copia todo o código-fonte.
- **EXPOSE 3000:** Expõe porta 3000.
- **CMD ["npm", "run", "dev"]:** Inicia servidor de desenvolvimento.

**Relações:** Usado por `docker-compose.dev.yml` para montar volumes e permitir hot-reload.
```
