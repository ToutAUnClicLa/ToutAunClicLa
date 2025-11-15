"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calculator, Gavel, Handshake, Sparkles, Stethoscope, Truck } from "lucide-react";
import Link from "next/link";
import { useTranslation } from '@/hooks/useTranslation';

interface ServiceHighlightTranslation {
  id: number;
  name: string;
  description: string;
  color: string;
  badge: string;
  href: string;
  icon: string;
  cta: string;
  languages: string[];
}

interface ServiceHighlight extends Omit<ServiceHighlightTranslation, 'icon'> {
  icon: React.ElementType;
}

const SERVICE_ICON_MAP: Record<string, React.ElementType> = {
  concierge: Sparkles,
  business: Handshake,
  logistics: Truck,
  law: Gavel,
  health: Stethoscope,
  finance: Calculator
};

const getServiceIcon = (type: string) => SERVICE_ICON_MAP[type] ?? Sparkles;

export default function ServiciosPage() {
  const { t } = useTranslation();
  const rawServices = t<ServiceHighlightTranslation[]>('landing.serviceHighlights');
  const serviceHighlights: ServiceHighlight[] = rawServices.map(service => ({
    ...service,
    icon: getServiceIcon(service.icon)
  }));

  const anchorFromHref = (href: string) => {
    const [, anchor] = href.split('#');
    return anchor;
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-700 to-slate-900 py-20 text-white">
        <div className="absolute inset-0 opacity-20 bg-[url('/noise.png')]"></div>
        <div className="container relative px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto text-center space-y-5"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-emerald-200" />
              <span>{t('servicesPage.heroBadge')}</span>
            </div>
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-200">
              {t('servicesPage.heroSubtitle')}
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
              {t('servicesPage.heroTitle')}
            </h1>
            <p className="text-base sm:text-lg text-emerald-50/90 leading-relaxed">
              {t('servicesPage.description')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="#profesiones"
                className="inline-flex items-center gap-2 rounded-full bg-white text-emerald-900 px-6 py-3 text-base font-semibold shadow-xl hover:-translate-y-0.5 transition-transform"
              >
                {t('servicesPage.heroCta')}
                <ArrowRight className="h-5 w-5" />
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-2 text-sm font-semibold text-white/80">
                <span className="h-2 w-2 rounded-full bg-emerald-300"></span>
                {t('servicesPage.comingSoon')}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="profesiones" className="py-14 sm:py-20 bg-gradient-to-b from-white to-emerald-50/40">
        <div className="container px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3">
              {t('servicesPage.highlightsTitle')}
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              {t('servicesPage.highlightsSubtitle')}
            </p>
          </motion.div>

          <div className="grid gap-6 lg:gap-8 md:grid-cols-2">
            {serviceHighlights.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.id}
                  id={anchorFromHref(service.href)}
                  className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${service.color} text-white p-7 sm:p-8 shadow-[0_25px_50px_-20px_rgba(16,185,129,0.6)]`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="relative flex flex-col h-full space-y-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                          <Icon className="h-7 w-7" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                            {service.badge}
                          </p>
                          <h3 className="text-xl sm:text-2xl font-semibold leading-tight">
                            {service.name}
                          </h3>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm sm:text-base text-white/90 leading-relaxed flex-grow">
                      {service.description}
                    </p>
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                        {t('servicesPage.languagesLabel')}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {service.languages.map((language) => (
                          <span key={language} className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
                            {language}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-base font-semibold">
                      {t('servicesPage.comingSoon')}
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="container px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-3xl mx-auto text-center bg-emerald-50/80 rounded-3xl p-8 sm:p-10 border border-emerald-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">
              {t('servicesPage.contactTitle')}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6">
              {t('servicesPage.contactDescription')}
            </p>
            <Link
              href="mailto:serviceclient@toutaunclicla.com"
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-200/80 hover:-translate-y-0.5 transition-transform"
            >
              {t('servicesPage.contactButton')}
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
