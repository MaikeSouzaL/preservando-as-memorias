"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/funeraria/dashboard", label: "Visão geral", icon: "space_dashboard", exact: true },
  { href: "/funeraria/dashboard/memoriais", label: "Memoriais", icon: "auto_stories" },
  { href: "/funeraria/dashboard/novo-memorial", label: "Novo memorial", icon: "add_circle" },
  { href: "/funeraria/dashboard/imprimir", label: "Imprimir QR", icon: "qr_code_2" },
  { href: "/funeraria/dashboard/cobranca", label: "Cobrança", icon: "receipt_long" },
  { href: "/funeraria/dados-bancarios", label: "Empresa", icon: "storefront" },
];

export function FuneralNav({ funeralHomeName }: { funeralHomeName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/funeral-auth/logout", { method: "POST" });
    router.push("/funeraria/login");
  }

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <header className="print:hidden sticky top-0 z-40 border-b border-white/10 bg-[#0a192f]/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e9c349]/10 border border-[#e9c349]/20">
            <span className="material-symbols-outlined text-lg text-[#e9c349]">corporate_fare</span>
          </div>
          <div>
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[#e9c349]">Painel da Funerária</p>
            <h1 className="text-sm font-semibold leading-tight text-white sm:text-base">{funeralHomeName}</h1>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center justify-center rounded-lg border border-white/10 p-2 text-white lg:hidden"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
        >
          <span className="material-symbols-outlined">{menuOpen ? "close" : "menu"}</span>
        </button>

        <div className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
                isActive(link.href, link.exact)
                  ? "bg-[#e9c349]/10 text-[#e9c349]"
                  : "text-[#c4c7c7]/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{link.icon}</span>
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="ml-2 flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs text-[#c4c7c7] transition hover:border-white/20 hover:text-white disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            Sair
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="flex flex-col gap-1 border-t border-white/10 px-4 py-3 lg:hidden">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive(link.href, link.exact) ? "bg-[#e9c349]/10 text-[#e9c349]" : "text-[#c4c7c7]/70 hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{link.icon}</span>
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="mt-1 flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2.5 text-sm text-[#c4c7c7]"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Sair
          </button>
        </div>
      )}
    </header>
  );
}
