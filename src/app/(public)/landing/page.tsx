"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const steps = [
  {
    icon: "edit_document",
    title: "1. Crie o memorial",
    description: "Reuna fotos, relatos e biografias em um espaco digital seguro e sofisticado.",
  },
  {
    icon: "qr_code_2",
    title: "2. Gere o QR Code",
    description: "Um codigo unico gravado em placa premium conecta o fisico ao digital.",
  },
  {
    icon: "location_on",
    title: "3. Instale com facilidade",
    description: "Fixe a placa de identificacao no local de descanso com praticidade.",
  },
  {
    icon: "hourglass_empty",
    title: "4. Preserve para sempre",
    description: "Compartilhe o legado com futuras geracoes mantendo a memoria viva.",
  },
];

const faqs = [
  {
    question: "Como funciona a conexao com o QR Code fisico?",
    answer:
      "A placa memorial possui um QR exclusivo. Ao escanear com o celular, o visitante abre o memorial digital instantaneamente, sem app adicional.",
  },
  {
    question: "O memorial digital dura para sempre?",
    answer:
      "Sim. Utilizamos armazenamento seguro com redundancia e backups para preservar historias, fotos e audios ao longo do tempo.",
  },
  {
    question: "A familia pode editar o memorial depois?",
    answer:
      "Sim. O curador tem acesso a um painel protegido por senha para atualizar conteudos e moderar homenagens quando quiser.",
  },
  {
    question: "As placas sao resistentes ao tempo?",
    answer:
      "Sim. As placas sao preparadas para ambientes externos e recebem gravacao de alta durabilidade.",
  },
];

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="relative isolate max-w-full overflow-x-clip bg-[#0d1010] text-[#e0e3e2] antialiased selection:bg-[#e9c349]/20 selection:text-[#e9c349]">
      <style>{`
        html { scroll-behavior: smooth; }
        @keyframes floatBlob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        .animate-float-blob-1 { animation: floatBlob 16s infinite ease-in-out; }
        .animate-float-blob-2 { animation: floatBlob 20s infinite ease-in-out; animation-delay: 3s; }
        .glass-panel {
          background: rgba(22, 28, 28, 0.45);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(233, 195, 73, 0.08);
        }
      `}</style>

      <div className="pointer-events-none absolute left-[10%] top-[15%] -z-10 h-[500px] w-[500px] rounded-full bg-[#e9c349]/5 blur-[120px] animate-float-blob-1" />
      <div className="pointer-events-none absolute right-[10%] top-[40%] -z-10 h-[560px] w-[560px] rounded-full bg-[#e9c349]/3 blur-[140px] animate-float-blob-2" />
      <div className="pointer-events-none absolute right-0 top-0 z-[1] hidden h-[980px] w-[min(60vw,1060px)] overflow-hidden lg:block">
        <Image
          src="/imagens/logo.png"
          alt=""
          width={1120}
          height={1120}
          className="absolute -right-44 top-8 h-auto w-[1120px] max-w-none opacity-[0.58] mix-blend-screen"
          style={{
            filter:
              "contrast(1.22) brightness(1.15) saturate(1.2) drop-shadow(0 0 42px rgba(233,195,73,0.3))",
            WebkitMaskImage:
              "linear-gradient(to left, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 100%)",
            maskImage:
              "linear-gradient(to left, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 100%)",
          }}
        />
      </div>
      <header className="fixed left-1/2 top-3 z-50 w-[calc(100%-16px)] max-w-[1200px] -translate-x-1/2 rounded-full border border-[#e9c349]/10 bg-[#161c1c]/50 shadow-2xl backdrop-blur-xl sm:top-6 sm:w-[92%]">
        <div className="flex min-w-0 items-center justify-between gap-2 px-3 py-2 sm:px-6 sm:py-3">
          <Link href="/" className="min-w-0 flex items-center gap-2 font-serif italic text-[#e9c349]">
            <span className="material-symbols-outlined text-lg sm:text-2xl">local_fire_department</span>
            <span className="block max-w-[120px] truncate text-xs font-semibold tracking-[0.08em] sm:max-w-none sm:text-base sm:tracking-widest">
              PRESERVANDO MEMÓRIAS
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <a href="#legado" className="text-xs uppercase tracking-widest text-[#c4c7c7] transition hover:text-[#e9c349]">Legado</a>
            <a href="#processo" className="text-xs uppercase tracking-widest text-[#c4c7c7] transition hover:text-[#e9c349]">Processo</a>
            <a href="#simulator" className="text-xs uppercase tracking-widest text-[#c4c7c7] transition hover:text-[#e9c349]">Como funciona</a>
            <a href="#faq" className="text-xs uppercase tracking-widest text-[#c4c7c7] transition hover:text-[#e9c349]">Duvidas</a>
          </nav>

          <Link href="/memorial?from=landing" className="rounded-full border border-[#e9c349]/30 bg-[#e9c349]/5 px-3 py-2 text-[10px] uppercase tracking-[0.12em] text-[#e9c349] transition hover:bg-[#e9c349]/15 sm:px-5 sm:text-xs sm:tracking-widest">
            Ver demo
          </Link>
        </div>
      </header>

      <main className="relative z-10">
        <section id="legado" className="relative mx-auto grid min-h-screen w-full max-w-[1200px] grid-cols-1 items-center gap-10 overflow-hidden px-4 pb-16 pt-24 sm:px-6 sm:pt-32 lg:grid-cols-2">
          <div className="space-y-7">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#e9c349]/10 px-4 py-1.5 text-xs uppercase tracking-widest text-[#e9c349]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#e9c349]" />
              Eternismo digital com dignidade
            </span>

            <h1 className="font-serif text-[clamp(2rem,9vw,4.2rem)] font-light leading-tight text-white">
              Porque cada historia merece <span className="italic text-[#e9c349]">viver para sempre</span>
            </h1>

            <p className="max-w-lg text-[1.08rem] leading-relaxed text-[#c4c7c7]">
              Transforme saudades em uma celebracao eterna. Conecte geracoes atraves de memoriais digitais acessiveis por QR Code fisico, preservando depoimentos e biografias.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/splash" className="rounded-full bg-[#e9c349] px-7 py-3 text-xs font-semibold uppercase tracking-widest text-[#0d1010] transition hover:bg-[#ffe088] hover:shadow-[0_0_30px_rgba(233,195,73,0.3)]">
                Criar memorial
              </Link>
              <a href="#simulator" className="rounded-full border border-[#e9c349]/20 bg-white/5 px-7 py-3 text-xs font-semibold uppercase tracking-widest text-[#e0e3e2] transition hover:border-[#e9c349]/40 hover:bg-white/10">
                Como funciona
              </a>
            </div>
          </div>

          <div className="relative z-10 flex w-full justify-center lg:justify-end">
            <div className="relative w-full max-w-[290px] sm:max-w-[320px]">
              <div className="group h-[560px] w-full overflow-hidden rounded-[2rem] border border-[#e9c349]/30 bg-[#111616] p-2 shadow-2xl sm:h-[640px]">
                <Image
                  src="/images/hero-bg.png"
                  alt="Santuário digital"
                  width={640}
                  height={960}
                  className="h-full w-full rounded-[1.8rem] object-cover opacity-65 transition duration-700 group-hover:scale-105 group-hover:opacity-85"
                />
                <div className="pointer-events-none absolute inset-0 rounded-[1.8rem] bg-gradient-to-t from-[#0d1010] via-transparent to-transparent opacity-80" />

                <div className="absolute left-5 top-8 rounded-2xl border border-[#e9c349]/30 bg-[#222]/65 p-4 backdrop-blur-lg">
                  <div className="inline-block rounded-lg bg-white p-2 shadow-lg">
                    <span className="material-symbols-outlined text-4xl text-black">qr_code_2</span>
                  </div>
                  <p className="mt-2 text-center text-[10px] font-semibold uppercase tracking-widest text-[#e9c349]">Escanear placa</p>
                </div>

                <div className="absolute bottom-14 right-5 flex items-center gap-3 rounded-2xl border border-[#e9c349]/20 bg-[#222]/65 p-4 backdrop-blur-lg">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e9c349]/10">
                    <span className="material-symbols-outlined text-[#e9c349]">local_fire_department</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-white">342 velas</h4>
                    <p className="text-[9px] uppercase text-[#c4c7c7]">Acesas por amigos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#e9c349]/10 bg-[#161c1c]/20 py-10">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 px-6 text-center md:grid-cols-3">
            <Stat value="+12.450" label="Historias preservadas" />
            <Stat value="342.180" label="Homenagens e velas" middle />
            <Stat value="100% Nobre" label="Aco cirurgico premium" />
          </div>
        </section>

        <section id="processo" className="relative mx-auto max-w-[1200px] px-6 py-24">
          <div className="mb-16 space-y-4 text-center">
            <span className="text-xs uppercase tracking-widest text-[#e9c349]">A Jornada</span>
            <h2 className="font-serif text-3xl font-light text-white sm:text-4xl">Preservando o legado em quatro passos</h2>
            <div className="mx-auto mt-4 h-[1px] w-12 bg-[#e9c349]" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <article key={step.title} className="relative overflow-hidden rounded-2xl border border-[#e9c349]/10 bg-[#161c1c]/30 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-[#e9c349]/30 hover:shadow-[0_10px_30px_rgba(233,195,73,0.06)]">
                <span className="pointer-events-none absolute right-6 top-6 select-none font-serif text-5xl font-bold text-white/5">{`0${i + 1}`}</span>
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#e9c349]/10">
                  <span className="material-symbols-outlined text-2xl text-[#e9c349]">{step.icon}</span>
                </div>
                <h3 className="mb-3 font-serif text-lg font-medium text-white">{step.title}</h3>
                <p className="text-sm leading-relaxed text-[#c4c7c7]">{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="simulator" className="mx-auto max-w-[1200px] px-6 py-20">
          <div className="glass-panel relative overflow-hidden rounded-3xl border border-[#e9c349]/20 p-8 shadow-2xl sm:p-12">
            <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-[#e9c349]/3 blur-[100px]" />
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
              <div className="space-y-6 lg:col-span-7">
                <span className="text-xs uppercase tracking-widest text-[#e9c349]">Do fisico ao eterno</span>
                <h2 className="font-serif text-3xl font-light leading-snug text-white sm:text-4xl">
                  Uma ponte de amor conectando o local fisico ao universo digital de memorias
                </h2>
                <p className="leading-relaxed text-[#c4c7c7]">
                  Ao aproximar qualquer smartphone da placa, o QR revela um santuario onde familiares podem navegar pela cronologia de vida, ouvir mensagens e acender velas virtuais.
                </p>
                <div className="pt-2">
                  <Link href="/splash" className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#e9c349] transition hover:text-white">
                    Explorar memorial demonstrativo
                    <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
                  </Link>
                </div>
              </div>

              <div className="flex justify-center lg:col-span-5">
                <div className="glass-panel flex aspect-[4/5] w-full max-w-[280px] flex-col items-center justify-center gap-4 rounded-2xl border border-[#e9c349]/15 p-8 text-center transition-colors duration-500 hover:border-[#e9c349]/40">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#e9c349]/10">
                    <span className="material-symbols-outlined text-4xl text-[#e9c349]">qr_code_scanner</span>
                  </div>
                  <h4 className="font-serif text-lg font-medium text-white">Placa Fisica e Celular</h4>
                  <p className="text-xs font-light text-[#c4c7c7]">Aproximacao sem fios, carregamento instantaneo e eternidade garantida.</p>
                  <div className="mt-2 h-[2px] w-12 bg-[#e9c349]/40" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-[800px] px-6 py-20">
          <div className="mb-12 space-y-4 text-center">
            <span className="text-xs uppercase tracking-widest text-[#e9c349]">Perguntas frequentes</span>
            <h2 className="font-serif text-3xl font-light text-white">Duvidas comuns das familias</h2>
            <p className="text-xs uppercase tracking-wider text-[#c4c7c7]">Como ajudamos voce a preservar com seguranca</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => {
              const isOpen = activeFaq === i;
              return (
                <div key={faq.question} className="overflow-hidden rounded-xl border border-[#e9c349]/10 bg-[#161c1c]/20 transition-all duration-300">
                  <button onClick={() => setActiveFaq(isOpen ? null : i)} className="flex w-full items-center justify-between px-6 py-5 text-left transition hover:bg-white/5">
                    <span className="pr-4 font-serif text-[1.05rem] text-white">{faq.question}</span>
                    <span className={`material-symbols-outlined text-[#e9c349] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>expand_more</span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[260px] border-t border-[#e9c349]/5 p-6" : "max-h-0 p-0"}`}>
                    <p className="text-sm leading-relaxed text-[#c4c7c7]">{faq.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="relative z-10 w-full border-t border-[#e9c349]/10 bg-gradient-to-t from-[#090b0b] to-transparent py-20">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 px-6 md:grid-cols-3">
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-serif text-xl font-semibold italic tracking-widest text-[#e9c349]">
              <span className="material-symbols-outlined text-2xl">local_fire_department</span>
              PRESERVANDO MEMORIAS
            </h3>
            <p className="max-w-xs text-xs leading-relaxed text-[#c4c7c7]/80">
              Santuario perpetuo de recordacao. Eternismo digital para manter viva a chama de quem amamos.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="mb-1 text-xs uppercase tracking-widest text-[#e9c349]">Institucional</h4>
            <Link className="text-xs text-[#c4c7c7]/80 transition hover:text-white" href="/faq">Politica de Privacidade</Link>
            <Link className="text-xs text-[#c4c7c7]/80 transition hover:text-white" href="/contato">Termos de Uso</Link>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <h4 className="mb-1 text-xs uppercase tracking-widest text-[#e9c349]">Suporte</h4>
            <Link className="text-xs text-[#c4c7c7]/80 transition hover:text-white" href="/contato">Central de Atendimento</Link>
            <Link className="text-xs text-[#c4c7c7]/80 transition hover:text-white" href="/contato">Fale Conosco</Link>
          </div>
        </div>

        <div className="mx-auto mt-16 flex max-w-[1200px] flex-col items-center justify-between gap-4 border-t border-[#e9c349]/5 px-6 pt-8 text-center md:flex-row md:text-left">
          <p className="text-xs font-light text-[#c4c7c7]/40">© 2026 Preservando a Memoria. Digital Eternalism. Todos os direitos reservados.</p>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#e9c349]" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#e9c349]">Conexao segura SSL</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Stat({ value, label, middle }: { value: string; label: string; middle?: boolean }) {
  return (
    <div className={`space-y-2 ${middle ? "border-y border-[#e9c349]/5 py-6 md:border-y-0 md:border-x md:border-[#e9c349]/10 md:py-0" : ""}`}>
      <span className="font-serif text-3xl font-light text-[#e9c349] md:text-4xl">{value}</span>
      <p className="text-xs uppercase tracking-widest text-[#c4c7c7]">{label}</p>
    </div>
  );
}
