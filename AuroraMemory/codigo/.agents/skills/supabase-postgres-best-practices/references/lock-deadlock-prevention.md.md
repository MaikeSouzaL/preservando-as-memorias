---
origem: .agents/skills/supabase-postgres-best-practices/references/lock-deadlock-prevention.md
origem_hash: 1346763fc8f7435608fbdf964d915ef1bc5a29c5
gerado_em: 2026-06-25T23:37:30
---

# `.agents/skills/supabase-postgres-best-practices/references/lock-deadlock-prevention.md`

# Lock Deadlock Prevention

## Purpose
Guia para prevenir deadlocks em transações PostgreSQL através de ordenação consistente de locks.

## Conteúdo Principal
- **Problema**: Deadlocks ocorrem quando transações adquirem locks em ordens diferentes
- **Solução**: Adquirir locks em ordem consistente usando `ORDER BY` com `FOR UPDATE`
- **Alternativa**: Usar `UPDATE` único com `CASE` para adquirir todos os locks atomicamente

## Comandos Chave
- `SELECT ... WHERE id IN (...) ORDER BY id FOR UPDATE` — lock explícito ordenado
- `UPDATE ... SET balance = balance + CASE ... END WHERE id IN (...)` — atualização atômica
- `pg_stat_database.deadlocks` — monitoramento de deadlocks
- `log_lock_waits = on` e `deadlock_timeout = '1s'` — logging de deadlocks

## Relações
- Referencia documentação oficial PostgreSQL sobre deadlocks
- Relaciona-se a práticas de transações e locking no Supabase
