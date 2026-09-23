"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, User, Languages, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/common/ui/select';
import { loginPath } from '@/lib/shop-auth';
import { PROFILE } from '@/lib/shop-profile';
import { ProfileCard, ProfilePageHeader, ProfileSettingsSkeleton } from '@/components/features/profile/ProfileChrome';
import { shopChrome } from '@/lib/shop-theme';
import { cn } from '@/lib/utils';

const LANGUAGES = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
];

export default function SettingsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { t } = useTranslation();

  const [language, setLanguage] = useState('es');

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(loginPath(PROFILE.settings));
    }

    let savedLanguage = 'es';
    const savedSettings = localStorage.getItem('user_settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (settings.language) savedLanguage = settings.language;
      } catch {
        savedLanguage = 'es';
      }
    }
    setLanguage(savedLanguage);
    localStorage.setItem(
      'user_settings',
      JSON.stringify({
        language: savedLanguage,
        emailNotifications: true,
        orderUpdates: true,
      })
    );
  }, [user, isLoading, router]);

  const saveLanguage = (value: string) => {
    setLanguage(value);
    localStorage.setItem(
      'user_settings',
      JSON.stringify({
        language: value,
        emailNotifications: true,
        orderUpdates: true,
      })
    );
  };

  if (isLoading || !user) {
    return <ProfileSettingsSkeleton />;
  }

  return (
    <div>
      <ProfilePageHeader
        title={t('profile.settings.title')}
        description={t('profile.settings.subtitle')}
      />

      <div className="grid gap-6">
        <ProfileCard className="p-5 sm:p-6">
          <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-[var(--shop-ink)]">
            <User className="h-4 w-4 text-[var(--shop-purple)]" />
            {t('profile.settings.general.title')}
          </h2>
          <div className="space-y-6">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--shop-ink)]">
                <Languages className="h-4 w-4 text-[var(--shop-muted)]" />
                {t('profile.settings.general.language')}
              </div>
              <Select value={language} onValueChange={saveLanguage}>
                <SelectTrigger className={cn('h-11 w-full px-4', shopChrome.focus)}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </ProfileCard>

        <ProfileCard className="p-5 sm:p-6">
          <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-[var(--shop-ink)]">
            <Bell className="h-4 w-4 text-[var(--shop-purple)]" />
            {t('profile.settings.notifications.title')}
          </h2>
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--shop-purple)]" />
              <div>
                <p className="font-medium text-[var(--shop-ink)]">
                  {t('profile.settings.notifications.email')}
                </p>
                <p className="text-sm text-[var(--shop-muted)]">
                  {t('profile.settings.notifications.emailDescription')}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--shop-purple)]" />
              <div>
                <p className="font-medium text-[var(--shop-ink)]">
                  {t('profile.settings.notifications.orders')}
                </p>
                <p className="text-sm text-[var(--shop-muted)]">
                  {t('profile.settings.notifications.ordersDescription')}
                </p>
              </div>
            </div>
          </div>
        </ProfileCard>
      </div>
    </div>
  );
}
