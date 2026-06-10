import Link from "next/link";

export const dynamic = "force-dynamic";

export default function PoliticaPrivacidadePage() {
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
            Política de Privacidade
          </h1>
          <p className="mt-4 text-sm text-[#c4c7c7]/60">
            Última atualização: 9 de junho de 2026
          </p>
        </header>

        {/* Destaque LGPD */}
        <div className="mb-10 flex items-start gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <span className="material-symbols-outlined mt-0.5 text-2xl text-emerald-400">shield</span>
          <div>
            <p className="text-sm font-semibold text-emerald-300">Em conformidade com a LGPD</p>
            <p className="mt-1 text-xs leading-relaxed text-[#c4c7c7]/60">
              Esta política está em conformidade com a Lei Geral de Proteção de Dados (Lei n° 13.709/2018). Seus dados são tratados com total transparência e segurança.
            </p>
          </div>
        </div>

        {/* Índice rápido */}
        <aside className="mb-12 rounded-2xl border border-[#e9c349]/10 bg-[#e9c349]/5 p-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#e9c349]">Índice</p>
          <ol className="grid gap-2 text-sm text-[#c4c7c7]/70">
            {[
              "Informações que Coletamos",
              "Como Usamos suas Informações",
              "Compartilhamento de Dados",
              "Segurança dos Dados",
              "Seus Direitos (LGPD)",
              "Cookies",
              "Retenção de Dados",
              "Alterações nesta Política",
            ].map((item, i) => (
              <li key={i} className="flex items-baseline gap-2">
                <span className="shrink-0 text-[0.65rem] text-[#e9c349]/50">{i + 1}.</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </aside>

        {/* Conteúdo */}
        <div className="grid gap-10">
          <Section num="1" title="Informações que Coletamos">
            <p>
              Ao utilizar a plataforma <strong className="text-[#e9c349]">Preservando Memórias</strong>, coletamos as seguintes informações:
            </p>
            <ul className="grid gap-3">
              <BulletItem>Nome completo e endereço de e-mail para criação e autenticação da conta.</BulletItem>
              <BulletItem>Conteúdo enviado por você: biografias, fotos, mensagens e dados de memoriais.</BulletItem>
              <BulletItem>Dados de navegação anônimos para melhoria da experiência do usuário.</BulletItem>
              <BulletItem>Informações de pagamento processadas exclusivamente por gateways seguros (não armazenamos dados de cartão).</BulletItem>
            </ul>
          </Section>

          <Section num="2" title="Como Usamos suas Informações">
            <p>Utilizamos os dados coletados exclusivamente para:</p>
            <ul className="grid gap-3">
              <BulletItem>Criar, manter e exibir os memoriais digitais configurados por você.</BulletItem>
              <BulletItem>Autenticar o seu acesso ao painel de curadoria.</BulletItem>
              <BulletItem>Processar pagamentos de planos e homenagens.</BulletItem>
              <BulletItem>Enviar notificações sobre novas interações nos seus memoriais (quando habilitadas).</BulletItem>
            </ul>
          </Section>

          <Section num="3" title="Compartilhamento de Dados">
            <p>
              Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros para fins de marketing.
              Seus dados podem ser compartilhados apenas com provedores de serviço essenciais — como processadores de pagamento e serviços de hospedagem em nuvem — estritamente necessários para o funcionamento da plataforma.
            </p>
          </Section>

          <Section num="4" title="Segurança dos Dados">
            <p>
              Adotamos medidas técnicas e organizacionais adequadas para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição. As senhas são armazenadas de forma criptografada e todas as comunicações são protegidas por protocolo HTTPS/TLS.
            </p>
          </Section>

          <Section num="5" title="Seus Direitos (LGPD)">
            <p>
              Em conformidade com a Lei Geral de Proteção de Dados (LGPD), você tem o direito de:
            </p>
            <ul className="grid gap-3">
              <BulletItem>Acessar, corrigir ou excluir os dados pessoais associados à sua conta.</BulletItem>
              <BulletItem>Revogar o consentimento para o tratamento de dados a qualquer momento.</BulletItem>
              <BulletItem>Solicitar a portabilidade dos seus dados.</BulletItem>
              <BulletItem>Ser informado sobre como seus dados são utilizados.</BulletItem>
            </ul>
            <div className="mt-4 rounded-xl border border-[#e9c349]/15 bg-[#e9c349]/5 p-4">
              <p className="text-sm">
                Para exercer esses direitos, entre em contato:{" "}
                <a
                  href="mailto:contato@preservandoasmemorias.com.br"
                  className="text-[#e9c349] underline underline-offset-2 transition hover:text-[#e9c349]/80"
                >
                  contato@preservandoasmemorias.com.br
                </a>
              </p>
            </div>
          </Section>

          <Section num="6" title="Cookies">
            <p>
              Utilizamos apenas cookies essenciais para manter a sessão do usuário autenticada e preservar suas preferências de interface. Não utilizamos cookies de rastreamento publicitário nem compartilhamos dados de navegação com redes de anúncios.
            </p>
          </Section>

          <Section num="7" title="Retenção de Dados">
            <p>
              Mantemos seus dados enquanto sua conta estiver ativa. Após o encerramento da conta, os dados pessoais são excluídos em até 30 dias, exceto quando a retenção for exigida por obrigação legal.
            </p>
          </Section>

          <Section num="8" title="Alterações nesta Política">
            <p>
              Reservamo-nos o direito de atualizar esta Política de Privacidade periodicamente. Notificaremos sobre mudanças significativas por meio da plataforma ou por e-mail cadastrado.
            </p>
          </Section>
        </div>

        {/* Footer da página */}
        <footer className="mt-16 flex flex-col items-center gap-4 border-t border-[#e9c349]/10 pt-10 text-center">
          <p className="text-sm text-[#c4c7c7]/50">
            Tem dúvidas sobre como tratamos seus dados?
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/contato"
              className="rounded-full border border-outline-variant/30 px-5 py-2 text-xs text-[#c4c7c7]/70 transition hover:border-[#e9c349]/30 hover:text-[#e9c349]"
            >
              Fale conosco
            </Link>
            <Link
              href="/termos-uso"
              className="rounded-full border border-outline-variant/30 px-5 py-2 text-xs text-[#c4c7c7]/70 transition hover:border-[#e9c349]/30 hover:text-[#e9c349]"
            >
              Termos de Uso →
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
