import Link from "next/link";

export default function RecuperarSenhaPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[1200px] items-center px-gutter py-14">
      <section className="mx-auto w-full max-w-md rounded-2xl border border-tertiary/15 bg-surface-container/75 p-8 backdrop-blur-xl">
        <div className="mb-8 text-center">
          <p className="mb-2 font-label-caps text-[0.75rem] uppercase tracking-[0.15em] text-tertiary">
            Recuperar acesso
          </p>
          <h1 className="font-h3 text-[1.75rem] text-on-surface">Esqueceu sua senha?</h1>
          <p className="mt-2 text-on-surface-variant">
            Informe seu e-mail e enviaremos instrucoes para redefinicao.
          </p>
        </div>

        <form action="/login" method="get" className="grid gap-5">
          <label className="grid gap-2">
            <span className="font-label-caps text-[0.75rem] uppercase tracking-[0.12em] text-on-surface-variant">
              E-mail cadastrado
            </span>
            <input
              type="email"
              required
              placeholder="voce@familia.com"
              className="w-full rounded-lg border border-outline-variant/40 bg-surface-container-low/70 px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:border-tertiary focus:outline-none"
            />
          </label>

          <button
            type="submit"
            className="rounded-full border border-tertiary py-3 font-label-caps text-[0.75rem] uppercase tracking-[0.15em] text-tertiary transition hover:bg-tertiary/10"
          >
            Enviar instrucoes
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-on-surface-variant">
          Lembrou sua senha?{" "}
          <Link href="/login" className="font-semibold text-tertiary hover:underline">
            Voltar ao login
          </Link>
        </p>
      </section>
    </main>
  );
}
