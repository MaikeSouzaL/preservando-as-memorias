---
origem: src/app/(public)/politica-privacidade/page.tsx
origem_hash: d601e203002cef08a3fc8876da40af18ef1b74c9
gerado_em: 2026-06-25T23:37:29
---

# `src/app/(public)/politica-privacidade/page.tsx`

# Política de Privacidade — Página Estática

**Responsabilidade:** Exibe a política de privacidade do projeto "Preservando Memórias", em conformidade com a LGPD.

**Componentes chave:**
- `PoliticaPrivacidadePage` (default) — página completa com navegação, índice, seções de conteúdo e footer
- `Section` — componente de seção com numeração e título (`num: string`, `title: string`, `children: ReactNode`)
- `BulletItem` — item de lista estilizado com bullet point (`children: ReactNode`)

**Funcionalidades:**
- Navegação com link para home e botão "Voltar"
- Índice rápido com 8 tópicos
- Destaque de conformidade com LGPD
- 8 seções de conteúdo (coleta, uso, compartilhamento, segurança, direitos, cookies, retenção, alterações)
- Footer com links para contato e termos de uso

**Relações:** Consome `next/link` para navegação interna; não define APIs ou endpoints.

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** next/link

## 📤 Exporta
`PoliticaPrivacidadePage`, `default`, `dynamic`

## 🧩 Componentes usados
BulletItem, Link, Section

## 📥 Props recebidas
children, num, title

## 🧠 Funções/Componentes definidos
`BulletItem`, `PoliticaPrivacidadePage`, `Section`

## 📞 O que cada função chama
- `PoliticaPrivacidadePage()` → map

