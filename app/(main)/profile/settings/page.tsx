"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  ChevronLeft, 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  CreditCard,
  Download,
  Trash2,
  User,
  Languages
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/common/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/ui/card';
import { Switch } from '@/components/common/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/common/ui/select';

const LANGUAGES = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' }
];

export default function SettingsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { t } = useTranslation();
  
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('es');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotions, setPromotions] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }

    // Load saved settings
    const savedSettings = localStorage.getItem('user_settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setDarkMode(settings.darkMode || false);
      setLanguage(settings.language || 'es');
      setEmailNotifications(settings.emailNotifications || true);
      setOrderUpdates(settings.orderUpdates || true);
      setPromotions(settings.promotions || false);
    }
  }, [user, isLoading, router]);

  const saveSettings = (updates: any) => {
    const newSettings = {
      darkMode,
      language,
      emailNotifications,
      orderUpdates,
      promotions,
      ...updates
    };
    localStorage.setItem('user_settings', JSON.stringify(newSettings));
  };

  const handleDarkModeToggle = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    saveSettings({ darkMode: newValue });
    // TODO: Implementar cambio de tema a nivel global
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    saveSettings({ language: value });
    // TODO: Implementar cambio de idioma a nivel global
  };

  const handleNotificationChange = (type: string, value: boolean) => {
    const updates = { [type]: value };
    
    switch(type) {
      case 'emailNotifications':
        setEmailNotifications(value);
        break;
      case 'orderUpdates':
        setOrderUpdates(value);
        break;
      case 'promotions':
        setPromotions(value);
        break;
    }
    
    saveSettings(updates);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30">
      <div className="container max-w-4xl mx-auto py-2 sm:py-4 md:py-6 px-3 sm:px-4">
        {/* Header Banner con estilo consistente */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 sm:mb-6"
        >
          <Card className=" overflow-hidden shadow-lg border-0">
            <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 p-3 sm:p-4 md:p-6 text-white relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-blue-600/20"></div>
              <div className="absolute top-2 right-2 w-16 h-16 bg-white/5 rounded-full blur-2xl"></div>
              
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-2 sm:p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                      <SettingsIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                        {t('profile.settings.title')}
                      </h1>
                      <p className="text-indigo-100 text-sm sm:text-base opacity-90">
                        {t('profile.settings.subtitle')}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className="bg-white/10 border border-white/20 text-white hover:bg-white/20 backdrop-blur-sm h-8 sm:h-9 px-2 sm:px-3"
                  >
                    <ChevronLeft className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">{t('common.back')}</span>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid gap-6">
          {/* Preferencias generales */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className=" p-6 shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  {t('profile.settings.general.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Idioma */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Languages className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{t('profile.settings.general.language')}</span>
                    </div>
                  </div>
                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="w-full">
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

                {/* Tema oscuro */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {darkMode ? (
                      <Moon className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Sun className="h-4 w-4 text-yellow-500" />
                    )}
                    <span className="font-medium">{t('profile.settings.general.darkMode')}</span>
                  </div>
                  <Switch 
                    checked={darkMode} 
                    onCheckedChange={handleDarkModeToggle}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notificaciones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className=" p-6  shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-orange-600" />
                  {t('profile.settings.notifications.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{t('profile.settings.notifications.email')}</div>
                    <div className="text-sm text-gray-600">{t('profile.settings.notifications.emailDescription')}</div>
                  </div>
                  <Switch 
                    checked={emailNotifications} 
                    onCheckedChange={(value) => handleNotificationChange('emailNotifications', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{t('profile.settings.notifications.orders')}</div>
                    <div className="text-sm text-gray-600">{t('profile.settings.notifications.ordersDescription')}</div>
                  </div>
                  <Switch 
                    checked={orderUpdates} 
                    onCheckedChange={(value) => handleNotificationChange('orderUpdates', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{t('profile.settings.notifications.promotions')}</div>
                    <div className="text-sm text-gray-600">{t('profile.settings.notifications.promotionsDescription')}</div>
                  </div>
                  <Switch 
                    checked={promotions} 
                    onCheckedChange={(value) => handleNotificationChange('promotions', value)}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
