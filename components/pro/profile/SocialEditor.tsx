"use client";

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { listSocial, addSocial, deleteSocial, type RedSocial } from '@/lib/pro/endpoints';
import { useTranslation } from '@/hooks/useTranslation';
import { socialIcon, socialBrandLabel } from '@/components/pro/socialBrand';
import { Button } from '@/components/pro/ui/button';
import { Input } from '@/components/pro/ui/input';
import { cn } from '@/lib/utils';

const PLATAFORMAS = [
  'instagram',
  'linkedin',
  'facebook',
  'tiktok',
  'youtube',
  'whatsapp',
  'website',
];

export function SocialEditor() {
  const { t } = useTranslation();
  const [redes, setRedes] = useState<RedSocial[]>([]);
  const [loading, setLoading] = useState(true);
  const [plataforma, setPlataforma] = useState('instagram');
  const [url, setUrl] = useState('');
  const [adding, setAdding] = useState(false);

  // Nombre visible: marca con su capitalización oficial; 'website' se traduce.
  const label = (key: string) =>
    key === 'website' ? t('pro.card.socialWebsite') : socialBrandLabel(key) || key;

  useEffect(() => {
    listSocial()
      .then(setRedes)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const onAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setAdding(true);
    try {
      const red = await addSocial({ plataforma, url });
      setRedes((prev) => [...prev, red]);
      setUrl('');
      toast.success(t('pro.social.added'));
    } catch {
      toast.error(t('pro.social.addError'));
    } finally {
      setAdding(false);
    }
  };

  const onDelete = async (id: string) => {
    try {
      await deleteSocial(id);
      setRedes((prev) => prev.filter((r) => r.id !== id));
    } catch {
      toast.error(t('pro.social.removeError'));
    }
  };

  return (
    <div>
      {loading ? (
        <div className="space-y-2" aria-hidden>
          <div className="pro-skeleton h-11 w-full" />
          <div className="pro-skeleton h-11 w-full" />
        </div>
      ) : redes.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('pro.social.empty')}</p>
      ) : (
        <ul className="space-y-2">
          {redes.map((r) => {
            const Icon = socialIcon(r.plataforma);
            return (
              <li
                key={r.id}
                className="flex items-center gap-3 rounded-[10px] border border-border px-3 py-2"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="flex min-w-0 flex-1 flex-col leading-tight sm:flex-row sm:items-baseline sm:gap-2">
                  <span className="shrink-0 text-sm font-medium text-foreground">
                    {label(r.plataforma)}
                  </span>
                  <span className="min-w-0 truncate text-xs text-muted-foreground sm:text-sm">
                    {r.url}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => onDelete(r.id)}
                  className="shrink-0 rounded text-sm text-destructive hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
                >
                  {t('pro.social.remove')}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <form onSubmit={onAdd} className="mt-3 flex flex-col gap-2 sm:flex-row">
        <PlatformSelect
          value={plataforma}
          onChange={setPlataforma}
          label={label}
          ariaLabel={t('pro.social.platformAria')}
        />
        <Input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={t('pro.social.urlPlaceholder')}
          aria-label={t('pro.social.urlPlaceholder')}
          className="w-full sm:flex-1"
        />
        <Button type="submit" variant="secondary" loading={adding} className="sm:w-auto">
          {t('pro.social.add')}
        </Button>
      </form>
    </div>
  );
}

// Dropdown propio (el <select> nativo no puede mostrar iconos): mismo patrón
// accesible que ProLangSwitcher — listbox con flechas, Escape y clic fuera.
function PlatformSelect({
  value,
  onChange,
  label,
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  label: (key: string) => string;
  ariaLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const CurrentIcon = socialIcon(value);

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
      const activeIndex = PLATAFORMAS.indexOf(value);
      itemRefs.current[activeIndex >= 0 ? activeIndex : 0]?.focus();
    }
  }, [open, value]);

  const choose = (key: string) => {
    onChange(key);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onMenuKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      itemRefs.current[(index + 1) % PLATAFORMAS.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      itemRefs.current[(index - 1 + PLATAFORMAS.length) % PLATAFORMAS.length]?.focus();
    }
  };

  return (
    <div ref={containerRef} className="relative sm:w-44">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className="flex h-10 w-full items-center gap-2 rounded-[10px] border border-input bg-background px-3 text-sm text-foreground transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <CurrentIcon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        <span className="min-w-0 flex-1 truncate text-left">{label(value)}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-150',
            open && 'rotate-180',
          )}
          aria-hidden
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={ariaLabel}
          className="pro-banner-in absolute bottom-full left-0 right-0 z-50 mb-2 overflow-hidden rounded-[12px] border border-border bg-card p-1 shadow-[var(--shadow-lg)]"
        >
          {PLATAFORMAS.map((key, i) => {
            const Icon = socialIcon(key);
            const active = key === value;
            return (
              <button
                key={key}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => choose(key)}
                onKeyDown={(e) => onMenuKeyDown(e, i)}
                className={cn(
                  'flex w-full items-center gap-2 rounded-[8px] px-2.5 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  active
                    ? 'bg-accent text-accent-foreground'
                    : 'text-foreground hover:bg-accent/60',
                )}
              >
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                <span className="flex-1">{label(key)}</span>
                {active && <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
