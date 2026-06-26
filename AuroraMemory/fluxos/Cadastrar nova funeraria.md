---
fluxo: Cadastrar nova funeraria
gerado_em: 2026-06-25T22:25:47
---

# Fluxo: Cadastrar nova funeraria

## Descrição (passos)
```
Acessar /funeraria/cadastro
Preencher 'Nome' com 'Funeraria Teste'
Preencher 'Email' com 'teste@funeraria.com'
Preencher 'Senha' com '12345678'
Preencher 'Contato' com 'João Silva'
Preencher 'Telefone' com '(11) 99999-8888'
Preencher 'CNPJ' com '12.345.678/0001-90'
Preencher 'Cidade' com 'São Paulo'
Preencher 'Estado' com 'SP'
Clicar em 'Cadastrar'
? aparece a mensagem 'Cadastro realizado com sucesso'
```

## Entendimento do código
# Fluxo de Teste: Cadastrar nova funerária

## Objetivo
Testar o cadastro de uma nova funerária no sistema, acessando a URL `/funeraria/cadastro`, preenchendo os campos obrigatórios em 3 etapas e submetendo o formulário. O fluxo espera que, ao final, o sistema redirecione para `/funeraria/cadastro?status=pendente` e exiba a tela de "Aguardando aprovação".

## Arquivos e Módulos Envolvidos

### [[FunerariaCadastroPage]] (`src/app/(funeral)/funeraria/cadastro/page.tsx`)
- **Componente principal** da página de cadastro de funerária.
- Implementa um **wizard de 3 etapas**:
  1. **Step1** — Dados da Empresa: campo CNPJ com busca automática via BrasilAPI (https://brasilapi.com.br/api/cnpj/v1/{cnpj}). Preenche automaticamente razão social, nome fantasia, cidade e estado.
  2. **Step2** — Responsável pelo Acesso: campos Nome do Responsável, E-mail Corporativo e Telefone de Contato.
  3. **Step3** — Criação de Senha: campos Senha e Confirmar Senha (mínimo 8 caracteres).
- Ao submeter, chama a API `/api/funeral-auth/register` com os dados coletados.
- Em caso de sucesso, redireciona para `/funeraria/cadastro?status=pendente`, que renderiza o componente `PendingScreen`.
- Suporta parâmetro opcional `?invite=...` para cadastro via convite.

### [[RegisterRoute]] (`src/app/api/funeral-auth/register/route.ts`)
- **Endpoint POST** que processa o cadastro.
- Valida campos obrigatórios (nome, email, senha, contato, telefone), formato de email e tamanho mínimo de senha (8).
- Verifica duplicidade de email na base.
- Gera um `slug` único para a funerária.
- Se houver `inviteSlug`, aplica condições comerciais do convite (comissão, plano ativo, etc.) e marca o convite como "used".
- Cria um registro de funerária com `approvalStatus: "pending"` e `isActive: false`.
- Persiste os dados via `updatePlatformData`.
- Retorna mensagem de sucesso e o objeto da funerária (sem passwordHash).

### [[PlatformData]] (`src/lib/platform-data.ts`)
- Camada de acesso a dados que lê/grava no Supabase.
- `updatePlatformData()`: lê o estado atual, aplica a mutação via callback e persiste as diferenças.
- `FuneralHome` type: define a estrutura do registro de funerária.
- `persistChanges()`: faz upsert/update/delete nas tabelas do Supabase.

### [[Hash]] (`src/lib/hash.ts`)
- Função `hashPassword(password)`: gera hash SHA-256 da senha.
- Função `verifyPassword(password, hash)`: compara senha com hash.

## Funções-Chave
- `CadastroContent()` no page.tsx: gerencia estado do wizard e submissão.
- `handleSubmit()`: valida senhas, chama API e redireciona.
- `POST` em register/route.ts: valida, cria slug, aplica convite, persiste.
- `updatePlatformData()`: transação de leitura+escrita no Supabase.

## Pontos de Atenção para o Teste
1. **Campos obrigatórios**: Nome, Email, Senha, Contato e Telefone são obrigatórios. Testar validação de cada um.
2. **CNPJ**: O campo CNPJ é usado apenas para consulta automática. Se a consulta falhar (CNPJ inválido), o botão "Continuar" fica desabilitado.
3. **Senha**: Mínimo 8 caracteres. Validação de confirmação no frontend e backend.
4. **Email duplicado**: O backend retorna erro se o email já existir.
5. **Convite**: Se o parâmetro `?invite=...` for passado, o sistema aplica condições do convite e o marca como usado.
6. **Redirecionamento**: Após sucesso, redireciona para `/funeraria/cadastro?status=pendente` (tela de aprovação pendente).
7. **Persistência**: Os dados são salvos no Supabase via `updatePlatformData`. Verificar se o registro foi criado com `approvalStatus: "pending"`.
8. **Hash de senha**: A senha é hasheada com SHA-256 antes de ser armazenada.

## Fluxo Completo
1. Usuário acessa `/funeraria/cadastro`.
2. Step 1: Preenche CNPJ (ex: 12.345.678/0001-90) → clica "Buscar dados" → dados da empresa são preenchidos automaticamente → clica "Continuar".
3. Step 2: Preenche Nome do Responsável, Email, Telefone → clica "Continuar".
4. Step 3: Preenche Senha e Confirma Senha → clica "Finalizar Cadastro".
5. Requisição POST para `/api/funeral-auth/register`.
6. Backend valida, cria registro com status "pending", retorna sucesso.
7. Frontend redireciona para `/funeraria/cadastro?status=pendente`.
8. Tela "Aguardando aprovação" é exibida.

## Arquivos relacionados
- `src/app/(funeral)/funeraria/cadastro/page.tsx`
- `src/app/api/funeral-auth/register/route.ts`
- `src/lib/platform-data.ts`
- `src/lib/hash.ts`

## Componentes
- [[FunerariaCadastroPage]]
- [[RegisterRoute]]
- [[PlatformData]]
- [[Hash]]
