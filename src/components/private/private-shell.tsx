"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserAvatar } from "@/src/components/ui/user-avatar";

type PrivateShellProps = {
  children: React.ReactNode;
};

const menuItems = [
  { href: "/dashboard", label: "Meus Memoriais", icon: "auto_stories" },
  { href: "/homenagens", label: "Homenagens", icon: "volunteer_activism" },
  { href: "/configuracoes", label: "Configurações", icon: "settings" },
];

export function PrivateShell({ children }: PrivateShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    avatarUrl?: string;
    bio?: string;
    password?: string;
  } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(false);

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

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  useEffect(() => {
    let active = true;

    async function loadUserData() {
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

        const resStats = await fetch("/api/me/stats");
        const dataStats = await resStats.json();
        if (active) {
          setHasNotifications(dataStats.hasNotifications === true);
        }
      } catch {}
    }

    loadUserData();

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
    <div className="min-h-dvh bg-[#121212] bg-[radial-gradient(circle_at_50%_0%,rgba(10,25,47,0.4)_0%,transparent_70%)] text-on-background">
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72 border-r border-tertiary/10 bg-surface-container/90 p-base backdrop-blur-lg transition-transform duration-300 md:w-64 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-8">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl text-tertiary drop-shadow-[0_2px_10px_rgba(233,195,73,0.4)]">local_fire_department</span>
            <div>
              <h1 className="font-serif italic text-[1rem] font-bold text-tertiary leading-none tracking-widest">PRESERVANDO MEMÓRIAS</h1>
              <p className="mt-1 font-label-caps text-[0.6rem] uppercase tracking-[0.15em] text-on-surface-variant">
                Digital Eternalism
              </p>
            </div>
          </div>
          <button onClick={() => setMobileOpen(false)} className="md:hidden" aria-label="Fechar menu">
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        <nav className="mt-8 space-y-2 px-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-4 rounded-lg px-4 py-3 transition-all duration-300 ${
                isActive(item.href)
                  ? "border-r-2 border-tertiary bg-tertiary/5 font-bold text-tertiary"
                  : "text-on-surface-variant hover:bg-tertiary/5 hover:text-tertiary"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6">
          <Link
            href="/criar-memorial"
            className="flex w-full items-center justify-center rounded-full border border-tertiary/50 py-3 text-tertiary transition hover:bg-tertiary/5 hover:shadow-[0_0_15px_rgba(233,195,73,0.2)]"
          >
            + Novo Memorial
          </Link>
        </div>
      </aside>

      {mobileOpen ? (
        <button
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          aria-label="Fechar menu"
        />
      ) : null}

      <div className="md:ml-64">
        <header className="sticky top-0 z-30 border-b border-tertiary/10 bg-surface-container-low/70 px-4 py-4 backdrop-blur-xl md:mx-8 md:mt-4 md:rounded-full md:border">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setMobileOpen(true)} className="md:hidden" aria-label="Abrir menu">
                <span className="material-symbols-outlined text-on-surface-variant">menu</span>
              </button>
              
              {/* Logo do Header Privado */}
              <Link href="/dashboard" className="flex items-center gap-2 mr-2">
                <span className="material-symbols-outlined text-2xl text-tertiary drop-shadow-[0_2px_8px_rgba(233,195,73,0.3)]">local_fire_department</span>
                <span className="hidden font-serif italic text-sm font-bold tracking-widest text-tertiary sm:block">PRESERVANDO MEMÓRIAS</span>
              </Link>
              <div className="hidden items-center md:flex">
                <span className="material-symbols-outlined mr-3 text-on-surface-variant">search</span>
                <input
                  placeholder="Buscar memoriais..."
                  className="w-64 bg-transparent text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/memoriais/criar"
                className="hidden rounded-full border border-tertiary/50 px-5 py-2 text-tertiary transition hover:bg-tertiary/5 md:block"
              >
                + Novo Memorial
              </Link>
              
              {/* Notificações */}
              <div className="relative">
                <button
                  aria-label="Notificações"
                  className="relative p-2 text-on-surface-variant hover:text-tertiary transition duration-300 flex items-center justify-center cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[24px]">notifications</span>
                  {hasNotifications && (
                    <span className="absolute right-1.5 top-1.5 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                    </span>
                  )}
                </button>
              </div>

              {/* Botão de Perfil Avatar */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="h-10 w-10 overflow-hidden rounded-full border border-outline-variant hover:border-tertiary transition-all duration-300 flex items-center justify-center cursor-pointer shadow-md"
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
                    <div className="absolute right-0 mt-3 w-56 origin-top-right rounded-xl border border-tertiary/10 bg-[#0a192fd0] p-2 shadow-2xl backdrop-blur-xl animate-fade-in z-50">
                      <div className="px-4 py-2.5 border-b border-outline-variant/30 mb-1.5">
                        <p className="text-xs text-outline">Conectado como</p>
                        <p className="font-semibold text-sm truncate text-on-surface mt-0.5">{profile?.name || "Usuário"}</p>
                        <p className="text-xs text-outline truncate mt-0.5">{profile?.email || "usuario@plataforma.com"}</p>
                      </div>
                      
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          setModalOpen(true);
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-on-surface hover:bg-tertiary/10 hover:text-tertiary transition-all cursor-pointer text-left font-medium"
                      >
                        <span className="material-symbols-outlined text-[20px] text-tertiary">settings</span>
                        <span>Configurações</span>
                      </button>

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-all cursor-pointer text-left font-medium"
                      >
                        <span className="material-symbols-outlined text-[20px]">logout</span>
                        <span>Sair da Conta</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="px-gutter pb-section-gap pt-10 md:pt-20">{children}</div>
      </div>

      {/* Modal de Configurações de Perfil do Usuário Comum */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl border border-tertiary/10 bg-[#0a192f] p-6 shadow-2xl backdrop-blur-2xl">
            <h3 className="font-h3 text-2xl text-on-surface mb-2">Configurações de Perfil</h3>
            <p className="text-sm text-on-surface-variant mb-6">Ajuste seu nome, e-mail, senha e foto de perfil da plataforma.</p>

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
