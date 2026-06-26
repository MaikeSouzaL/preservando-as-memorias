---
origem: src/app/(dev)/dev/page.tsx
origem_hash: 0b25704e8b6e34a57fcf7ffed002cf00363660f7
gerado_em: 2026-06-26T00:33:20
---

# `src/app/(dev)/dev/page.tsx`

### `src/app/(dev)/dev/page.tsx` — Dev Console (Sistema)

Página de administração do desenvolvedor do sistema, protegida por sessão (`requireDevAdminSession`). Exibe métricas financeiras, permite configurar a comissão do sistema e gerenciar o admin parceiro.

**Componentes chave:**
- **`DevPage`** (default, async): Carrega dados da plataforma, calcula receitas e repasses, renderiza painéis de controle.
- **`MetricCard`**: Card de métrica com ícone, label e valor; suporta destaque visual (`highlight`).

**Painéis importados:**
- `CommissionConfigPanel` — altera percentual da comissão do sistema.
- `PlatformAdminPanel` — gerencia admin parceiro e exibe repasses.
- `RepassePanel` — mostra valores retidos no Stripe para transferência.
- `CriarMemorialButton` — cria memorial gratuito.

**Dados:** Consome `readPlatformData()` e descriptografa dados bancários do admin (`decrypt`). Redireciona para `/login` se não autenticado.

<!-- aurora:relacoes -->

## 🔗 Importa
- [[commission-config-panel.tsx]] — `src/components/dev/commission-config-panel.tsx`
- [[criar-memorial-button.tsx]] — `src/components/dev/criar-memorial-button.tsx`
- [[platform-admin-panel.tsx]] — `src/components/dev/platform-admin-panel.tsx`
- [[repasse-panel.tsx]] — `src/components/dev/repasse-panel.tsx`
- [[dev-auth.ts]] — `src/lib/dev-auth.ts`
- [[encrypt.ts]] — `src/lib/encrypt.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- **Externos/APIs:** next/link, next/navigation

## 📤 Exporta
`DevPage`, `default`, `dynamic`

## 🧩 Componentes usados
CommissionConfigPanel, CriarMemorialButton, Link, MetricCard, PlatformAdminPanel, RepassePanel

## 📥 Props recebidas
highlight, icon, label, value

## 🧠 Funções/Componentes definidos
`DevPage`, `MetricCard`, `brl`, `formatDate`, `paymentLabel`

## 📞 O que cada função chama
- `DevPage()` → Boolean, brl, decrypt, filter, formatDate, getTime, map, parse, paymentLabel, readPlatformData, redirect, reduce, requireDevAdminSession, slice, sort, toString
- `brl()` → toLocaleString
- `formatDate()` → toLocaleDateString

## 🔁 Chama (arquivos)
- [[dev-auth.ts]] — `src/lib/dev-auth.ts`
- [[encrypt.ts]] — `src/lib/encrypt.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`

