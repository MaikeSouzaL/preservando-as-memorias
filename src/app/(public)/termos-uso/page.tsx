import Link from "next/link";

export const dynamic = "force-dynamic";

export default function TermosUsoPage() {
  return (
    <div className="min-h-dvh bg-[#0c1117] text-[#e0e3e2]">
      {/* Header de navegação */}
      <nav className="sticky top-0 z-40 border-b border-[#e9c349]/10 bg-[#0c1117]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-serif italic text-[#e9c349]">
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              local_fire_department
            </span>
            <span className="text-sm font-bold tracking-widest">PRESERVANDO MEMÓRIAS</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-[#c4c7c7]/60 transition hover:text-[#c4c7c7]"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Voltar
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-[900px] px-6 py-12">
        {/* Cabeçalho */}
        <header className="mb-12 border-b border-[#e9c349]/10 pb-10">
          <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#e9c349]">
            Legal
          </p>
          <h1 className="text-[clamp(2rem,5vw,3rem)] font-light leading-[1.15] tracking-tight text-white">
            Termos de Uso
          </h1>
          <p className="mt-4 text-sm text-[#c4c7c7]/60">
            Última atualização: 9 de junho de 2026
          </p>
        </header>

        {/* Índice rápido */}
        <aside className="mb-12 rounded-2xl border border-[#e9c349]/10 bg-[#e9c349]/5 p-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#e9c349]">Índice</p>
          <ol className="grid gap-2 text-sm text-[#c4c7c7]/70">
            {[
              "Aceitação dos Termos",
              "Descrição do Serviço",
              "Cadastro e Segurança da Conta",
              "Conduta do Usuário e Conteúdo Proibido",
              "Planos, Pagamentos e Cancelamento",
              "Propriedade Intelectual",
              "Limitação de Responsabilidade",
              "Modificações dos Termos",
            ].map((item, i) => (
              <li key={i} className="flex items-baseline gap-2">
                <span className="shrink-0 text-[0.65rem] text-[#e9c349]/50">{i + 1}.</span>
                <span className="transition hover:text-[#e9c349]">{item}</span>
              </li>
            ))}
          </ol>
        </aside>

        {/* Conteúdo */}
        <div className="grid gap-10">
          <Section num="1" title="Aceitação dos Termos">
            <p>
              Ao acessar e utilizar a plataforma <strong className="text-[#e9c349]">Preservando Memórias</strong>, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços.
            </p>
          </Section>

          <Section num="2" title="Descrição do Serviço">
            <p>
              A plataforma oferece um espaço digital dedicado à criação de memoriais virtuais para homenagem a entes queridos, incluindo biografias, galerias de fotos, linhas do tempo, acendimento de velas virtuais e recebimento de tributos e mensagens de condolências.
            </p>
          </Section>

          <Section num="3" title="Cadastro e Segurança da Conta">
            <p>
              Para usufruir dos serviços de curadoria de memoriais, você deve criar uma conta. Você é inteiramente responsável por manter a confidencialidade dos dados da sua conta, incluindo sua senha, e por todas as atividades realizadas sob seu login.
            </p>
          </Section>

          <Section num="4" title="Conduta do Usuário e Conteúdo Proibido">
            <p>
              Você é o único responsável pelo conteúdo publicado nos memoriais que gerenciar. É terminantemente proibido publicar qualquer conteúdo que:
            </p>
            <ul className="mt-4 grid gap-3">
              <BulletItem>Seja difamatório, calunioso, obsceno, odioso ou discriminatório.</BulletItem>
              <BulletItem>Infrinja direitos autorais, marcas registradas ou direitos de propriedade intelectual de terceiros.</BulletItem>
              <BulletItem>Contenha spam, vírus ou qualquer código malicioso.</BulletItem>
            </ul>
            <p className="mt-4">
              Reservamo-nos o direito de remover qualquer memorial ou conteúdo que viole estas regras, bem como suspender ou encerrar a conta do infrator sem aviso prévio.
            </p>
          </Section>

          <Section num="5" title="Planos, Pagamentos e Cancelamento">
            <p>
              A plataforma oferece planos para criação e manutenção de memoriais digitais. Ao contratar um plano, você concorda com os valores exibidos no momento da compra e com as condições de faturamento correspondentes.
              Os pagamentos são processados por parceiros seguros, e seus respectivos termos se aplicam às transações.
            </p>
          </Section>

          <Section num="6" title="Propriedade Intelectual">
            <p>
              Todo o design, código-fonte, marcas e elementos gráficos da plataforma Preservando Memórias são de nossa propriedade exclusiva. Os textos, imagens e fotos inseridos nos memoriais pertencem aos respectivos curadores e autores que os publicaram.
            </p>
          </Section>

          <Section num="7" title="Limitação de Responsabilidade">
            <p>
              A plataforma é fornecida "como está". Em nenhuma circunstância seremos responsáveis por danos indiretos, incidentais ou perda de dados decorrentes do uso ou da impossibilidade de uso da plataforma.
            </p>
          </Section>

          <Section num="8" title="Modificações dos Termos">
            <p>
              Podemos alterar estes Termos de Uso a qualquer momento. O uso continuado da plataforma após a publicação das alterações constituirá sua aceitação dos novos termos.
            </p>
          </Section>
        </div>

        {/* Footer da página */}
        <footer className="mt-16 flex flex-col items-center gap-4 border-t border-[#e9c349]/10 pt-10 text-center">
          <p className="text-sm text-[#c4c7c7]/50">
            Dúvidas sobre estes termos? Entre em contato conosco.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/contato"
              className="rounded-full border border-outline-variant/30 px-5 py-2 text-xs text-[#c4c7c7]/70 transition hover:border-[#e9c349]/30 hover:text-[#e9c349]"
            >
              Fale conosco
            </Link>
            <Link
              href="/politica-privacidade"
              className="rounded-full border border-outline-variant/30 px-5 py-2 text-xs text-[#c4c7c7]/70 transition hover:border-[#e9c349]/30 hover:text-[#e9c349]"
            >
              Política de Privacidade →
            </Link>
          </div>
          <p className="text-xs text-[#c4c7c7]/25">
            © 2026 Preservando Memórias. Todos os direitos reservados.
          </p>
        </footer>
      </main>
    </div>
  );
}

function Section({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4">
      <div className="flex items-baseline gap-3">
        <span className="text-[0.7rem] font-bold text-[#e9c349]/50">{num}.</span>
        <h2 className="text-xl font-medium text-white">{title}</h2>
      </div>
      <div className="pl-6 text-[#c4c7c7]/75 leading-relaxed grid gap-3">{children}</div>
    </section>
  );
}

function BulletItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#e9c349]/40" />
      <span>{children}</span>
    </li>
  );
}
