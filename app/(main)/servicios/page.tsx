"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import {
  Search,
  Gavel,
  Stethoscope,
  Calculator,
  TrendingUp,
  Home,
  Car,
  Scissors,
  Languages,
  BadgeDollarSign,
  CheckCircle2,
  X,
  Wrench
} from 'lucide-react';
import ServiceCard from '@/components/features/services/ServiceCard';
import { shopChrome, shopHeroFigure } from '@/lib/shop-theme';
import { cn } from '@/lib/utils';

const HERO_MOSAIC = [
  { id: 'lawyers', image: '/services/lawyers.png' },
  { id: 'health', image: '/services/health.png' },
  { id: 'beauty', image: '/services/beauty.png' },
  { id: 'accounting', image: '/services/accounting.png' },
] as const;

const normalize = (str: string) =>
  str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export default function ServicesPage() {
  const { t, locale } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const gridRef = useRef<HTMLDivElement>(null);
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  const services = [
    {
      id: 'lawyers',
      icon: Gavel,
      titleKey: 'services.categories.lawyers.title',
      descKey: 'services.categories.lawyers.description',
      subServices: ['services.subservices.lawyers', 'services.subservices.notaries', 'services.subservices.migration', 'services.subservices.civil'],
      image: '/services/lawyers.png',
    },
    {
      id: 'health',
      icon: Stethoscope,
      titleKey: 'services.categories.health.title',
      descKey: 'services.categories.health.description',
      subServices: [
        'services.subservices.doctors',
        'services.subservices.dentists',
        'services.subservices.psychologists',
        'services.subservices.psychotherapists',
        'services.subservices.speechTherapists',
        'services.subservices.optometrists',
        'services.subservices.sexologists',
        'services.subservices.manyMore'
      ],
      image: '/services/health.png',
    },
    {
      id: 'accounting',
      icon: Calculator,
      titleKey: 'services.categories.accounting.title',
      descKey: 'services.categories.accounting.description',
      subServices: ['services.subservices.taxes', 'services.subservices.payroll', 'services.subservices.bookkeeping'],
      image: '/services/accounting.png',
    },
    {
      id: 'finance',
      icon: TrendingUp,
      titleKey: 'services.categories.finance.title',
      descKey: 'services.categories.finance.description',
      subServices: ['services.subservices.insurance', 'services.subservices.investments'],
      image: '/services/finance.png',
    },
    {
      id: 'realestate',
      icon: Home,
      titleKey: 'services.categories.realestate.title',
      descKey: 'services.categories.realestate.description',
      subServices: ['services.subservices.buying', 'services.subservices.renting', 'services.subservices.commercial'],
      image: '/services/home-services.png',
    },
    {
      id: 'cars',
      icon: Car,
      titleKey: 'services.categories.cars.title',
      descKey: 'services.categories.cars.description',
      subServices: ['services.subservices.dealerships', 'services.subservices.mechanics'],
      image: '/services/cars.png',
    },
    {
      id: 'beauty',
      icon: Scissors,
      titleKey: 'services.categories.beauty.title',
      descKey: 'services.categories.beauty.description',
      subServices: ['services.subservices.stylists', 'services.subservices.nails', 'services.subservices.barber'],
      image: '/services/beauty.png',
    },
    {
      id: 'translation',
      icon: Languages,
      titleKey: 'services.categories.translation.title',
      descKey: 'services.categories.translation.description',
      subServices: ['services.subservices.official', 'services.subservices.interpretation'],
      image: '/services/translation.png',
    },
    {
      id: 'money',
      icon: BadgeDollarSign,
      titleKey: 'services.categories.money.title',
      descKey: 'services.categories.money.description',
      subServices: ['services.subservices.remittances', 'services.subservices.exchange'],
      image: '/services/money.png',
    },
    {
      id: 'maintenance',
      icon: Wrench,
      titleKey: 'services.categories.maintenance.title',
      descKey: 'services.categories.maintenance.description',
      subServices: ['services.subservices.electricians', 'services.subservices.plumbers', 'services.subservices.painters', 'services.subservices.carpenters', 'services.subservices.locksmiths'],
      image: '/services/maintenance.png',
    },
  ];

  const filteredServices = useMemo(() => {
    const query = normalize(searchQuery.trim());
    if (!query) return services;

    return services.filter((service) => {
      const title = normalize(t(service.titleKey));
      const desc = normalize(t(service.descKey));
      const subs = service.subServices.map(key => normalize(t(key))).join(' ');
      return title.includes(query) || desc.includes(query) || subs.includes(query);
    });
  }, [searchQuery, services, t]);

  const scrollToGrid = useCallback(() => {
    if (gridRef.current) {
      const navbarHeight = 72;
      const top = gridRef.current.getBoundingClientRect().top + window.scrollY - navbarHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    if (value.trim()) {
      scrollTimerRef.current = setTimeout(scrollToGrid, 600);
    }
  }, [scrollToGrid]);

  useEffect(() => {
    return () => {
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, []);

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    setTimeout(scrollToGrid, 100);
  };

  return (
    <div className="min-h-screen bg-white text-[var(--shop-ink)]">
      <section className="border-b border-[var(--shop-hairline)] bg-white">
        <div className="container py-12 sm:py-16 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14">
            <div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--shop-hairline)] px-3 py-1 text-xs font-medium text-[var(--shop-purple)]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {t('services.hero.badge')}
                <span className="text-[var(--shop-hairline)]">·</span>
                <span className="text-[var(--shop-muted)]">{services.length}</span>
              </p>
              <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-[var(--shop-ink)] sm:text-5xl lg:text-[3.25rem]">
                {t('services.hero.title')} {t('services.hero.subtitle')}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--shop-muted)] sm:text-lg">
                {t('services.hero.description')}
              </p>

              <div className="mt-8 max-w-xl">
                <div className={shopChrome.searchField}>
                  <Search className="h-4 w-4 shrink-0 text-[var(--shop-muted)]" />
                  <input
                    className={shopChrome.searchInput}
                    placeholder={t('services.search.placeholder')}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className={cn('-mr-1', shopChrome.iconBtn)}
                      aria-label={t('services.search.clearFilter')}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-1.5">
                <span className="mr-1 text-sm text-[var(--shop-muted)]">{t('services.search.popular')}:</span>
                {[
                  { key: 'services.categories.lawyers.short', fallback: 'Legal' },
                  { key: 'services.categories.health.short', fallback: 'Salud' },
                  { key: 'services.categories.accounting.short', fallback: 'Contabilidad' },
                ].map((tag) => {
                  const label = t(tag.key) === tag.key ? tag.fallback : t(tag.key);
                  return (
                    <button
                      type="button"
                      key={tag.key}
                      onClick={() => handleTagClick(label)}
                      className={cn(shopChrome.filterChip, shopChrome.focus)}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {HERO_MOSAIC.map((tile, i) => (
                <Link
                  key={tile.id}
                  href={`/servicios/${tile.id}`}
                  className={cn(
                    shopHeroFigure,
                    'max-h-none aspect-[16/10] lg:aspect-[5/4]',
                    i % 2 === 1 ? 'lg:translate-y-6' : '',
                    shopChrome.focus,
                  )}
                >
                  <Image
                    src={tile.image}
                    alt=""
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 50vw, 28vw"
                    priority
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container py-16 sm:py-20">
        <div className="mb-10 max-w-2xl sm:mb-14">
          <h2 className="text-3xl font-semibold tracking-tight text-[var(--shop-ink)] sm:text-4xl">
            {t('services.grid.title')}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[var(--shop-muted)] sm:text-lg">
            {t('services.grid.subtitle')}
          </p>
        </div>

        <div ref={gridRef} />
        {searchQuery && (
          <p className="mb-8 text-sm text-[var(--shop-muted)]">
            {filteredServices.length} {filteredServices.length === 1 ? t('services.search.result') : t('services.search.results')}
            {' '}<span className="text-[var(--shop-hairline)]">·</span>{' '}
            <button type="button" onClick={() => setSearchQuery('')} className={cn('font-medium text-[var(--shop-purple)]', shopChrome.focus)}>
              {t('services.search.clearFilter')}
            </button>
          </p>
        )}

        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  icon={service.icon}
                  title={t(service.titleKey)}
                  description={t(service.descKey)}
                  subServices={service.subServices.map(key => t(key))}
                  comingSoonText={t('services.card.comingSoon')}
                  subServicesText={t('services.card.subservices')}
                  viewMoreText={t('services.card.viewMore')}
                  image={service.image}
                  variant="pro"
                  showMeta
                  href={`/servicios/${service.id}`}
                />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-[var(--shop-hairline)] py-16 text-center">
            <Search className="mx-auto mb-4 h-8 w-8 text-[var(--shop-hairline)]" />
            <p className="text-lg font-medium text-[var(--shop-ink)]">
              {t('services.search.noResults')}
            </p>
            <p className="mt-2 text-sm text-[var(--shop-muted)]">
              {t('services.search.noResultsHint')}
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className={cn('mt-6 font-medium text-[var(--shop-purple)]', shopChrome.focus)}
            >
              {t('services.search.showAll')}
            </button>
          </div>
        )}

        <div className="mt-20 rounded-xl border border-[var(--shop-hairline)] bg-white px-6 py-12 text-center sm:px-12 sm:py-16">
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--shop-ink)] sm:text-3xl">
            {t('services.cta.title')}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-[var(--shop-muted)]">
            {t('services.cta.description')}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/pro"
              target="_blank"
              rel="noopener noreferrer"
              className={shopChrome.inkCta}
            >
              {t('services.cta.notifyButton')}
            </a>
            <a
              href={`https://wa.me/14384626255?text=${encodeURIComponent(
                locale === 'fr'
                  ? 'Bonjour, je voudrais suggérer un service pour le répertoire Tout à un Clic Là.'
                  : locale === 'en'
                    ? 'Hi, I would like to suggest a service for the Tout à un Clic Là directory.'
                    : 'Hola, me gustaría sugerir un servicio para el directorio de Tout à un Clic Là.',
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(shopChrome.filterChip, 'h-11 min-h-11 px-5 text-sm', shopChrome.focus)}
            >
              {t('services.cta.suggestButton')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
