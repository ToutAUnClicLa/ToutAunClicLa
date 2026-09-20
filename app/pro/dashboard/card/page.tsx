"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExternalLink, Lock } from 'lucide-react';
import { useProAuth } from '@/contexts/ProAuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { fetchPublicProfile, APP_URL, type PublicPro } from '@/lib/pro/publicProfile';
import { PublicCardBody } from '@/components/features/services/card/PublicCardBody';
import { PublicGallery } from '@/components/features/services/card/PublicGallery';
import { QrCard } from '@/components/features/services/card/QrCard';
import { BackButton } from '@/components/pro/ui/back-button';
import { Button } from '@/components/pro/ui/button';
import { ProEmptyState, ProPageHeader } from '@/components/pro/ui/shell';

export default function CardPreviewPage() {
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
      <div className="mx-auto max-w-3xl">
        <BackButton href="/pro/dashboard" label={t('pro.dashboard.card.back')} />
        <ProPageHeader title={t('pro.dashboard.card.title')} />
        <ProEmptyState
          icon={Lock}
          title={t('pro.dashboard.card.upsellTitle')}
          text={t('pro.dashboard.card.upsellText')}
        >
          <Button onClick={() => router.push('/pro/pricing')}>
            {t('pro.dashboard.card.upsellCta')}
          </Button>
        </ProEmptyState>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl" aria-busy="true">
        <div className="pro-skeleton h-5 w-36" />
        <div className="mt-6 space-y-2">
          <div className="pro-skeleton h-8 w-48" />
          <div className="pro-skeleton h-4 w-72 max-w-full" />
        </div>
        <div className="mt-8">
          <div className="pro-skeleton h-96 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  const name = pro ? `${pro.nombre} ${pro.apellido || ''}`.trim() : '';
  const liveUrl = pro ? `${APP_URL}/card/${pro.slug}` : '';
  const cardT = {
    saveContact: t('pro.card.saveContact'),
    speaks: t('pro.card.speaks'),
    socialsSection: t('pro.card.socialsSection'),
    contactSection: t('pro.card.contactSection'),
  };

  return (
    <div className="mx-auto max-w-3xl">
      <BackButton href="/pro/dashboard" label={t('pro.dashboard.card.back')} />

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <ProPageHeader
          className="mt-0"
          title={t('pro.dashboard.card.title')}
          subtitle={t('pro.dashboard.card.subtitle')}
        />
        {pro && (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 shrink-0 items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            {t('pro.dashboard.card.viewLive')}
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        )}
      </div>

      {pro ? (
        <div className="mt-8">
          <PublicCardBody
            pro={pro}
            name={name}
            url={liveUrl}
            t={cardT}
            qr={<QrCard slug={pro.slug} dataUrl={`/api/pro/qr/${pro.slug}`} />}
          />

          {pro.galeria && pro.galeria.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t('pro.card.gallery')}
              </h2>
              <PublicGallery items={pro.galeria} />
            </section>
          )}
        </div>
      ) : (
        <p className="mt-8 text-sm text-muted-foreground">{t('pro.dashboard.card.notReady')}</p>
      )}
    </div>
  );
}
