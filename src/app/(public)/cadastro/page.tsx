"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientBrowser } from "@/src/lib/supabase-browser";

export default function CadastroPage() {
  return (
    <Suspense>
      <CadastroContent />
    </Suspense>
  );
}

function CadastroContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [emailSent, setEmailSent] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("As senhas não coincidem.");
      return;
    }

    setIsRegistering(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          bio: `Guardião das memórias da família. Curadoria de lembranças criada por ${name.trim()}.`,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        setErrorMsg(payload.error ?? "Ocorreu um erro ao criar a conta. Tente novamente.");
        setIsRegistering(false);
        return;
      }

      if (payload.emailConfirmationRequired) {
        setEmailSent(email.trim());
        setIsRegistering(false);
        return;
      }

      localStorage.setItem("has_logged_in", "true");

      if (payload.session?.isAdmin === true) {
        router.push("/admin/dashboard");
      } else {
        router.push(next);
      }
    } catch {
      setErrorMsg("Ocorreu um erro ao criar a conta. Tente novamente.");
      setIsRegistering(false);
    }
  };

  if (emailSent) {
    return (
      <main className="relative min-h-dvh overflow-hidden bg-background text-on-surface">
        <div className="absolute inset-0 -z-20">
          <Image src="/images/hero-bg.png" alt="" fill priority className="object-cover" />
        </div>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(16,20,20,0.9)_0%,rgba(16,20,20,0.7)_50%,rgba(16,20,20,0.9)_100%)]" />
        <div className="flex min-h-dvh items-center justify-center px-4">
          <div className="w-full max-w-md rounded-2xl border border-tertiary/10 bg-[#0a192f66] p-10 text-center backdrop-blur-[20px]">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-tertiary/10">
              <span className="material-symbols-outlined text-3xl text-tertiary">mark_email_unread</span>
            </div>
            <h2 className="mb-2 text-2xl font-light text-on-surface">Confirme seu e-mail</h2>
            <p className="mb-1 text-on-surface-variant">
              Enviamos um link de confirmação para:
            </p>
            <p className="mb-6 font-semibold text-tertiary">{emailSent}</p>
            <p className="mb-8 text-sm text-on-surface-variant">
              Clique no link do e-mail para ativar sua conta e depois faça o login.
            </p>
            <Link
              href="/login"
              className="block w-full rounded-full border border-tertiary py-3 text-sm font-semibold text-tertiary transition hover:bg-tertiary/10"
            >
              Ir para o login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-dvh overflow-hidden bg-background text-on-surface">
      <div className="absolute inset-0 -z-20">
        <Image src="/images/hero-bg.png" alt="" fill priority className="object-cover" />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(16,20,20,0.9)_0%,rgba(16,20,20,0.7)_50%,rgba(16,20,20,0.9)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_50%,rgba(233,195,73,0.05)_0%,transparent_60%)]" />

      <section className="mx-auto grid min-h-dvh w-full max-w-[1200px] grid-cols-1 items-center gap-section-gap px-gutter py-10 md:grid-cols-2">
        <aside className="hidden animate-[fade-rise_800ms_ease-out_forwards] flex-col justify-center gap-gutter md:flex">
          <div className="space-y-base">
            <h1 className="font-h1 text-[clamp(2.3rem,4.8vw,4rem)] font-light leading-[1.1] tracking-[-0.02em] text-on-surface">
              Construa um espaco eterno para quem voce ama.
            </h1>
            <p className="max-w-lg font-body-lg text-[1.125rem] text-on-surface-variant">
              Crie seu memorial digital e convide familiares para preservar memorias, fotos e homenagens em um unico lugar.
            </p>
          </div>

          <div className="relative mt-gutter w-full max-w-md">
            <div className="rounded-xl border border-tertiary/10 bg-[#0a192f66] p-base opacity-80 backdrop-blur-[20px] [transform:rotate(-2deg)]">
              <Image
                src="/images/hero-bg.png"
                alt="Memorial digital"
                width={640}
                height={420}
                className="h-auto w-full rounded-lg sepia-[0.3]"
              />
            </div>
            <div className="absolute -right-12 top-1/4 w-52 rounded-xl border border-tertiary/10 bg-[#0a192f66] p-base shadow-2xl backdrop-blur-[20px] [transform:rotate(5deg)]">
              <div className="flex items-center gap-base">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container">
                  <span className="material-symbols-outlined text-sm text-tertiary">shield</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-caps text-[0.75rem] tracking-[0.15em] text-on-surface">Conta Segura</span>
                  <span className="text-xs text-on-surface-variant">Protecao e privacidade</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <article className="animate-[fade-rise_800ms_ease-out_200ms_forwards] opacity-0">
          <div className="relative mx-auto flex w-full max-w-md flex-col gap-gutter overflow-hidden rounded-2xl border border-tertiary/10 bg-[#0a192f66] p-[clamp(1.5rem,4vw,4rem)] backdrop-blur-[20px]">
            {/* Voltar à página principal */}
            <Link
              href="/"
              className="absolute left-6 top-6 flex h-8 w-8 items-center justify-center rounded-full border border-tertiary/20 bg-[#0d1010]/40 text-tertiary transition hover:bg-[#e9c349] hover:text-[#0d1010] shadow-md active:scale-95 group z-10"
              title="Voltar à página principal"
            >
              <span className="material-symbols-outlined text-sm font-bold transition-transform group-hover:-translate-x-0.5">arrow_back</span>
            </Link>

            <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-tertiary/5 blur-[100px]" />

            <div className="flex flex-col items-center gap-base text-center">
              <Image src="/imagens/logo.png" alt="Logo" width={140} height={48} className="mb-base h-12 w-auto opacity-90" />
              <h2 className="font-h3 text-[1.75rem] text-on-surface">Crie sua conta</h2>
              <p className="text-on-surface-variant">Comece agora a preservar historias eternas.</p>
            </div>

            {errorMsg && (
              <div className="rounded border border-red-500/20 bg-red-500/10 p-3 text-center text-sm text-red-400">
                {errorMsg}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="space-y-4">
                <InputWithIcon
                  icon="person"
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <InputWithIcon
                  icon="mail"
                  type="email"
                  placeholder="Seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <InputWithIcon
                  icon="lock"
                  type="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputWithIcon
                  icon="lock"
                  type="password"
                  placeholder="Confirmar senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <label className="flex items-start gap-2 text-sm text-on-surface-variant cursor-pointer">
                <input type="checkbox" required className="mt-1 h-4 w-4 rounded border border-outline-variant bg-transparent accent-tertiary cursor-pointer" />
                <span>
                  Aceito os <Link href="/termos-uso" className="text-tertiary hover:underline">termos de uso</Link> e a{" "}
                  <Link href="/politica-privacidade" className="text-tertiary hover:underline">politica de privacidade</Link>.
                </span>
              </label>

              <button
                type="submit"
                disabled={isRegistering}
                className="w-full rounded-full border border-tertiary py-4 font-h3 text-lg tracking-wide text-tertiary transition hover:bg-tertiary/5 hover:shadow-[0_0_15px_rgba(233,195,73,0.2)] disabled:opacity-50 cursor-pointer"
              >
                {isRegistering ? "Criando seu legado..." : "Criar conta"}
              </button>
            </form>

            <div className="flex items-center py-2">
              <div className="h-px flex-grow border-t border-outline-variant/30" />
              <span className="mx-4 text-[0.75rem] uppercase tracking-[0.15em] text-on-surface-variant">ou continue com</span>
              <div className="h-px flex-grow border-t border-outline-variant/30" />
            </div>

            <div className="w-full">
              <button
                type="button"
                onClick={async () => {
                  localStorage.setItem("has_logged_in", "true");
                  const supabase = createClientBrowser();
                  await supabase.auth.signInWithOAuth({
                    provider: "google",
                    options: {
                      redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
                    },
                  });
                }}
                className="group flex w-full items-center justify-center rounded-lg border border-outline-variant/30 py-3 text-on-surface transition hover:bg-surface-container-high cursor-pointer"
              >
                <span className="material-symbols-outlined mr-2 text-on-surface-variant transition group-hover:text-on-surface">mail</span>
                <span className="text-sm">Cadastrar com Google</span>
              </button>
            </div>

            <p className="pt-base text-center text-sm text-on-surface-variant">
              Ja possui conta?{" "}
              <Link href="/login" className="font-semibold text-tertiary transition hover:text-tertiary/80">
                Entrar
              </Link>
            </p>
          </div>
        </article>
      </section>
    </main>
  );
}

function InputWithIcon({
  icon,
  type,
  placeholder,
  value,
  onChange,
}: {
  icon: string;
  type: "text" | "email" | "password";
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <label className="group relative block">
      <span className="material-symbols-outlined pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant transition group-focus-within:text-tertiary">
        {icon}
      </span>
      <input
        type={isPassword && show ? "text" : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="w-full border-0 border-b border-on-surface/40 bg-transparent py-3 pl-10 pr-8 text-on-surface placeholder:text-on-surface-variant/50 focus:border-tertiary focus:outline-none focus:ring-0"
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-on-surface-variant transition hover:text-tertiary"
        >
          <span className="material-symbols-outlined text-base">{show ? "visibility_off" : "visibility"}</span>
        </button>
      )}
    </label>
  );
}
