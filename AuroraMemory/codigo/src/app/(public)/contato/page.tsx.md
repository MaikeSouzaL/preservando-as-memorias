---
origem: src/app/(public)/contato/page.tsx
origem_hash: 1880b62d8eae432e677ffa4d7b46c51f7a8bf480
gerado_em: 2026-06-26T00:33:20
---

# `src/app/(public)/contato/page.tsx`

# `src/app/(public)/contato/page.tsx`

## Responsabilidade
Página de contato pública do "Preservando a Memória", exibindo formulário de mensagem e canais de atendimento.

## Componentes

- **`ContatoPage`** (default export) — Página completa com:
  - Header com título "Fale com a equipe"
  - Seção de formulário (nome, e-mail, assunto, mensagem + botão enviar)
  - Seção de canais (email, WhatsApp, horário) com link para `/faq`
- **`Field`** — Componente interno de input estilizado
  - Props: `label`, `type`, `placeholder`

## Dados
- `contactChannels`: array estático com 3 canais (label + value)

## Bibliotecas
- `next/link` — Link para FAQ

## Conexões
- Link para `/faq` (perguntas frequentes)
- Layout público via rota `(public)`

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** next/link

## 📤 Exporta
`ContatoPage`, `default`

## 🧩 Componentes usados
Field, Link

## 📥 Props recebidas
label, placeholder, type

## 🧠 Funções/Componentes definidos
`ContatoPage`, `Field`

## 📞 O que cada função chama
- `ContatoPage()` → map

