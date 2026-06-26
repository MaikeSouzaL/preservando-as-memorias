---
pergunta: Analise este projeto usando a memória catalogada (arquitetura, dependências e o grafo de chamadas) e produza um RELATÓRI
gerado_em: 2026-06-25T19:40:40
---

# Analise este projeto usando a memória catalogada (arquitetura, dependências e o grafo de chamadas) e produza um RELATÓRIO DE MELHORIAS objetivo e específico, CITANDO ARQUIVOS: 1) acoplamento — arquivos que concentram dependências/chamadas; 2) código morto ou duplicado; 3) riscos e pontos frágeis; 4) organização e nomes; 5) liste as 3 melhorias de maior impacto primeiro, com o porquê e como aplicar.

Com base na memória catalogada do projeto, apresento o relatório de melhorias objetivo e específico.

---

## RELATÓRIO DE MELHORIAS — PROJETO AURORA

### 🏆 3 MELHORIAS DE MAIOR IMPACTO

1.  **Centralizar e tipificar chamadas de API no frontend**
    - **Por quê:** `src/app/(admin)/admin/denuncias/page.tsx` faz chamadas `fetch` brutas para `GET /api/admin/complaints`, `PATCH /api/admin/complaints` e `DELETE /api/admin/complaints?id={id}` diretamente no componente. Isso duplica lógica de tratamento de erros, loading e parsing de JSON em cada página. Qualquer mudança na API (ex.: adicionar header de autenticação) exige alterar N páginas.
    - **Como aplicar:** Criar um serviço em `src/lib/api-client.ts` com funções tipadas (`getComplaints()`, `updateComplaintStatus(id, status)`, `deleteComplaint(id)`). Refatorar `AdminComplaintsPage` para usar essas funções. Estender para todas as outras páginas que fazem fetch direto (ex.: `src/app/(admin)/admin/comercial/page.tsx`, `src/app/(admin)/admin/ofertas/page.tsx`).

2.  **Remover dependência de `mock-db` em produção**
    - **Por quê:** A pasta `src/mock-db/` existe e é listada na estrutura do projeto. Manter dados mockados no bundle de produção aumenta o tamanho do build e cria risco de vazamento de dados de teste ou comportamento inesperado se alguma rota acidentalmente importar o mock.
    - **Como aplicar:** Garantir que `src/mock-db/` seja excluída do build de produção via `next.config.js` (ex.: `exclude: /mock-db/` no webpack) ou mover para uma pasta fora de `src/` (ex.: `tests/mocks/`). Verificar se alguma página ou API route importa esses mocks em produção e substituir por dados reais.

3.  **Unificar estilos de botões e tabelas em componentes reutilizáveis**
    - **Por quê:** `src/app/(admin)/admin/denuncias/page.tsx` possui botões de ação (alternar status, excluir) e tabela com estilos inline/tailwind repetidos. O mesmo padrão aparece em `src/components/admin/commercial-settings-panel.tsx`, `src/components/admin/convites-page-client.tsx` e outras páginas admin. Isso dificulta manutenção de tema e acessibilidade.
    - **Como aplicar:** Criar componentes `DataTable`, `ActionButton` (com variantes `primary`, `danger`, `ghost`) e `StatusBadge` em `src/components/ui/`. Refatorar as páginas admin para usá-los, padronizando padding, cores, estados de loading e desabilitado.

---

### 1. ACOPLAMENTO — Arquivos que concentram dependências/chamadas

| Arquivo | Problema | Impacto |
|---|---|---|
| `src/lib/platform-types.ts` | Importado por 10+ arquivos (páginas, componentes, API routes). Qualquer alteração nesse arquivo exige recompilação e teste de quase todo o sistema. | Alto acoplamento. |
| `src/lib/email.ts` | Único serviço de email, chamado por `src/app/api/webhooks/stripe/route.ts`. Se o webhook falhar, o email não é enviado e não há fallback. | Ponto único de falha. |
| `src/app/api/admin/complaints/route.ts` (inferido) | Provavelmente concentra lógica de listagem, atualização e exclusão de denúncias. Se quebrar, a página admin de denúncias para completamente. | Alta dependência vertical. |

**Recomendação:** Avaliar se `platform-types.ts` pode ser dividido em arquivos menores (ex.: `plan-types.ts`, `commission-utils.ts`, `invite-types.ts`). Para `email.ts`, considerar fila de emails (ex.: Bull/BullMQ) para desacoplar do webhook.

---

### 2. CÓDIGO MORTO OU DUPLICADO

| Arquivo | Evidência | Ação |
|---|---|---|
| `tsconfig.tsbuildinfo` | Arquivo de cache gerado automaticamente, não deve ser versionado. | Adicionar ao `.gitignore` (se já não estiver). |
| `src/mock-db/` | Pasta de dados mockados presente na estrutura. Se não usada em produção, é código morto no bundle. | Mover para `tests/mocks/` ou excluir do build. |
| `src/app/(admin)/admin/denuncias/page.tsx` | Lógica de `handleToggleStatus` e `handleDelete` duplicada em relação a outras páginas admin que manipulam recursos (ex.: convites, ofertas). | Extrair para hooks customizados (`useResourceActions`). |
| `src/lib/platform-types.ts` — `centsToBRL()` | Função de formatação de moeda. Pode existir similar em `src/lib/` ou ser substituída por `Intl.NumberFormat` diretamente. | Verificar duplicação com `src/lib/email.ts` que também formata data/moeda. |

---

### 3. RISCOS E PONTOS FRÁGEIS

| Risco | Arquivo(s) | Descrição | Mitigação |
|---|---|---|---|
| **Falta de validação de entrada** | `src/app/(admin)/admin/denuncias/page.tsx` | `handleDelete` usa `confirm()` nativo do browser — não há validação no backend sobre quem pode excluir. | Adicionar verificação de role/permissão no backend. |
| **Exposição de dados sensíveis** | `src/app/api/admin/complaints/` (inferido) | Rota admin pode expor dados de denunciantes se não houver filtro por role. | Revisar se a rota retorna `reporter` (nome/email) para admins não
