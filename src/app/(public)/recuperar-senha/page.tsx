"use client";

import Link from "next/link";
import { useState } from "react";

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/reset-password/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);

    if (!res.ok) {
      const payload = await res.json();
      setError(payload.error ?? "Erro ao processar solicitação.");
      return;
    }

    setSubmitted(true);
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[1200px] items-center px-gutter py-14">
      <section className="mx-auto w-full max-w-md rounded-2xl border border-tertiary/15 bg-surface-container/75 p-8 backdrop-blur-xl">
        {submitted ? (
          <div className="text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#e9c349]/10 text-[#e9c349]">
              <span className="material-symbols-outlined text-3xl">mark_email_read</span>
            </div>
            <h1 className="font-h3 text-[1.75rem] text-on-surface">Verifique seu e-mail</h1>
            <p className="mt-3 text-on-surface-variant">
              Se <strong className="text-on-surface">{email}</strong> estiver cadastrado, você receberá
              um link válido por <strong className="text-tertiary">15 minutos</strong>.
            </p>
            <p className="mt-2 text-sm text-on-surface-variant">Verifique também a caixa de spam.</p>
            <Link
              href="/login"
              className="mt-6 inline-block rounded-full border border-tertiary px-6 py-2.5 font-label-caps text-[0.75rem] uppercase tracking-[0.15em] text-tertiary transition hover:bg-tertiary/10"
            >
              Voltar ao login
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <p className="mb-2 font-label-caps text-[0.75rem] uppercase tracking-[0.15em] text-tertiary">
                Recuperar acesso
              </p>
              <h1 className="font-h3 text-[1.75rem] text-on-surface">Esqueceu sua senha?</h1>
              <p className="mt-2 text-on-surface-variant">
                Informe seu e-mail e enviaremos um link para redefinição.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5">
              <label className="grid gap-2">
                <span className="font-label-caps text-[0.75rem] uppercase tracking-[0.12em] text-on-surface-variant">
                  E-mail cadastrado
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@familia.com"
                  className="w-full rounded-lg border border-outline-variant/40 bg-surface-container-low/70 px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:border-tertiary focus:outline-none"
                />
              </label>

              {error && (
                <p className="rounded-lg border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-200">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="rounded-full border border-tertiary py-3 font-label-caps text-[0.75rem] uppercase tracking-[0.15em] text-tertiary transition hover:bg-tertiary/10 disabled:opacity-50"
              >
                {loading ? "Enviando..." : "Enviar instruções"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-on-surface-variant">
              Lembrou sua senha?{" "}
              <Link href="/login" className="font-semibold text-tertiary hover:underline">
                Voltar ao login
              </Link>
            </p>
          </>
        )}
      </section>
    </main>
  );
}
