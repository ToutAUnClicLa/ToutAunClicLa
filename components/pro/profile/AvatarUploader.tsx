"use client";

import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { uploadAvatar } from '@/lib/pro/endpoints';
import { ProApiError } from '@/lib/pro/api';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/pro/ui/button';

interface Props {
  initialUrl?: string | null;
  nombre?: string;
  onUploaded?: (url: string) => void;
}

export function AvatarUploader({ initialUrl, nombre, onUploaded }: Props) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(initialUrl || null);
  const [uploading, setUploading] = useState(false);

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error(t('pro.avatar.invalidType'));
      return;
    }
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const { foto_url } = await uploadAvatar(file);
      onUploaded?.(foto_url);
      toast.success(t('pro.avatar.uploaded'));
    } catch (err) {
      toast.error((err as ProApiError).message || t('pro.avatar.uploadError'));
    } finally {
      setUploading(false);
    }
  };

  const initials = (nombre || '?').slice(0, 2).toUpperCase();

  return (
    <div className="flex items-start gap-4">
      <div className="flex aspect-[4/5] w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-accent text-xl font-semibold text-accent-foreground">
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
          {t('pro.avatar.change')}
        </Button>
        <p className="mt-1.5 max-w-xs text-xs text-muted-foreground">{t('pro.avatar.hint')}</p>
      </div>
    </div>
  );
}
