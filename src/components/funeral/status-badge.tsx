import type { MemorialStatus } from "@/src/components/funeral/memorial-data";

const STATUS: Record<string, { text: string; className: string }> = {
  ativo: { text: "Publicado", className: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  rascunho: { text: "Rascunho", className: "text-[#c4c7c7]/70 bg-white/5 border-white/15" },
  pending_payment: { text: "Aguardando pagamento", className: "text-[#e9c349] bg-[#e9c349]/10 border-[#e9c349]/20" },
};

export function MemorialStatusBadge({ status, className = "" }: { status: MemorialStatus | string; className?: string }) {
  const s = STATUS[status] ?? STATUS.rascunho;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider ${s.className} ${className}`}
    >
      {s.text}
    </span>
  );
}

const INVOICE_STATUS: Record<string, { text: string; className: string }> = {
  open: { text: "Em aberto", className: "text-[#e9c349] bg-[#e9c349]/10 border-[#e9c349]/20" },
  sent: { text: "Enviada", className: "text-sky-400 bg-sky-400/10 border-sky-400/20" },
  paid: { text: "Paga", className: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  overdue: { text: "Vencida", className: "text-red-400 bg-red-400/10 border-red-400/20" },
  cancelled: { text: "Cancelada", className: "text-[#c4c7c7]/50 bg-white/5 border-white/10" },
};

export function InvoiceStatusBadge({ status }: { status: string }) {
  const s = INVOICE_STATUS[status] ?? INVOICE_STATUS.open;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider ${s.className}`}>
      {s.text}
    </span>
  );
}
