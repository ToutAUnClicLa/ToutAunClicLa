"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';
import { shopChrome } from '@/lib/shop-theme';

type Lang = 'fr' | 'en' | 'es';

const OPTIONS: { code: Lang; label: string }[] = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
];

/** Same interaction as `ProLangSwitcher` — shop tokens, no Pro CSS, no flags. */
export function ShopLangSwitcher() {
  const router = useRouter();
  const { currentLanguage, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const current = (currentLanguage as Lang) || 'es';

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
        className={cn(
          'inline-flex h-11 min-h-11 items-center gap-1.5 rounded-lg border border-[var(--shop-hairline)] bg-white px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50',
          shopChrome.focus,
        )}
      >
        <Globe className="h-4 w-4 text-gray-500" aria-hidden />
        <span className="text-xs font-semibold uppercase tabular-nums">{current}</span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label={t('pro.header.langMenuLabel')}
          className="absolute right-0 z-50 mt-2 flex w-60 flex-col gap-1 rounded-lg border border-gray-200 bg-white p-3 shadow-md"
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
                  'flex min-h-12 w-full items-center justify-between gap-3 rounded-md px-3 py-2.5 text-left text-sm',
                  shopChrome.focus,
                  active
                    ? 'bg-[var(--shop-purple-wash)] text-[var(--shop-ink)]'
                    : 'text-gray-700 hover:bg-gray-50',
                )}
              >
                <span className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tabular-nums text-gray-500">
                    {opt.code}
                  </span>
                  <span lang={opt.code}>{opt.label}</span>
                </span>
                {active && <Check className="h-4 w-4 shrink-0 text-[var(--shop-purple)]" aria-hidden />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
