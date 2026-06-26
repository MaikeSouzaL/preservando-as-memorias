---
origem: check-exact.ts
origem_hash: bd8f47dfbb14a98dd5afcfa956431ad2ebd986a3
gerado_em: 2026-06-25T23:37:13
---

# `check-exact.ts`

```markdown
# check-exact.ts

## Responsabilidade
Script utilitário para verificar perfis de usuário no Supabase com `is_dev_admin = false`.

## Funcionalidade
- Conecta ao Supabase usando service role key
- Consulta tabela `profiles` filtrando por `is_dev_admin = false`
- Exibe quantidade e dados completos dos perfis encontrados

## Dependências
- **@supabase/supabase-js**: Cliente Supabase
- **Variáveis de ambiente**: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

## Uso
Script executado diretamente via Node.js para auditoria de perfis não-admin.
```

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** @supabase/supabase-js, profiles

## 🧠 Funções/Componentes definidos
`check`

## 📞 O que cada função chama
- `check()` → dir, eq, error, from, log, order, select

