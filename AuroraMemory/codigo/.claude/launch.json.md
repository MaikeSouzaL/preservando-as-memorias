---
origem: .claude/launch.json
origem_hash: 05c90935fb959a52a8b67fa327735c9f4b5a069b
gerado_em: 2026-06-26T00:33:20
---

# `.claude/launch.json`

# `.claude/launch.json`

**Responsabilidade:** Configuração de inicialização para o Claude Code, definindo como executar o projeto em modo de desenvolvimento.

**Configuração:**
- **`dev`**: Executa `npm run dev` (projeto Next.js), expondo na porta **3001**.
- Usa `runtimeExecutable: "npm"` com argumentos `["run", "dev"]`.

**Relações:** Liga-se ao `package.json` (script `dev`) e ao servidor Next.js na porta 3001.
