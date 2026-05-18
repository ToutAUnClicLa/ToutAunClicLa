"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
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

const normalize = (str: string) =>
  str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export default function ServicesPage() {
  const { t } = useTranslation();
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
      const navbarHeight = window.innerWidth < 768 ? 80 : 64;
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
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans transition-colors duration-200 min-h-screen">

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#004d40] via-[#00332a] to-[#0f172a] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6">
            <CheckCircle2 className="w-4 h-4 text-green-300" />
            <span className="text-xs font-medium tracking-wide text-green-100 uppercase">
              {t('services.hero.badge')}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            {t('services.hero.title')} <br className="hidden md:block" /> {t('services.hero.subtitle')}
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 mb-10 leading-relaxed">
            {t('services.hero.description')}
          </p>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto relative z-10">
            <div className="relative flex items-center bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-white/10">
              <div className="flex-grow flex items-center w-full px-5 py-4">
                <Search className="text-gray-400 w-5 h-5 mr-3 flex-shrink-0" />
                <input
                  className="w-full bg-transparent border-none focus:ring-0 text-slate-800 dark:text-slate-100 placeholder-gray-400 text-base outline-none"
                  placeholder={t('services.search.placeholder')}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm">
            <span className="text-gray-400">{t('services.search.popular')}:</span>
            {[
              { key: 'services.categories.lawyers.short', fallback: 'Legal' },
              { key: 'services.categories.health.short', fallback: 'Salud' },
              { key: 'services.categories.accounting.short', fallback: 'Contabilidad' },
            ].map((tag) => {
              const label = t(tag.key) === tag.key ? tag.fallback : t(tag.key);
              return (
                <button
                  key={tag.key}
                  onClick={() => handleTagClick(label)}
                  className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm transition-colors"
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-14">
          <div className="inline-block mb-4">
            <div className="h-1 w-12 bg-[#00875A] rounded-full mx-auto" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 sm:text-4xl mb-4">{t('services.grid.title')}</h2>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            {t('services.grid.subtitle')}
          </p>
        </div>

        <div ref={gridRef} />
        {/* Results count when filtering */}
        {searchQuery && (
          <div className="mb-8 flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {filteredServices.length} {filteredServices.length === 1 ? t('services.search.result') : t('services.search.results')}
              {' '}<span className="text-slate-400">·</span>{' '}
              <button onClick={() => setSearchQuery('')} className="text-[#00875A] hover:underline font-medium">
                {t('services.search.clearFilter')}
              </button>
            </p>
          </div>
        )}

        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">
              {t('services.search.noResults')}
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mb-6">
              {t('services.search.noResultsHint')}
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#00875A] hover:underline font-medium text-sm"
            >
              {t('services.search.showAll')}
            </button>
          </div>
        )}

        <div className="mt-20">
          <div className="relative bg-gradient-to-br from-[#004d40] to-[#0f172a] rounded-3xl p-8 md:p-14 text-center overflow-hidden">
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}
            />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{t('services.cta.title')}</h2>
              <p className="text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
                {t('services.cta.description')}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="bg-[#00875A] hover:bg-emerald-600 text-white px-8 py-3.5 rounded-xl font-medium shadow-lg shadow-emerald-900/30 hover:shadow-xl transition-all hover:-translate-y-0.5">
                  {t('services.cta.notifyButton')}
                </button>
                <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 px-8 py-3.5 rounded-xl font-medium transition-all hover:-translate-y-0.5">
                  {t('services.cta.suggestButton')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
