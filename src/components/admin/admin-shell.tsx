"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { UserAvatar } from "@/src/components/ui/user-avatar";

type AdminShellProps = {
  children: React.ReactNode;
};

type AdminMenuItem = {
  label: string;
  icon: string;
  href?: string;
  danger?: boolean;
};

const adminItems: AdminMenuItem[] = [
  { label: "Dashboard", icon: "dashboard", href: "/admin/dashboard" },
  { label: "Comercial", icon: "payments", href: "/admin/comercial" },
  { label: "Funerárias", icon: "store", href: "/admin/funerarias" },
  { label: "Contrato", icon: "description", href: "/admin/contrato" },
  { label: "Usuários", icon: "group", href: "/admin/usuarios" },
  { label: "Memoriais", icon: "favorite", href: "/admin/memoriais" },
  { label: "QR Codes", icon: "qr_code_2", href: "/admin/qr-codes" },
  { label: "Denúncias", icon: "warning", href: "/admin/denuncias", danger: true },
];

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [pendingFuneralHomes, setPendingFuneralHomes] = useState<{
    id: string; name: string; email: string; contactName: string; city?: string; state?: string; createdAt: string;
  }[]>([]);
  const [pendingDeliveries, setPendingDeliveries] = useState<{
    id: string; name: string; source: string;
    recipientName: string; cidade: string; estado: string;
    logradouro: string; numero: string; complemento?: string; bairro: string; cep: string;
    createdAt: string;
  }[]>([]);
  const [markingSent, setMarkingSent] = useState<string | null>(null);
  const [isDevAdmin, setIsDevAdmin] = useState(false);
  const [adminPartners, setAdminPartners] = useState<{
    id: string; name: string; email: string; lastSeenAt: string | null;
  }[]>([]);
  const [saving, setSaving] = useState(false);
  const [approving, setApproving] = useState<string | null>(null);
  const [hasSignedContract, setHasSignedContract] = useState<boolean | null>(null);

  // Estados do perfil e formulário do Admin
  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    avatarUrl?: string;
    bio?: string;
    password?: string;
  } | null>(null);

  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formAvatarUrl, setFormAvatarUrl] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setFormAvatarUrl(data.url);
      }
    } catch {} finally {
      setUploading(false);
    }
  };

  const isActive = (href?: string) => (href ? pathname.startsWith(href) : false);

  useEffect(() => {
    let active = true;

    async function loadAdminData() {
      try {
        const resProfile = await fetch("/api/profile");
        const dataProfile = await resProfile.json();
        if (active && dataProfile.profile) {
          setProfile(dataProfile.profile);
          setFormName(dataProfile.profile.name || "");
          setFormEmail(dataProfile.profile.email || "");
          setFormAvatarUrl(dataProfile.profile.avatarUrl || "");
          setFormPassword("");
          setIsDevAdmin(dataProfile.profile.isDevAdmin === true);

          // Registra o acesso do admin parceiro (silenciosamente, só se não for devAdmin)
          if (dataProfile.profile.isAdmin && !dataProfile.profile.isDevAdmin) {
            fetch("/api/admin/ping", { method: "POST" }).catch(() => undefined);
          }
        }

        const resContracts = await fetch("/api/admin/contracts");
        const dataContracts = await resContracts.json();

        if (active) {
          setHasSignedContract(dataContracts.hasSigned);
        }

        if (active && dataContracts.hasSigned === false && !pathname.includes("/admin/contrato")) {
          window.location.href = "/admin/contrato";
          return;
        }

        const resStats = await fetch("/api/admin/stats");
        const dataStats = await resStats.json();
        if (active) {
          setHasNotifications(dataStats.hasNotifications === true);
          setPendingFuneralHomes(dataStats.pendingFuneralHomes ?? []);
          setPendingDeliveries(dataStats.pendingDeliveries ?? []);
          setAdminPartners(dataStats.adminPartners ?? []);
        }
      } catch {}
    }

    loadAdminData();

    return () => {
      active = false;
    };
  }, [pathname]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          avatarUrl: formAvatarUrl,
          password: formPassword,
        }),
      });

      const result = await res.json();
      if (result.profile) {
        setProfile(result.profile);
        setModalOpen(false);
      }
    } catch {}
    setSaving(false);
  };

  const handleMarkSent = async (id: string) => {
    setMarkingSent(id);
    try {
      const res = await fetch(`/api/admin/memorial/${id}/delivery`, { method: "PATCH" });
      if (res.ok) {
        const remaining = pendingDeliveries.filter((d) => d.id !== id);
        setPendingDeliveries(remaining);
        setHasNotifications(remaining.length > 0 || pendingFuneralHomes.length > 0);
      }
    } finally {
      setMarkingSent(null);
    }
  };

  const handleApproval = async (id: string, action: "approve" | "reject") => {
    setApproving(id);
    try {
      const res = await fetch(`/api/admin/funeral-homes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        const remaining = pendingFuneralHomes.filter((fh) => fh.id !== id);
        setPendingFuneralHomes(remaining);
        setHasNotifications(remaining.length > 0);
        if (remaining.length === 0) setNotifOpen(false);
      }
    } finally {
      setApproving(null);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("has_logged_in");
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-dvh bg-background text-on-surface selection:bg-tertiary/20 selection:text-tertiary">
      <aside
        className={`fixed left-0 top-0 z-40 h-full w-72 shrink-0 border-r border-outline-variant bg-surface-container/95 p-4 backdrop-blur-xl transition-transform duration-300 md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col justify-between">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 border-b border-outline-variant/50 pb-4">
              <span className="material-symbols-outlined text-4xl text-tertiary drop-shadow-[0_2px_8px_rgba(233,195,73,0.4)]">local_fire_department</span>
              <div>
                <h1 className="font-h3 text-lg leading-tight text-on-surface">Admin Master</h1>
                <p className="text-[0.75rem] uppercase tracking-[0.15em] text-outline">Preservando  Memórias</p>
              </div>
              <button onClick={() => setMobileOpen(false)} className="ml-auto md:hidden" aria-label="Fechar menu">
                <span className="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              {adminItems.map((item) => {
                // Se ainda não assinou o contrato, oculta todas as outras opções exceto "Contrato"
                if (hasSignedContract === false && item.label !== "Contrato") {
                  return null;
                }

                const active = isActive(item.href);
                const baseClass = `flex items-center gap-3 rounded px-4 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "border border-tertiary/20 bg-tertiary/10 text-tertiary"
                    : item.danger
                      ? "text-error hover:bg-error-container/20"
                      : "text-on-surface hover:bg-surface-variant"
                }`;

                if (item.href) {
                  return (
                    <Link key={item.label} href={item.href} className={baseClass} onClick={() => setMobileOpen(false)}>
                      <span className="material-symbols-outlined">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  );
                }

                return (
                  <button key={item.label} type="button" className={`${baseClass} text-left`}>
                    <span className="material-symbols-outlined">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="border-t border-outline-variant/50 pt-4 space-y-2">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded px-4 py-3 text-red-400 transition-colors hover:bg-red-500/5 cursor-pointer text-left font-medium"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              <span>Sair da Conta</span>
            </button>
          </div>
        </div>
      </aside>

      {mobileOpen ? (
        <button className="fixed inset-0 z-30 bg-black/60 md:hidden" onClick={() => setMobileOpen(false)} aria-label="Fechar menu" />
      ) : null}

      <div className="min-w-0 flex-1 md:ml-72">
        <header className="sticky top-0 z-20 border-b border-outline-variant/60 bg-[#0a192fb0] px-4 py-4 md:px-6 md:py-5 backdrop-blur-xl md:px-gutter">
          <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-5">
            <div className="flex items-center gap-3 md:gap-0">
              <button onClick={() => setMobileOpen(true)} className="md:hidden shrink-0 pt-1" aria-label="Abrir menu">
                <span className="material-symbols-outlined text-on-surface-variant text-[28px]">menu</span>
              </button>
              <div>
                <h2 className="font-h2 text-2xl md:text-[2.2rem] leading-[1.2] tracking-[-0.01em] text-on-surface">Painel Administrativo</h2>
                <p className="hidden text-on-surface-variant md:block">Gerencie clientes, memoriais e assinaturas da plataforma.</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden w-64 items-center rounded-full border border-outline-variant/50 bg-surface-container/60 px-3 py-2 md:flex">
                <span className="material-symbols-outlined mr-2 text-outline">search</span>
                <input
                  type="text"
                  placeholder="Buscar registros..."
                  className="w-full bg-transparent text-sm text-on-surface placeholder:text-outline focus:outline-none"
                />
              </div>

              <div className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative text-on-surface-variant transition hover:text-tertiary"
                  aria-label="Notificações"
                >
                  <span className="material-symbols-outlined">notifications</span>
                  {hasNotifications && (
                    <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-tertiary shadow-[0_0_8px_rgba(233,195,73,0.8)] animate-pulse" />
                  )}
                </button>

                {notifOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                    <div className="absolute right-0 top-10 z-50 w-80 rounded-xl border border-outline-variant bg-[#0b162a]/95 shadow-2xl backdrop-blur-xl">
                      <div className="flex items-center justify-between border-b border-outline-variant/30 px-4 py-3">
                        <p className="text-sm font-semibold text-on-surface">Pendências</p>
                        {(pendingFuneralHomes.length + pendingDeliveries.length) > 0 && (
                          <span className="rounded-full bg-tertiary/15 px-2 py-0.5 text-xs font-bold text-tertiary">
                            {pendingFuneralHomes.length + pendingDeliveries.length}
                          </span>
                        )}
                      </div>

                      {/* Atividade dos parceiros — visível apenas para o dev admin */}
                      {isDevAdmin && adminPartners.length > 0 && (
                        <div className="border-b border-outline-variant/20">
                          <div className="bg-surface-variant/10 px-4 py-2">
                            <p className="flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-widest text-outline">
                              <span className="material-symbols-outlined text-[14px]">person_check</span>
                              Acesso dos Parceiros
                            </p>
                          </div>
                          <ul className="divide-y divide-outline-variant/10">
                            {adminPartners.map((p) => {
                              const lastSeen = p.lastSeenAt ? new Date(p.lastSeenAt) : null;
                              const diffMs = lastSeen ? Date.now() - lastSeen.getTime() : null;
                              const diffH = diffMs != null ? Math.floor(diffMs / 3_600_000) : null;
                              const diffD = diffMs != null ? Math.floor(diffMs / 86_400_000) : null;
                              const label = lastSeen == null
                                ? "Nunca acessou"
                                : diffH! < 1 ? "Agora há pouco"
                                : diffH! < 24 ? `Há ${diffH}h`
                                : diffD === 1 ? "Ontem"
                                : `Há ${diffD} dias`;
                              const isStale = diffD == null || diffD >= 3;
                              return (
                                <li key={p.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-on-surface">{p.name}</p>
                                    <p className="truncate text-xs text-on-surface-variant">{p.email}</p>
                                  </div>
                                  <span className={`shrink-0 flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold ${
                                    isStale
                                      ? "bg-error/10 text-error/80 border border-error/20"
                                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  }`}>
                                    <span className={`h-1.5 w-1.5 rounded-full ${isStale ? "bg-error/70" : "bg-emerald-400"}`} />
                                    {label}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}

                      {pendingFuneralHomes.length === 0 && pendingDeliveries.length === 0 ? (
                        <div className="px-4 py-6 text-center">
                          <span className="material-symbols-outlined text-3xl text-on-surface-variant">check_circle</span>
                          <p className="mt-2 text-sm text-on-surface-variant">Sem pendências no momento.</p>
                        </div>
                      ) : (
                        <ul className="max-h-[28rem] divide-y divide-outline-variant/20 overflow-y-auto">
                          {/* Seção: Entregas de QR Code */}
                          {pendingDeliveries.length > 0 && (
                            <>
                              <li className="bg-amber-500/5 px-4 py-2">
                                <p className="flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-widest text-amber-400">
                                  <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                                  Entregas de QR Code ({pendingDeliveries.length})
                                </p>
                              </li>
                              {pendingDeliveries.map((d) => (
                                <li key={d.id} className="px-4 py-3">
                                  <div className="mb-2">
                                    <p className="font-medium text-on-surface text-sm">{d.name}</p>
                                    <p className="text-xs text-amber-300/80">Para: {d.recipientName}</p>
                                    <p className="text-xs text-on-surface-variant">
                                      {d.logradouro}, {d.numero}{d.complemento ? ` — ${d.complemento}` : ""} · {d.bairro}
                                    </p>
                                    <p className="text-xs text-on-surface-variant">{d.cidade} – {d.estado} · CEP {d.cep}</p>
                                    <p className="mt-0.5 text-[0.65rem] text-outline">
                                      {new Date(d.createdAt).toLocaleDateString("pt-BR")} · {d.source === "funeral_home" ? "Funerária" : "Família"}
                                    </p>
                                  </div>
                                  <button
                                    disabled={markingSent === d.id}
                                    onClick={() => handleMarkSent(d.id)}
                                    className="w-full rounded-lg bg-amber-500/15 border border-amber-500/30 py-1.5 text-xs font-semibold text-amber-300 transition hover:bg-amber-500/25 disabled:opacity-50"
                                  >
                                    {markingSent === d.id ? "Registrando..." : "Marcar como enviado"}
                                  </button>
                                </li>
                              ))}
                            </>
                          )}

                          {/* Seção: Aprovações de funerárias */}
                          {pendingFuneralHomes.length > 0 && (
                            <>
                              <li className="bg-surface-variant/10 px-4 py-2">
                                <p className="flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-widest text-outline">
                                  <span className="material-symbols-outlined text-[14px]">store</span>
                                  Aprovações de Funerárias ({pendingFuneralHomes.length})
                                </p>
                              </li>
                              {pendingFuneralHomes.map((fh) => (
                                <li key={fh.id} className="px-4 py-3">
                                  <div className="mb-2">
                                    <p className="font-medium text-on-surface text-sm">{fh.name}</p>
                                    <p className="text-xs text-on-surface-variant">{fh.contactName} · {fh.email}</p>
                                    {fh.city && (
                                      <p className="text-xs text-on-surface-variant">{fh.city}{fh.state ? `, ${fh.state}` : ""}</p>
                                    )}
                                    <p className="mt-0.5 text-[0.65rem] text-outline">
                                      {new Date(fh.createdAt).toLocaleDateString("pt-BR")}
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      disabled={approving === fh.id}
                                      onClick={() => handleApproval(fh.id, "approve")}
                                      className="flex-1 rounded-lg bg-green-600/20 border border-green-500/30 py-1.5 text-xs font-semibold text-green-300 transition hover:bg-green-600/30 disabled:opacity-50"
                                    >
                                      {approving === fh.id ? "..." : "Aprovar"}
                                    </button>
                                    <button
                                      disabled={approving === fh.id}
                                      onClick={() => handleApproval(fh.id, "reject")}
                                      className="flex-1 rounded-lg bg-red-600/10 border border-red-500/20 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-600/20 disabled:opacity-50"
                                    >
                                      {approving === fh.id ? "..." : "Rejeitar"}
                                    </button>
                                  </div>
                                </li>
                              ))}
                            </>
                          )}
                        </ul>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="h-10 w-10 overflow-hidden rounded-full border border-outline-variant hover:border-tertiary transition-all duration-300 flex items-center justify-center cursor-pointer bg-surface-container shadow-md"
                  aria-label="Menu do Usuário"
                >
                  <UserAvatar
                    avatarUrl={profile?.avatarUrl}
                    name={profile?.name}
                    size={40}
                    className="transition duration-300 hover:scale-105"
                  />
                </button>
                
                {/* Dropdown menu */}
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40 cursor-default" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 mt-3 z-50 w-64 rounded-xl border border-outline-variant bg-[#0b162a]/95 p-2 shadow-2xl backdrop-blur-xl animate-[fade-in_150ms_ease-out]">
                      <div className="px-4 py-3 border-b border-outline-variant/30">
                        <p className="text-sm font-semibold text-on-surface truncate">{profile?.name || "Admin Master"}</p>
                        <p className="text-xs text-outline truncate">{profile?.email || "admin@plataforma.com"}</p>
                        <span className="mt-1.5 inline-block rounded bg-tertiary/10 px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-tertiary">
                          Administrador
                        </span>
                      </div>
                      <div className="py-1.5 space-y-0.5">
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            setModalOpen(true);
                          }}
                          className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-on-surface transition hover:bg-surface-variant text-left cursor-pointer font-medium"
                        >
                          <span className="material-symbols-outlined text-[18px] text-tertiary">settings</span>
                          <span>Configurações</span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-red-400 transition hover:bg-red-500/10 text-left cursor-pointer font-medium"
                        >
                          <span className="material-symbols-outlined text-[18px]">logout</span>
                          <span>Sair da Conta</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Banner de entregas pendentes — permanece até o admin marcar todos como enviados */}
        {pendingDeliveries.length > 0 && (
          <div className="border-b border-amber-500/30 bg-amber-500/10 px-4 py-3 md:px-6">
            <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.4)]">
                  <span className="material-symbols-outlined text-[18px] text-amber-400">local_shipping</span>
                </span>
                <div>
                  <p className="text-sm font-semibold text-amber-300">
                    {pendingDeliveries.length === 1
                      ? "1 QR Code aguardando envio físico"
                      : `${pendingDeliveries.length} QR Codes aguardando envio físico`}
                  </p>
                  <p className="text-xs text-amber-400/70">
                    Destinatário{pendingDeliveries.length > 1 ? "s" : ""}: {pendingDeliveries.slice(0, 2).map((d) => d.recipientName).join(", ")}{pendingDeliveries.length > 2 ? ` e mais ${pendingDeliveries.length - 2}` : ""}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setNotifOpen(true)}
                className="shrink-0 rounded-full border border-amber-500/40 bg-amber-500/15 px-4 py-1.5 text-xs font-semibold text-amber-300 transition hover:bg-amber-500/25"
              >
                Ver detalhes
              </button>
            </div>
          </div>
        )}

        <div className="mx-auto w-full max-w-[1200px] px-gutter py-gutter">{children}</div>
      </div>

      {/* Modal de Configurações do Admin */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl border border-tertiary/10 bg-[#0a192f] p-6 shadow-2xl backdrop-blur-2xl">
            <h3 className="font-h3 text-2xl text-on-surface mb-2">Configurações do Admin</h3>
            <p className="text-sm text-on-surface-variant mb-6">Ajuste seu nome, e-mail, senha e foto de perfil do painel master.</p>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-outline mb-1 font-semibold">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded-lg border border-outline-variant bg-surface-container/60 px-4 py-2.5 text-sm text-on-surface focus:border-tertiary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-outline mb-1 font-semibold">E-mail de Acesso</label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full rounded-lg border border-outline-variant bg-surface-container/60 px-4 py-2.5 text-sm text-on-surface focus:border-tertiary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-outline mb-1 font-semibold">Senha de Acesso</label>
                <input
                  type="password"
                  placeholder="Preencha apenas se quiser alterar"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  className="w-full rounded-lg border border-outline-variant bg-surface-container/60 px-4 py-2.5 text-sm text-on-surface focus:border-tertiary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-outline mb-2 font-semibold">Foto de Perfil</label>
                <div className="flex items-center gap-4 rounded-xl border border-outline-variant bg-surface-container/60 p-4">
                  <div className="relative h-16 w-16 shrink-0">
                    <UserAvatar
                      avatarUrl={formAvatarUrl || undefined}
                      name={formName || profile?.name}
                      size={64}
                    />
                    {uploading && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-tertiary border-t-transparent" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-tertiary/10 border border-tertiary/20 px-4 py-2 text-xs font-semibold text-tertiary transition hover:bg-tertiary/20">
                      <span>{uploading ? "Enviando..." : "Selecionar Foto"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploading}
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[10px] text-on-surface-variant">PNG, JPG ou WEBP de até 5MB</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant/30 mt-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-full px-5 py-2 text-sm text-outline hover:text-on-surface transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-tertiary px-6 py-2 text-sm font-semibold text-background hover:bg-tertiary-fixed transition disabled:opacity-50 cursor-pointer shadow-lg hover:shadow-tertiary/20"
                >
                  {saving ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
