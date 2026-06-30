"use client";

import { useEffect, useState } from 'react';
import { getCategories, type Categoria } from '@/lib/pro/endpoints';
import { useProAuth } from '@/contexts/ProAuthContext';
import { ProfileForm } from '@/components/pro/profile/ProfileForm';
import { AvatarUploader } from '@/components/pro/profile/AvatarUploader';
import { SocialEditor } from '@/components/pro/profile/SocialEditor';
import { BackButton } from '@/components/pro/ui/back-button';

export default function ProfilePage() {
  const { proUser, refresh } = useProAuth();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then(setCategorias)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || !proUser) {
    return (
      <div className="flex justify-center py-20">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <BackButton href="/pro/dashboard" label="Dashboard" />

      <div className="mt-4">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Mi perfil</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Así te verán en tu tarjeta digital y en el directorio.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Sidebar: avatar */}
        <aside className="lg:col-span-1">
          <div className="rounded-[14px] border border-border bg-card p-6 lg:sticky lg:top-24">
            <AvatarUploader
              initialUrl={proUser.foto_url}
              nombre={proUser.nombre}
              onUploaded={() => refresh()}
            />
          </div>
        </aside>

        {/* Principal: formulario + redes */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-[14px] border border-border bg-card p-6">
            <ProfileForm categorias={categorias} />
          </div>

          <div className="rounded-[14px] border border-border bg-card p-6">
            <h2 className="text-base font-semibold text-foreground">Redes sociales</h2>
            <p className="mb-4 mt-1 text-sm text-muted-foreground">
              Pro permite hasta 5 · Max, ilimitadas.
            </p>
            <SocialEditor />
          </div>
        </div>
      </div>
    </div>
  );
}
