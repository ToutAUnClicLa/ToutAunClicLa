"use client";

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { listSocial, addSocial, deleteSocial, type RedSocial } from '@/lib/pro/endpoints';
import { ProApiError } from '@/lib/pro/api';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/pro/ui/button';
import { Input } from '@/components/pro/ui/input';
import { Select } from '@/components/pro/ui/select';

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
    } catch (err) {
      toast.error((err as ProApiError).message || t('pro.social.addError'));
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
        <p className="text-sm text-muted-foreground">{t('pro.social.loading')}</p>
      ) : redes.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('pro.social.empty')}</p>
      ) : (
        <ul className="space-y-2">
          {redes.map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between rounded-[10px] border border-border px-3 py-2"
            >
              <span className="flex min-w-0 items-baseline gap-2 text-sm">
                <span className="shrink-0 font-medium capitalize text-foreground">
                  {r.plataforma}
                </span>
                <span className="min-w-0 truncate text-muted-foreground">{r.url}</span>
              </span>
              <button
                type="button"
                onClick={() => onDelete(r.id)}
                className="ml-3 shrink-0 text-sm text-destructive hover:underline"
              >
                {t('pro.social.remove')}
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={onAdd} className="mt-3 flex flex-col gap-2 sm:flex-row">
        <Select
          value={plataforma}
          onChange={(e) => setPlataforma(e.target.value)}
          className="sm:w-40"
        >
          {PLATAFORMAS.map((p) => (
            <option key={p} value={p} className="capitalize">
              {p}
            </option>
          ))}
        </Select>
        <Input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={t('pro.social.urlPlaceholder')}
          className="flex-1"
        />
        <Button type="submit" variant="secondary" loading={adding} className="sm:w-auto">
          {t('pro.social.add')}
        </Button>
      </form>
    </div>
  );
}
