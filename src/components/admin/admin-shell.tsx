"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

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
  { label: "Usuários", icon: "group", href: "/admin/usuarios" },
  { label: "Memoriais", icon: "favorite", href: "/admin/memoriais" },
  { label: "Homenagens", icon: "card_giftcard", href: "/admin/homenagens" },
  { label: "QR Codes", icon: "qr_code_2", href: "/admin/qr-codes" },
  { label: "Denúncias", icon: "warning", href: "/admin/denuncias", danger: true },
];

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [saving, setSaving] = useState(false);

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
        }

        const resStats = await fetch("/api/admin/stats");
        const dataStats = await resStats.json();
        if (active) {
          setHasNotifications(dataStats.hasNotifications === true);
        }
      } catch {}
    }

    loadAdminData();

    return () => {
      active = false;
    };
  }, []);

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
              <Image
                src="/imagens/logo.png"
                alt="Logo"
                width={48}
                height={48}
                className="h-12 w-12 object-contain drop-shadow-[0_2px_8px_rgba(233,195,73,0.4)]"
              />
              <div>
                <h1 className="font-h3 text-lg leading-tight text-on-surface">Admin Master</h1>
                <p className="text-[0.75rem] uppercase tracking-[0.15em] text-outline">Preservando a Memória</p>
              </div>
              <button onClick={() => setMobileOpen(false)} className="ml-auto md:hidden" aria-label="Fechar menu">
                <span className="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              {adminItems.map((item) => {
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
        <header className="sticky top-0 z-20 border-b border-outline-variant/60 bg-[#0a192fb0] px-6 py-5 backdrop-blur-xl md:px-gutter">
          <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-5">
            <div>
              <h2 className="font-h2 text-[2.2rem] leading-[1.2] tracking-[-0.01em] text-on-surface">Painel Administrativo</h2>
              <p className="text-on-surface-variant">Gerencie clientes, memoriais e assinaturas da plataforma.</p>
            </div>

            <div className="flex items-center gap-4">
              <button onClick={() => setMobileOpen(true)} className="md:hidden" aria-label="Abrir menu">
                <span className="material-symbols-outlined text-on-surface-variant">menu</span>
              </button>

              <div className="hidden w-64 items-center rounded-full border border-outline-variant/50 bg-surface-container/60 px-3 py-2 md:flex">
                <span className="material-symbols-outlined mr-2 text-outline">search</span>
                <input
                  type="text"
                  placeholder="Buscar registros..."
                  className="w-full bg-transparent text-sm text-on-surface placeholder:text-outline focus:outline-none"
                />
              </div>

              <button className="relative text-on-surface-variant transition hover:text-tertiary" aria-label="Notificações">
                <span className="material-symbols-outlined">notifications</span>
                {hasNotifications && (
                  <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-tertiary shadow-[0_0_8px_rgba(233,195,73,0.8)] animate-pulse" />
                )}
              </button>

              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="h-10 w-10 overflow-hidden rounded-full border border-outline-variant hover:border-tertiary transition-all duration-300 flex items-center justify-center cursor-pointer bg-surface-container shadow-md"
                  aria-label="Menu do Usuário"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile?.avatarUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                    alt={profile?.name || "Avatar"}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
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
                  <div className="relative h-16 w-16 overflow-hidden rounded-full border border-tertiary/20 bg-background shrink-0">
                    {formAvatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={formAvatarUrl} alt="Prévia" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-outline-variant">
                        <span className="material-symbols-outlined text-2xl">account_circle</span>
                      </div>
                    )}
                    {uploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60">
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
