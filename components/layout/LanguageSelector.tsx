"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

interface LanguageSelectorProps {
  isMobile?: boolean;
}

export function LanguageSelector({ isMobile = false }: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' }
  ];

  return (
    <div className="flex items-center space-x-2">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant={language === lang.code ? "default" : "ghost"}
          size="sm"
          onClick={() => setLanguage(lang.code as 'es' | 'en' | 'fr')}
          className={`text-sm ${isMobile ? 'px-2' : ''}`}
        >
          <span className="mr-1">{lang.flag}</span>
          {!isMobile && <span className="hidden lg:inline">{lang.label}</span>}
        </Button>
      ))}
    </div>
  );
}