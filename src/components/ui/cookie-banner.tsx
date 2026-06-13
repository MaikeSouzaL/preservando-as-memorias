"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const CONSENT_KEY = "pm_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) {
      setVisible(true);
    }
  }, []);

  function accept(level: "all" | "essential") {
    localStorage.setItem(CONSENT_KEY, level);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] border-t border-[#e9c349]/10 bg-[#0a1628]/95 px-4 py-4 backdrop-blur-xl sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 space-y-1">
          <p className="text-sm font-semibold text-[#e0e3e2]">
            Usamos cookies para melhorar sua experiência
          </p>
          <p className="text-xs text-[#e0e3e2]/60 leading-relaxed">
            Em conformidade com a{" "}
            <strong className="text-[#e0e3e2]/80">LGPD (Lei 13.709/2018)</strong>,
            utilizamos cookies essenciais para o funcionamento do site e,
            com seu consentimento, cookies analíticos para melhorar nossos serviços.
            Consulte nossa{" "}
            <Link href="/politica-privacidade" className="text-[#e9c349] hover:underline">
              Política de Privacidade
            </Link>{" "}
            e nossos{" "}
            <Link href="/termos-uso" className="text-[#e9c349] hover:underline">
              Termos de Uso
            </Link>
            .
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <button
            onClick={() => accept("essential")}
            className="rounded-full border border-[#e0e3e2]/20 px-5 py-2 text-xs font-medium text-[#e0e3e2]/70 transition hover:border-[#e0e3e2]/40 hover:text-[#e0e3e2]"
          >
            Apenas essenciais
          </button>
          <button
            onClick={() => accept("all")}
            className="rounded-full bg-[#e9c349] px-5 py-2 text-xs font-semibold text-[#0d1010] transition hover:bg-[#e9c349]/90"
          >
            Aceitar todos
          </button>
        </div>
      </div>
    </div>
  );
}
