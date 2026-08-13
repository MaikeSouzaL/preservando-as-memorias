import Link from "next/link";
import { redirect } from "next/navigation";
import { requireFuneralHomePage } from "@/src/components/funeral/guard";
import { getFuneralHomeMemorial } from "@/src/components/funeral/memorial-data";
import { PublishMemorialForm } from "@/src/components/funeral/publish-memorial-form";

export const dynamic = "force-dynamic";

export default async function ContinuarMemorialPage({ params }: { params: { id: string } }) {
  const { funeralHome } = await requireFuneralHomePage();
  const memorial = await getFuneralHomeMemorial(funeralHome.id, params.id);

  if (!memorial) redirect("/funeraria/dashboard/memoriais");

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/funeraria/dashboard/memoriais"
        className="mb-4 inline-flex items-center gap-1 text-sm text-[#e9c349] hover:underline"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Voltar aos memoriais
      </Link>
      <PublishMemorialForm memorial={memorial} />
    </div>
  );
}
