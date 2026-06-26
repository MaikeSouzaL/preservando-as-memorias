---
pergunta: entao faça a melhoria no projeto
gerado_em: 2026-06-25T23:19:15
---

# entao faça a melhoria no projeto

Perfeito! Vou implementar as melhorias no projeto. Começarei pela **refatoração do layout compartilhado** e **componentização dos elementos reutilizáveis**, que são as prioridades mais altas.

## 📁 Estrutura que vou criar/modificar:

```
src/
├── components/
│   ├── ui/
│   │   ├── Stat.tsx          # NOVO - Componente de estatística
│   │   ├── InputWithIcon.tsx # NOVO - Input com ícone
│   │   └── Accordion.tsx     # NOVO - Accordion reutilizável
│   └── layout/
│       └── PublicLayout.tsx  # NOVO - Layout compartilhado das páginas públicas
├── hooks/
│   └── useAccordion.ts      # NOVO - Hook para accordion
├── services/
│   └── public-content.ts    # NOVO - Service layer para dados
├── types/
│   └── public-content.ts    # NOVO - Tipagens centralizadas
└── app/(public)/
    └── layout.tsx           # MODIFICADO - Usar PublicLayout
```

## 🚀 Vou implementar agora:

### 1. Primeiro, o layout compartilhado:

**`src/components/layout/PublicLayout.tsx`**
```tsx
'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface PublicLayoutProps {
  children: ReactNode;
  showNav?: boolean;
  showFooter?: boolean;
}

export function PublicLayout({ 
  children, 
  showNav = true, 
  showFooter = true 
}: PublicLayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Início' },
    { href: '/contato', label: 'Contato' },
    { href: '/cadastro', label: 'Cadastro' },
    { href: '/politica-privacidade', label: 'Privacidade' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {showNav && (
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-2xl">📖</span>
                <span className="font-semibold text-xl text-gray-900">
                  Preservando Memórias
                </span>
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden md:flex space-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                aria-label="Abrir menu"
              >
                {isDrawerOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Drawer */}
          {isDrawerOpen && (
            <div className="md:hidden border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </header>
      )}

      <main className="flex-1">
        {children}
      </main>

      {showFooter && (
        <footer className="bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Preservando Memórias
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Honrando histórias, celebrando vidas.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Links
                </h3>
                <ul className="mt-2 space-y-2">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm text-gray-600 hover:text-gray-900">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Contato
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  contato@preservandomemorias.com.br
                </p>
              </div>
            </div>
            <div className="mt-8 border-t border-gray-200 pt-8">
              <p className="text-sm text-gray-400 text-center">
                &copy; {new Date().getFullYear()} Preservando Memórias. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
```

### 2. Componente Stat reutilizável:

**`
