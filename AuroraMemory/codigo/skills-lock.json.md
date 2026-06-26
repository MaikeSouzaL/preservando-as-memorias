---
origem: skills-lock.json
origem_hash: 08c4d540db082f706b195779d535b78a282886d3
gerado_em: 2026-06-26T00:33:19
---

# `skills-lock.json`

Este arquivo `skills-lock.json` é um **manifesto de bloqueio de versões** para skills de um agente de IA. Sua responsabilidade principal é **fixar e validar** as versões exatas de skills instaladas, garantindo reprodutibilidade.

- **`version`**: Versão do formato do manifesto (atualmente `1`).
- **`skills`**: Objeto que mapeia cada skill (ex: `grill-me`, `supabase`) para suas configurações:
  - **`source`**: Repositório de origem (`mattpocock/skills` ou `supabase/agent-skills`).
  - **`sourceType`**: Tipo da fonte (`github`).
  - **`skillPath`**: Caminho relativo ao arquivo `SKILL.md` dentro do repositório.
  - **`computedHash`**: Hash SHA-256 do conteúdo da skill, usado para **verificação de integridade** e detecção de alterações.

O arquivo **não define APIs ou endpoints**, mas **consome** as skills referenciadas (arquivos `SKILL.md`). Ele se liga a um sistema de gerenciamento de skills que lê este lockfile para instalar/validar as versões corretas, similar a um `package-lock.json` para skills de IA.
