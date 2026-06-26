---
pergunta: voce tem acesso a memoria do projeto ?
gerado_em: 2026-06-25T22:34:53
---

# voce tem acesso a memoria do projeto ?

Sim, tenho acesso completo à memória do projeto! 🎯

Com base no que já foi catalogado, aqui está o que sei sobre o **fluxo de recuperação de senha**:

## 📍 Onde está
- **Página:** `src/app/(public)/recuperar-senha/page.tsx`
- **API:** `POST /api/auth/reset-password/request`

## 🔄 Como funciona
1. Usuário acessa `/recuperar-senha`
2. Preenche o e-mail no formulário
3. Clica em enviar → faz `POST` para a API de reset
4. API envia um e-mail com link de redefinição (válido por **15 minutos**)
5. Após o envio, a página mostra uma tela de confirmação

## 🧩 Estados da página
- **Formulário** (`submitted=false`): campo de e-mail + botão de envio
- **Confirmação** (`submitted=true`): mensagem de sucesso após envio

## ⚠️ O que eu **NÃO** sei ainda
- O conteúdo do arquivo `src/app/(public)/recuperar-senha/page.tsx` em si (só tenho o resumo)
- Como é a página de **redefinição de senha** (aquela que o link do e-mail leva)
- Detalhes da implementação da API de reset

Quer que eu aprofunde em algum desses pontos? Posso buscar mais detalhes sobre a página, a API ou o fluxo completo de autenticação.
