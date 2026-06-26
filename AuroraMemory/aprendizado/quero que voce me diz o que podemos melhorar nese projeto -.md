---
pergunta: quero que voce me diz o que podemos melhorar nese projeto ?
gerado_em: 2026-06-25T23:11:08
---

# quero que voce me diz o que podemos melhorar nese projeto ?

Olá! Com base no conhecimento que tenho do projeto, aqui está uma análise de refatoração com oportunidades de melhoria:

## 🔍 Oportunidades de Refatoração Identificadas

### 1. **Duplicação de Layout entre Rotas Públicas**
**Problema:** As páginas em `src/app/(public)/` (landing, contato, cadastro, etc.) parecem compartilhar estrutura similar, mas cada uma gerencia seu próprio layout/estado.

**Sugestão:** Extrair um `layout.tsx` compartilhado no grupo `(public)` que forneça:
- Header/Navbar consistente
- Footer padronizado
- Drawer mobile reutilizável

### 2. **Componente `Stat` Inline na Landing Page**
**Problema:** O componente `Stat` está definido dentro de `LandingPage`, impedindo reuso.

**Sugestão:** Mover para `src/components/ui/Stat.tsx` e tipar corretamente as props.

### 3. **Estado de FAQ Duplicado**
**Problema:** Lógica de accordion FAQ (`activeFaq`, `setActiveFaq`) aparece em landing e provavelmente em outras páginas.

**Sugestão:** Criar hook customizado `useAccordion` ou componente `Accordion` genérico.

### 4. **Mock Data vs API Real**
**Problema:** `public-content.json` é usado diretamente, mas o sistema tem API endpoints. Isso gera dois caminhos de dados.

**Sugestão:** Criar um adapter/service layer que abstraia a fonte dos dados:
```typescript
// src/services/public-content.ts
export async function getPublicContent() {
  if (process.env.NODE_ENV === 'development') {
    return (await import('@/mock-db/public-content')).default;
  }
  const res = await fetch('/api/public-content');
  return res.json();
}
```

### 5. **Nomes de Arquivos e Pastas**
**Problema:** Alguns nomes poderiam ser mais descritivos:
- `src/mock-db/` → `src/mocks/` (mais curto e padrão)
- `public-content.json` → `site-content.json` (mais específico)

### 6. **Componente `InputWithIcon` no Cadastro**
**Problema:** Input com ícone e toggle de senha está específico do cadastro, mas é útil em login e outras telas.

**Sugestão:** Extrair para `src/components/ui/InputWithIcon.tsx` com props genéricas.

### 7. **Código Morto Potencial**
**Sugestão:** Verificar se:
- `src/app/(future)/` contém algo não utilizado
- `src/app/(dev)/` pode ser removido em produção

### 8. **Tratamento de Erros Inconsistente**
**Problema:** Cada página trata erros de forma diferente (estado `error` vs `toast` vs console).

**Sugestão:** Criar hook `useApiError` ou componente `ErrorBoundary` padronizado.

---

## 📋 Plano de Ação Sugerido (Prioridade)

1. **Alta:** Extrair layout compartilhado do grupo `(public)`
2. **Alta:** Criar adapter para mock data vs API real
3. **Média:** Componentizar `Stat`, `InputWithIcon` e `Accordion`
4. **Média:** Padronizar tratamento de erros
5. **Baixa:** Renomear pastas e arquivos

---

**Quer que eu detalhe algum desses pontos?** Posso mostrar exemplos de código de como implementar cada refatoração, começando pelo que você achar mais crítico para o projeto.

## Arquivos consultados
- [[page.tsx]] — `src/app/(public)/landing/page.tsx`
