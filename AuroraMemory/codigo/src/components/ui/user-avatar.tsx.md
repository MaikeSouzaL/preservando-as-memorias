---
origem: src/components/ui/user-avatar.tsx
origem_hash: fbc5886b42374b8b8d481361fba72f0115496b0a
gerado_em: 2026-06-25T23:37:29
---

# `src/components/ui/user-avatar.tsx`

## UserAvatar

Componente que exibe a foto real do usuário ou um círculo com iniciais como fallback.

**Props:**
- `avatarUrl?`: URL da imagem do avatar
- `name?`: Nome do usuário (para gerar iniciais e cor de fundo)
- `size?`: Tamanho em pixels (padrão 40)
- `className?`: Classes CSS adicionais

**Funcionalidades:**
- Se `avatarUrl` for fornecida, exibe a imagem com fallback para iniciais em caso de erro
- Se não houver URL, gera um círculo colorido com até 2 iniciais do nome
- A cor de fundo é determinada consistentemente a partir do nome
- Usa "?" como fallback se não houver nome

**Importado por:** `configuracoes/page.tsx`, `admin-shell.tsx`, `private-shell.tsx`

<!-- aurora:relacoes -->

## ⬅️ Importado por
- [[page.tsx]] — `src/app/(private)/configuracoes/page.tsx`
- [[admin-shell.tsx]] — `src/components/admin/admin-shell.tsx`
- [[private-shell.tsx]] — `src/components/private/private-shell.tsx`

## 📤 Exporta
`UserAvatar`

## 📥 Props recebidas
avatarUrl, className, name, size

## 🧠 Funções/Componentes definidos
`UserAvatar`, `getBgColor`, `getInitials`

## 📞 O que cada função chama
- `UserAvatar()` → floor, getBgColor, getInitials, max
- `getBgColor()` → charCodeAt, trim
- `getInitials()` → charAt, split, toUpperCase, trim

