"use client";

import { useState, useEffect } from "react";

type CuratorProfile = {
  name: string;
  email: string;
  bio: string;
  theme: string;
  privacy: "public" | "protected" | "private";
  notifyVelas: boolean;
  notifyTributos: boolean;
  multiFactorEnabled: boolean;
  language: string;
  timezone: string;
  globalAudio: boolean;
};

const tabs = [
  "Perfil",
  "Conta",
  "Privacidade",
  "Segurança",
  "Memorial",
  "Notificações",
  "Aparência",
  "Backup e Exportação",
];

const themes = [
  { id: "noturno", label: "Noturno", description: "Design moderno escuro" },
  { id: "claro", label: "Claro", description: "Visual limpo e brilhante" },
  { id: "cinema", label: "Cinematográfico", description: "Foco em tons quentes" },
];

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [profile, setProfile] = useState<CuratorProfile>({
    name: "Felipe Silva",
    email: "felipe@test.com",
    bio: "Guardião das memórias da família. Curadoria emocional de histórias e lembranças.",
    theme: "noturno",
    privacy: "public",
    notifyVelas: true,
    notifyTributos: true,
    multiFactorEnabled: false,
    language: "pt-BR",
    timezone: "GMT-3",
    globalAudio: true,
  });

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [show2FADialog, setShow2FADialog] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");

  // Senhas (aba segurança)
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const json = await res.json();
          if (json.profile) {
            setProfile(json.profile);
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

  const saveProfileFields = async (updates: Partial<CuratorProfile>) => {
    setIsSaving(true);
    setSuccessMsg("");
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const json = await res.json();
        setProfile(json.profile);
        setSuccessMsg("Configurações atualizadas com sucesso!");
        setTimeout(() => setSuccessMsg(""), 4000);
      }
    } catch (err) {
      console.error("Erro ao salvar perfil:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackupExport = async () => {
    try {
      const res = await fetch("/api/memorials");
      const memorialsData = res.ok ? await res.json() : { memorials: [] };

      const backupObj = {
        exportedAt: new Date().toISOString(),
        curator: {
          name: profile.name,
          email: profile.email,
          bio: profile.bio,
        },
        settings: {
          theme: profile.theme,
          privacy: profile.privacy,
          language: profile.language,
          timezone: profile.timezone,
          globalAudio: profile.globalAudio,
        },
        memorials: memorialsData.memorials || [],
      };

      const jsonStr = JSON.stringify(backupObj, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `legado-digital-backup-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSuccessMsg("Backup gerado e baixado com sucesso!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      console.error("Erro ao exportar backup:", err);
    }
  };

  const handleThemeChange = (themeId: string) => {
    saveProfileFields({ theme: themeId });
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
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.1)]">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            <span className="text-sm font-medium">{successMsg}</span>
          </div>
        )}

        <nav className="mb-12 overflow-x-auto border-b border-surface-container-highest pb-4 [scrollbar-width:none]">
          <ul className="flex gap-8 whitespace-nowrap">
            {tabs.map((tab, index) => (
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
          {/* Coluna de Conteúdo Principal */}
          <div className="flex flex-col gap-8 lg:col-span-8">
            
            {/* Aba 0: Perfil */}
            {activeTab === 0 && (
              <section className="rounded-xl border border-tertiary/10 bg-[#0a192f]/30 p-8 backdrop-blur-md">
                <h2 className="mb-8 flex items-center gap-3 font-h3 text-[1.75rem] text-on-surface">
                  <span className="material-symbols-outlined text-tertiary">person</span>
                  Perfil do Curador
                </h2>

                <div className="flex flex-col items-start gap-8 md:flex-row">
                  <div className="group relative">
                    <div className="h-32 w-32 overflow-hidden rounded-full border-2 border-tertiary/20 p-1 bg-surface-container">
                      <div className="flex h-full w-full items-center justify-center bg-tertiary/10 text-tertiary text-4xl font-bold">
                        {profile.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
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
                        className="w-full border-0 border-b border-white/10 bg-white/2 pb-2 text-on-surface outline-none transition-all focus:border-b-tertiary/80 focus:bg-tertiary/2 text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-[0.75rem] uppercase tracking-[0.15em] text-on-surface-variant/60">Email de Contato</label>
                      <input
                        type="email"
                        name="email"
                        defaultValue={profile.email}
                        className="w-full border-0 border-b border-white/10 bg-white/2 pb-2 text-on-surface outline-none transition-all focus:border-b-tertiary/80 focus:bg-tertiary/2 text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-[0.75rem] uppercase tracking-[0.15em] text-on-surface-variant/60">Biografia Curta</label>
                      <textarea
                        name="bio"
                        defaultValue={profile.bio}
                        className="h-24 w-full resize-none border-0 border-b border-white/10 bg-white/2 pb-2 text-on-surface outline-none transition-all focus:border-b-tertiary/80 focus:bg-tertiary/2 text-sm"
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

                <div className="space-y-6">
                  <button
                    onClick={() => saveProfileFields({ privacy: "public" })}
                    className={`w-full flex items-center justify-between rounded-lg p-4 transition-all text-left cursor-pointer border ${
                      profile.privacy === "public" ? "border-tertiary/30 bg-tertiary/5" : "border-transparent bg-[#0a192f]/20 hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-tertiary">public</span>
                      <div>
                        <h4 className="font-semibold text-on-surface">Público</h4>
                        <p className="text-xs text-on-surface-variant/60">Aberto a todos que possuírem o link ou escanear o QR Code.</p>
                      </div>
                    </div>
                    {profile.privacy === "public" && <span className="material-symbols-outlined text-tertiary">check_circle</span>}
                  </button>

                  <button
                    onClick={() => saveProfileFields({ privacy: "protected" })}
                    className={`w-full flex items-center justify-between rounded-lg p-4 transition-all text-left cursor-pointer border ${
                      profile.privacy === "protected" ? "border-tertiary/30 bg-tertiary/5" : "border-transparent bg-[#0a192f]/20 hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-tertiary">vpn_key</span>
                      <div>
                        <h4 className="font-semibold text-on-surface">Protegido por Senha</h4>
                        <p className="text-xs text-on-surface-variant/60">Exige uma senha simples criada por você para visualização.</p>
                      </div>
                    </div>
                    {profile.privacy === "protected" && <span className="material-symbols-outlined text-tertiary">check_circle</span>}
                  </button>

                  <button
                    onClick={() => saveProfileFields({ privacy: "private" })}
                    className={`w-full flex items-center justify-between rounded-lg p-4 transition-all text-left cursor-pointer border ${
                      profile.privacy === "private" ? "border-tertiary/30 bg-tertiary/5" : "border-transparent bg-[#0a192f]/20 hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-tertiary">shield_person</span>
                      <div>
                        <h4 className="font-semibold text-on-surface">Privado (Restrito)</h4>
                        <p className="text-xs text-on-surface-variant/60">Apenas você e e-mails convidados conseguem acessar.</p>
                      </div>
                    </div>
                    {profile.privacy === "private" && <span className="material-symbols-outlined text-tertiary">check_circle</span>}
                  </button>
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
                <p className="mb-8 text-on-surface-variant/60">Altere sua senha ou gerencie a autenticação multifator (2FA).</p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newPassword) return;
                    setSuccessMsg("Senha alterada com sucesso!");
                    setOldPassword("");
                    setNewPassword("");
                    setTimeout(() => setSuccessMsg(""), 4000);
                  }}
                  className="space-y-6"
                >
                  <div>
                    <label className="mb-2 block text-[0.75rem] uppercase tracking-[0.15em] text-on-surface-variant/60">Senha Atual</label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full border-0 border-b border-white/10 bg-white/2 pb-2 text-on-surface outline-none transition-all focus:border-b-tertiary/80 focus:bg-tertiary/2 text-sm"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[0.75rem] uppercase tracking-[0.15em] text-on-surface-variant/60">Nova Senha</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full border-0 border-b border-white/10 bg-white/2 pb-2 text-on-surface outline-none transition-all focus:border-b-tertiary/80 focus:bg-tertiary/2 text-sm"
                      placeholder="Mínimo 8 caracteres"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="rounded border border-tertiary/50 px-6 py-3 text-[0.75rem] uppercase tracking-[0.15em] text-tertiary transition-colors hover:bg-tertiary/10 cursor-pointer"
                    >
                      Alterar Senha
                    </button>
                  </div>
                </form>

                <div className="mt-8 pt-8 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-on-surface">Autenticação em Dois Fatores (2FA)</h4>
                      <p className="text-xs text-on-surface-variant/60">Proteja sua conta adicionando uma etapa extra de login.</p>
                    </div>
                    <button
                      onClick={() => {
                        if (profile.multiFactorEnabled) {
                          saveProfileFields({ multiFactorEnabled: false });
                        } else {
                          setShow2FADialog(true);
                        }
                      }}
                      className={`px-4 py-2 rounded text-xs font-semibold uppercase tracking-wide cursor-pointer border ${
                        profile.multiFactorEnabled
                          ? "bg-error/10 text-error border-error/30"
                          : "bg-tertiary/10 text-tertiary border-tertiary/30"
                      }`}
                    >
                      {profile.multiFactorEnabled ? "Desativar 2FA" : "Configurar 2FA"}
                    </button>
                  </div>

                  {show2FADialog && (
                    <div className="mt-6 rounded-lg border border-tertiary/20 bg-tertiary/5 p-4 space-y-4">
                      <p className="text-xs text-on-surface-variant">
                        Escaneie o QR Code abaixo com seu aplicativo de autenticação (Google Authenticator ou Authy) e digite o código de 6 dígitos gerado:
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="h-24 w-24 bg-white p-2 rounded flex items-center justify-center text-black font-bold">
                          QR CODE 2FA
                        </div>
                        <div className="space-y-2">
                          <input
                            type="text"
                            maxLength={6}
                            placeholder="000 000"
                            value={twoFactorCode}
                            onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ""))}
                            className="bg-black/40 border border-white/20 px-3 py-2 rounded text-center text-sm font-mono tracking-widest outline-none focus:border-tertiary w-32"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (twoFactorCode.length === 6) {
                                saveProfileFields({ multiFactorEnabled: true });
                                setShow2FADialog(false);
                                setTwoFactorCode("");
                              } else {
                                alert("Insira o código de 6 dígitos.");
                              }
                            }}
                            className="block rounded bg-tertiary px-4 py-2 text-xs font-bold text-background hover:bg-tertiary-fixed cursor-pointer"
                          >
                            Validar e Ativar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
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
                  <div className="flex items-center justify-between rounded-lg border border-transparent bg-surface-container-lowest/50 p-4 hover:border-tertiary/10">
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-tertiary">lightbulb</span>
                      <div>
                        <h4 className="font-semibold text-on-surface">Vela Virtual Acesa</h4>
                        <p className="text-xs text-on-surface-variant/60">Ser avisado quando um familiar acender uma vela virtual.</p>
                      </div>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={profile.notifyVelas}
                        onChange={(e) => saveProfileFields({ notifyVelas: e.target.checked })}
                        className="peer sr-only"
                      />
                      <div className="h-6 w-11 rounded-full bg-surface-container-highest transition-colors peer-checked:bg-tertiary/80" />
                      <div className="absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-on-surface transition-transform peer-checked:translate-x-5 peer-checked:bg-background" />
                    </label>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-transparent bg-surface-container-lowest/50 p-4 hover:border-tertiary/10">
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-tertiary">chat_bubble</span>
                      <div>
                        <h4 className="font-semibold text-on-surface">Novas Homenagens</h4>
                        <p className="text-xs text-on-surface-variant/60">Ser avisado ao receber mensagens de tributo na página.</p>
                      </div>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={profile.notifyTributos}
                        onChange={(e) => saveProfileFields({ notifyTributos: e.target.checked })}
                        className="peer sr-only"
                      />
                      <div className="h-6 w-11 rounded-full bg-surface-container-highest transition-colors peer-checked:bg-tertiary/80" />
                      <div className="absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-on-surface transition-transform peer-checked:translate-x-5 peer-checked:bg-background" />
                    </label>
                  </div>
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

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
                            active ? "border-tertiary bg-tertiary/10 shadow-[0_0_15px_rgba(233,195,73,0.1)]" : "border-surface-container-highest bg-black/40"
                          }`}
                        >
                          {theme.id === "noturno" && <span className="material-symbols-outlined text-3xl text-tertiary">dark_mode</span>}
                          {theme.id === "claro" && <span className="material-symbols-outlined text-3xl text-outline">light_mode</span>}
                          {theme.id === "cinema" && <span className="material-symbols-outlined text-3xl text-amber-500">movie</span>}

                          {active && (
                            <span className="absolute bottom-2 right-2 material-symbols-outlined text-sm text-tertiary">check_circle</span>
                          )}
                        </div>
                        <p className={`text-center text-[0.75rem] uppercase tracking-[0.15em] font-medium ${active ? "text-tertiary" : "text-on-surface-variant"}`}>
                          {theme.label}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Aba 7: Backup e Exportação */}
            {activeTab === 7 && (
              <section className="rounded-xl border border-tertiary/10 bg-[#0a192f]/30 p-8 backdrop-blur-md">
                <h2 className="mb-6 flex items-center gap-3 font-h3 text-[1.75rem] text-on-surface">
                  <span className="material-symbols-outlined text-tertiary">download</span>
                  Preservação e Exportação (Backup)
                </h2>
                <p className="mb-8 text-on-surface-variant/60">
                  Faça o download físico de todas as fotos, histórias, biografias e dados de homenagens em formato estruturado (JSON).
                </p>

                <div className="rounded-lg border border-tertiary/20 bg-tertiary/5 p-6 text-center space-y-6">
                  <span className="material-symbols-outlined text-5xl text-tertiary">history_edu</span>
                  <div>
                    <h4 className="font-semibold text-on-surface text-lg">Baixar Legado Digital</h4>
                    <p className="text-xs text-on-surface-variant/60 max-w-md mx-auto mt-2">
                      Garante que todo o conteúdo emocional e dados estruturados criados por você fiquem salvos em segurança também no seu computador.
                    </p>
                  </div>
                  <button
                    onClick={handleBackupExport}
                    className="inline-flex items-center gap-2 rounded bg-tertiary px-6 py-3 text-sm font-bold text-background hover:bg-tertiary-fixed transition-colors cursor-pointer shadow-lg"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    Exportar Backup em JSON
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
                      strokeDashoffset={profile.multiFactorEnabled ? 0 : 56}
                      className="transition-all duration-700"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="font-h2 text-[2.5rem] leading-none text-tertiary">
                      {profile.multiFactorEnabled ? "100%" : "80%"}
                    </span>
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
                  Privacidade ativa: {profile.privacy === "public" ? "Pública" : profile.privacy === "protected" ? "Protegida" : "Privada"}
                </li>
                <li className={`flex items-center gap-3 ${profile.multiFactorEnabled ? "" : "text-on-surface-variant/50"}`}>
                  <span className="material-symbols-outlined text-base">
                    {profile.multiFactorEnabled ? "check_circle" : "radio_button_unchecked"}
                  </span>
                  Autenticação em 2 fatores ({profile.multiFactorEnabled ? "Ativa" : "Inativa"})
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
