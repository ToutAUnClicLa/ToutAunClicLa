"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';

type Lang = 'fr' | 'en' | 'es';

const OPTIONS: { code: Lang; label: string }[] = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
];

// Switcher compacto y accesible: botón con icono Globe + código del idioma actual,
// despliega un menú propio (sin dependencias externas) con FR/EN/ES. Al elegir,
// escribe cookie + localStorage (setLanguage) y refresca los server components.
export function ProLangSwitcher() {
  const router = useRouter();
  const { currentLanguage, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const current = (currentLanguage as Lang) || 'fr';

  // Cierra al hacer clic fuera o con Escape.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  // Al abrir, enfoca el item activo para navegación por teclado.
  useEffect(() => {
    if (open) {
      const activeIndex = OPTIONS.findIndex((o) => o.code === current);
      itemRefs.current[activeIndex >= 0 ? activeIndex : 0]?.focus();
    }
  }, [open, current]);

  const choose = (code: Lang) => {
    setLanguage(code);
    router.refresh();
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onMenuKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      itemRefs.current[(index + 1) % OPTIONS.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      itemRefs.current[(index - 1 + OPTIONS.length) % OPTIONS.length]?.focus();
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t('pro.header.langCurrentLabel', { lang: current.toUpperCase() })}
        className="inline-flex h-11 min-h-11 items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 text-sm text-foreground transition-colors duration-[180ms] ease-out hover:bg-secondary"
      >
        <Globe className="h-4 w-4 text-muted-foreground" aria-hidden />
        <span className="font-mono text-xs font-semibold uppercase tabular-nums">{current}</span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label={t('pro.header.langMenuLabel')}
          className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-lg border border-border bg-card p-1 shadow-[var(--shadow-md)]"
        >
          {OPTIONS.map((opt, i) => {
            const active = opt.code === current;
            return (
              <button
                key={opt.code}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => choose(opt.code)}
                onKeyDown={(e) => onMenuKeyDown(e, i)}
                className={cn(
                  'flex min-h-11 w-full items-center justify-between gap-2 rounded-md px-2.5 text-left text-sm transition-colors duration-[180ms] ease-out',
                  active
                    ? 'bg-accent text-accent-foreground'
                    : 'text-foreground hover:bg-accent/60',
                )}
              >
                <span className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold uppercase tabular-nums text-muted-foreground">
                    {opt.code}
                  </span>
                  <span>{opt.label}</span>
                </span>
                {active && <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
