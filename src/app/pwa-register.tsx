"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    // Desregistrar ativamente qualquer service worker antigo para evitar ERR_FAILED e problemas de cache dinâmico no App Router
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister().then((success) => {
          if (success) {
            console.log("Service Worker antigo desregistrado com sucesso para restaurar navegação dinâmica.");
          }
        });
      }
    });
  }, []);

  return null;
}
