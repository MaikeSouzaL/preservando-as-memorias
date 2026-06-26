---
pergunta: o que deveria melhorar nesse projeto ?
gerado_em: 2026-06-25T19:17:25
---

# o que deveria melhorar nesse projeto ?

Com base no que explorei do projeto, aqui estão as principais melhorias que identifiquei, organizadas por prioridade:

## 🔴 **Críticas (segurança e arquitetura)**

### 1. **Autenticação insegura (senhas em texto puro)**
- **Onde:** `src/mock-db/data/database.json` — as senhas dos usuários estão armazenadas como texto puro.
- **Problema:** Isso é uma vulnerabilidade grave. Qualquer pessoa com acesso ao banco de dados teria acesso às senhas.
- **Solução:** Implementar hash de senhas com bcrypt ou argon2 antes de armazenar.

### 2. **Banco de dados em JSON (não escalável)**
- **Onde:** `src/mock-db/data/database.json`
- **Problema:** O projeto usa um arquivo JSON como "banco de dados". Isso não escala, não suporta concorrência e pode corromper facilmente.
- **Solução:** Migrar para um banco de dados real (PostgreSQL, SQLite ou Supabase como mencionado nos skills disponíveis).

### 3. **Upload de arquivos local (sem CDN)**
- **Problema:** Arquivos de mídia (fotos, áudios) são armazenados localmente no servidor.
- **Riscos:** Consumo de disco, perda de dados, lentidão para usuários distantes.
- **Solução:** Migrar para S3, Cloudinary ou serviço similar.

## 🟡 **Funcionalidades e UX**

### 4. **Pagamento em modo sandbox apenas**
- **Onde:** Sistema de checkout
- **Problema:** O checkout está configurado apenas para testes (sandbox). Não é possível cobrar usuários reais.
- **Solução:** Integrar gateway de pagamento real (Stripe, Mercado Pago, etc.)

### 5. **Falta de testes automatizados**
- **O que encontrei:** Nenhum arquivo de teste (`.test.ts`, `.spec.ts`) foi identificado.
- **Risco:** Qualquer alteração pode quebrar funcionalidades existentes sem que ninguém perceba.
- **Solução:** Adicionar testes unitários com Jest/Vitest e testes de integração.

### 6. **Sem tratamento de erros consistente**
- **Problema:** Não vi um padrão unificado de tratamento de erros (try/catch, mensagens amigáveis, logging).
- **Impacto:** Usuários podem ver erros técnicos ou telas quebradas.

## 🟢 **Melhorias de código e manutenção**

### 7. **Código duplicado e componentes muito grandes**
- **Exemplo:** `src/components/memorial-desktop-preview.tsx` tem **mais de 700 linhas**.
- **Problema:** Dificulta manutenção, testes e reuso.
- **Solução:** Quebrar em componentes menores (ex: `MemorialHeader`, `MemorialTimeline`, `MemorialGallery`).

### 8. **Dados mockados misturados com dados reais**
- **Onde:** `src/mock-db/`
- **Problema:** Os dados de exemplo estão no mesmo diretório que a lógica de acesso a dados, o que pode causar confusão.
- **Solução:** Separar claramente: dados mockados em uma pasta `__mocks__` ou usar uma factory para gerar dados de teste.

### 9. **Falta de tipagem consistente**
- **Problema:** Algumas partes do código usam `any` ou tipos genéricos demais.
- **Solução:** Definir interfaces TypeScript para todas as entidades (User, Memorial, Tribute, etc.) e usá-las consistentemente.

## 📋 **Resumo para ação imediata**

| Prioridade | O que fazer | Por quê |
|------------|-------------|---------|
| 🔴 Crítica | Hash de senhas | Segurança básica |
| 🔴 Crítica | Migrar de JSON para banco real | Escalabilidade e confiabilidade |
| 🔴 Crítica | Armazenamento externo de arquivos | Performance e segurança |
| 🟡 Alta | Gateway de pagamento real | Monetização |
| 🟡 Alta | Adicionar testes | Prevenir regressões |
| 🟢 Média | Refatorar componentes grandes | Manutenibilidade |
| 🟢 Média | Tipagem consistente | Qualidade do código |

**Quer que eu detalhe alguma dessas melhorias?** Posso sugerir implementações específicas ou ajudar a planejar a ordem de execução.
