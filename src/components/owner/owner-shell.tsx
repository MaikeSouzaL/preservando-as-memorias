"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { UserAvatar } from "@/src/components/ui/user-avatar";

type OwnerShellProps = {
  children: React.ReactNode;
};

type NavItem = {
  label: string;
  icon: string;
  href: string;
  danger?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Visão geral", icon: "space_dashboard", href: "/painel" },
  { label: "Preços", icon: "sell", href: "/painel/precos" },
  { label: "Funerárias", icon: "store", href: "/painel/funerarias" },
  { label: "Planos de cobrança", icon: "subscriptions", href: "/painel/planos-cobranca" },
  { label: "Faturas", icon: "receipt_long", href: "/painel/faturas" },
  { label: "Memoriais", icon: "favorite", href: "/painel/memoriais" },
  { label: "Entregas de QR", icon: "local_shipping", href: "/painel/entregas" },
  { label: "Usuários", icon: "group", href: "/painel/usuarios" },
  { label: "Moderação", icon: "shield_person", href: "/painel/moderacao", danger: true },
];

export function OwnerShell({ children }: OwnerShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingApprovals, setPendingApprovals] = useState(0);

  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    avatarUrl?: string;
  } | null>(null);

  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formAvatarUrl, setFormAvatarUrl] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const isActive = (href: string) => (href === "/painel" ? pathname === "/painel" : pathname.startsWith(href));

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [profileRes, statsRes] = await Promise.all([
          fetch("/api/profile"),
          fetch("/api/admin/stats"),
        ]);
        const profileData = await profileRes.json();
        if (active && profileData.profile) {
          setProfile(profileData.profile);
          setFormName(profileData.profile.name || "");
          setFormEmail(profileData.profile.email || "");
          setFormAvatarUrl(profileData.profile.avatarUrl || "");
          setFormPassword("");
        }
        const statsData = await statsRes.json();
        if (active) {
          setPendingApprovals(statsData.pendingCount ?? 0);
        }
      } catch {}
    }

    load();
    return () => {
      active = false;
    };
  }, [pathname]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) setFormAvatarUrl(data.url);
    } catch {
      // ignore
    } finally {
      setUploading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
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
    } catch {
      // ignore
    } finally {
      setSaving(false);
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
        className={`fixed left-0 top-0 z-40 h-full w-64 shrink-0 border-r border-outline-variant/60 bg-surface-container-low p-4 transition-transform duration-300 md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col justify-between">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 border-b border-outline-variant/40 pb-4">
              <span className="material-symbols-outlined text-3xl text-tertiary">local_fire_department</span>
              <div>
                <h1 className="font-h3 text-base leading-tight text-on-surface">Painel do Dono</h1>
                <p className="text-[0.68rem] uppercase tracking-[0.15em] text-outline">Preservando Memórias</p>
              </div>
              <button onClick={() => setMobileOpen(false)} className="ml-auto md:hidden" aria-label="Fechar menu">
                <span className="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>

            <nav className="flex flex-col gap-0.5">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-tertiary/10 text-tertiary"
                        : item.danger
                          ? "text-on-surface-variant hover:bg-error/5 hover:text-error"
                          : "text-on-surface-variant hover:bg-surface-variant/40 hover:text-on-surface"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    <span>{item.label}</span>
                    {item.href === "/painel/funerarias" && pendingApprovals > 0 && (
                      <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-tertiary px-1 text-[0.65rem] font-bold text-background">
                        {pendingApprovals}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="border-t border-outline-variant/40 pt-3">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-error/80 transition-colors hover:bg-error/5 hover:text-error"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              <span>Sair da conta</span>
            </button>
          </div>
        </div>
      </aside>

      {mobileOpen ? (
        <button className="fixed inset-0 z-30 bg-black/60 md:hidden" onClick={() => setMobileOpen(false)} aria-label="Fechar menu" />
      ) : null}

      <div className="min-w-0 flex-1 md:ml-64">
        <header className="sticky top-0 z-20 border-b border-outline-variant/40 bg-background/90 px-4 py-3 backdrop-blur-xl md:px-8">
          <div className="flex items-center justify-between gap-4">
            <button onClick={() => setMobileOpen(true)} className="md:hidden shrink-0" aria-label="Abrir menu">
              <span className="material-symbols-outlined text-on-surface-variant text-[26px]">menu</span>
            </button>

            <div className="hidden md:block" />

            <div className="relative ml-auto">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="h-9 w-9 overflow-hidden rounded-full border border-outline-variant hover:border-tertiary transition-colors flex items-center justify-center cursor-pointer"
                aria-label="Menu do usuário"
              >
                <UserAvatar avatarUrl={profile?.avatarUrl} name={profile?.name} size={36} />
              </button>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 mt-3 z-50 w-60 rounded-xl border border-outline-variant/60 bg-surface-container p-2 shadow-2xl">
                    <div className="px-3 py-2.5 border-b border-outline-variant/30">
                      <p className="text-sm font-semibold text-on-surface truncate">{profile?.name || "Dono"}</p>
                      <p className="text-xs text-outline truncate">{profile?.email || ""}</p>
                    </div>
                    <div className="py-1 space-y-0.5">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          setModalOpen(true);
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-on-surface transition hover:bg-surface-variant/40 text-left"
                      >
                        <span className="material-symbols-outlined text-[18px] text-tertiary">settings</span>
                        <span>Configurações</span>
                      </button>
                      <Link
                        href="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-on-surface transition hover:bg-surface-variant/40 text-left"
                      >
                        <span className="material-symbols-outlined text-[18px] text-on-surface-variant">arrow_back</span>
                        <span>Ir para meu painel</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-error transition hover:bg-error/10 text-left"
                      >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        <span>Sair da conta</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="mx-auto w-full max-w-[1280px] px-4 py-6 md:px-8 md:py-8">{children}</div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl border border-outline-variant/40 bg-surface-container p-6 shadow-2xl">
            <h3 className="font-h3 text-xl text-on-surface mb-1">Configurações da conta</h3>
            <p className="text-sm text-on-surface-variant mb-6">Nome, e-mail, senha e foto de perfil do dono.</p>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-outline mb-1 font-semibold">Nome completo</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2.5 text-sm text-on-surface focus:border-tertiary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-outline mb-1 font-semibold">E-mail de acesso</label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2.5 text-sm text-on-surface focus:border-tertiary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-outline mb-1 font-semibold">Nova senha</label>
                <input
                  type="password"
                  placeholder="Preencha apenas se quiser alterar"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2.5 text-sm text-on-surface focus:border-tertiary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-outline mb-2 font-semibold">Foto de perfil</label>
                <div className="flex items-center gap-4 rounded-xl border border-outline-variant bg-surface-container-low p-4">
                  <div className="relative h-14 w-14 shrink-0">
                    <UserAvatar avatarUrl={formAvatarUrl || undefined} name={formName || profile?.name} size={56} />
                    {uploading && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-tertiary border-t-transparent" />
                      </div>
                    )}
                  </div>
                  <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-tertiary/10 border border-tertiary/20 px-4 py-2 text-xs font-semibold text-tertiary transition hover:bg-tertiary/20">
                    <span>{uploading ? "Enviando..." : "Selecionar foto"}</span>
                    <input type="file" accept="image/*" disabled={uploading} onChange={handleAvatarChange} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant/30 mt-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-full px-5 py-2 text-sm text-outline hover:text-on-surface transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-tertiary px-6 py-2 text-sm font-semibold text-background hover:bg-tertiary/90 transition disabled:opacity-50"
                >
                  {saving ? "Salvando..." : "Salvar alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
