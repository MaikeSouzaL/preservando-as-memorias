export const dynamic = "force-dynamic";

export default function PoliticaPrivacidadePage() {
  return (
    <main className="mx-auto flex w-full max-w-[900px] flex-1 flex-col px-gutter py-12">
      <header className="mb-10">
        <p className="mb-2 font-label-caps text-[0.75rem] uppercase tracking-[0.15em] text-tertiary">
          Legal
        </p>
        <h1 className="font-h2 text-[clamp(2rem,5vw,3rem)] font-light leading-[1.2] tracking-[-0.01em] text-on-surface">
          Política de Privacidade
        </h1>
        <p className="mt-3 max-w-3xl text-on-surface-variant">
          Última atualização: 25 de maio de 2026
        </p>
      </header>

      <div className="prose-custom grid gap-8 text-on-surface-variant leading-relaxed">
        <section>
          <h2 className="mb-3 font-h3 text-[1.4rem] text-on-surface">1. Informações que Coletamos</h2>
          <p>
            Ao utilizar a plataforma <strong className="text-tertiary">Preservando as Memórias</strong>, coletamos as seguintes informações:
          </p>
          <ul className="mt-3 grid gap-2 pl-5">
            <li className="list-disc">Nome completo e endereço de e-mail para criação e autenticação da conta.</li>
            <li className="list-disc">Conteúdo enviado por você, como biografias, fotos, mensagens de homenagem e dados de memoriais.</li>
            <li className="list-disc">Dados de navegação anônimos para melhoria da experiência do usuário.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-h3 text-[1.4rem] text-on-surface">2. Como Usamos suas Informações</h2>
          <p>Utilizamos os dados coletados exclusivamente para:</p>
          <ul className="mt-3 grid gap-2 pl-5">
            <li className="list-disc">Criar, manter e exibir os memoriais digitais configurados por você.</li>
            <li className="list-disc">Autenticar o seu acesso ao painel de curadoria.</li>
            <li className="list-disc">Processar pagamentos de planos, velas e homenagens premium.</li>
            <li className="list-disc">Enviar notificações sobre novas homenagens ou interações nos seus memoriais (quando habilitadas).</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-h3 text-[1.4rem] text-on-surface">3. Compartilhamento de Dados</h2>
          <p>
            Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros para fins de marketing.
            Seus dados podem ser compartilhados apenas com provedores de serviço essenciais (como processadores de pagamento e serviços de hospedagem em nuvem) estritamente necessários para o funcionamento da plataforma.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-h3 text-[1.4rem] text-on-surface">4. Segurança dos Dados</h2>
          <p>
            Adotamos medidas técnicas e organizacionais adequadas para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição. As senhas são armazenadas de forma criptografada e as comunicações são protegidas por protocolo HTTPS.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-h3 text-[1.4rem] text-on-surface">5. Seus Direitos</h2>
          <p>
            Em conformidade com a Lei Geral de Proteção de Dados (LGPD), você tem o direito de:
          </p>
          <ul className="mt-3 grid gap-2 pl-5">
            <li className="list-disc">Acessar, corrigir ou excluir os dados pessoais associados à sua conta.</li>
            <li className="list-disc">Revogar o consentimento para o tratamento de dados a qualquer momento.</li>
            <li className="list-disc">Solicitar a portabilidade dos seus dados.</li>
          </ul>
          <p className="mt-3">
            Para exercer esses direitos, entre em contato conosco pelo e-mail{" "}
            <a href="mailto:contato@preservandoasmemorias.com.br" className="text-tertiary underline underline-offset-2 transition hover:text-tertiary/80">
              contato@preservandoasmemorias.com.br
            </a>.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-h3 text-[1.4rem] text-on-surface">6. Cookies</h2>
          <p>
            Utilizamos cookies essenciais para manter a sessão do usuário autenticada. Não utilizamos cookies de rastreamento publicitário.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-h3 text-[1.4rem] text-on-surface">7. Alterações nesta Política</h2>
          <p>
            Reservamo-nos o direito de atualizar esta Política de Privacidade periodicamente. Notificaremos sobre mudanças significativas por meio da plataforma ou por e-mail.
          </p>
        </section>
      </div>
    </main>
  );
}
