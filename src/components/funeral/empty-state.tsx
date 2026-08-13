import Link from "next/link";

type Props = {
  icon: string;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
};

export function FuneralEmptyState({ icon, title, description, actionHref, actionLabel }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#e9c349]/20 py-16 text-center">
      <span className="material-symbols-outlined mb-4 text-5xl text-[#e9c349]/40">{icon}</span>
      <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-[#c4c7c7]/60">{description}</p>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="rounded-xl bg-[#e9c349] px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-[#101414] transition hover:bg-[#ffe28a]"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
