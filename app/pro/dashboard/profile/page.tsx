"use client";

import { useEffect, useState } from 'react';
import { getCategories, type Categoria } from '@/lib/pro/endpoints';
import { useProAuth } from '@/contexts/ProAuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { ProfileForm } from '@/components/pro/profile/ProfileForm';
import { AvatarUploader } from '@/components/pro/profile/AvatarUploader';
import { SocialEditor } from '@/components/pro/profile/SocialEditor';
import { BackButton } from '@/components/pro/ui/back-button';
import { ProPageHeader } from '@/components/pro/ui/shell';

export default function ProfilePage() {
  const { proUser, refresh } = useProAuth();
  const { t } = useTranslation();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then(setCategorias)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || !proUser) {
    // Skeleton que replica el layout real (guía: shimmer, no spinners en contenido).
    return (
      <div aria-busy="true">
        <div className="pro-skeleton h-5 w-36" />
        <div className="mt-6 space-y-2">
          <div className="pro-skeleton h-8 w-48" />
          <div className="pro-skeleton h-4 w-72 max-w-full" />
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="pro-card border border-border bg-card p-6 lg:col-span-1">
            <div className="flex items-center gap-4">
              <div className="pro-skeleton h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <div className="pro-skeleton h-8 w-32" />
                <div className="pro-skeleton h-3 w-40" />
              </div>
            </div>
          </div>
          <div className="space-y-6 lg:col-span-2">
            <div className="space-y-4 pro-card border border-border bg-card p-6">
              <div className="pro-skeleton h-4 w-24" />
              <div className="pro-skeleton h-10 w-full" />
              <div className="pro-skeleton h-4 w-24" />
              <div className="pro-skeleton h-10 w-full" />
              <div className="pro-skeleton h-24 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <BackButton href="/pro/dashboard" label={t('pro.dashboard.profile.back')} />
      <ProPageHeader
        title={t('pro.dashboard.profile.title')}
        subtitle={t('pro.dashboard.profile.subtitle')}
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Sidebar: avatar */}
        <aside className="min-w-0 lg:col-span-1">
          <div className="pro-card border border-border bg-card p-6 lg:sticky lg:top-24">
            <AvatarUploader
              initialUrl={proUser.foto_url}
              nombre={proUser.nombre}
              onUploaded={() => refresh()}
            />
          </div>
        </aside>

        {/* Principal: formulario + redes */}
        <div className="min-w-0 space-y-6 lg:col-span-2">
          <div className="pro-card border border-border bg-card p-6">
            <ProfileForm categorias={categorias} />
          </div>

          <div className="pro-card border border-border bg-card p-6">
            <h2 className="text-base font-semibold text-foreground">
              {t('pro.dashboard.profile.socialsTitle')}
            </h2>
            <p className="mb-4 mt-1 text-sm text-muted-foreground">
              {t('pro.dashboard.profile.socialsHint')}
            </p>
            <SocialEditor />
          </div>
        </div>
      </div>
    </div>
  );
}
