"use client";

import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { uploadAvatar } from '@/lib/pro/endpoints';
import { ProApiError } from '@/lib/pro/api';
import { Button } from '@/components/pro/ui/button';

interface Props {
  initialUrl?: string | null;
  nombre?: string;
  onUploaded?: (url: string) => void;
}

export function AvatarUploader({ initialUrl, nombre, onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(initialUrl || null);
  const [uploading, setUploading] = useState(false);

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Selecciona una imagen.');
      return;
    }
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const { foto_url } = await uploadAvatar(file);
      onUploaded?.(foto_url);
      toast.success('Foto actualizada.');
    } catch (err) {
      toast.error((err as ProApiError).message || 'No se pudo subir la foto.');
    } finally {
      setUploading(false);
    }
  };

  const initials = (nombre || '?').slice(0, 2).toUpperCase();

  return (
    <div className="flex items-center gap-4">
      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-accent text-xl font-semibold text-accent-foreground">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : (
          initials
        )}
      </div>
      <div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onChange} />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          loading={uploading}
          onClick={() => inputRef.current?.click()}
        >
          Cambiar foto
        </Button>
        <p className="mt-1.5 text-xs text-muted-foreground">JPG o PNG, máximo 5 MB.</p>
      </div>
    </div>
  );
}
