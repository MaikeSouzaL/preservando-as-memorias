---
origem: .agents/skills/supabase/references/skill-feedback.md
origem_hash: 6d64e2f5d684322547a180ee16902153e4322907
gerado_em: 2026-06-25T23:37:30
---

# `.agents/skills/supabase/references/skill-feedback.md`

# Skill Feedback

**Responsabilidade:** Processar feedback do usuário sobre erros ou melhorias nas instruções do agente (skill), não sobre o produto Supabase.

## Fluxo principal

1. **Solicitar permissão** — Perguntar se o usuário quer enviar feedback aos mantenedores
2. **Estruturar issue** — Usar template em `assets/feedback-issue-template.md`, identificando o arquivo de referência e seção específicos
3. **Criar issue no GitHub** — No repositório `supabase/agent-skills`, com título no formato `user-feedback: <resumo do problema>`
4. **Compartilhar resultado** — URL da issue criada; se falhar, fornecer link manual: `https://github.com/supabase/agent-skills/issues/new`

## Conexões

- **Consome:** `assets/feedback-issue-template.md` (template de estruturação)
- **Produz:** Issues no repositório `supabase/agent-skills`
