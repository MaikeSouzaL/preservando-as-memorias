import { readPlatformData } from "@/src/lib/platform-data";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function AdminMemorialsPage() {
  const data = await readPlatformData();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="font-h3 text-2xl text-on-surface">Memoriais Cadastrados</h3>
        <span className="rounded-full bg-tertiary/10 px-4 py-1 text-sm font-semibold text-tertiary">
          Total: {data.memorials.length} memoriais
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-tertiary/10 bg-[#0a192f66] p-6 backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b border-outline-variant/50 text-outline">
                <th className="pb-3 font-normal">Ente Querido</th>
                <th className="pb-3 font-normal">Epitáfio</th>
                <th className="pb-3 font-normal">Nascimento / Falecimento</th>
                <th className="pb-3 font-normal">Cidade</th>
                <th className="pb-3 font-normal">Scans / Visitas</th>
                <th className="pb-3 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.memorials.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-outline text-xs uppercase tracking-wider font-semibold">
                    Nenhum memorial cadastrado na plataforma ainda.
                  </td>
                </tr>
              ) : (
                data.memorials.map((memorial) => {
                  const birthStr = memorial.birthDate ? new Date(memorial.birthDate).toLocaleDateString("pt-BR") : "---";
                  const deathStr = memorial.deathDate ? new Date(memorial.deathDate).toLocaleDateString("pt-BR") : "---";

                  return (
                    <tr key={memorial.id} className="border-b border-outline-variant/20 transition-colors hover:bg-surface-variant/30">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-outline-variant bg-surface-variant">
                            <Image
                              src={memorial.imageUrl || "/images/hero-bg.png"}
                              alt={memorial.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-on-surface">{memorial.name}</span>
                            <span className="text-xs text-outline">{memorial.nickname ? `"${memorial.nickname}"` : ""}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 max-w-xs truncate text-on-surface-variant">
                        {memorial.epitaph}
                      </td>
                      <td className="py-4">
                        <div className="flex flex-col text-xs text-outline">
                          <span>Nasceu: {birthStr}</span>
                          <span>Faleceu: {deathStr}</span>
                        </div>
                      </td>
                      <td className="py-4 text-outline">{memorial.city || "Não informada"}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-1.5 text-tertiary">
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                          <span className="font-semibold">{memorial.visits}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          memorial.status === "ativo"
                            ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20"
                            : "bg-surface-variant text-outline"
                        }`}>
                          {memorial.status === "ativo" ? "Ativo" : "Rascunho"}
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
