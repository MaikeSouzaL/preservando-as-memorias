import { requireFuneralHomePage } from "@/src/components/funeral/guard";
import { QuickCreateForm } from "@/src/components/funeral/quick-create-form";

export const dynamic = "force-dynamic";

export default async function NovoMemorialPage() {
  await requireFuneralHomePage();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-[#e9c349]/80">Novo memorial</p>
        <h2 className="mt-1 text-2xl font-semibold text-white">Cadastrar falecido</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-[#c4c7c7]/60">
          Comece pelo essencial. Depois de continuar, você adiciona foto, epitáfio e a história com calma.
        </p>
      </div>

      <QuickCreateForm />
    </div>
  );
}
