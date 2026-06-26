---
origem: .agents/skills/supabase/SKILL.md
origem_hash: 3148500fef52fe014fc51cd9b4f1668a6ff32025
gerado_em: 2026-06-26T00:33:20
---

# `.agents/skills/supabase/SKILL.md`

# Supabase Skill

## Responsabilidade Principal
Guia de boas práticas e instruções para tarefas envolvendo Supabase (Database, Auth, Edge Functions, Realtime, Storage, Vectors, Cron, Queues, CLI, MCP).

## Componentes Chave

- **Core Principles**: 6 princípios fundamentais — verificar changelog, verificar implementações, recuperação de erros, exposição de tabelas à Data API, RLS obrigatório em schemas expostos, checklist de segurança.

- **Security Checklist**: 6 categorias de armadilhas de segurança (auth/sessão, chaves de API, RLS/views, storage, dependências, funções SECURITY DEFINER).

- **Supabase CLI**: Comandos via `--help`, gotchas conhecidos (`db query` requer v2.79.0+, `db advisors` requer v2.81.3+), version check e upgrade.

- **Supabase MCP Server**: Troubleshooting de conexão (verificar servidor, `.mcp.json`, autenticação OAuth 2.1).

- **Documentation**: Métodos de acesso em ordem de prioridade (MCP `search_docs`, fetch de páginas como markdown, busca web).

- **Schema Changes**: Usar `execute_sql` (MCP) ou `supabase db query` (CLI) para iteração; gerar migração com `supabase db pull` apenas quando pronto.

## Conexões com Outros Arquivos
- Referencia `references/skill-feedback.md` para feedback sobre o skill.
- Consome `https://supabase.com/changelog.md` e documentação oficial via fetch/MCP.
