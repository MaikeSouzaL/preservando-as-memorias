---
origem: .agents/skills/supabase-postgres-best-practices/references/security-rls-basics.md
origem_hash: e47b9a555b1bcce2f4a73838b3e9ff4e91054581
gerado_em: 2026-06-25T23:37:30
---

# `.agents/skills/supabase-postgres-best-practices/references/security-rls-basics.md`

## Row Level Security (RLS) for Multi-Tenant Data

**Responsabilidade:** Impedir vazamento de dados entre tenants através de políticas de segurança no banco de dados, não apenas no código da aplicação.

**Conceitos chave:**
- RLS força verificação de acesso a nível de banco, garantindo que usuários vejam apenas seus próprios dados
- Políticas são criadas com `CREATE POLICY` usando `USING` para filtrar registros

**Exemplos de políticas:**
- **Por variável de sessão:** `user_id = current_setting('app.current_user_id')::bigint`
- **Por autenticação:** `user_id = auth.uid()` (para role `authenticated`)

**Comandos essenciais:**
- `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` — ativa RLS
- `ALTER TABLE ... FORCE ROW LEVEL SECURITY` — força RLS até para proprietários
- `SET app.current_user_id = '123'` — define contexto do usuário

**Erro comum:** filtrar apenas na aplicação (`WHERE user_id = $current_user_id`) sem RLS — uma query sem filtro expõe todos os dados.
