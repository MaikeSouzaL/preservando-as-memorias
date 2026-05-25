import { readPlatformData } from "@/src/lib/platform-data";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const data = await readPlatformData();

  // Mapeia curadores a partir de suas ordens registradas
  const users = data.orders.map((order) => {
    const planName = data.config.plans.find((p) => p.id === order.planId)?.name || "Básico";
    return {
      id: order.id,
      name: order.userName,
      email: order.userEmail,
      cpf: order.customerDocument,
      phone: order.customerPhone,
      plan: planName,
      status: order.status === "paid" ? "Ativo" : "Aguardando Pagamento",
      date: new Date(order.createdAt).toLocaleDateString("pt-BR"),
    };
  });

  // Nenhuma semente artificial inserida. O banco começa 100% vazio e limpo para o cliente.

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="font-h3 text-2xl text-on-surface">Curadores e Clientes</h3>
        <span className="rounded-full bg-tertiary/10 px-4 py-1 text-sm font-semibold text-tertiary">
          Total: {users.length} usuários
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-tertiary/10 bg-[#0a192f66] p-6 backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b border-outline-variant/50 text-outline">
                <th className="pb-3 font-normal">Nome</th>
                <th className="pb-3 font-normal">E-mail / CPF</th>
                <th className="pb-3 font-normal">Telefone</th>
                <th className="pb-3 font-normal">Plano Ativo</th>
                <th className="pb-3 font-normal">Data Cadastro</th>
                <th className="pb-3 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-outline text-xs uppercase tracking-wider">
                    Nenhum curador ou usuário cadastrado na plataforma ainda.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id + user.email} className="border-b border-outline-variant/20 transition-colors hover:bg-surface-variant/30">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-tertiary/10 text-tertiary">
                          <span className="material-symbols-outlined text-[20px]">person</span>
                        </div>
                        <span className="font-medium text-on-surface">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex flex-col">
                        <span className="text-on-surface-variant">{user.email}</span>
                        <span className="text-xs text-outline">{user.cpf}</span>
                      </div>
                    </td>
                    <td className="py-4 text-outline">{user.phone}</td>
                    <td className="py-4">
                      <span className="rounded border border-tertiary/20 bg-tertiary/5 px-2 py-1 text-xs font-semibold uppercase tracking-[0.05em] text-tertiary">
                        {user.plan}
                      </span>
                    </td>
                    <td className="py-4 text-outline">{user.date}</td>
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                        user.status === "Ativo"
                          ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20"
                          : "bg-amber-400/10 text-amber-400 border border-amber-400/20"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${user.status === "Ativo" ? "bg-emerald-400" : "bg-amber-400"}`} />
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
