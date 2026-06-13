"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/src/components/admin/admin-shell";

type ContractStatus = {
  hasSigned: boolean;
  signedAt: string | null;
};

const CONTRACT_VERSION = "1.0";

const CONTRACT_TEXT = `CONTRATO DE PARCERIA COMERCIAL — PLATAFORMA PRESERVANDO MEMÓRIAS
Versão ${CONTRACT_VERSION} · Vigência: indeterminada a partir da data de aceite

1. PARTES
1.1 CONTRATANTE: Preservando Memórias Tecnologia Ltda. (doravante "Plataforma"), proprietária da plataforma digital disponível em preservandomemorias.com.br.
1.2 CONTRATADO: O Administrador Parceiro (doravante "Admin Parceiro"), pessoa física ou jurídica que aceita este contrato eletronicamente ao clicar em "Li e aceito o contrato".

2. OBJETO
2.1 Este contrato regula o relacionamento comercial entre a Plataforma e o Admin Parceiro para distribuição e comercialização dos serviços de memorial digital junto a funerárias e famílias.

3. MODELO DE REMUNERAÇÃO
3.1 A Plataforma cobra uma taxa de 15% (quinze por cento) sobre o valor bruto de comissão recebido pelo Admin Parceiro.
3.2 O Admin Parceiro é livre para definir o percentual de comissão cobrado de cada funerária parceira, dentro dos limites estabelecidos pela Plataforma.
3.3 Os repasses ao Admin Parceiro serão realizados pela Plataforma até 5 (cinco) dias úteis após a confirmação do pagamento por parte do cliente final.
3.4 O Admin Parceiro é responsável por registrar e manter atualizados seus dados bancários na plataforma para recebimento dos repasses.

4. OBRIGAÇÕES DO ADMIN PARCEIRO
4.1 Manter dados cadastrais e bancários atualizados.
4.2 Não sublocar ou ceder direitos de uso da plataforma sem autorização prévia por escrito da Plataforma.
4.3 Agir em conformidade com a LGPD (Lei 13.709/2018) no tratamento de dados pessoais de seus parceiros e clientes.
4.4 Assinar contratos com as funerárias parceiras por meio dos mecanismos disponibilizados pela Plataforma.
4.5 Não praticar atos que prejudiquem a imagem ou reputação da Plataforma.

5. OBRIGAÇÕES DA PLATAFORMA
5.1 Disponibilizar a infraestrutura tecnológica para criação e gestão de memoriais digitais.
5.2 Efetuar os repasses de comissão conforme o item 3.3.
5.3 Fornecer suporte técnico ao Admin Parceiro.
5.4 Notificar o Admin Parceiro com antecedência mínima de 30 (trinta) dias em caso de alteração nos percentuais ou condições comerciais.

6. VIGÊNCIA E RESCISÃO
6.1 Este contrato entra em vigor na data do aceite eletrônico e permanece por prazo indeterminado.
6.2 Qualquer das partes poderá rescindir este contrato mediante aviso prévio de 30 (trinta) dias, sem penalidades.
6.3 A Plataforma poderá rescindir imediatamente em caso de violação das obrigações do item 4.

7. FORO
7.1 Fica eleito o foro da comarca de São Paulo/SP para dirimir quaisquer controvérsias oriundas deste contrato.

8. ACEITE ELETRÔNICO
8.1 Ao clicar em "Li e aceito o contrato", o Admin Parceiro declara ter lido, compreendido e concordado integralmente com todos os termos acima, reconhecendo o aceite eletrônico como vinculante nos termos do art. 10 da MP 2.200-2/2001 e do Marco Civil da Internet (Lei 12.965/2014).`;

export default function ContratoPage() {
  const [status, setStatus] = useState<ContractStatus | null>(null);
  const [signing, setSigning] = useState(false);
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/contracts")
      .then((r) => r.json())
      .then((d) => setStatus(d))
      .catch(() => setStatus({ hasSigned: false, signedAt: null }));
  }, []);

  async function handleSign() {
    if (!checked) return;
    setSigning(true);
    setError("");
    try {
      const res = await fetch("/api/admin/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "dev_to_admin", contractVersion: CONTRACT_VERSION }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Erro ao registrar aceite.");
        return;
      }
      setStatus({ hasSigned: true, signedAt: new Date().toISOString() });
    } finally {
      setSigning(false);
    }
  }

  return (
    <AdminShell>
      <div className="flex flex-col gap-8">
        <header>
          <p className="mb-2 text-[0.75rem] uppercase tracking-[0.15em] text-tertiary">Admin do sistema</p>
          <h1 className="font-h2 text-[clamp(2rem,4vw,3rem)] text-on-surface">Contrato de Parceria</h1>
          <p className="mt-2 max-w-2xl text-on-surface-variant">
            Leia o contrato completo antes de operar como Admin Parceiro na plataforma.
          </p>
        </header>

        {status?.hasSigned && (
          <div className="flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 px-5 py-4">
            <span className="material-symbols-outlined text-green-400">verified</span>
            <div>
              <p className="font-semibold text-green-300">Contrato aceito</p>
              <p className="text-sm text-green-400/70">
                Aceito em {status.signedAt ? new Date(status.signedAt).toLocaleString("pt-BR") : "—"} · Versão {CONTRACT_VERSION}
              </p>
            </div>
          </div>
        )}

        {/* Texto do contrato */}
        <div className="rounded-xl border border-outline-variant/30 bg-surface-container/40 p-6">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-on-surface-variant">
            {CONTRACT_TEXT}
          </pre>
        </div>

        {/* Aceite */}
        {!status?.hasSigned && (
          <div className="rounded-xl border border-outline-variant/30 bg-surface-container/40 p-6 space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-outline-variant accent-[#e9c349]"
              />
              <span className="text-sm text-on-surface-variant">
                Li e compreendi todos os termos acima e aceito o Contrato de Parceria Comercial com a Plataforma Preservando Memórias, versão {CONTRACT_VERSION}.
              </span>
            </label>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              onClick={handleSign}
              disabled={!checked || signing}
              className="rounded-full bg-[#e9c349] px-8 py-3 text-sm font-semibold text-[#0d1010] transition hover:bg-[#e9c349]/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {signing ? "Registrando aceite..." : "Li e aceito o contrato"}
            </button>
          </div>
        )}

        {/* Gerar contratos para funerárias */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-on-surface">Contratos com Funerárias Parceiras</h2>
            <p className="mt-1 text-sm text-on-surface-variant">
              Gere e envie contratos para as funerárias que operam sob sua gestão.
              O aceite delas é registrado quando elas fazem login e aceitam os termos na própria plataforma.
            </p>
          </div>
          <FuneralContractsSection />
        </section>
      </div>
    </AdminShell>
  );
}

function FuneralContractsSection() {
  const [homes, setHomes] = useState<{ id: string; name: string; email: string; approvalStatus: string }[]>([]);
  const [contracts, setContracts] = useState<{ funeralHomeId?: string; acceptedAt: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/funeral-homes").then((r) => r.json()),
      fetch("/api/admin/contracts").then((r) => r.json()),
    ]).then(([fhData, cData]) => {
      setHomes((fhData.funeralHomes ?? []).filter((h: { approvalStatus: string }) => h.approvalStatus === "approved"));
      setContracts(cData.contracts?.filter((c: { type: string }) => c.type === "admin_to_funeral") ?? []);
      setLoading(false);
    });
  }, []);

  async function generate(funeralHomeId: string) {
    setGenerating(funeralHomeId);
    await fetch("/api/admin/contracts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "admin_to_funeral", funeralHomeId, contractVersion: "1.0" }),
    });
    const res = await fetch("/api/admin/contracts");
    const d = await res.json();
    setContracts(d.contracts?.filter((c: { type: string }) => c.type === "admin_to_funeral") ?? []);
    setGenerating(null);
  }

  if (loading) return <p className="text-sm text-on-surface-variant">Carregando...</p>;
  if (homes.length === 0) return (
    <div className="rounded-xl border border-dashed border-outline-variant/40 py-8 text-center text-sm text-on-surface-variant">
      Nenhuma funerária aprovada. Aprove funerárias na aba Cadastros em Funerárias.
    </div>
  );

  return (
    <div className="space-y-3">
      {homes.map((fh) => {
        const signed = contracts.find((c) => c.funeralHomeId === fh.id);
        return (
          <div key={fh.id} className="flex items-center justify-between gap-4 rounded-xl border border-outline-variant/30 bg-surface-container/40 px-5 py-4">
            <div>
              <p className="font-semibold text-on-surface">{fh.name}</p>
              <p className="text-xs text-on-surface-variant">{fh.email}</p>
              {signed && (
                <p className="mt-1 text-xs text-green-400">
                  Contrato gerado em {new Date(signed.acceptedAt).toLocaleDateString("pt-BR")}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {signed ? (
                <span className="flex items-center gap-1 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Enviado
                </span>
              ) : (
                <button
                  onClick={() => generate(fh.id)}
                  disabled={generating === fh.id}
                  className="rounded-lg border border-[#e9c349]/30 bg-[#e9c349]/10 px-4 py-2 text-xs font-semibold text-[#e9c349] transition hover:bg-[#e9c349]/20 disabled:opacity-50"
                >
                  {generating === fh.id ? "..." : "Gerar contrato"}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
