"use client";

import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { shopChrome } from '@/lib/shop-theme';
import { useTranslation } from '@/hooks/useTranslation';

const LANGS = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'pt', label: 'Português' },
  { code: 'it', label: 'Italiano' },
  { code: 'ar', label: 'العربية' },
];

interface Props {
  q: string;
  idioma: string;
  ciudad: string;
  onChange: (patch: { q?: string; idioma?: string; ciudad?: string }) => void;
  onClear: () => void;
  active: boolean;
}

const field =
  'h-11 w-full min-w-0 rounded-full border border-[var(--shop-hairline)] bg-white px-4 py-2.5 text-sm text-[var(--shop-ink)] placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--shop-purple)] focus-visible:ring-offset-2';

export function DirectoryFilters({ q, idioma, ciudad, onChange, onClear, active }: Props) {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="dir-q" className="mb-2 block text-xs font-medium uppercase tracking-wider text-[var(--shop-muted)]">
          {t('pro.directory.searchLabel')}
        </label>
        <div className={shopChrome.searchField}>
          <Search className="h-4 w-4 shrink-0 text-[var(--shop-muted)]" aria-hidden />
          <input
            id="dir-q"
            type="text"
            value={q}
            onChange={(e) => onChange({ q: e.target.value })}
            placeholder={t('pro.directory.searchPlaceholder')}
            className={shopChrome.searchInput}
          />
        </div>
      </div>

      <div>
        <p className="mb-2 block text-xs font-medium uppercase tracking-wider text-[var(--shop-muted)]">
          {t('pro.directory.languageLabel')}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {LANGS.map((l) => {
            const activeChip = idioma === l.code;
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => onChange({ idioma: activeChip ? '' : l.code })}
                className={cn(
                  activeChip ? shopChrome.filterChipOn : shopChrome.filterChip,
                  shopChrome.focus,
                )}
              >
                {l.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="dir-ciudad" className="mb-2 block text-xs font-medium uppercase tracking-wider text-[var(--shop-muted)]">
          {t('pro.directory.cityLabel')}
        </label>
        <input
          id="dir-ciudad"
          type="text"
          value={ciudad}
          onChange={(e) => onChange({ ciudad: e.target.value })}
          placeholder={t('pro.directory.cityPlaceholder')}
          className={field}
        />
      </div>

      {active && (
        <button
          type="button"
          onClick={onClear}
          className={cn(
            'inline-flex items-center gap-1.5 text-sm font-medium text-[var(--shop-purple)]',
            shopChrome.focus,
          )}
        >
          <X className="h-3.5 w-3.5" aria-hidden />
          {t('pro.directory.clearFilters')}
        </button>
      )}
    </div>
  );
}
