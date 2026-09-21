'use client';

import React, { useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export default function PoliticasPage() {
  const { t } = useTranslation();

  // SEO metadata update
  useEffect(() => {
    document.title = `${t('privacy.title')} | Tout à un clic là`;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Información sobre cómo recopilamos, utilizamos y protegemos sus datos personales conforme a la legislación canadiense');
    }
  }, [t]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-indigo-600">{t('privacy.title')}</h1>
      <p className="text-sm text-gray-500 mb-8">{t('privacy.lastUpdated')} {new Date().toLocaleDateString()}</p>
      
      <div className="space-y-8 text-gray-700 dark:text-gray-300">
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{t('privacy.sections.introduction.title')}</h2>
          <p className="mb-3">{t('privacy.sections.introduction.paragraph1')}</p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{t('privacy.sections.dataCollection.title')}</h2>
          <p className="mb-3">{t('privacy.sections.dataCollection.paragraph1')}</p>
          <ul className="list-disc pl-6 space-y-2">
            {Array.isArray(t('privacy.sections.dataCollection.list1')) && (t('privacy.sections.dataCollection.list1') as string[]).map((item: string, index: number) => (
              <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{t('privacy.sections.dataUsage.title')}</h2>
          <p className="mb-3">{t('privacy.sections.dataUsage.paragraph1')}</p>
          <ul className="list-disc pl-6 space-y-2">
            {Array.isArray(t('privacy.sections.dataUsage.list1')) && (t('privacy.sections.dataUsage.list1') as string[]).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{t('privacy.sections.cookies.title')}</h2>
          <p className="mb-3">{t('privacy.sections.cookies.paragraph1')}</p>
          <ul className="list-disc pl-6 space-y-2">
            {Array.isArray(t('privacy.sections.cookies.list1')) && (t('privacy.sections.cookies.list1') as string[]).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <p className="mb-3 mt-3">{t('privacy.sections.cookies.paragraph2')}</p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{t('privacy.sections.dataDisclosure.title')}</h2>
          <p className="mb-3">{t('privacy.sections.dataDisclosure.paragraph1')}</p>
          <ul className="list-disc pl-6 space-y-2">
            {Array.isArray(t('privacy.sections.dataDisclosure.list1')) && (t('privacy.sections.dataDisclosure.list1') as string[]).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <p className="mt-3">{t('privacy.sections.dataDisclosure.paragraph2')}</p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{t('privacy.sections.internationalTransfers.title')}</h2>
          <p className="mb-3">{t('privacy.sections.internationalTransfers.paragraph1')}</p>
          <ul className="list-disc pl-6 space-y-2">
            {Array.isArray(t('privacy.sections.internationalTransfers.list1')) && (t('privacy.sections.internationalTransfers.list1') as string[]).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{t('privacy.sections.dataSecurity.title')}</h2>
          <p className="mb-3">{t('privacy.sections.dataSecurity.paragraph1')}</p>
          <ul className="list-disc pl-6 space-y-2">
            {Array.isArray(t('privacy.sections.dataSecurity.list1')) && (t('privacy.sections.dataSecurity.list1') as string[]).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{t('privacy.sections.dataRetention.title')}</h2>
          <p className="mb-3">{t('privacy.sections.dataRetention.paragraph1')}</p>
          <ul className="list-disc pl-6 space-y-2">
            {Array.isArray(t('privacy.sections.dataRetention.list1')) && (t('privacy.sections.dataRetention.list1') as string[]).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{t('privacy.sections.yourRights.title')}</h2>
          <p className="mb-3">{t('privacy.sections.yourRights.paragraph1')}</p>
          <ul className="list-disc pl-6 space-y-2">
            {Array.isArray(t('privacy.sections.yourRights.list1')) && (t('privacy.sections.yourRights.list1') as string[]).map((item: string, index: number) => (
              <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
          <p className="mt-3">{t('privacy.sections.yourRights.paragraph2')}</p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{t('privacy.sections.changes.title')}</h2>
          <p className="mb-3">{t('privacy.sections.changes.paragraph1')}</p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{t('privacy.sections.contact.title')}</h2>
          <p className="mb-3">{t('privacy.sections.contact.paragraph1')}</p>
          <p className="mb-3">
            <strong>Email:</strong> <a href={`mailto:${t('privacy.sections.contact.email')}`} className="text-indigo-600 hover:text-indigo-800">{t('privacy.sections.contact.email')}</a>
          </p>
          <p className="mb-3">{t('privacy.sections.contact.paragraph2')}</p>
        </section>
      </div>
    </div>
  );
}