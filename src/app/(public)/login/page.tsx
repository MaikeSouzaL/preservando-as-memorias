"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientBrowser } from "@/src/lib/supabase-browser";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const [email, setEmail] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("remembered_email") || "";
    }
    return "";
  });
  const [password, setPassword] = useState(() => {
    return "";
  });
  const [rememberMe, setRememberMe] = useState(() => {
    if (typeof window !== "undefined") {
      return Boolean(localStorage.getItem("remembered_email"));
    }
    return false;
  });
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    localStorage.setItem("has_logged_in", "true");
    
    if (rememberMe) {
      localStorage.setItem("remembered_email", email);
    } else {
      localStorage.removeItem("remembered_email");
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? "E-mail ou senha inválidos.");
        return;
      }

      if (data.session?.isDevAdmin === true) {
        router.push("/dev");
      } else if (data.session?.isAdmin === true) {
        router.push("/admin/dashboard");
      } else {
        router.push(next);
      }
    } catch {
      setErrorMsg("Não foi possível entrar agora. Tente novamente.");
    }
  };
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
              As memórias mais importantes merecem permanecer para sempre.
            </h1>
            <p className="max-w-lg font-body-lg text-[1.125rem] text-on-surface-variant">
              Crie memoriais digitais eternos, compartilhe histórias e preserve legados familiares através da tecnologia.
            </p>
          </div>

          <div className="relative mt-gutter w-full max-w-md">
            <div className="rounded-xl border border-tertiary/10 bg-[#0a192f66] p-base opacity-80 backdrop-blur-[20px] [transform:rotate(-2deg)]">
              <Image
                src="/images/hero-bg.png"
                alt="Memória em destaque"
                width={640}
                height={420}
                className="h-auto w-full rounded-lg sepia-[0.3]"
              />
            </div>
            <div className="absolute -right-12 top-1/4 w-48 rounded-xl border border-tertiary/10 bg-[#0a192f66] p-base shadow-2xl backdrop-blur-[20px] [transform:rotate(5deg)]">
              <div className="flex items-center gap-base">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container">
                  <span className="material-symbols-outlined text-sm text-tertiary">favorite</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-caps text-[0.75rem] tracking-[0.15em] text-on-surface">Novo Tributo</span>
                  <span className="text-xs text-on-surface-variant">Família Silva</span>
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
              <div className="flex items-center gap-2 font-serif italic text-tertiary mb-1">
                <span className="material-symbols-outlined text-3xl">local_fire_department</span>
                <span className="text-sm font-bold tracking-widest">PRESERVANDO MEMÓRIAS</span>
              </div>
              <h2 className="font-h3 text-[1.75rem] text-on-surface">Bem-vindo de volta</h2>
              <p className="text-on-surface-variant">Acesse sua conta para continuar preservando histórias eternas.</p>
            </div>

            {errorMsg && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-center text-xs font-semibold text-red-400 animate-pulse">
                {errorMsg}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="space-y-4">
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
              </div>

              <div className="flex items-center justify-between">
                <label className="group flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border border-outline-variant bg-transparent accent-tertiary"
                  />
                  <span className="text-sm text-on-surface-variant transition group-hover:text-on-surface">Lembrar de mim</span>
                </label>
                <Link href="/recuperar-senha" className="text-sm text-tertiary transition hover:text-tertiary/80">
                  Esqueceu sua senha?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full rounded-full border border-tertiary py-4 font-h3 text-lg tracking-wide text-tertiary transition hover:bg-tertiary/5 hover:shadow-[0_0_15px_rgba(233,195,73,0.2)] cursor-pointer"
              >
                Entrar
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
                <span className="text-sm">Entrar com Google</span>
              </button>
            </div>

            <p className="pt-base text-center text-sm text-on-surface-variant">
              Ainda não possui conta?{" "}
              <Link href="/cadastro" className="font-semibold text-tertiary transition hover:text-tertiary/80">
                Criar conta
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
  type: "email" | "password";
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
        className="w-full border-0 border-b border-on-surface/40 bg-transparent py-3 pl-10 pr-8 text-on-surface placeholder:text-on-surface-variant/50 focus:border-tertiary focus:outline-none focus:ring-0 text-sm"
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
