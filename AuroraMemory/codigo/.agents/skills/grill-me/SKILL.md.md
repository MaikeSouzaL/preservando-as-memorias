---
origem: .agents/skills/grill-me/SKILL.md
origem_hash: 8dbde08fef2c92afda6b7ca7ba5bfe1067995d1d
gerado_em: 2026-06-26T00:33:20
---

# `.agents/skills/grill-me/SKILL.md`

# `grill-me` Skill

**Responsabilidade:** Entrevistar o usuário exaustivamente sobre um plano ou design até alcançar entendimento compartilhado, percorrendo cada ramo da árvore de decisão.

**Comportamento chave:**
- Faz perguntas uma de cada vez, caminhando por cada ramo da árvore de design
- Para cada pergunta, fornece uma resposta recomendada
- Se uma pergunta pode ser respondida explorando o codebase, explora o codebase em vez de perguntar
- Resolve dependências entre decisões uma por uma

**Ativação:** Usado quando o usuário quer testar um plano, ser "grillado" sobre seu design, ou menciona "grill me".

**Conexões:** Este skill é invocado pelo agente principal quando detecta a intenção do usuário de estressar um plano ou design.
