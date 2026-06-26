---
origem: src/app/(public)/cadastro/layout.tsx
origem_hash: 8297055be6435874b0ca60c23e328cb6dce22d14
gerado_em: 2026-06-25T23:37:29
---

# `src/app/(public)/cadastro/layout.tsx`

### `src/app/(public)/cadastro/layout.tsx`

**Responsabilidade:** Layout raiz da rota `/cadastro`, servindo como wrapper para páginas de cadastro.

**Componente chave:**
- `ScreenLayout` (default): Componente assíncrono que recebe `children` (ReactNode) e os renderiza diretamente, sem estrutura visual adicional.

**Props:**
- `children`: Conteúdo das páginas aninhadas na rota.

**Funcionamento:**
- Executa `loadScreenData()` (atualmente retorna `null`, sem efeito real) antes de renderizar.
- Renderiza apenas `{children}`, sem adicionar elementos HTML extras.

**Integração:** Atua como layout intermediário entre o layout raiz da aplicação e as páginas de cadastro, permitindo futura injeção de dados ou lógica compartilhada.

<!-- aurora:relacoes -->

## 📤 Exporta
`ScreenLayout`, `default`

## 📥 Props recebidas
children

## 🧠 Funções/Componentes definidos
`ScreenLayout`, `loadScreenData`

## 📞 O que cada função chama
- `ScreenLayout()` → loadScreenData

