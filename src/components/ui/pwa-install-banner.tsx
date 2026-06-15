"use client";

import { useEffect, useState } from "react";

// Extend window para o evento do PWA
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PwaInstallBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Evitar SSR
    if (typeof window === "undefined") return;

    // Se já foi dispensado antes, não mostra
    if (localStorage.getItem("pwa-banner-dismissed") === "true") {
      return;
    }

    // Se já estiver rodando como app (standalone), não mostra
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || 
                         (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (isStandalone) {
      return;
    }

    // Checar se é iOS (Safari iPhone/iPad)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isAndroidDevice = /android/.test(userAgent);
    
    console.log("PwaInstallBanner debug - Agent:", userAgent, "isIos:", isIosDevice, "isAndroid:", isAndroidDevice);

    if (isIosDevice) {
      // eslint-disable-next-line
      setIsIos(true);
      setIsVisible(true);
      return;
    }

    if (isAndroidDevice) {
      setIsAndroid(true);
      setIsVisible(true);
    }

    // Para Android/Chrome: interceptar o evento nativo
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log("PwaInstallBanner: beforeinstallprompt received!");
      // Impede o Chrome de mostrar aquele banner "miniatura" automático na barra inferior (opcional)
      e.preventDefault();
      // Salva o evento para dispararmos depois
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  if (!isVisible) return null;

  function dismiss() {
    setIsVisible(false);
    localStorage.setItem("pwa-banner-dismissed", "true");
  }

  async function handleInstall() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        dismiss(); // Tira da tela se instalou
      }
      setDeferredPrompt(null);
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#e9c349] p-3 text-black shadow-lg">
      <div className="mx-auto flex max-w-7xl items-start justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black text-[#e9c349]">
            <span className="material-symbols-outlined text-2xl">install_mobile</span>
          </div>
          <div className="text-sm font-medium">
            {isIos ? (
              <p>
                Para instalar o app no seu iPhone, toque no botão <strong>Compartilhar</strong> <span className="material-symbols-outlined align-middle text-lg">ios_share</span> abaixo e escolha <strong>&quot;Adicionar à Tela de Início&quot;</strong>.
              </p>
            ) : deferredPrompt ? (
              <p>
                Instale nosso aplicativo para acesso rápido e uma experiência melhor!
              </p>
            ) : isAndroid ? (
              <p>
                Para instalar no Android, toque nos <strong>3 pontinhos</strong> do navegador e escolha <strong>&quot;Adicionar à tela inicial&quot;</strong>.
              </p>
            ) : (
              <p>
                Instale o aplicativo para uma experiência melhor.
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {!isIos && deferredPrompt && (
            <button
              onClick={handleInstall}
              className="rounded-md bg-black px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#e9c349] transition hover:bg-black/80"
            >
              Instalar
            </button>
          )}
          <button
            onClick={dismiss}
            className="flex h-8 w-8 items-center justify-center rounded-md text-black/60 transition hover:bg-black/10 hover:text-black"
            aria-label="Fechar"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
        
      </div>
    </div>
  );
}
