'use client';

import { useEffect, useState } from 'react';

export type CookieConsent = 'all' | 'essential' | null;

const STORAGE_KEY = 'aurora_cookie_consent';

export function useCookieConsent() {
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

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setConsent(null);
  };

  return { consent, accept, reset };
}