import { requireFuneralHomePage } from "@/src/components/funeral/guard";
import { FuneralNav } from "@/src/components/funeral/funeral-nav";

export const dynamic = "force-dynamic";

export default async function FuneralDashboardLayout({ children }: { children: React.ReactNode }) {
  // Revalida sessão + is_active + approval_status no banco a cada request —
  // cobre todas as páginas dentro de /funeraria/dashboard/*.
  const { funeralHome } = await requireFuneralHomePage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a192f] to-[#0b0f0f]">
      <FuneralNav funeralHomeName={funeralHome.name} />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
