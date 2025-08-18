'use client';

import React, { useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export default function TerminosPage() {
  const { t } = useTranslation();

  // SEO metadata update
  useEffect(() => {
    document.title = `${t('terms.title')} | Tout à un clic là`;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Términos y condiciones de uso de nuestra plataforma de comercio electrónico conforme a la legislación canadiense');
    }
  }, [t]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-indigo-600">{t('terms.title')}</h1>
      <p className="text-sm text-gray-500 mb-8">{t('terms.lastUpdated')} {new Date().toLocaleDateString()}</p>
      
      <div className="space-y-8 text-gray-700 dark:text-gray-300">
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{t('terms.sections.introduction.title')}</h2>
          <p className="mb-3">{t('terms.sections.introduction.paragraph1')}</p>
          <p className="mb-3">{t('terms.sections.introduction.paragraph2')}</p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{t('terms.sections.eligibility.title')}</h2>
          <p className="mb-3">{t('terms.sections.eligibility.paragraph1')}</p>
          <p className="mb-3">{t('terms.sections.eligibility.paragraph2')}</p>
          <p className="mb-3">{t('terms.sections.eligibility.paragraph3')}</p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{t('terms.sections.products.title')}</h2>
          <p className="mb-3">{t('terms.sections.products.paragraph1')}</p>
          <p className="mb-3">{t('terms.sections.products.paragraph2')}</p>
          <p className="mb-3">{t('terms.sections.products.paragraph3')}</p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{t('terms.sections.pricing.title')}</h2>
          <p className="mb-3">{t('terms.sections.pricing.paragraph1')}</p>
          <p className="mb-3">{t('terms.sections.pricing.paragraph2')}</p>
          <p className="mb-3">{t('terms.sections.pricing.paragraph3')}</p>
          <p className="mb-3">{t('terms.sections.pricing.paragraph4')}</p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{t('terms.sections.shipping.title')}</h2>
          <p className="mb-3">{t('terms.sections.shipping.paragraph1')}</p>
          <p className="mb-3">{t('terms.sections.shipping.paragraph3')}</p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{t('terms.sections.delivery.title')}</h2>
          <p className="mb-3">{t('terms.sections.delivery.paragraph1')}</p>
          <p className="mb-3">{t('terms.sections.delivery.paragraph2')}</p>
          <ul className="list-disc pl-6 space-y-2 mb-3">
            {(t('terms.sections.delivery.list1') as string[]).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <p className="mb-3">{t('terms.sections.delivery.paragraph3')}</p>
          <p className="mb-3">{t('terms.sections.delivery.paragraph4')}</p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{t('terms.sections.returns.title')}</h2>
          <p className="mb-3">{t('terms.sections.returns.paragraph1')}</p>
          <ul className="list-disc pl-6 space-y-2 mb-3">
            {(t('terms.sections.returns.list1') as string[]).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <p className="mb-3">{t('terms.sections.returns.paragraph2')}</p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{t('terms.sections.intellectualProperty.title')}</h2>
          <p className="mb-3">{t('terms.sections.intellectualProperty.paragraph1')}</p>
          <p className="mb-3">{t('terms.sections.intellectualProperty.paragraph2')}</p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{t('terms.sections.liability.title')}</h2>
          <p className="mb-3">{t('terms.sections.liability.paragraph1')}</p>
          <ul className="list-disc pl-6 space-y-2 mb-3">
            {(t('terms.sections.liability.list1') as string[]).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <p className="mb-3">{t('terms.sections.liability.paragraph2')}</p>
          <p className="mb-3">{t('terms.sections.liability.paragraph3')}</p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{t('terms.sections.governing.title')}</h2>
          <p className="mb-3">{t('terms.sections.governing.paragraph1')}</p>
          <p className="mb-3">{t('terms.sections.governing.paragraph2')}</p>
          <p className="mb-3">{t('terms.sections.governing.paragraph3')}</p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{t('terms.sections.changes.title')}</h2>
          <p className="mb-3">{t('terms.sections.changes.paragraph1')}</p>
          <p className="mb-3">{t('terms.sections.changes.paragraph2')}</p>
          <p className="mb-3">{t('terms.sections.changes.paragraph3')}</p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{t('terms.sections.contact.title')}</h2>
          <p className="mb-3">{t('terms.sections.contact.paragraph1')}</p>
          <p className="mb-3">
            <strong>Email:</strong> <a href={`mailto:${t('terms.sections.contact.email')}`} className="text-indigo-600 hover:text-indigo-800">{t('terms.sections.contact.email')}</a>
          </p>
          <p className="mb-3">{t('terms.sections.contact.paragraph2')}</p>
        </section>
      </div>
    </div>
  );
}