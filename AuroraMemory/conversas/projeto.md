# Conversa — projeto

_Atualizado em 26/06/2026 01:38_

**🧑 Você:**

olá

**🤖 Aurora:**

Olá! 👋

Sou a Aurora, sua assistente de programação. Estou aqui para ajudar com o projeto.

Pelo que vejo no mapa, este é um projeto com **253 arquivos indexados** — parece ser um sistema de memorial com suporte a áudio, PostgreSQL/Supabase, e várias skills de agentes.

Como posso ajudar hoje? Me diga o que você precisa:

- **Criar/modificar funcionalidades** no código
- **Corrigir bugs**
- **Melhorar arquitetura**
- **Consultar** partes específicas do projeto
- **Rodar testes** ou comandos

É só falar! 🚀

**🧑 Você:**

o que da para melhroar  no sistema

**🤖 Aurora:**

Agora tenho uma visão completa e detalhada do projeto. Aqui está minha análise como **🏛️ Arquiteto de Software**:

---

## 📋 Relatório de Melhorias — Projeto Aurora (Preservando Memórias)

Com base na análise do código-fonte, memória catalogada e arquivos reais, aqui estão as oportunidades de melhoria, ordenadas por impacto:

---

### 🏆 TOP 3 — Maior Impacto

#### 1. 🔴 **Centralizar chamadas de API do frontend (cliente HTTP tipado)**

**Onde:** `src/app/(admin)/admin/denuncias/page.tsx` (fetch bruto), e potencialmente outras páginas.

**Problema:** A página de denúncias faz `fetch` direto para `/api/admin/complaints` com tratamento de erro mínimo, sem tipagem de resposta, sem abstração. Cada página que precisar de API vai duplicar lógica de headers, parsing, loading, error handling.

**Solução:** Criar `src/lib/api-client.ts` com funções tipadas:
```typescript
export async function getComplaints(): Promise<Complaint[]>
export async function updateComplaintStatus(id: string, status: string): Promise<Complaint[]>
export async function deleteComplaint(id: string): Promise<Complaint[]>
```

**Impacto:** Reduz duplicação, facilita manutenção (ex.: adicionar header de autenticação), melhora DX com tipos.

---

#### 2. 🔴 **Upload com fallback base64 — risco de segurança e performance**

**Onde:** `src/app/api/upload/route.ts` (linha ~55)

**Problema:** Quando o upload para o Supabase Storage falha, o código faz **fallback para base64 inline** na URL. Isso é um problema grave:
- Base64 é ~33% maior que o binário
- URLs base64 não são cacheadas por CDN
- Vaza dados binários em respostas JSON
- Pode estourar limites de tamanho de resposta

**Solução:** Remover o fallback base64. Se o storage falhar, retornar erro 500. Ou, alternativamente, salvar localmente em `public/uploads/` como fallback controlado.

**Impacto:** Segurança, performance e previsibilidade.

---

#### 3. 🟡 **Rate limiting implementado 2x (memória local + Upstash) — risco em produção multi-instância**

**Onde:** `src/lib/rate-limit.ts`

**Problema:** O rate limiting tem fallback para `Map` em memória. Em produção com múltiplas instâncias (escalonamento horizontal), cada instância tem seu próprio `Map`, então um usuário pode fazer `limit * N` requisições (N = número de instâncias). O Redis/Upstash resolve, mas o fallback silencioso esconde o problema.

**Solução:** 
- Logar um aviso quando estiver usando o fallback em memória
- Ou exigir Redis em produção (falhar cedo se não configurado)
- Documentar a limitação

**Impacto:** Segurança contra abuso em produção.

---

### 🟡 Média Prioridade

#### 4. **`platform-data.ts` monolítico — 700+ linhas, muitas responsabilidades**

**Onde:** `src/lib/platform-data.ts`

**Problema:** Este arquivo faz tudo: leitura/escrita de dados, sync com Supabase, diff de arrays, CRUD de funerárias, ofertas, denúncias, memoriais, etc. Viola o Princípio da Responsabilidade Única.

**Solução:** Quebrar em módulos:
- `src/lib/platform-data/reader.ts` — leitura
- `src/lib/platform-data/writer.ts` — escrita + diff
- `src/lib/platform-data/sync.ts` — sync com Supabase
- `src/lib/platform-data/entities/` — operações por entidade

**Impacto:** Manutenibilidade, testabilidade, legibilidade.

---

#### 5. **`funeral-auth/register/route.ts` — hash de senha duplicado com Supabase Auth**

**Onde:** `src/app/api/funeral-auth/register/route.ts`

**Problema:** O registro de funerárias faz hash manual da senha (`hashPassword`) e armazena em `passwordHash` no JSON/Supabase. Mas o Supabase Auth já gerencia autenticação. Isso significa que a funerária não consegue fazer login pelo Supabase Auth — apenas por um fluxo customizado.

**Solução:** Usar `supabase.auth.signUp()` em vez de hash manual, ou documentar claramente que é um fluxo separado.

**Impacto:** Consistência de autenticação, segurança.

---

#### 6. **Componentes inline duplicados em páginas admin**

**Onde:** `src/app/(admin)/admin/comercial/page.tsx` (Metric, CommercialTabInfo, OrderRow), `src/app/(admin)/admin/dashboard/page.tsx` (StatCard, ProgressItem)

**Problema:** `Metric` e `CommercialTabInfo` estão definidos dentro do arquivo de página, não podem ser reutilizados. `StatCard` no dashboard tem função similar a `Metric` mas com props diferentes.

**Solução:** Extrair para `src/components/ui/`:
- `MetricCard` — unifica StatCard + Metric
- `TabInfo` —通用 CommercialTabInfo
- `DataTable` — componente de tabela genérico

**Impacto:** Redução de duplicação, consistência visual, reuso.

---

#### 7. **Webhook Stripe sem idempotência e sem fila**

**Onde:** `src/app/api/webhooks/stripe/route.ts`

**Problema:** O Stripe pode entregar o mesmo evento mais de uma vez (at-least-once). O código não tem verificação de idempotência (`stripeSessionId` é salvo mas não verificado antes de processar). Também não usa fila — o processamento (emails, transferência Stripe) acontece inline no webhook.

**Solução:**
- Verificar se `order.stripeSessionId` já existe antes de processar
- Usar `Promise.allSettled` para não falhar o webhook se email falhar (já faz)
- Idealmente: enfileirar em background job

**Impacto:** Evita duplicação de pedidos/emails.

---

#### 8. **`dynamic = "force-dynamic"` em TODAS as rotas de API**

**Onde:** Praticamente todas as rotas em `src/app/api/`

**Problema:** `force-dynamic` desativa caching do Next.js em todas as rotas. Algumas rotas GET (ex.: `/api/memorials`) poderiam se beneficiar de caching parcial.

**Solução:** Remover `force-dynamic` de rotas GET que podem usar cache, ou usar `revalidate` tags.

**Impacto:** Performance em leitura, redução de carga no banco.

---

#### 9. **Falta de testes automatizados**

**Onde:** Projeto todo

**Problema:** O `package.json` tem `jest` configurado, mas não há testes implementados. Um sistema financeiro (pedidos, repasses, webhooks) sem testes é arriscado.

**Solução:** Começar com testes nos pontos críticos:
- `platform-types.ts` — `calculateOrderTotals`, `calculateCascadeOrderTotals`, `estimateStripeFeeCents`
- Webhook Stripe — lógica de negócio
- Rotas de API — validação de input

**Impacto:** Confiança para deploy, prevenção de regressões.

---

#### 10. **`src/data/platform-store.json` vs Supabase — duas fontes de verdade**

**Onde:** `src/lib/platform-data.ts` + `src/data/platform-store.json`

**Problema:** O sistema lê de `platform-store.json` e faz sync para Supabase via `persistChanges()`. Isso cria duas fontes de verdade. Se o sync falhar parcialmente, os dados ficam inconsistentes.

**Solução:** Migrar para usar Supabase como fonte primária e remover o JSON, ou manter JSON como cache local apenas para leitura.

**Impacto:** Consistência de dados, simplificação.

---

### 🟢 Baixa Prioridade / Cosmético

#### 11. **`asString()` duplicado em várias rotas de API**

**Onde:** `src/app/api/funeral-auth/register/route.ts`, `src/app/api/memorials/route.ts`, etc.

**Problema:** Função `asString()` definida inline em múltiplos arquivos.

**Solução:** Mover para `src/lib/validate.ts` e importar.

---

#### 12. **README.md ainda é o padrão do Next.js**

**Onde:** `README.md`

**Problema:** Não documenta o produto real.

**Solução:** Substituir por documentação real do projeto.

---

### 📊 Resumo

| # | Melhoria | Impacto | Esforço |
|---|----------|---------|---------|
| 1 | Cliente HTTP tipado | 🔴 Alto | 🟢 Baixo |
| 2 | Remover fallback base64 | 🔴 Alto | 🟢 Baixo |
| 3 | Rate limit multi-instância | 🔴 Alto | 🟢 Baixo |
| 4 | Quebrar platform-data.ts | 🟡 Médio | 🔴 Alto |
| 5 | Hash de senha duplicado | 🟡 Médio | 🟢 Baixo |
| 6 | Componentes inline duplicados | 🟡 Médio | 🟢 Baixo |
| 7 | Idempotência no webhook | 🟡 Médio | 🟢 Baixo |
| 8 | force-dynamic em GETs | 🟡 Médio | 🟢 Baixo |
| 9 | Falta de testes | 🟡 Médio | 🔴 Alto |
| 10 | Duas fontes de verdade | 🟡 Médio | 🔴 Alto |
| 11 | asString() duplicado | 🟢 Baixo | 🟢 Baixo |
| 12 | README padrão | 🟢 Baixo | 🟢 Baixo |

---

**Quer que eu implemente alguma dessas melhorias?** Posso começar pelas de maior impacto e menor esforço (1, 2, 3, 6, 7, 11) — são mudanças localizadas que trazem ganho imediato. É só me dizer qual você quer priorizar! 🚀
