import { readPlatformData } from "@/src/lib/platform-data";

export const dynamic = "force-dynamic";

export default async function AdminQrCodesPage() {
  const data = await readPlatformData();

  // Mapeia todos os memoriais que não possuem registro explícito de QR code
  // e cria um QR code virtual para exibição (pois todos os memoriais têm QR code nativamente no app)
  const existingQrMemorialIds = new Set(data.qrCodes.map(q => q.memorialId));
  
  const virtualQrCodes = data.memorials
    .filter(m => !existingQrMemorialIds.has(m.id))
    .map(m => ({
      id: `qr-virtual-${m.id.substring(0, 8)}`,
      memorialId: m.id,
      publicPath: `/qr/${m.id}`,
      scans: m.visits,
      status: m.status === "ativo" ? "ativo" : "pausado",
      createdAt: m.createdAt,
    }));

  const allQrCodes = [...data.qrCodes, ...virtualQrCodes].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="font-h3 text-2xl text-on-surface">QR Codes Emitidos</h3>
        <span className="rounded-full bg-tertiary/10 px-4 py-1 text-sm font-semibold text-tertiary">
          Total: {allQrCodes.length} QR Codes
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-tertiary/10 bg-[#0a192f66] p-6 backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b border-outline-variant/50 text-outline">
                <th className="pb-3 font-normal">Identificador</th>
                <th className="pb-3 font-normal">Memorial Associado</th>
                <th className="pb-3 font-normal">Caminho do QR Code</th>
                <th className="pb-3 font-normal">Total de Scans</th>
                <th className="pb-3 font-normal">Data de Emissão</th>
                <th className="pb-3 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {allQrCodes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-outline text-xs uppercase tracking-wider font-semibold">
                    Nenhum QR Code gerado ou associado na plataforma ainda.
                  </td>
                </tr>
              ) : (
                allQrCodes.map((qr) => {
                  const associatedMemorial = data.memorials.find((m) => m.id === qr.memorialId)?.name || "Desconhecido";
                  const dateStr = qr.createdAt ? new Date(qr.createdAt).toLocaleDateString("pt-BR") : "---";

                  return (
                    <tr key={qr.id} className="border-b border-outline-variant/20 transition-colors hover:bg-surface-variant/30">
                      <td className="py-4 font-mono text-xs text-on-surface-variant">
                        {qr.id.replace("qr-virtual-", "")}
                      </td>
                      <td className="py-4 font-medium text-on-surface">
                        {associatedMemorial}
                      </td>
                      <td className="py-4 text-outline font-mono text-xs">
                        {qr.publicPath}
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-1 text-tertiary">
                          <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
                          <span className="font-bold">{qr.scans} scans</span>
                        </div>
                      </td>
                      <td className="py-4 text-outline">{dateStr}</td>
                      <td className="py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                          qr.status === "ativo"
                            ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20"
                            : "bg-surface-variant text-outline border border-outline-variant/30"
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${qr.status === "ativo" ? "bg-emerald-400" : "bg-outline"}`} />
                          {qr.status === "ativo" ? "Ativo" : "Pausado"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
