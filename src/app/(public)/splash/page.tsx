"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { publicContent } from "@/src/mock-db/public-content";

export default function SplashPage() {
  const router = useRouter();
  const [hasLoggedIn, setHasLoggedIn] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    let redirectTimer: NodeJS.Timeout | number;

    const loadTimer = window.setTimeout(() => {
      // 1. Verificar auto-login
      const loggedKey = localStorage.getItem("has_logged_in") === "true";
      if (loggedKey) {
        setHasLoggedIn(true);
        setIsRedirecting(true);
        
        // Redireciona automaticamente após 1.5 segundos com uma mensagem solene premium
        redirectTimer = window.setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        // 2. Verificar consentimento de cache
        const consentKey = localStorage.getItem("cache_consent_accepted") === "true";
        if (!consentKey) {
          setShowCookieConsent(true);
        }
      }
    }, 0);

    return () => {
      window.clearTimeout(loadTimer);
      if (redirectTimer) {
        window.clearTimeout(redirectTimer as number);
      }
    };
  }, [router]);

  const handleAcceptConsent = () => {
    localStorage.setItem("cache_consent_accepted", "true");
    setShowCookieConsent(false);
  };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#101414] text-[#e0e3e2] selection:bg-[#e9c349]/20 selection:text-[#e9c349]">
      {styleBlock}
      
      {/* Background Image with Cinematic Golden Overlay */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.png"
          alt=""
          fill
          priority
          className="scale-105 object-cover opacity-35 blur-[6px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#101414]/90 via-[#101414]/65 to-[#101414]/95 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(233,195,73,0.06)_0%,transparent_60%)] animate-pulse-glow" />
      </div>

      <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[1200px] flex-col items-center justify-center px-6">
        <section className="fade-rise flex max-w-3xl flex-col items-center text-center">
          
          {/* Logo Premium - Apenas a árvore dourada flutuando com brilho sublime */}
          <div className="relative mb-12 flex h-60 w-60 items-center justify-center animate-pulse-glow">
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(233,195,73,0.15)_0%,transparent_70%)] blur-xl" />
            <Image
              src="/imagens/logo.png"
              alt="Logo Preservando a Memória"
              width={240}
              height={240}
              priority
              className="relative z-10 h-full w-full object-contain filter drop-shadow-[0_0_35px_rgba(233,195,73,0.65)] hover:scale-105 transition duration-500"
            />
          </div>

          <h1 className="mb-6 font-h1 text-[clamp(2.5rem,6vw,4.5rem)] font-light leading-[1.1] tracking-[-0.02em] text-[#e5e2e1] text-glow">
            {publicContent.brand.name}
          </h1>
          
          {isRedirecting ? (
            <div className="flex flex-col items-center justify-center gap-4 mt-6">
              <div className="relative h-[3px] w-48 overflow-hidden rounded-full bg-[#444748]/30">
                <div className="absolute left-0 top-0 h-full rounded-full bg-[#e9c349] shadow-[0_0_10px_rgba(233,195,73,0.5)] animate-loading-bar" />
              </div>
              <span className="font-label-caps text-[0.75rem] uppercase tracking-[0.2em] text-[#e9c349] animate-pulse">
                Bem-vindo de volta! Acessando seu legado...
              </span>
            </div>
          ) : (
            <p className="max-w-lg font-body-lg text-[1.125rem] leading-[1.7] tracking-[0.01em] text-[#c4c7c7]/80">
              {publicContent.brand.tagline}
            </p>
          )}
        </section>
      </main>

      {/* Action Button */}
      {!isRedirecting && (
        <div className="absolute bottom-16 left-0 z-20 flex w-full justify-center px-6">
          <Link
            href={hasLoggedIn ? "/dashboard" : "/login"}
            className="group relative overflow-hidden rounded-full px-12 py-4.5 transition-all duration-700 ease-in-out hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e9c349]/50 cursor-pointer"
          >
            <div className="absolute inset-0 rounded-full border border-[#e9c349]/20 bg-[#e9c349]/5 backdrop-blur-md transition-colors duration-500 group-hover:border-[#e9c349]/40 group-hover:bg-[#e9c349]/10" />
            <span className="relative flex items-center gap-3 font-label-caps text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-[#e0e3e2] transition-colors duration-500 group-hover:text-[#e9c349]">
              Continuar
              <span className="translate-x-0 text-base opacity-70 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-100">
                {"->"}
              </span>
            </span>
          </Link>
        </div>
      )}

      {/* Elegant Cookie and Cache Consent Banner */}
      {showCookieConsent && (
        <div className="fixed bottom-6 left-6 right-6 z-[100] mx-auto max-w-[600px] rounded-2xl border border-[#e9c349]/25 bg-[#141818]/95 p-6 shadow-[0_10px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-fade-in md:bottom-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1 space-y-1">
              <h3 className="font-h3 text-sm font-semibold tracking-wider text-[#e9c349] uppercase">
                🕊️ Uso de Cache e Privacidade
              </h3>
              <p className="text-xs text-[#c4c7c7] leading-relaxed">
                Este sistema utiliza cache local e cookies para garantir que você permaneça logado com segurança, preservar suas preferências visuais e otimizar o carregamento das páginas. Ao continuar, você concorda com essas otimizações.
              </p>
            </div>
            <button
              onClick={handleAcceptConsent}
              className="rounded-full bg-[#e9c349] px-6 py-2.5 font-label-caps text-[0.7rem] font-bold uppercase tracking-widest text-[#101414] shadow-[0_0_15px_rgba(233,195,73,0.3)] transition hover:bg-[#d6b23b] hover:scale-[1.03] cursor-pointer"
            >
              Aceitar e Prosseguir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styleBlock = (
  <style>{`
    .animate-pulse-glow {
      animation: pulse-glow 3s infinite ease-in-out;
    }
    .animate-spin-slow {
      animation: spin-slow 20s infinite linear;
    }
    .animate-loading-bar {
      animation: loading-bar 1.5s infinite ease-in-out;
    }
    .text-glow {
      text-shadow: 0 0 30px rgba(233, 195, 73, 0.15);
    }
    .animate-fade-in {
      animation: fadeIn 0.5s ease-out forwards;
    }
    @keyframes pulse-glow {
      0%, 100% {
        box-shadow: 0 0 40px rgba(233, 195, 73, 0.08);
        border-color: rgba(233, 195, 73, 0.15);
      }
      50% {
        box-shadow: 0 0 80px rgba(233, 195, 73, 0.22);
        border-color: rgba(233, 195, 73, 0.35);
      }
    }
    @keyframes spin-slow {
      100% {
        transform: rotate(360deg);
      }
    }
    @keyframes loading-bar {
      0% {
        left: -100%;
      }
      50% {
        left: 0;
      }
      100% {
        left: 100%;
      }
    }
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(15px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `}</style>
);
