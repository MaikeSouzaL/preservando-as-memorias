---
origem: src/app/layout.tsx
origem_hash: c06b98e0ddb178ae2a76b60271b2ff10c632fd51
gerado_em: 2026-06-29T18:31:48
---

# `src/app/layout.tsx`

```markdown
Este arquivo define o layout raiz do Next.js para o app "Preservando Memórias".  
**Responsabilidade**: Renderizar a estrutura HTML `<html><body>` com filhos e componentes globais.  
**Exporta**: `metadata` (título, descrição, nome do app) e o componente `RootLayout` (default).  
**RootLayout**:  
- **Recebe**: `children: React.ReactNode`  
- **Retorna**: `<html lang="pt-BR">` com classes `h-full antialiased`, `<head>` com fontes do Google (Material Symbols, Material Icons), e `<body>` com `min-h-full flex flex-col`.  
- **Chama/usa componentes**: `<PwaRegister />`, `<PwaInstallBanner />`, `<CookieBanner />`.  
- **Links com outros arquivos**: Importa `globals.css`, `pwa-register.tsx`, `cookie-banner.tsx` e `pwa-install-banner.tsx`.  
- **Bibliotecas**: Next (Metadata, next).  
- **Efeitos colaterais**: Carrega folhas de estilo externas de fontes (CSS via link).  
- **Mensagens/textos**: Nenhum texto visível ao usuário diretamente.  
```

<!-- aurora:relacoes -->

## 🔗 Importa
- [[globals.css]] — `src/app/globals.css`
- [[pwa-register.tsx]] — `src/app/pwa-register.tsx`
- [[cookie-banner.tsx]] — `src/components/ui/cookie-banner.tsx`
- [[pwa-install-banner.tsx]] — `src/components/ui/pwa-install-banner.tsx`
- **Externos/APIs:** next

## 📤 Exporta
`RootLayout`, `default`, `metadata`

## 🧩 Componentes usados
CookieBanner, PwaInstallBanner, PwaRegister

## 📥 Props recebidas
children

## 🧠 Funções/Componentes definidos
`RootLayout`

