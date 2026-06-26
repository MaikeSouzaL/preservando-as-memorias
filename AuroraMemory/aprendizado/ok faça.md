---
pergunta: ok faça
gerado_em: 2026-06-25T23:20:04
---

# ok faça

Perfeito! Agora que tenho uma visão completa do projeto, vou implementar as melhorias de forma integrada. Vou começar com a estrutura que faz mais sentido para a arquitetura atual.

## 🚀 Implementação Completa das Melhorias

### 1. Primeiro, as tipagens centralizadas:

**`src/types/public-content.ts`**
```typescript
export interface PublicContent {
  brand: {
    name: string;
    tagline: string;
    logo?: string;
  };
  landing: {
    headline: string;
    subheadline: string;
    benefits: Benefit[];
    socialProof: SocialProof;
    cta: {
      text: string;
      link: string;
    };
  };
  plans: Plan[];
  about: {
    mission: string;
    history: string;
    values: string[];
    team?: TeamMember[];
  };
  contact: {
    email: string;
    whatsapp: string;
    phone?: string;
    hours: string;
    channels: ContactChannel[];
    address?: Address;
  };
  faq: FAQItem[];
  footer: {
    description: string;
    socialLinks?: SocialLink[];
    legal?: LegalInfo;
  };
}

export interface Benefit {
  icon: string;
  title: string;
  description: string;
}

export interface SocialProof {
  users: number;
  memorials: number;
  satisfaction: number;
  testimonials?: Testimonial[];
}

export interface Testimonial {
  name: string;
  role: string;
  text: string;
  avatar?: string;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: string;
  period: 'monthly' | 'yearly' | 'one-time';
  features: string[];
  highlighted?: boolean;
  cta: string;
  popular?: boolean;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  photo?: string;
}

export interface ContactChannel {
  icon: string;
  label: string;
  value: string;
  type: 'email' | 'phone' | 'whatsapp' | 'social';
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface LegalInfo {
  cnpj?: string;
  privacyPolicy?: string;
  termsOfUse?: string;
}
```

### 2. Service Layer para Dados:

**`src/services/public-content.ts`**
```typescript
import { PublicContent } from '@/types/public-content';

type DataSource = 'mock' | 'api';

interface ServiceResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

function getDataSource(): DataSource {
  if (process.env.NEXT_PUBLIC_USE_MOCK === 'false') return 'api';
  return process.env.NODE_ENV === 'development' ? 'mock' : 'api';
}

// Cache em memória para evitar múltiplas requisições
let cachedContent: PublicContent | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export async function getPublicContent(): Promise<ServiceResponse<PublicContent>> {
  try {
    // Verificar cache
    if (cachedContent && Date.now() - cacheTimestamp < CACHE_DURATION) {
      return { data: cachedContent, error: null, loading: false };
    }

    const source = getDataSource();
    
    if (source === 'mock') {
      const { default: mockData } = await import('@/mock-db/data/public-content.json');
      cachedContent = mockData as PublicContent;
      cacheTimestamp = Date.now();
      return { data: cachedContent, error: null, loading: false };
    }

    const res = await fetch('/api/public-content');
    if (!res.ok) {
      throw new Error(`Falha ao carregar conteúdo: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    cachedContent = data as PublicContent;
    cacheTimestamp = Date.now();
    
    return { data: cachedContent, error: null, loading: false };
  } catch (error) {
    console.error('Erro ao carregar conteúdo público:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Erro desconhecido', 
      loading: false 
    };
  }
}

// Hook React para uso no cliente
export function usePublicContent() {
  const [state, setState] = useState<ServiceResponse<PublicContent>>({
    data: null,
    error: null,
    loading: true
  });

  useEffect(() => {
    let mounted = true;

    async function loadContent() {
      const result = await getPublicContent();
      if (mounted) {
        setState(result);
      }
    }

    loadContent();

    return () => {
      mounted = false;
    };
  }, []);

  return state;
}

// Função para invalidar cache (útil após atualizações)
export function invalidatePublicContentCache() {
  cachedContent = null;
  cacheTimestamp = 0;
}
```

### 3. Componentes UI Reutilizáveis:

**`src/components/ui/Stat.tsx`**
```tsx
'use client';

import { useEffect, useRef, useState } from 'react';

interface StatProps {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  duration?: number;
  animate?: boolean;
  icon?: string;
}

export function Stat({ 
  value, 
  label, 
  prefix = '', 
  suffix = '', 
  duration = 2000,
  animate = true,
  icon 
}: StatProps) {
  const [displayValue, setDisplayValue] = useState(animate ? 0 : value);
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!animate) {
      setDisplayValue(value);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if
