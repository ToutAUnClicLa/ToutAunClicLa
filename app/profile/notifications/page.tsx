"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Bell, ChevronLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/ui/card';
import { Switch } from '@/components/common/ui/switch';

const NOTIFICATION_SETTINGS = [
  {
    id: 'order_updates',
    title: 'Actualizaciones de pedidos',
    description: 'Recibe notificaciones sobre el estado de tus pedidos'
  },
  {
    id: 'promotions',
    title: 'Promociones',
    description: 'Entérate de ofertas especiales y descuentos'
  },
  {
    id: 'favorites',
    title: 'Productos favoritos',
    description: 'Notificaciones cuando tus productos favoritos estén en oferta'
  },
  {
    id: 'new_products',
    title: 'Nuevos productos',
    description: 'Mantente al día con los nuevos productos en tu categoría favorita'
  }
];

export default function NotificationsPage() {
  const router = useRouter();
  const { 
    user,
    isLoading 
  } = useAuth();
  const [settings, setSettings] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }

    // Load saved notification settings
    const savedSettings = localStorage.getItem('notification_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    } else {
      // Default all to true
      const defaults = NOTIFICATION_SETTINGS.reduce((acc, setting) => ({
        ...acc,
        [setting.id]: true
      }), {});
      setSettings(defaults);
      localStorage.setItem('notification_settings', JSON.stringify(defaults));
    }
  }, [user, isLoading, router]);

  const handleToggle = (settingId: string) => {
    const newSettings = {
      ...settings,
      [settingId]: !settings[settingId]
    };
    setSettings(newSettings);
    localStorage.setItem('notification_settings', JSON.stringify(newSettings));
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
            <Bell className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold">Notificaciones</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Preferencias de notificación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {NOTIFICATION_SETTINGS.map((setting) => (
              <motion.div
                key={setting.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start justify-between"
              >
                <div className="space-y-1">
                  <h3 className="font-medium">{setting.title}</h3>
                  <p className="text-sm text-gray-500">{setting.description}</p>
                </div>
                <Switch
                  checked={settings[setting.id]}
                  onCheckedChange={() => handleToggle(setting.id)}
                />
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}