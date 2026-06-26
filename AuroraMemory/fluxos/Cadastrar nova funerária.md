---
fluxo: Cadastrar nova funerária
gerado_em: 2026-06-25T19:56:26
---

# Fluxo: Cadastrar nova funerária

## Descrição (passos)
```
Acessar '/funeraria/cadastro'
Preencher 'Nome' com 'Funerária Teste'
Preencher 'Email' com 'teste@funeraria.com'
Preencher 'Senha' com 'senha12345'
Preencher 'Contato' com 'João Silva'
Preencher 'Telefone' com '(11) 99999-8888'
Clicar em 'Cadastrar'
? aparece a mensagem 'Cadastro realizado com sucesso! Aguarde aprovação.'
```

## Entendimento do código
# Memória de Análise: Fluxo "Cadastrar nova funerária"

## Visão Geral

O fluxo de cadastro de uma nova funerária é um wizard de 3 etapas que coleta dados da empresa (via CNPJ), dados do responsável e senha de acesso. Após o envio, o cadastro fica pendente de aprovação administrativa.

## Arquivos Envolvidos

### [[FunerariaCadastroPage]]
- **Arquivo:** `src/app/(funeral)/funeraria/cadastro/page.tsx`
- **Resumo:** Página cliente ("use client") que implementa o wizard de cadastro em 3 etapas. Gerencia estado local (CNPJ, empresa, contato, senha) e faz POST para `/api/funeral-auth/register`. Ao final, redireciona para `/funeraria/cadastro?status=pendente`, que exibe a tela de "Aguardando aprovação".

### [[RegisterRoute]]
- **Arquivo:** `src/app/api/funeral-auth/register/route.ts`
- **Resumo:** Rota de API que recebe os dados do formulário, valida campos obrigatórios (nome, email, senha, contato, telefone), verifica duplicidade de email, gera slug, processa convite (se houver `inviteSlug`), e persiste a funerária via `updatePlatformData` com `approvalStatus: "pending"` e `isActive: false`.

### [[PlatformData]]
- **Arquivo:** `src/lib/platform-data.ts`
- **Resumo:** Camada de acesso a dados que lê/grava no Supabase. A função `updatePlatformData` recebe um callback que modifica uma cópia dos dados e depois persiste as diferenças. No registro, adiciona um novo objeto `FuneralHome` ao array `funeralHomes`.

### [[Password]]
- **Arquivo:** `src/lib/password.ts`
- **Resumo:** Utilitário de hash de senha (não lido por conter segredo). Usado pela rota de registro para armazenar `passwordHash`.

## Fluxo Detalhado

1. **Acessar `/funeraria/cadastro`** → Renderiza `FunerariaCadastroPage`.
2. **Etapa 1 (Empresa):** Usuário digita CNPJ → consulta BrasilAPI → dados da empresa são exibidos (razão social, fantasia, cidade, estado).
3. **Etapa 2 (Responsável):** Formulário com nome do contato, email corporativo e telefone.
4. **Etapa 3 (Acesso):** Senha e confirmação (mínimo 8 caracteres).
5. **Submissão:** `handleSubmit` faz POST para `/api/funeral-auth/register` com todos os dados.
6. **API:** Valida → verifica email duplicado → gera slug → processa convite (se houver) → persiste funerária com `approvalStatus: "pending"`.
7. **Redirecionamento:** Para `/funeraria/cadastro?status=pendente` → exibe `PendingScreen` com mensagem "Aguardando aprovação".

## Funções-Chave

- `CadastroContent.handleSubmit()` — orquestra o envio do formulário.
- `POST /api/funeral-auth/register` — valida e persiste o cadastro.
- `updatePlatformData()` — lê dados atuais, aplica callback, persiste diferenças.
- `hashPassword()` — gera hash da senha.

## Pontos de Atenção para Teste

- **Campos obrigatórios:** Nome, email, senha (≥8), contato e telefone são validados no front e no backend.
- **CNPJ:** Consulta externa à BrasilAPI — testar com CNPJ válido e inválido.
- **Email duplicado:** Backend retorna erro 400 se email já existe.
- **Convite:** Se `inviteSlug` for passado, o sistema aplica comissão/plano do convite e marca como "used".
- **Status pendente:** Após cadastro, `isActive: false` e `approvalStatus: "pending"` — o acesso só é liberado após aprovação manual do admin.
- **Mensagem de sucesso:** A tela `PendingScreen` exibe "Cadastro enviado" e "Aguardando aprovação".
- **Slug:** Gerado automaticamente a partir do nome da empresa + timestamp.

## Componentes Identificados

- [[FunerariaCadastroPage]] — página do wizard
- [[RegisterRoute]] — rota de API de registro
- [[PlatformData]] — camada de persistência
- [[Password]] — utilitário de hash

## Arquivos relacionados
- `src/app/(funeral)/funeraria/cadastro/page.tsx`
- `src/app/api/funeral-auth/register/route.ts`
- `src/lib/platform-data.ts`
- `src/lib/password.ts`

## Componentes
- [[FunerariaCadastroPage]]
- [[RegisterRoute]]
- [[PlatformData]]
- [[Password]]
