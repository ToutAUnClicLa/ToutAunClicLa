"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Briefcase,
  Check,
  Download,
  ImageIcon,
  Lock,
  Mail,
  Minus,
  Phone,
  User,
  Globe,
} from 'lucide-react';
import { useProAuth } from '@/contexts/ProAuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { fetchPublicProfile, vcardUrl, type PublicPro } from '@/lib/pro/publicProfile';
import { ProAvatar } from '@/components/pro/ProAvatar';
import { BackButton } from '@/components/pro/ui/back-button';
import { Button } from '@/components/pro/ui/button';
import { ProEmptyState, ProPageHeader } from '@/components/pro/ui/shell';

export default function VCardPreviewPage() {
  const router = useRouter();
  const { proUser } = useProAuth();
  const { t, locale } = useTranslation();
  const [pro, setPro] = useState<PublicPro | null>(null);
  const [loading, setLoading] = useState(true);

  const isFree = proUser?.tier === 'free';
  const photoUrl = pro?.foto_url || proUser?.foto_url || null;
  const displayName = `${(pro?.nombre || proUser?.nombre) ?? ''} ${(pro?.apellido || proUser?.apellido) ?? ''}`.trim();

  useEffect(() => {
    if (isFree || !proUser?.slug) {
      setLoading(false);
      return;
    }
    fetchPublicProfile(proUser.slug, locale)
      .then(setPro)
      .finally(() => setLoading(false));
  }, [isFree, proUser?.slug, locale]);

  if (isFree) {
    return (
      <div className="mx-auto max-w-2xl">
        <BackButton href="/pro/dashboard" label={t('pro.dashboard.vcard.back')} />
        <ProPageHeader title={t('pro.dashboard.vcard.title')} />
        <ProEmptyState
          icon={Lock}
          title={t('pro.dashboard.vcard.upsellTitle')}
          text={t('pro.dashboard.vcard.upsellText')}
        >
          <Button onClick={() => router.push('/pro/pricing')}>
            {t('pro.dashboard.vcard.upsellCta')}
          </Button>
        </ProEmptyState>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl" aria-busy="true">
        <div className="pro-skeleton h-5 w-36" />
        <div className="mt-6 space-y-2">
          <div className="pro-skeleton h-8 w-48" />
          <div className="pro-skeleton h-4 w-72 max-w-full" />
        </div>
        <div className="mt-8 pro-card">
          <div className="flex items-center gap-3">
            <ProAvatar src={photoUrl} name={displayName} pending={!photoUrl} />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="pro-skeleton h-4 w-40" />
              <div className="pro-skeleton h-3 w-56 max-w-full" />
            </div>
          </div>
          <div className="mt-4 pro-skeleton h-3 w-24" />
          <ul className="mt-3 flex flex-col gap-2.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="pro-skeleton h-4 w-4 rounded" />
                <span className="pro-skeleton h-4 flex-1" />
              </li>
            ))}
          </ul>
          <div className="pro-skeleton mt-6 h-12 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (!pro) {
    return (
      <div className="mx-auto max-w-2xl">
        <BackButton href="/pro/dashboard" label={t('pro.dashboard.vcard.back')} />
        <ProPageHeader title={t('pro.dashboard.vcard.title')} />
        <p className="mt-8 text-sm text-muted-foreground">{t('pro.dashboard.vcard.notReady')}</p>
      </div>
    );
  }

  const name = `${pro.nombre} ${pro.apellido || ''}`.trim();
  const fields = [
    { key: 'fieldName', Icon: User, value: name, included: true },
    { key: 'fieldTitle', Icon: Briefcase, value: pro.titulo || pro.empresa || null, included: !!(pro.titulo || pro.empresa) },
    { key: 'fieldPhone', Icon: Phone, value: pro.telefono, included: !!pro.telefono },
    { key: 'fieldEmail', Icon: Mail, value: pro.email_contacto, included: !!pro.email_contacto },
    { key: 'fieldWebsite', Icon: Globe, value: pro.sitio_web, included: !!pro.sitio_web },
    { key: 'fieldPhoto', Icon: ImageIcon, value: pro.foto_url ? t('pro.dashboard.vcard.fieldPhotoValue') : null, included: !!pro.foto_url },
  ] as const;

  return (
    <div className="mx-auto max-w-2xl">
      <BackButton href="/pro/dashboard" label={t('pro.dashboard.vcard.back')} />
      <ProPageHeader
        title={t('pro.dashboard.vcard.title')}
        subtitle={t('pro.dashboard.vcard.subtitle')}
      />

      <div className="mt-8 pro-card">
        <div className="flex items-center gap-3">
          <ProAvatar src={photoUrl} name={name} />
          <div>
            <h2 className="text-base font-semibold text-foreground">{name}</h2>
            <p className="text-xs text-muted-foreground">{t('pro.dashboard.vcard.fileNote')}</p>
          </div>
        </div>

        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t('pro.dashboard.vcard.fieldsTitle')}
        </p>
        <ul className="mt-3 flex flex-col gap-2.5">
          {fields.map(({ key, Icon, value, included }) => (
            <li key={key} className="flex items-center gap-3 text-sm">
              <Icon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              <span className="flex-1 text-foreground">
                {t(`pro.dashboard.vcard.${key}`)}
                {included && value && (
                  <span className="text-muted-foreground"> · {value}</span>
                )}
              </span>
              {included ? (
                <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              ) : (
                <Minus className="h-4 w-4 shrink-0 text-muted-foreground/50" aria-hidden />
              )}
            </li>
          ))}
        </ul>

        <a
          href={vcardUrl(pro.slug)}
          className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Download className="h-4 w-4" aria-hidden />
          {t('pro.dashboard.vcard.testButton')}
        </a>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">{t('pro.dashboard.vcard.howItWorks')}</p>
    </div>
  );
}
