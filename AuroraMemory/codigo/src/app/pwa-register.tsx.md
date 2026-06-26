---
origem: src/app/pwa-register.tsx
origem_hash: 4b70ce7c8e5408872a7ee8136c2b652e04b80f80
gerado_em: 2026-06-26T00:33:19
---

# `src/app/pwa-register.tsx`

# `src/app/pwa-register.tsx`

## Responsabilidade
Componente cliente que **desregistra service workers** no App Router Next.js, prevenindo conflitos de cache que causam erros `ERR_FAILED` em navegação dinâmica.

## Funcionalidade
- **`PwaRegister`**: Componente React que retorna `null` (sem UI)
  - No `useEffect`, verifica suporte a Service Worker
  - Itera sobre todos registros ativos e os **desregistra**
  - Loga sucesso no console quando um SW antigo é removido

## Props/Parâmetros
- Nenhum (componente sem props)

## Integração
- **Importado por**: `src/app/layout.tsx` (provavelmente como componente raiz)
- **Consome**: API `navigator.serviceWorker` do navegador
- **Efeito**: Garante que o App Router funcione sem interferência de cache de SWs de versões anteriores

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** react

## ⬅️ Importado por
- [[layout.tsx]] — `src/app/layout.tsx`

## 📤 Exporta
`PwaRegister`

## 🪝 Hooks / efeitos
useEffect

## 🧠 Funções/Componentes definidos
`PwaRegister`

## 📞 O que cada função chama
- `PwaRegister()` → getRegistrations, log, then, unregister, useEffect

