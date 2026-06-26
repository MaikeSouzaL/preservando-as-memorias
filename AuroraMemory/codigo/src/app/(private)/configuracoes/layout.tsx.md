---
origem: src/app/(private)/configuracoes/layout.tsx
origem_hash: 104c39e55473052f7a92a2cfd3f3afb07b431591
gerado_em: 2026-06-25T23:37:29
---

# `src/app/(private)/configuracoes/layout.tsx`

### `src/app/(private)/configuracoes/layout.tsx`

**Responsabilidade:** Layout assíncrono para a rota `/configuracoes` (área privada).

**Componente principal:**
- **`ScreenLayout`** (default export): Componente assíncrono que recebe `children` como prop. Executa `loadScreenData()` (atualmente retorna `null`, sem efeito) e renderiza os filhos diretamente.

**Props:**
- `children: React.ReactNode` — conteúdo aninhado da rota.

**Conexões:**
- Define layout para todas as páginas sob `/configuracoes`.
- Atualmente é um wrapper transparente (sem estrutura visual), apenas garantindo execução assíncrona antes da renderização dos filhos.

<!-- aurora:relacoes -->

## 📤 Exporta
`ScreenLayout`, `default`

## 📥 Props recebidas
children

## 🧠 Funções/Componentes definidos
`ScreenLayout`, `loadScreenData`

## 📞 O que cada função chama
- `ScreenLayout()` → loadScreenData

