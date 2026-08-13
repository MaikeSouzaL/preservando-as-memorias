import { requireFuneralHomePage } from "@/src/components/funeral/guard";
import { listFuneralHomeMemorials } from "@/src/components/funeral/memorial-data";
import { MemorialsListClient } from "@/src/components/funeral/memorials-list-client";

export const dynamic = "force-dynamic";

export default async function MemoriaisPage() {
  const { funeralHome } = await requireFuneralHomePage();
  const memorials = await listFuneralHomeMemorials(funeralHome.id);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-[#e9c349]/80">Memoriais</p>
        <h2 className="text-2xl font-semibold text-white">Memoriais cadastrados</h2>
      </div>
      <MemorialsListClient memorials={memorials} />
    </div>
  );
}
