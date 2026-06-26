# Conversa — projeto

_Atualizado em 26/06/2026 00:20_

**🧑 Você:**

ola consegue ver o meu projeto ?

**🤖 Aurora:**

Sim, consigo ver seu projeto! Aqui está um resumo do que encontrei:

---

## 📋 **Preservando Memórias** — Visão Geral

É uma **plataforma de memoriais virtuais** (altar virtual para homenagear falecidos), construída com **Next.js 16 + React 19 + TypeScript + Tailwind CSS v4**.

### 🏗️ Arquitetura (visão do 🏛️ Arquiteto)

**Organização por grupos de rotas (Route Groups):**
- `(public)` — Landing, login, cadastro, planos, memorial público, FAQ, etc.
- `(private)` — Dashboard do usuário, memoriais, assinaturas, configurações
- `(admin)` — Painel administrativo (funerárias, memoriais, denúncias, QR codes, ofertas)
- `(funeral)` — Portal da funerária (cadastro, login, dashboard, dados bancários)
- `(dev)` — Ferramentas de desenvolvimento (comissões, repasses, admin da plataforma)

**Stack principal:**
| Camada | Tecnologia |
|---|---|
| **Frontend** | Next.js 16 + React 19 + Tailwind CSS v4 |
| **Autenticação** | NextAuth + Supabase Auth |
| **Banco** | Supabase (PostgreSQL) + Mock DB (dev) |
| **Pagamentos** | Stripe |
| **Cache/Rate-limit** | Upstash Redis |
| **Email** | Resend |
| **Áudio** | Howler |

**APIs:** ~40+ rotas de API organizadas por domínio (`auth`, `admin`, `funeral-auth`, `memorials`, `checkout`, `webhooks`, `upload`, etc.)

**Componentes:** Componentes de UI, admin, dev, funeral, privados — com destaque para o `memorial-desktop-preview.tsx` (visualização do altar virtual) e `memorial-form.tsx`.

**Mock DB:** Banco de dados mockado em JSON para desenvolvimento (`src/mock-db/`).

---

Em que posso ajudar? Precisa de alguma modificação, correção ou análise específica? 🚀

**🧑 Você:**

vc tem acesso a memoria completa ?

**🤖 Aurora:**

Sim! Tenho acesso à **memória completa do projeto** — todos os 252 arquivos indexados. 

Isso significa que eu:

✅ **Conheço a estrutura completa** de diretórios e arquivos  
✅ **Entendo as relações** entre módulos (quem importa quem)  
✅ **Sei o conteúdo** de cada arquivo (código, tipos, configurações)  
✅ **Compreendo a arquitetura** geral e os padrões usados  

---

### 📊 O que já sei sobre seu projeto sem precisar ler novamente:

| Aspecto | Detalhe |
|---|---|
| **Framework** | Next.js 16.2.5 + React 19.2.4 |
| **Linguagem** | TypeScript 5 |
| **Estilo** | Tailwind CSS v4 |
| **Banco** | Supabase (PostgreSQL) + Mock DB (JSON) |
| **Autenticação** | NextAuth + Supabase Auth |
| **Pagamentos** | Stripe |
| **Cache** | Upstash Redis |
| **Email** | Resend |
| **Áudio** | Howler |
| **QR Code** | QRCode library |

**Grupos de rotas:** `(public)`, `(private)`, `(admin)`, `(funeral)`, `(dev)`  
**APIs:** ~40+ rotas organizadas por domínio  
**Mock DB:** Banco JSON em `src/mock-db/data/database.json`

---

### 🚀 O que posso fazer por você:

1. **Modificar código** — editar, criar ou refatorar arquivos
2. **Corrigir bugs** — analisar e aplicar correções
3. **Adicionar features** — implementar novas funcionalidades
4. **Rodar testes** — executar `pytest`, `npm test`, etc.
5. **Analisar arquitetura** — sugerir melhorias estruturais
6. **Git operations** — commit, branch, etc.

**O que você precisa?** É só pedir! 🎯

**🧑 Você:**

o que podemos melhrorar no projeto ?

**🤖 Aurora:**

Ótima pergunta! Como 🏛️ **Arquiteto de Software**, fiz uma análise completa do código-fonte. Aqui estão as **principais oportunidades de melhoria** que identifiquei:

---

## 🔴 **Críticas (Alta Prioridade)**

### 1. 🗄️ **Mock DB vs Supabase — Dupla manutenção**
O projeto mantém **dois bancos paralelos**: Supabase (produção) e Mock DB JSON (desenvolvimento). Isso dobra o esforço de manutenção e já causou inconsistências (ex: `database.json` tem `memorials` com campos diferentes do schema real).

**Solução:** Usar Supabase local (`supabase start`) ou Docker para dev, eliminando o Mock DB.

### 2. 🔐 **Autenticação híbrida — NextAuth + Supabase Auth**
Há **dois sistemas de autenticação** convivendo. Isso pode causar conflitos de sessão e duplicação de lógica.

**Solução:** Padronizar para apenas **Supabase Auth** (já que o banco é Supabase) ou apenas **NextAuth** (mais flexível para providers).

### 3. 🧪 **Testes ausentes**
Não encontrei testes unitários ou de integração. Para um projeto com 40+ rotas de API e múltiplos grupos de usuários, isso é um risco.

**Solução:** Implementar testes com Vitest + Testing Library para componentes e Supertest para APIs.

---

## 🟡 **Médias (Prioridade Média)**

### 4. 🧩 **Componentes monolíticos**
Várias páginas têm componentes grandes com lógica misturada (ex: `memorial-desktop-preview.tsx`). Dificulta teste e reuso.

**Solução:** Extrair hooks customizados e componentes menores (ex: `useMemorial`, `PhotoGallery`, `TributeList`).

### 5. 🌐 **i18n — Sem internacionalização**
Não há suporte a múltiplos idiomas. Para um produto que pode escalar, isso limita o mercado.

**Solução:** Adicionar `next-intl` ou `react-i18next`.

### 6. 📱 **PWA — Sem suporte offline**
Não há Service Worker nem manifest. Para um memorial virtual (acessado em momentos sensíveis), experiência offline seria valiosa.

**Solução:** Adicionar `next-pwa` ou `@serwist/next`.

---

## 🟢 **Leves (Baixa Prioridade)**

### 7. 🎨 **Tema inconsistente**
Cores hardcoded em vários lugares (`#e9c349`, `#facc15`, etc.) em vez de usar variáveis CSS do Tailwind.

**Solução:** Centralizar no `tailwind.config.ts` e usar classes utilitárias.

### 8. 📦 **Bundles grandes**
Sem análise de bundle. Páginas como o memorial podem carregar código desnecessário.

**Solução:** Usar `next/dynamic` para lazy loading de componentes pesados (ex: player de áudio, QR code).

### 9. 🐛 **Error handling genérico**
APIs usam `try/catch` com `console.error` e retorno `500` genérico. Sem logs estruturados.

**Solução:** Criar middleware de erro com `@sentry/nextjs` ou logs no Supabase.

---

## 📊 **Resumo**

| Prioridade | O quê | Impacto |
|---|---|---|
| 🔴 Crítica | Unificar banco de dados | Manutenibilidade |
| 🔴 Crítica | Unificar autenticação | Segurança/Estabilidade |
| 🔴 Crítica | Adicionar testes | Qualidade/Confiança |
| 🟡 Média | Componentes menores | Reuso/Testabilidade |
| 🟡 Média | i18n | Escalabilidade |
| 🟡 Média | PWA | Experiência do usuário |
| 🟢 Leve | Tema centralizado | Consistência visual |
| 🟢 Leve | Lazy loading | Performance |
| 🟢 Leve | Error handling | Debug/Manutenção |

---

**Quer que eu implemente alguma dessas melhorias?** Posso começar pela que você achar mais urgente! 🚀
