"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Briefcase,
  Check,
  Contact,
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
import { BackButton } from '@/components/pro/ui/back-button';
import { Button } from '@/components/pro/ui/button';

export default function VCardPreviewPage() {
  const router = useRouter();
  const { proUser } = useProAuth();
  const { t, locale } = useTranslation();
  const [pro, setPro] = useState<PublicPro | null>(null);
  const [loading, setLoading] = useState(true);

  const isFree = proUser?.tier === 'free';

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
        <div className="mt-4">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {t('pro.dashboard.vcard.title')}
          </h1>
        </div>
        <div className="mt-8 flex flex-col items-center rounded-[14px] border border-dashed border-border bg-card p-10 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Lock className="h-5 w-5" aria-hidden />
          </span>
          <h2 className="mt-4 text-base font-semibold text-foreground">
            {t('pro.dashboard.vcard.upsellTitle')}
          </h2>
          <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
            {t('pro.dashboard.vcard.upsellText')}
          </p>
          <Button className="mt-5" onClick={() => router.push('/pro/pricing')}>
            {t('pro.dashboard.vcard.upsellCta')}
          </Button>
        </div>
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
        <div className="mt-8">
          <div className="pro-skeleton h-72 w-full rounded-[14px]" />
        </div>
      </div>
    );
  }

  if (!pro) {
    return (
      <div className="mx-auto max-w-2xl">
        <BackButton href="/pro/dashboard" label={t('pro.dashboard.vcard.back')} />
        <div className="mt-4">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {t('pro.dashboard.vcard.title')}
          </h1>
        </div>
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

      <div className="mt-4">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {t('pro.dashboard.vcard.title')}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {t('pro.dashboard.vcard.subtitle')}
        </p>
      </div>

      <div className="mt-8 rounded-[14px] border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-accent text-accent-foreground">
            <Contact className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h2 className="text-base font-semibold text-foreground">{name}</h2>
            <p className="text-xs text-muted-foreground">{t('pro.dashboard.vcard.fileNote')}</p>
          </div>
        </div>

        <p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
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
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <Download className="h-4 w-4" aria-hidden />
          {t('pro.dashboard.vcard.testButton')}
        </a>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">{t('pro.dashboard.vcard.howItWorks')}</p>
    </div>
  );
}
