---
origem: public/sw.js
origem_hash: c8fda0060a177c3bbe33bf06b110156cb50e1ab7
gerado_em: 2026-06-26T00:33:20
---

# `public/sw.js`

Este arquivo é um **Service Worker** que implementa uma estratégia de cache **App Shell** para o aplicativo Memória.

**Responsabilidade principal:** Gerenciar o cache offline e a interceptação de requisições de rede para garantir carregamento rápido e funcionalidade offline básica.

**Eventos chave:**
- **`install`**: Pré-cacheia o App Shell (rotas principais como `/`, `/login`, `/dashboard`, etc.) na instalação.
- **`activate`**: Limpa caches antigos (versões anteriores) e assume o controle de todas as abas abertas.
- **`fetch`**: Intercepta requisições GET — primeiro tenta servir do cache; se falhar, busca na rede e armazena a resposta no cache; em caso de erro de rede, serve a página `/splash` como fallback.

**Conexões:** Atua como proxy entre o navegador e o servidor, servindo arquivos estáticos e páginas do App Shell diretamente do cache para todas as rotas listadas.
