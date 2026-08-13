import { readPlatformData } from "@/src/lib/platform-data";
import { PriceConfigPanel } from "@/src/components/owner/price-config-panel";

export const dynamic = "force-dynamic";

export default async function OwnerPrecosPage() {
  const data = await readPlatformData();

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="mb-1 text-[0.7rem] uppercase tracking-[0.15em] text-tertiary">Painel do dono</p>
        <h1 className="font-h2 text-[clamp(1.75rem,3.5vw,2.5rem)] text-on-surface">Preços</h1>
        <p className="mt-1 max-w-2xl text-sm text-on-surface-variant">
          Valores cobrados por memorial (família e funerária) e por vela avulsa em toda a plataforma.
        </p>
      </header>

      <PriceConfigPanel initialConfig={data.config} />
    </div>
  );
}
