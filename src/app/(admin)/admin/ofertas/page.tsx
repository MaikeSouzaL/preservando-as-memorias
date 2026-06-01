"use client";

import { useCallback, useEffect, useState } from "react";
import { type FuneralHomeOfferLink } from "@/src/lib/platform-data";
import { centsToBRL, cycleLabel } from "@/src/lib/platform-types";

type FuneralHome = {
  id: string;
  name: string;
};

export default function AdminOfertasPage() {
  const [offers, setOffers] = useState<FuneralHomeOfferLink[]>([]);
  const [funeralHomes, setFuneralHomes] = useState<FuneralHome[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cycle: "one_time" as "monthly" | "annual" | "one_time",
    priceCents: 9900,
    funeralHomeId: "",
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [priceInput, setPriceInput] = useState("99,00");

  const handlePriceChange = (value: string) => {
    setPriceInput(value);
    let clean = value.replace(/[^\d,.-]/g, "");
    clean = clean.replace(/\./g, "").replace(/,/g, ".");
    const parsed = parseFloat(clean);
    if (!isNaN(parsed)) {
      setFormData(prev => ({ ...prev, priceCents: Math.round(parsed * 100) }));
    } else {
      setFormData(prev => ({ ...prev, priceCents: 0 }));
    }
  };

  const handlePriceBlur = () => {
    const reals = formData.priceCents / 100;
    const formatted = reals.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    setPriceInput(formatted);
  };

  const loadOffers = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/offer-links");
      if (response.ok) {
        const payload = await response.json();
        setOffers(Array.isArray(payload.offerLinks) ? payload.offerLinks : []);
        setFuneralHomes(Array.isArray(payload.funeralHomes) ? payload.funeralHomes : []);
      }
    } catch {
      // Keep empty list on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await loadOffers();
    };
    init();
  }, [loadOffers]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/offer-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setShowForm(false);
        setFormData({ title: "", description: "", cycle: "one_time", priceCents: 9900, funeralHomeId: "" });
        setPriceInput("99,00");
        loadOffers();
      }
    } catch {
      // Error handling
    }
  };

  const handleToggleStatus = async (offer: FuneralHomeOfferLink) => {
    const newStatus = offer.status === "active" ? "paused" : "active";
    try {
      const response = await fetch("/api/admin/offer-links", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: offer.id, status: newStatus }),
      });
      if (response.ok) {
        loadOffers();
      }
    } catch {
      // Error handling
    }
  };

  const handleCopyLink = async (offer: FuneralHomeOfferLink) => {
    const link = `${window.location.origin}/oferta/${offer.slug}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(offer.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta oferta?")) return;
    try {
      const response = await fetch(`/api/admin/offer-links?id=${id}`, { method: "DELETE" });
      if (response.ok) {
        loadOffers();
      }
    } catch {
      // Error handling
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <header>
          <p className="mb-2 text-[0.75rem] uppercase tracking-[0.15em] text-tertiary">Admin do sistema</p>
          <h1 className="font-h2 text-[clamp(2rem,4vw,3rem)] text-on-surface">Ofertas para Funerárias</h1>
        </header>
        <div className="rounded-xl border border-tertiary/10 bg-[#0a192f66] p-8 text-center text-on-surface-variant">
          Carregando ofertas...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="mb-2 text-[0.75rem] uppercase tracking-[0.15em] text-tertiary">Admin do sistema</p>
        <h1 className="font-h2 text-[clamp(2rem,4vw,3rem)] text-on-surface">Ofertas para Funerárias</h1>
        <p className="mt-2 max-w-2xl text-on-surface-variant">
          Crie ofertas com preço próprio para funerárias. Elas recebem um link público para cadastrar dados do falecido e gerar o QR Code após pagamento.
        </p>
      </header>

      <section className="grid gap-5 md:grid-cols-3">
        <Metric label="Ofertas ativas" value={offers.filter(o => o.status === "active").length.toString()} />
        <Metric label="Total de acessos" value={offers.reduce((sum, o) => sum + o.accessCount, 0).toString()} />
        <Metric label="Conversões" value={offers.reduce((sum, o) => sum + o.conversionCount, 0).toString()} highlight />
      </section>

      <section className="rounded-xl border border-tertiary/10 bg-[#0a192f66] p-6">
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[0.75rem] uppercase tracking-[0.15em] text-tertiary">Ofertas</p>
            <h2 className="font-h3 text-2xl text-on-surface">Links de cadastro para funerárias</h2>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-lg bg-tertiary px-5 py-2.5 text-sm font-semibold text-on-surface hover:bg-tertiary/90 transition"
          >
            {showForm ? "Cancelar" : "Criar nova oferta"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="mb-6 rounded-lg border border-outline-variant/30 bg-[#0a192f33] p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-wider text-outline">Funerária Associada (Opcional)</label>
                <select
                  value={formData.funeralHomeId}
                  onChange={(e) => {
                    const fhId = e.target.value;
                    const selectedFh = funeralHomes.find(f => f.id === fhId);
                    setFormData({
                      ...formData,
                      funeralHomeId: fhId,
                      title: selectedFh ? selectedFh.name : ""
                    });
                  }}
                  className="w-full rounded-lg border border-outline-variant/50 bg-[#0a192f66] px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none"
                >
                  <option value="">Nenhuma (Oferta Geral)</option>
                  {funeralHomes.map(fh => (
                    <option key={fh.id} value={fh.id}>{fh.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-wider text-outline">Título da oferta</label>
                <input
                  type="text"
                  required
                  disabled={Boolean(formData.funeralHomeId)}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={formData.funeralHomeId ? "Nome da Funerária Usado Automático" : "Ex: Memorial Completo"}
                  className="w-full rounded-lg border border-outline-variant/50 bg-[#0a192f66] px-4 py-2.5 text-on-surface placeholder:text-outline focus:border-tertiary focus:outline-none disabled:opacity-60"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-wider text-outline">Ciclo de cobrança</label>
                <select
                  value={formData.cycle}
                  onChange={(e) => setFormData({ ...formData, cycle: e.target.value as "monthly" | "annual" | "one_time" })}
                  className="w-full rounded-lg border border-outline-variant/50 bg-[#0a192f66] px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none"
                >
                  <option value="one_time">Pagamento único</option>
                  <option value="monthly">Mensal</option>
                  <option value="annual">Anual</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-wider text-outline">Preço (R$)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-outline font-semibold">R$</span>
                  <input
                    type="text"
                    required
                    value={priceInput}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    onBlur={handlePriceBlur}
                    placeholder="0,00"
                    className="w-full rounded-lg border border-outline-variant/50 bg-[#0a192f66] pl-10 pr-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none font-semibold"
                  />
                </div>
                <p className="mt-1 text-xs text-outline">{centsToBRL(formData.priceCents)}</p>
              </div>
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs uppercase tracking-wider text-outline">Descrição (opcional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição da oferta para a funerária"
                  rows={2}
                  className="w-full rounded-lg border border-outline-variant/50 bg-[#0a192f66] px-4 py-2.5 text-on-surface placeholder:text-outline focus:border-tertiary focus:outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 rounded-lg bg-tertiary px-6 py-2.5 text-sm font-semibold text-on-surface hover:bg-tertiary/90 transition"
            >
              Criar oferta
            </button>
          </form>
        )}

        {offers.length > 0 ? (
          <div className="space-y-4">
            {offers.map((offer) => (
              <div key={offer.id} className="rounded-lg border border-outline-variant/30 bg-[#0a192f33] p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-on-surface">{offer.title}</h3>
                      <span className={`rounded px-2 py-0.5 text-xs font-medium ${
                        offer.status === "active" 
                          ? "bg-green-500/20 text-green-400" 
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {offer.status === "active" ? "Ativa" : "Pausada"}
                      </span>
                    </div>
                    {offer.description && (
                      <p className="text-sm text-on-surface-variant mb-2">{offer.description}</p>
                    )}
                    <div className="mt-1 mb-3 rounded border border-outline-variant/30 bg-[#0a192f66] px-3 py-1.5 text-xs text-tertiary select-all font-mono break-all inline-block">
                      {typeof window !== "undefined" ? `${window.location.origin}/oferta/${offer.slug}` : `/oferta/${offer.slug}`}
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-outline">
                      <span><strong className="text-on-surface">{centsToBRL(offer.priceCents)}</strong> · {cycleLabel(offer.cycle)}</span>
                      <span>{offer.accessCount} acessos</span>
                      <span>{offer.conversionCount} conversões</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleCopyLink(offer)}
                      className="rounded-lg border border-outline-variant/50 px-3 py-1.5 text-xs text-on-surface hover:bg-[#0a192f66] transition"
                    >
                      {copiedId === offer.id ? "Copiado!" : "Copiar link"}
                    </button>
                    <button
                      onClick={() => handleToggleStatus(offer)}
                      className="rounded-lg border border-outline-variant/50 px-3 py-1.5 text-xs text-on-surface hover:bg-[#0a192f66] transition"
                    >
                      {offer.status === "active" ? "Pausar" : "Ativar"}
                    </button>
                    <button
                      onClick={() => handleDelete(offer.id)}
                      className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-outline-variant/50 p-8 text-center text-on-surface-variant">
            Nenhuma oferta criada ainda. Clique em &quot;Criar nova oferta&quot; para começar.
          </div>
        )}
      </section>
    </div>
  );
}

function Metric({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <article className="rounded-xl border border-tertiary/10 bg-[#0a192f66] p-5">
      <p className="text-xs uppercase tracking-[0.14em] text-outline">{label}</p>
      <p className={`mt-2 font-h3 text-3xl ${highlight ? "text-tertiary" : "text-on-surface"}`}>{value}</p>
    </article>
  );
}
