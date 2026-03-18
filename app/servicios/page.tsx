"use client";

import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import {
  Search,
  ArrowRight,
  Gavel,
  Stethoscope,
  Calculator,
  TrendingUp,
  Home,
  Car,
  Scissors,
  Languages,
  BadgeDollarSign,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import ServiceCard from '@/components/features/services/ServiceCard';

export default function ServicesPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const services = [
    {
      id: 'lawyers',
      icon: Gavel,
      titleKey: 'services.categories.lawyers.title',
      descKey: 'services.categories.lawyers.description',
      subServices: ['services.subservices.notaries', 'services.subservices.migration', 'services.subservices.civil'],
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
    },
    {
      id: 'accounting',
      icon: Calculator,
      titleKey: 'services.categories.accounting.title',
      descKey: 'services.categories.accounting.description',
      subServices: ['services.subservices.taxes', 'services.subservices.payroll', 'services.subservices.bookkeeping'],
    },
    {
      id: 'finance',
      icon: TrendingUp,
      titleKey: 'services.categories.finance.title',
      descKey: 'services.categories.finance.description',
      subServices: ['services.subservices.insurance', 'services.subservices.investments'],
    },
    {
      id: 'realestate',
      icon: Home,
      titleKey: 'services.categories.realestate.title',
      descKey: 'services.categories.realestate.description',
      subServices: ['services.subservices.buying', 'services.subservices.renting', 'services.subservices.commercial'],
    },
    {
      id: 'cars',
      icon: Car,
      titleKey: 'services.categories.cars.title',
      descKey: 'services.categories.cars.description',
      subServices: ['services.subservices.dealerships', 'services.subservices.mechanics'],
    },
    {
      id: 'beauty',
      icon: Scissors,
      titleKey: 'services.categories.beauty.title',
      descKey: 'services.categories.beauty.description',
      subServices: ['services.subservices.stylists', 'services.subservices.nails', 'services.subservices.barber'],
    },
    {
      id: 'translation',
      icon: Languages,
      titleKey: 'services.categories.translation.title',
      descKey: 'services.categories.translation.description',
      subServices: ['services.subservices.official', 'services.subservices.interpretation'],
    },
    {
      id: 'money',
      icon: BadgeDollarSign,
      titleKey: 'services.categories.money.title',
      descKey: 'services.categories.money.description',
      subServices: ['services.subservices.remittances', 'services.subservices.exchange'],
    },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans transition-colors duration-200 min-h-screen">

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#004d40] to-[#0f172a] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none">
          <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor"></path>
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6 animate-fade-in-up">
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
          <div className="max-w-3xl mx-auto relative group z-10">
            <div className="absolute inset-0 bg-primary opacity-20 blur-xl rounded-full group-hover:opacity-30 transition-opacity"></div>
            <div className="relative flex flex-col sm:flex-row items-center bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-2xl border border-white/10">
              <div className="flex-grow flex items-center w-full px-4 py-2">
                <Search className="text-gray-400 w-6 h-6 mr-3" />
                <input
                  className="w-full bg-transparent border-none focus:ring-0 text-slate-800 dark:text-slate-100 placeholder-gray-400 text-base outline-none"
                  placeholder={t('services.search.placeholder')}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="hidden sm:block w-px h-8 bg-gray-200 dark:bg-gray-700 mx-2"></div>
              <button className="w-full sm:w-auto mt-2 sm:mt-0 bg-[#00875A] hover:bg-green-700 text-white px-8 py-3 rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                <span>{t('services.search.button')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-4 text-sm text-gray-400">
            <span>{t('services.search.popular')}:</span>
            <Link href="#" className="text-white hover:underline decoration-[#00875A] underline-offset-4">{t('services.categories.lawyers.short')}</Link>
            <Link href="#" className="text-white hover:underline decoration-[#00875A] underline-offset-4">{t('services.categories.health.short')}</Link>
            <Link href="#" className="text-white hover:underline decoration-[#00875A] underline-offset-4">{t('services.categories.accounting.short')}</Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 sm:text-4xl mb-4">{t('services.grid.title')}</h2>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
            {t('services.grid.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              icon={service.icon}
              title={t(service.titleKey)}
              description={t(service.descKey)}
              subServices={service.subServices.map(key => t(key))}
              comingSoonText={t('services.card.comingSoon')}
              subServicesText={t('services.card.subservices')}
              viewMoreText={t('services.card.viewMore')}
            />
          ))}
        </div>

        <div className="mt-24">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-[#002f24] dark:to-[#0f2441] border border-green-100 dark:border-green-900/30 rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">{t('services.cta.title')}</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
              {t('services.cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-[#00875A] hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all">
                {t('services.cta.notifyButton')}
              </button>
              <button className="bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 border border-gray-200 dark:border-gray-700 px-8 py-3 rounded-lg font-medium transition-colors">
                {t('services.cta.suggestButton')}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
