# Banco de dados

Projeto Supabase: `xpgxfcsjkubkhmvkvzcu` (região `sa-east-1`).

As migrações são aplicadas direto no projeto e ficam registradas no histórico do
Supabase — não há pasta `supabase/migrations` neste repositório. Para ver o que
está aplicado, consulte o histórico de migrações no painel do Supabase.

## Migrações do modelo de 3 atores (12/08/2026)

| Versão | Nome | O que fez |
|---|---|---|
| `20260812023341` | `add_flowers_hearts_counters_to_memorials` | Criou `memorials.flowers` e `memorials.hearts`. O código já gravava nessas colunas, mas elas nunca existiram — **todo INSERT de memorial falhava em silêncio**. |
| `20260812133126` | `drop_funeral_erp_tables` | Removeu `funeral_services`, `funeral_schedules`, `inventory_items`, `staff_members`, `funeral_documents`. Eram um ERP funerário (urnas, motoristas, certidão de óbito) sem tela e sem uso. |
| `20260812133147` | `funeral_home_billing_model` | Criou `funeral_billing_plans` e `funeral_invoices`, mais `funeral_homes.billing_plan_id`. |
| `20260812133213` | `qr_plaque_delivery_tracking` | Criou `qr_deliveries` (rastreio da placa física) e índices em 10 chaves estrangeiras. |
| `20260812133230` | `fix_security_advisors_and_rls` | Fixou `search_path` das funções, revogou `EXECUTE` público de `handle_new_user`, e removeu a policy que deixava **qualquer visitante inserir uma funerária já aprovada**. |
| `20260812135255` | `add_auto_approve_tributes_config` | Tornou configurável se homenagens entram aprovadas ou pendentes. |

## Cobrança da funerária

```
funeral_billing_plans
  billing_mode                'monthly' | 'per_qr'
  monthly_fee_cents           mensalidade
  included_memorials          cota inclusa no plano mensal
  extra_memorial_price_cents  preço por memorial excedente (ou por QR no modo per_qr)
  is_default                  índice único parcial garante um só padrão

funeral_homes.billing_plan_id  FK nullable — NULL herda o plano padrão
funeral_invoices               fatura fechada por período
```

## Observação sobre a camada de acesso

`readPlatformData()` em `src/lib/platform-data.ts` carrega **várias tabelas
inteiras com `select("*")` a cada chamada** e filtra em JavaScript. Isso é
herança da época em que a persistência era um JSON local. Funciona hoje porque o
volume é baixo, mas não escala e deve ser substituído por consultas filtradas.

O painel da funerária (`src/components/funeral/memorial-data.ts`) já usa
consultas direcionadas e serve de referência para essa migração.
