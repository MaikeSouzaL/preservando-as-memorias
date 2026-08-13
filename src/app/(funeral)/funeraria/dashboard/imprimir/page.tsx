import { requireFuneralHomePage } from "@/src/components/funeral/guard";
import { listFuneralHomeMemorials } from "@/src/components/funeral/memorial-data";
import { generateMemorialQrPair } from "@/src/components/funeral/qr";
import { QrPrintClient, type PrintableMemorial } from "@/src/components/funeral/qr-print-client";
import { FuneralEmptyState } from "@/src/components/funeral/empty-state";

export const dynamic = "force-dynamic";

export default async function ImprimirQrPage({ searchParams }: { searchParams: { select?: string } }) {
  const { funeralHome } = await requireFuneralHomePage();
  const memorials = await listFuneralHomeMemorials(funeralHome.id);
  const published = memorials.filter((m) => m.status === "ativo");

  const printable: PrintableMemorial[] = published.map((m) => ({
    id: m.id,
    name: m.name,
    birthDate: m.birthDate,
    deathDate: m.deathDate,
    city: m.city,
    qr: generateMemorialQrPair(m),
  }));

  return (
    <div className="space-y-6">
      <div className="print:hidden">
        <p className="text-xs uppercase tracking-widest text-[#e9c349]/80">Impressão de QR</p>
        <h2 className="text-2xl font-semibold text-white">Imprimir placas com QR Code</h2>
        <p className="mt-1 max-w-2xl text-sm text-[#c4c7c7]/60">
          Selecione os memoriais publicados e imprima em lote. Cada placa sai pronta para recortar e entregar junto ao
          atendimento.
        </p>
      </div>

      {printable.length === 0 ? (
        <div className="print:hidden">
          <FuneralEmptyState
            icon="qr_code_2"
            title="Nenhum memorial publicado ainda"
            description="Publique um memorial para gerar o QR Code dele e poder imprimir."
            actionHref="/funeraria/dashboard/memoriais"
            actionLabel="Ver memoriais"
          />
        </div>
      ) : (
        <QrPrintClient memorials={printable} initialSelectedId={searchParams.select} />
      )}
    </div>
  );
}
