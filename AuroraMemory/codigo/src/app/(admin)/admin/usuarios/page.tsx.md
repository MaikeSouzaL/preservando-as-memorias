---
origem: src/app/(admin)/admin/usuarios/page.tsx
origem_hash: 5821c4a9aa9b5c0ec60a9a45dc65246e6cc119a6
gerado_em: 2026-06-26T00:33:20
---

# `src/app/(admin)/admin/usuarios/page.tsx`

# AdminUsersPage - Página de Usuários (Admin)

**Responsabilidade:** Página administrativa que lista curadores/clientes a partir de pedidos registrados.

## Funcionalidades

- **Leitura de dados:** Importa `readPlatformData()` de `src/lib/platform-data.ts` para obter pedidos e planos
- **Mapeamento:** Converte `data.orders` em lista de usuários com nome, email, CPF, telefone, plano, status e data
- **Renderização:** Tabela responsiva com colunas Nome, E-mail/CPF, Telefone, Plano Ativo, Data Cadastro e Status
- **Status:** "Ativo" (paid) ou "Aguardando Pagamento" (outros status)
- **Exportação:** `dynamic = "force-dynamic"` para renderização sob demanda

## Props/Parâmetros

- Nenhum (página assíncrona sem props)

## Integração

- Consome `readPlatformData()` do módulo `src/lib/platform-data.ts`
- Exibe dados de pedidos e planos da plataforma

<!-- aurora:relacoes -->

## 🔗 Importa
- [[platform-data.ts]] — `src/lib/platform-data.ts`

## 📤 Exporta
`AdminUsersPage`, `default`, `dynamic`

## 🧠 Funções/Componentes definidos
`AdminUsersPage`

## 📞 O que cada função chama
- `AdminUsersPage()` → find, map, readPlatformData, toLocaleDateString

## 🔁 Chama (arquivos)
- [[platform-data.ts]] — `src/lib/platform-data.ts`

