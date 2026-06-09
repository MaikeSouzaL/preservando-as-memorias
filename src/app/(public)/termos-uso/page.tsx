export const dynamic = "force-dynamic";

export default function TermosUsoPage() {
  return (
    <main className="mx-auto flex w-full max-w-[900px] flex-1 flex-col px-gutter py-12">
      <header className="mb-10">
        <p className="mb-2 font-label-caps text-[0.75rem] uppercase tracking-[0.15em] text-tertiary">
          Legal
        </p>
        <h1 className="font-h2 text-[clamp(2rem,5vw,3rem)] font-light leading-[1.2] tracking-[-0.01em] text-on-surface">
          Termos de Uso
        </h1>
        <p className="mt-3 max-w-3xl text-on-surface-variant">
          Última atualização: 25 de maio de 2026
        </p>
      </header>

      <div className="prose-custom grid gap-8 text-on-surface-variant leading-relaxed">
        <section>
          <h2 className="mb-3 font-h3 text-[1.4rem] text-on-surface">1. Aceitação dos Termos</h2>
          <p>
            Ao acessar e utilizar a plataforma <strong className="text-tertiary">Preservando Memórias</strong>, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-h3 text-[1.4rem] text-on-surface">2. Descrição do Serviço</h2>
          <p>
            A plataforma oferece um espaço digital dedicado à criação de memoriais virtuais para homenagem a entes queridos, incluindo biografias, galerias de fotos, linhas do tempo, acendimento de velas virtuais e recebimento de tributos/mensagens de condolências.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-h3 text-[1.4rem] text-on-surface">3. Cadastro e Segurança da Conta</h2>
          <p>
            Para usufruir dos serviços de curadoria de memoriais, você deve criar uma conta de curador. Você é inteiramente responsável por manter a confidencialidade dos dados da sua conta (incluindo sua senha) e por todas as atividades que ocorram sob seu login.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-h3 text-[1.4rem] text-on-surface">4. Conduta do Usuário e Conteúdo Proibido</h2>
          <p>
            Você é o único responsável pelo conteúdo publicado nos memoriais que gerenciar. É terminantemente proibido publicar qualquer conteúdo que:
          </p>
          <ul className="mt-3 grid gap-2 pl-5">
            <li className="list-disc">Seja difamatório, calunioso, obsceno, odioso ou discriminatório.</li>
            <li className="list-disc">Infrinja direitos autorais, marcas registradas ou direitos de propriedade intelectual de terceiros.</li>
            <li className="list-disc">Contenha spam, vírus ou qualquer código malicioso que comprometa o funcionamento da plataforma.</li>
          </ul>
          <p className="mt-3">
            Reservamo-nos o direito de remover qualquer memorial ou conteúdo que viole estas regras, bem como suspender ou banir a conta do infrator sem aviso prévio.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-h3 text-[1.4rem] text-on-surface">5. Planos, Pagamentos e Cancelamento</h2>
          <p>
            A plataforma oferece planos gratuitos e pagos. Ao assinar um plano pago, você concorda com as condições de cobrança recorrente, valores exibidos no painel comercial e ciclos de faturamento selecionados.
            Os pagamentos são processados por parceiros integrados seguros, e os termos dos gateways de pagamento se aplicam a essas transações.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-h3 text-[1.4rem] text-on-surface">6. Propriedade Intelectual</h2>
          <p>
            Todo o design, código-fonte, marcas e elementos gráficos da plataforma Preservando Memórias são de nossa propriedade exclusiva. Os textos, imagens e fotos inseridos nos memoriais pertencem aos respectivos curadores e autores que os publicaram.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-h3 text-[1.4rem] text-on-surface">7. Limitação de Responsabilidade</h2>
          <p>
            A plataforma é fornecida "como está" e não garantimos que o serviço será ininterrupto ou livre de erros. Em nenhuma circunstância seremos responsáveis por danos indiretos, incidentais ou perda de dados decorrentes do uso ou da impossibilidade de uso da plataforma.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-h3 text-[1.4rem] text-on-surface">8. Modificações dos Termos</h2>
          <p>
            Podemos alterar estes Termos de Uso a qualquer momento. O uso continuado da plataforma após a publicação das alterações constituirá sua aceitação dos novos termos.
          </p>
        </section>
      </div>
    </main>
  );
}
