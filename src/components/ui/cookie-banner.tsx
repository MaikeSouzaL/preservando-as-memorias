'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type CookieConsent = 'all' | 'essential' | null;

const STORAGE_KEY = 'aurora_cookie_consent';

function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as CookieConsent | null;
    if (stored === 'all' || stored === 'essential') {
      setConsent(stored);
    }
  }, []);

  const accept = (type: 'all' | 'essential') => {
    localStorage.setItem(STORAGE_KEY, type);
    setConsent(type);
  };

  return { consent, accept };
}

export default function CookieBanner() {
  const { consent, accept } = useCookieConsent();

  if (consent !== null) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 text-white p-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-300">
          Usamos cookies para melhorar sua experiência. Ao continuar navegando, você concorda com nossa{' '}
          <Link href="/politica-privacidade" className="underline hover:text-white">
            Política de Privacidade
          </Link>{' '}
          e{' '}
          <Link href="/termos-de-uso" className="underline hover:text-white">
            Termos de Uso
          </Link>
          . Com seu consentimento, cookies analíticos para melhorar nossos serviços.
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => accept('essential')}
            className="px-4 py-2 text-sm border border-gray-600 rounded hover:bg-gray-800 transition-colors"
          >
            Apenas essenciais
          </button>
          <button
            onClick={() => accept('all')}
            className="px-4 py-2 text-sm bg-blue-600 rounded hover:bg-blue-700 transition-colors"
          >
            Aceitar todos
          </button>
        </div>
      </div>
    </div>
  );
}