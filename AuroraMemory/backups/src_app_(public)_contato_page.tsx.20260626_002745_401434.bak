import Link from "next/link";
import { publicContent } from "@/src/mock-db/public-content";

export default function ContatoPage() {
  return (
    <main className="mx-auto flex w-full max-w-[1000px] flex-1 flex-col px-gutter py-12">
      <header className="mb-10 text-center">
        <p className="mb-2 font-label-caps text-[0.75rem] uppercase tracking-[0.15em] text-tertiary">
          Suporte
        </p>
        <h1 className="font-h2 text-[clamp(2rem,5vw,3rem)] font-light leading-[1.2] tracking-[-0.01em] text-on-surface">
          Fale com a equipe
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-on-surface-variant">
          Estamos aqui para ajudar sua familia em cada etapa da criacao e preservacao do memorial.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        <article className="rounded-xl border border-tertiary/10 bg-surface-container/70 p-6">
          <h2 className="mb-5 font-h3 text-[1.4rem]">Enviar mensagem</h2>
          <form className="grid gap-4">
            <Field label="Nome" type="text" placeholder="Seu nome" />
            <Field label="E-mail" type="email" placeholder="voce@familia.com" />
            <Field label="Assunto" type="text" placeholder="Como podemos ajudar?" />
            <label className="grid gap-2">
              <span className="text-sm text-on-surface-variant">Mensagem</span>
              <textarea
                rows={5}
                placeholder="Descreva sua necessidade..."
                className="w-full rounded-lg border border-outline-variant/40 bg-surface-container-low/70 px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:border-tertiary focus:outline-none"
              />
            </label>
            <button className="mt-2 rounded-full border border-tertiary/50 py-3 text-sm text-tertiary transition hover:bg-tertiary/10">
              Enviar mensagem
            </button>
          </form>
        </article>

        <article className="rounded-xl border border-outline-variant/30 bg-surface-container-low/70 p-6">
          <h2 className="mb-5 font-h3 text-[1.4rem]">Canais de atendimento</h2>
          <ul className="grid gap-4">
            {publicContent.contact.channels.map((channel) => (
              <li key={channel.label} className="rounded-lg border border-tertiary/10 bg-surface-container-high/30 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-on-surface-variant">{channel.label}</p>
                <p className="mt-1 text-on-surface">{channel.value}</p>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <Link href="/faq" className="text-sm text-tertiary hover:underline">
              Ver perguntas frequentes
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}

function Field({
  label,
  type,
  placeholder,
}: {
  label: string;
  type: string;
  placeholder: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm text-on-surface-variant">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-lg border border-outline-variant/40 bg-surface-container-low/70 px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:border-tertiary focus:outline-none"
      />
    </label>
  );
}
