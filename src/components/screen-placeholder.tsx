import Link from "next/link";

type ScreenPlaceholderProps = {
  title: string;
  description: string;
  area: string;
  routePath: string;
};

export function ScreenPlaceholder({
  title,
  description,
  area,
  routePath,
}: ScreenPlaceholderProps) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[1200px] flex-1 flex-col justify-center px-gutter py-16">
      <p className="mb-3 font-label-caps text-[0.75rem] uppercase tracking-[0.15em] text-tertiary">
        {area}
      </p>
      <h1 className="mb-4 font-h2 text-[clamp(2rem,4vw,2.8rem)] font-light leading-[1.2] tracking-[-0.01em] text-on-surface">
        {title}
      </h1>
      <p className="mb-8 max-w-2xl text-on-surface-variant">{description}</p>

      <div className="rounded-xl border border-tertiary/20 bg-surface-container/80 p-6">
        <p className="mb-2 text-sm text-on-surface-variant">Rota</p>
        <code className="text-tertiary">{routePath}</code>
      </div>

      <div className="mt-8 flex gap-3">
        <Link
          href="/dashboard"
          className="rounded-full border border-tertiary/50 px-5 py-2 text-sm text-tertiary transition hover:bg-tertiary/10"
        >
          Voltar ao dashboard
        </Link>
        <Link
          href="/login"
          className="rounded-full border border-outline-variant/60 px-5 py-2 text-sm text-on-surface-variant transition hover:border-tertiary/50 hover:text-tertiary"
        >
          Ir para login
        </Link>
      </div>
    </main>
  );
}
