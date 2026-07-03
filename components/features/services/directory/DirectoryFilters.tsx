"use client";

import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
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

export function DirectoryFilters({ q, idioma, ciudad, onChange, onClear, active }: Props) {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      {/* Búsqueda */}
      <div>
        <label htmlFor="dir-q" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {t('pro.directory.searchLabel')}
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input
            id="dir-q"
            type="text"
            value={q}
            onChange={(e) => onChange({ q: e.target.value })}
            placeholder={t('pro.directory.searchPlaceholder')}
            className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-9 pr-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      {/* Idiomas hablados */}
      <div>
        <p className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
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
                  'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                  activeChip
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-400',
                )}
              >
                {l.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Ciudad */}
      <div>
        <label htmlFor="dir-ciudad" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {t('pro.directory.cityLabel')}
        </label>
        <input
          id="dir-ciudad"
          type="text"
          value={ciudad}
          onChange={(e) => onChange({ ciudad: e.target.value })}
          placeholder={t('pro.directory.cityPlaceholder')}
          className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      {active && (
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400"
        >
          <X className="h-3 w-3" aria-hidden />
          {t('pro.directory.clearFilters')}
        </button>
      )}
    </div>
  );
}
