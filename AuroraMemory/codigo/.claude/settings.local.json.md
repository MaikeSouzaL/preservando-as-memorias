---
origem: .claude/settings.local.json
origem_hash: 9284def48b3633550fceabae4710b7a0b393c7ce
gerado_em: 2026-06-25T23:37:30
---

# `.claude/settings.local.json`

Este é um arquivo de configuração de permissões do **Claude Code** (`.claude/settings.local.json`).

**Responsabilidade principal:** Define quais comandos, ferramentas MCP e operações o Claude pode executar no projeto "preservando-as-memorias".

**Estrutura:**
- `permissions.allow`: lista exaustiva de ações permitidas, incluindo:
  - **Comandos shell:** `Bash(...)` e `PowerShell(...)` para operações de arquivo, git, npm, Next.js, Stripe, Vercel
  - **Ferramentas MCP:** acesso a serviços externos (Supabase, Stripe, navegador Chrome, visualização)
  - **Leitura de arquivos:** `Read(...)` para configs do Stripe

**Conexões:** Funciona como uma **lista de controle de acesso (ACL)** que restringe o agente Claude a operações específicas neste repositório, garantindo segurança ao limitar comandos potencialmente destrutivos.
