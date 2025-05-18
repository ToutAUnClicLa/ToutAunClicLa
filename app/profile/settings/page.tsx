"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, ChevronLeft, Moon, Sun, Globe, Bell, Shield, CreditCard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const LANGUAGES = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' }
];

export default function SettingsPage() {
  const router = useRouter();
  const { 
    user, 
    userData,
    isLoading 
  } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('es');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }

    // Load saved settings
    const savedSettings = localStorage.getItem('user_settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setDarkMode(settings.darkMode);
      setLanguage(settings.language);
    }
  }, [user, isLoading, router]);

  const saveSettings = (updates: any) => {
    const newSettings = {
      darkMode,
      language,
      ...updates
    };
    localStorage.setItem('user_settings', JSON.stringify(newSettings));
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    saveSettings({ darkMode: !darkMode });
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    saveSettings({ language: value });
  };

  if (isLoading) {
    return (
      <div className="container max-w-6xl py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => router.back()}
            className="lg:hidden"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <SettingsIcon className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold">Configuración</h1>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Preferencias
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium">Modo oscuro</h3>
                  <p className="text-sm text-gray-500">Cambiar entre tema claro y oscuro</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={darkMode}
                    onCheckedChange={handleDarkModeToggle}
                  />
                  {darkMode ? (
                    <Moon className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Sun className="h-4 w-4 text-gray-500" />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium">Idioma</h3>
                  <p className="text-sm text-gray-500">Selecciona tu idioma preferido</p>
                </div>
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map(lang => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => router.push('/profile/settings/password')}
              >
                Cambiar contraseña
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => router.push('/profile/settings/security')}
              >
                Configuración de seguridad
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => router.push('/profile/notifications')}
              >
                Administrar notificaciones
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Pagos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => router.push('/profile/settings/payment')}
              >
                Métodos de pago
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}