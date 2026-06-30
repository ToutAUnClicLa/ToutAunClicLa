"use client";

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { listSocial, addSocial, deleteSocial, type RedSocial } from '@/lib/pro/endpoints';
import { ProApiError } from '@/lib/pro/api';
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
      toast.success('Red agregada.');
    } catch (err) {
      toast.error((err as ProApiError).message || 'No se pudo agregar (¿límite del plan?).');
    } finally {
      setAdding(false);
    }
  };

  const onDelete = async (id: string) => {
    try {
      await deleteSocial(id);
      setRedes((prev) => prev.filter((r) => r.id !== id));
    } catch {
      toast.error('No se pudo eliminar.');
    }
  };

  return (
    <div>
      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando…</p>
      ) : redes.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aún no agregaste redes sociales.</p>
      ) : (
        <ul className="space-y-2">
          {redes.map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between rounded-[10px] border border-border px-3 py-2"
            >
              <span className="min-w-0 text-sm">
                <span className="font-medium capitalize text-foreground">{r.plataforma}</span>
                <span className="ml-2 truncate text-muted-foreground">{r.url}</span>
              </span>
              <button
                type="button"
                onClick={() => onDelete(r.id)}
                className="ml-3 shrink-0 text-sm text-destructive hover:underline"
              >
                Eliminar
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
          placeholder="https://…"
          className="flex-1"
        />
        <Button type="submit" variant="secondary" loading={adding} className="sm:w-auto">
          Agregar
        </Button>
      </form>
    </div>
  );
}
