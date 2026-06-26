---
origem: src/app/(public)/login/acesso/layout.tsx
origem_hash: b6e59d9f3e0a7ce5d7ad91c79e61efa8a65daa57
gerado_em: 2026-06-26T00:33:20
---

# `src/app/(public)/login/acesso/layout.tsx`

### `src/app/(public)/login/acesso/layout.tsx`

**Responsabilidade:** Layout raiz da rota `/login/acesso`, servindo como wrapper para páginas de acesso.

**Componente chave:**
- `AcessoLayout` (async): Layout que renderiza `children` diretamente, sem estrutura visual adicional.

**Props:**
- `children: React.ReactNode` — conteúdo da página aninhada.

**Funcionalidade:**
- Executa `loadAcessoBootstrap()` (atualmente vazio) antes da renderização, preparado para futura inicialização (ex.: carregar configurações de acesso).

**Integração:** Envolve páginas filhas da rota `/login/acesso`, sem adicionar elementos visuais.

<!-- aurora:relacoes -->

## 📤 Exporta
`AcessoLayout`, `default`

## 📥 Props recebidas
children

## 🧠 Funções/Componentes definidos
`AcessoLayout`, `loadAcessoBootstrap`

## 📞 O que cada função chama
- `AcessoLayout()` → loadAcessoBootstrap

