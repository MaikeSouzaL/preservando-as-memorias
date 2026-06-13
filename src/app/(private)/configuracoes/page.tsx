"use client";

import { useState, useEffect } from "react";
import { UserAvatar } from "@/src/components/ui/user-avatar";

type CuratorProfile = {
  name: string;
  email: string;
  bio: string;
  theme: string;
  privacy: "public" | "protected" | "private";
  memorialPassword: string;
  notifyVelas: boolean;
  notifyTributos: boolean;
  language: string;
  timezone: string;
  globalAudio: boolean;
  avatarUrl: string;
  isDevAdmin: boolean;
};

const BASE_TABS = [
  "Perfil",
  "Conta",
  "Privacidade",
  "Segurança",
  "Memorial",
  "Notificações",
  "Aparência",
] as const;

const DEV_ADMIN_TAB = "Backup e Exportação";

const themes = [
  { id: "noturno", label: "Noturno", icon: "dark_mode" },
  { id: "claro", label: "Claro", icon: "light_mode" },
];

function applyThemeToDom(themeId: string) {
  if (themeId === "claro") {
    document.documentElement.dataset.theme = "claro";
  } else {
    delete document.documentElement.dataset.theme;
  }
}

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [profile, setProfile] = useState<CuratorProfile>({
    name: "",
    email: "",
    bio: "",
    theme: "noturno",
    privacy: "public",
    memorialPassword: "",
    notifyVelas: true,
    notifyTributos: true,
    language: "pt-BR",
    timezone: "GMT-3",
    globalAudio: true,
    avatarUrl: "",
    isDevAdmin: false,
  });

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPwd, setShowNewPwd] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [formAvatarUrl, setFormAvatarUrl] = useState("");

  const [memorialPwd, setMemorialPwd] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const json = await res.json();
          if (json.profile) {
            setProfile(json.profile);
            setFormAvatarUrl(json.profile.avatarUrl || "");
            setMemorialPwd(json.profile.memorialPassword || "");
            applyThemeToDom(json.profile.theme || "noturno");
          }
        }
      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setErrorMsg("");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setSuccessMsg("");
    setTimeout(() => setErrorMsg(""), 4000);
  };

  const saveProfileFields = async (updates: Record<string, unknown>) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const json = await res.json();
        setProfile(json.profile);
        showSuccess("Configurações atualizadas com sucesso!");
      } else {
        const json = await res.json();
        showError(json.error || "Erro ao salvar configurações.");
      }
    } catch {
      showError("Erro de conexão. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        setFormAvatarUrl(data.url);
        await saveProfileFields({ avatarUrl: data.url });
      }
    } catch {
      showError("Erro ao enviar foto.");
    } finally {
      setUploading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showError("As senhas não coincidem.");
      return;
    }
    if (newPassword.length < 8) {
      showError("A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch("/api/profile/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });
      const json = await res.json();
      if (res.ok) {
        showSuccess("Senha alterada com sucesso!");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        showError(json.error || "Erro ao alterar senha.");
      }
    } catch {
      showError("Erro de conexão. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleThemeChange = (themeId: string) => {
    applyThemeToDom(themeId);
    saveProfileFields({ theme: themeId });
  };

  const handleBackupExport = async () => {
    try {
      setIsSaving(true);
      const res = await fetch("/api/dev/backup");
      if (!res.ok) {
        showError("Erro ao gerar backup. Tente novamente.");
        return;
      }
      const backupObj = await res.json();
      const blob = new Blob([JSON.stringify(backupObj, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const date = new Date().toISOString().slice(0, 10);
      link.download = `preservando-memorias-backup-${date}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showSuccess("Backup completo gerado e baixado com sucesso!");
    } catch {
      showError("Erro ao exportar backup.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-tertiary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(10,25,47,0.4)_0%,rgba(16,20,20,1)_60%),radial-gradient(circle_at_100%_50%,rgba(233,195,73,0.03)_0%,transparent_40%)]" />

      <main className="mx-auto w-full max-w-container-max pb-28">
        <header className="mb-10">
          <h1 className="mb-4 font-h1 text-[clamp(2.2rem,5vw,4rem)] font-light leading-[1.1] tracking-[-0.02em] text-on-surface">
            Configurações
          </h1>
          <p className="max-w-2xl text-body-lg text-on-surface-variant/70">
            Gerencie o seu legado, privacidade, segurança e preferências visuais.
          </p>
        </header>

        {successMsg && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-emerald-400">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            <span className="text-sm font-medium">{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-error/20 bg-error/10 px-4 py-3 text-error">
            <span className="material-symbols-outlined text-[20px]">error</span>
            <span className="text-sm font-medium">{errorMsg}</span>
          </div>
        )}

        <nav className="mb-12 overflow-x-auto border-b border-surface-container-highest pb-4 [scrollbar-width:none]">
          <ul className="flex gap-8 whitespace-nowrap">
            {[...BASE_TABS, ...(profile.isDevAdmin ? [DEV_ADMIN_TAB] : [])].map((tab, index) => (
              <li key={tab}>
                <button
                  onClick={() => setActiveTab(index)}
                  className={`block px-2 pb-4 text-[0.75rem] uppercase tracking-[0.15em] transition-colors cursor-pointer ${
                    activeTab === index
                      ? "border-b-2 border-tertiary text-tertiary font-bold"
                      : "text-on-surface-variant/60 hover:text-on-surface"
                  }`}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col gap-8 lg:col-span-8">

            {/* Aba 0: Perfil */}
            {activeTab === 0 && (
              <section className="rounded-xl border border-tertiary/10 bg-[#0a192f]/30 p-8 backdrop-blur-md">
                <h2 className="mb-8 flex items-center gap-3 font-h3 text-[1.75rem] text-on-surface">
                  <span className="material-symbols-outlined text-tertiary">person</span>
                  Perfil do Curador
                </h2>

                <div className="flex flex-col items-start gap-8 md:flex-row">
                  <div className="flex flex-col items-center gap-3 shrink-0">
                    <div className="relative h-32 w-32">
                      <UserAvatar avatarUrl={formAvatarUrl || undefined} name={profile.name} size={128} />
                      {uploading && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60">
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-tertiary border-t-transparent" />
                        </div>
                      )}
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-tertiary/30 bg-tertiary/10 px-4 py-2 text-xs font-semibold text-tertiary transition hover:bg-tertiary/20">
                      <span className="material-symbols-outlined text-[16px]">upload</span>
                      <span>{uploading ? "Enviando..." : "Alterar foto"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploading}
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[10px] text-on-surface-variant/50">PNG, JPG ou WEBP até 5MB</p>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      saveProfileFields({
                        name: String(formData.get("name")),
                        email: String(formData.get("email")),
                        bio: String(formData.get("bio")),
                      });
                    }}
                    className="w-full flex-1 space-y-6"
                  >
                    <div>
                      <label className="mb-2 block text-[0.75rem] uppercase tracking-[0.15em] text-on-surface-variant/60">Nome Completo</label>
                      <input
                        type="text"
                        name="name"
                        defaultValue={profile.name}
                        className="w-full border-0 border-b border-white/10 bg-transparent pb-2 text-on-surface outline-none transition-all focus:border-b-tertiary/80 text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-[0.75rem] uppercase tracking-[0.15em] text-on-surface-variant/60">Email de Contato</label>
                      <input
                        type="email"
                        name="email"
                        defaultValue={profile.email}
                        className="w-full border-0 border-b border-white/10 bg-transparent pb-2 text-on-surface outline-none transition-all focus:border-b-tertiary/80 text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-[0.75rem] uppercase tracking-[0.15em] text-on-surface-variant/60">Biografia Curta</label>
                      <textarea
                        name="bio"
                        defaultValue={profile.bio}
                        className="h-24 w-full resize-none border-0 border-b border-white/10 bg-transparent pb-2 text-on-surface outline-none transition-all focus:border-b-tertiary/80 text-sm"
                      />
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="rounded border border-tertiary/50 px-6 py-3 text-[0.75rem] uppercase tracking-[0.15em] text-tertiary transition-colors hover:bg-tertiary/10 cursor-pointer disabled:opacity-50"
                      >
                        {isSaving ? "Salvando..." : "Salvar Alterações"}
                      </button>
                    </div>
                  </form>
                </div>
              </section>
            )}

            {/* Aba 1: Conta */}
            {activeTab === 1 && (
              <section className="rounded-xl border border-tertiary/10 bg-[#0a192f]/30 p-8 backdrop-blur-md">
                <h2 className="mb-6 flex items-center gap-3 font-h3 text-[1.75rem] text-on-surface">
                  <span className="material-symbols-outlined text-tertiary">settings_applications</span>
                  Configurações da Conta
                </h2>
                <p className="mb-8 text-on-surface-variant/60">Defina suas preferências de fuso horário e localização global.</p>

                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block text-[0.75rem] uppercase tracking-[0.15em] text-on-surface-variant/60">Idioma Preferido</label>
                    <select
                      value={profile.language}
                      onChange={(e) => saveProfileFields({ language: e.target.value })}
                      className="w-full border-0 border-b border-white/10 bg-[#0e1e35] p-2 text-on-surface outline-none text-sm cursor-pointer"
                    >
                      <option value="pt-BR">Português (Brasil)</option>
                      <option value="en">English (United States)</option>
                      <option value="es">Español</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-[0.75rem] uppercase tracking-[0.15em] text-on-surface-variant/60">Fuso Horário</label>
                    <select
                      value={profile.timezone}
                      onChange={(e) => saveProfileFields({ timezone: e.target.value })}
                      className="w-full border-0 border-b border-white/10 bg-[#0e1e35] p-2 text-on-surface outline-none text-sm cursor-pointer"
                    >
                      <option value="GMT-3">Brasília (GMT-3)</option>
                      <option value="GMT-4">Amazonas (GMT-4)</option>
                      <option value="GMT+0">Londres (GMT+0)</option>
                    </select>
                  </div>

                  <div className="pt-8 border-t border-white/10">
                    <h4 className="text-error font-semibold mb-2">Excluir Conta</h4>
                    <p className="text-xs text-on-surface-variant/60 mb-4">
                      Essa ação é irreversível e excluirá permanentemente todos os seus memoriais, fotos e legados cadastrados.
                    </p>
                    <button
                      type="button"
                      onClick={() => alert("Por segurança, entre em contato com o suporte para processar a exclusão da sua conta.")}
                      className="rounded border border-error/50 px-4 py-2 text-xs font-semibold uppercase text-error transition hover:bg-error/10 cursor-pointer"
                    >
                      Excluir Conta Permanentemente
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* Aba 2: Privacidade */}
            {activeTab === 2 && (
              <section className="rounded-xl border border-tertiary/10 bg-[#0a192f]/30 p-8 backdrop-blur-md">
                <h2 className="mb-2 flex items-center gap-3 font-h3 text-[1.75rem] text-on-surface">
                  <span className="material-symbols-outlined text-tertiary">visibility</span>
                  Privacidade dos Memoriais
                </h2>
                <p className="mb-8 text-on-surface-variant/60">
                  Defina o nível de acesso e privacidade padrão dos seus memoriais.
                </p>

                <div className="space-y-4">
                  {(["public", "protected", "private"] as const).map((opt) => {
                    const icons = { public: "public", protected: "vpn_key", private: "shield_person" } as const;
                    const labels = { public: "Público", protected: "Protegido por Senha", private: "Privado (Restrito)" };
                    const descriptions = {
                      public: "Aberto a todos que possuírem o link ou escanear o QR Code.",
                      protected: "Exige uma senha simples criada por você para visualização.",
                      private: "Apenas você e e-mails convidados conseguem acessar.",
                    };
                    const isActive = profile.privacy === opt;
                    return (
                      <div key={opt}>
                        <button
                          onClick={() => saveProfileFields({ privacy: opt })}
                          className={`w-full flex items-center justify-between rounded-lg p-4 transition-all text-left cursor-pointer border ${
                            isActive
                              ? "border-tertiary/30 bg-tertiary/5"
                              : "border-transparent bg-[#0a192f]/20 hover:border-white/10"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <span className="material-symbols-outlined text-tertiary">{icons[opt]}</span>
                            <div>
                              <h4 className="font-semibold text-on-surface">{labels[opt]}</h4>
                              <p className="text-xs text-on-surface-variant/60">{descriptions[opt]}</p>
                            </div>
                          </div>
                          {isActive && <span className="material-symbols-outlined text-tertiary">check_circle</span>}
                        </button>

                        {opt === "protected" && isActive && (
                          <div className="mt-2 rounded-lg border border-tertiary/20 bg-tertiary/5 p-4">
                            <label className="mb-2 block text-[0.75rem] uppercase tracking-[0.15em] text-on-surface-variant/60">
                              Senha de acesso ao memorial
                            </label>
                            <div className="flex gap-3">
                              <input
                                type="text"
                                value={memorialPwd}
                                onChange={(e) => setMemorialPwd(e.target.value)}
                                placeholder="Crie uma senha simples"
                                className="flex-1 border-0 border-b border-white/20 bg-transparent pb-2 text-on-surface outline-none text-sm"
                              />
                              <button
                                type="button"
                                disabled={isSaving}
                                onClick={() => saveProfileFields({ memorialPassword: memorialPwd })}
                                className="rounded border border-tertiary/40 px-4 py-1.5 text-xs font-semibold text-tertiary hover:bg-tertiary/10 cursor-pointer disabled:opacity-50"
                              >
                                Salvar
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Aba 3: Segurança */}
            {activeTab === 3 && (
              <section className="rounded-xl border border-tertiary/10 bg-[#0a192f]/30 p-8 backdrop-blur-md">
                <h2 className="mb-6 flex items-center gap-3 font-h3 text-[1.75rem] text-on-surface">
                  <span className="material-symbols-outlined text-tertiary">security</span>
                  Segurança da Conta
                </h2>
                <p className="mb-8 text-on-surface-variant/60">Altere sua senha de acesso à plataforma.</p>

                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div>
                    <label className="mb-2 block text-[0.75rem] uppercase tracking-[0.15em] text-on-surface-variant/60">Nova Senha</label>
                    <div className="relative">
                      <input
                        type={showNewPwd ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full border-0 border-b border-white/10 bg-transparent pb-2 pr-8 text-on-surface outline-none transition-all focus:border-b-tertiary/80 text-sm"
                        placeholder="Mínimo 8 caracteres"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPwd(!showNewPwd)}
                        className="absolute right-0 top-0 text-on-surface-variant/60 hover:text-on-surface cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {showNewPwd ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-[0.75rem] uppercase tracking-[0.15em] text-on-surface-variant/60">Confirmar Nova Senha</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full border-0 border-b border-white/10 bg-transparent pb-2 text-on-surface outline-none transition-all focus:border-b-tertiary/80 text-sm"
                      placeholder="••••••••"
                    />
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="mt-1 text-xs text-error">As senhas não coincidem.</p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving || !newPassword || newPassword !== confirmPassword}
                      className="rounded border border-tertiary/50 px-6 py-3 text-[0.75rem] uppercase tracking-[0.15em] text-tertiary transition-colors hover:bg-tertiary/10 cursor-pointer disabled:opacity-50"
                    >
                      {isSaving ? "Alterando..." : "Alterar Senha"}
                    </button>
                  </div>
                </form>

                <div className="mt-8 pt-8 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-on-surface">Autenticação em Dois Fatores (2FA)</h4>
                      <p className="text-xs text-on-surface-variant/60">Adicione uma camada extra de proteção ao seu login.</p>
                    </div>
                    <span className="rounded border border-outline/30 px-3 py-1.5 text-xs text-on-surface-variant/60">
                      Em breve
                    </span>
                  </div>
                </div>
              </section>
            )}

            {/* Aba 4: Memorial */}
            {activeTab === 4 && (
              <section className="rounded-xl border border-tertiary/10 bg-[#0a192f]/30 p-8 backdrop-blur-md">
                <h2 className="mb-6 flex items-center gap-3 font-h3 text-[1.75rem] text-on-surface">
                  <span className="material-symbols-outlined text-tertiary">music_note</span>
                  Configurações do Memorial
                </h2>
                <p className="mb-8 text-on-surface-variant/60">Controle o comportamento padrão de reprodução e mídias nos memoriais.</p>

                <div className="space-y-6">
                  <div className="flex items-center justify-between rounded-lg border border-transparent bg-surface-container-lowest/50 p-4 hover:border-tertiary/10">
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-tertiary">volume_up</span>
                      <div>
                        <h4 className="font-semibold text-on-surface">Áudio Global de Fundo</h4>
                        <p className="text-xs text-on-surface-variant/60">Tocar automaticamente a música de fundo ao abrir o memorial.</p>
                      </div>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={profile.globalAudio}
                        onChange={(e) => saveProfileFields({ globalAudio: e.target.checked })}
                        className="peer sr-only"
                      />
                      <div className="h-6 w-11 rounded-full bg-surface-container-highest transition-colors peer-checked:bg-tertiary/80" />
                      <div className="absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-on-surface transition-transform peer-checked:translate-x-5 peer-checked:bg-background" />
                    </label>
                  </div>
                </div>
              </section>
            )}

            {/* Aba 5: Notificações */}
            {activeTab === 5 && (
              <section className="rounded-xl border border-tertiary/10 bg-[#0a192f]/30 p-8 backdrop-blur-md">
                <h2 className="mb-6 flex items-center gap-3 font-h3 text-[1.75rem] text-on-surface">
                  <span className="material-symbols-outlined text-tertiary">notifications</span>
                  Preferências de Notificações
                </h2>
                <p className="mb-8 text-on-surface-variant/60">
                  Gerencie quando e por quais motivos deseja ser alertado por e-mail.
                </p>

                <div className="space-y-6">
                  {[
                    {
                      key: "notifyVelas" as const,
                      icon: "lightbulb",
                      title: "Vela Virtual Acesa",
                      desc: "Ser avisado quando um familiar acender uma vela virtual.",
                    },
                    {
                      key: "notifyTributos" as const,
                      icon: "chat_bubble",
                      title: "Novas Homenagens",
                      desc: "Ser avisado ao receber mensagens de tributo na página.",
                    },
                  ].map(({ key, icon, title, desc }) => (
                    <div
                      key={key}
                      className="flex items-center justify-between rounded-lg border border-transparent bg-surface-container-lowest/50 p-4 hover:border-tertiary/10"
                    >
                      <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-tertiary">{icon}</span>
                        <div>
                          <h4 className="font-semibold text-on-surface">{title}</h4>
                          <p className="text-xs text-on-surface-variant/60">{desc}</p>
                        </div>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          checked={profile[key]}
                          onChange={(e) => saveProfileFields({ [key]: e.target.checked })}
                          className="peer sr-only"
                        />
                        <div className="h-6 w-11 rounded-full bg-surface-container-highest transition-colors peer-checked:bg-tertiary/80" />
                        <div className="absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-on-surface transition-transform peer-checked:translate-x-5 peer-checked:bg-background" />
                      </label>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Aba 6: Aparência */}
            {activeTab === 6 && (
              <section className="rounded-xl border border-tertiary/10 bg-[#0a192f]/30 p-8 backdrop-blur-md">
                <h2 className="mb-6 flex items-center gap-3 font-h3 text-[1.75rem] text-on-surface">
                  <span className="material-symbols-outlined text-tertiary">palette</span>
                  Tema da Plataforma
                </h2>
                <p className="mb-8 text-on-surface-variant/60">Escolha a aparência visual ideal para o gerenciamento de lembranças.</p>

                <div className="grid grid-cols-2 gap-6 max-w-sm">
                  {themes.map((theme) => {
                    const active = profile.theme === theme.id;
                    return (
                      <button
                        key={theme.id}
                        onClick={() => handleThemeChange(theme.id)}
                        className={`group text-left cursor-pointer transition-all ${active ? "" : "opacity-60 hover:opacity-100"}`}
                      >
                        <div
                          className={`relative mb-3 h-24 overflow-hidden rounded-lg border flex items-center justify-center ${
                            active
                              ? "border-tertiary bg-tertiary/10 shadow-[0_0_15px_rgba(233,195,73,0.1)]"
                              : "border-surface-container-highest bg-black/40"
                          }`}
                        >
                          <span className={`material-symbols-outlined text-3xl ${active ? "text-tertiary" : "text-outline"}`}>
                            {theme.icon}
                          </span>
                          {active && (
                            <span className="absolute bottom-2 right-2 material-symbols-outlined text-sm text-tertiary">
                              check_circle
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-center text-[0.75rem] uppercase tracking-[0.15em] font-medium ${
                            active ? "text-tertiary" : "text-on-surface-variant"
                          }`}
                        >
                          {theme.label}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Aba 7: Backup e Exportação — somente dev admin */}
            {activeTab === 7 && profile.isDevAdmin && (
              <section className="rounded-xl border border-tertiary/10 bg-[#0a192f]/30 p-8 backdrop-blur-md">
                <h2 className="mb-6 flex items-center gap-3 font-h3 text-[1.75rem] text-on-surface">
                  <span className="material-symbols-outlined text-tertiary">database</span>
                  Backup Completo da Plataforma
                </h2>
                <p className="mb-8 text-on-surface-variant/60">
                  Exporta todos os dados da plataforma — memoriais, pedidos, funerárias, perfis, contratos e configurações — em formato JSON estruturado para migração ou armazenamento externo.
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    { icon: "auto_stories", label: "Memoriais, galerias e linhas do tempo" },
                    { icon: "volunteer_activism", label: "Velas, tributos e homenagens" },
                    { icon: "receipt_long", label: "Pedidos e histórico financeiro" },
                    { icon: "business", label: "Funerárias, serviços e agendamentos" },
                    { icon: "group", label: "Perfis de usuários (sem senhas)" },
                    { icon: "description", label: "Contratos e aceitações digitais" },
                  ].map(({ icon, label }) => (
                    <div key={label} className="flex items-center gap-3 text-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-tertiary text-[18px]">{icon}</span>
                      {label}
                    </div>
                  ))}
                </div>

                <div className="rounded-lg border border-tertiary/20 bg-tertiary/5 p-6 text-center space-y-4">
                  <span className="material-symbols-outlined text-5xl text-tertiary">cloud_download</span>
                  <div>
                    <h4 className="font-semibold text-on-surface text-lg">Baixar Backup Completo</h4>
                    <p className="text-xs text-on-surface-variant/60 max-w-md mx-auto mt-1">
                      Arquivo JSON com snapshot de todos os dados do banco. Dados bancários sensíveis são omitidos por segurança.
                    </p>
                  </div>
                  <button
                    onClick={handleBackupExport}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 rounded bg-tertiary px-6 py-3 text-sm font-bold text-background hover:bg-tertiary-fixed transition-colors cursor-pointer shadow-lg disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    {isSaving ? "Gerando backup..." : "Exportar Backup em JSON"}
                  </button>
                </div>
              </section>
            )}

          </div>

          {/* Coluna Lateral de Resumo */}
          <aside className="flex flex-col gap-8 lg:col-span-4">
            <div className="relative overflow-hidden rounded-xl border border-tertiary/10 bg-[#0a192f]/30 p-8 backdrop-blur-md">
              <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-tertiary/5 blur-2xl" />
              <h3 className="relative z-10 mb-6 font-h3 text-[1.75rem] text-on-surface">Status</h3>

              <div className="relative z-10 mb-8 flex justify-center">
                <div className="relative flex h-32 w-32 items-center justify-center">
                  <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100" aria-hidden>
                    <circle cx="50" cy="50" r="45" fill="transparent" stroke="rgba(233,195,73,0.1)" strokeWidth="4" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="transparent"
                      stroke="#e9c349"
                      strokeWidth="4"
                      strokeDasharray="283"
                      strokeDashoffset="0"
                      className="transition-all duration-700"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="font-h2 text-[2.5rem] leading-none text-tertiary">100%</span>
                    <span className="text-[0.75rem] uppercase tracking-[0.15em] text-on-surface-variant/60">Protegido</span>
                  </div>
                </div>
              </div>

              <ul className="relative z-10 space-y-4 text-sm text-on-surface-variant">
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-base text-emerald-400">check_circle</span>
                  Senha forte configurada
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-base text-emerald-400">check_circle</span>
                  Privacidade:{" "}
                  {profile.privacy === "public"
                    ? "Pública"
                    : profile.privacy === "protected"
                    ? "Protegida"
                    : "Privada"}
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-base text-emerald-400">check_circle</span>
                  Tema: {profile.theme === "claro" ? "Claro" : "Noturno"}
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
