---
origem: src/app/(public)/contato/page.tsx
origem_hash: 22425bfb84bb9a9d1c08582f9e06aaa529dea45a
gerado_em: 2026-06-25T23:37:29
---

# `src/app/(public)/contato/page.tsx`

# Página de Contato

## Responsabilidade
Página pública de contato/suporte com formulário de mensagem e canais de atendimento.

## Componentes

- **`ContatoPage`** (default export): Página principal com layout responsivo (grid 2 colunas em desktop)
  - Seção "Enviar mensagem": formulário com campos Nome, E-mail, Assunto e Mensagem
  - Seção "Canais de atendimento": lista dinâmica de canais via `publicContent.contact.channels`
  - Link para `/faq`

- **`Field`**: Componente interno de input reutilizável
  - Props: `label`, `type`, `placeholder`

## Dependências
- **`publicContent`** (mock-db): dados dos canais de contato
- **`next/link`**: navegação para FAQ

<!-- aurora:relacoes -->

## 🔗 Importa
- [[public-content.ts]] — `src/mock-db/public-content.ts`
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

## 🔁 Chama (arquivos)
- [[public-content.ts]] — `src/mock-db/public-content.ts`

