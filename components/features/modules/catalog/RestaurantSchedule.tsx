"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronDown, Calendar, X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { DiaAbierto, formatTime } from '@/lib/services/restaurants';
import { Button } from '@/components/common/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/ui/card';
import { Badge } from '@/components/common/ui/badge';
import { cn } from '@/lib/utils';

interface RestaurantScheduleProps {
  diasAbiertos?: DiaAbierto[];
  restaurantName: string;
  variant?: 'sidebar' | 'modal';
  className?: string;
}

// Mapeo de días de la semana
const dayNames = {
  es: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  fr: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
};

const dayNamesShort = {
  es: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  fr: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
};

export function RestaurantSchedule({
  diasAbiertos = [],
  restaurantName,
  variant = 'sidebar',
  className
}: RestaurantScheduleProps) {
  const { t, locale } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Obtener el día actual
  const today = new Date().getDay();

  // Crear un array completo de 7 días con estados por defecto
  const weekSchedule = Array.from({ length: 7 }, (_, index) => {
    const dayData = diasAbiertos.find(dia => dia.dia === index);
    return {
      dia: index,
      abierto: dayData?.abierto || false,
      hora_apertura: dayData?.hora_apertura || '12:00',
      hora_cierre: dayData?.hora_cierre || '21:00'
    };
  });

  // Obtener nombres de días según el idioma
  const currentDayNames = dayNames[locale as keyof typeof dayNames] || dayNames.es;
  const currentDayNamesShort = dayNamesShort[locale as keyof typeof dayNamesShort] || dayNamesShort.es;

  const ScheduleContent = ({ isCompact = false, animated = true }) => (
    <div className="space-y-4">
      {weekSchedule.map((day, index) => {
        const isToday = day.dia === today;
        const dayName = isCompact ? currentDayNamesShort[day.dia] : currentDayNames[day.dia];

        const DayComponent = animated ? motion.div : 'div';
        const animationProps = animated ? {
          initial: { opacity: 0, x: -20 },
          animate: { opacity: 1, x: 0 },
          transition: { delay: index * 0.1 }
        } : {};

        return (
          <DayComponent
            key={day.dia}
            {...animationProps}
            className={cn(
              "flex items-center justify-between p-3 rounded-lg border transition-all duration-200",
              isToday
                ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm"
                : "bg-gray-50/50 border-gray-200 hover:bg-gray-50"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-2 h-2 rounded-full",
                day.abierto ? "bg-green-500" : "bg-red-400"
              )} />
              <span className={cn(
                "font-medium text-sm",
                isToday ? "text-blue-700" : "text-gray-700"
              )}>
                {dayName}
                {isToday && (
                  <Badge variant="secondary" className="ml-2 text-xs bg-blue-100 text-blue-700">
                    {t('common.today')}
                  </Badge>
                )}
              </span>
            </div>

            <div className="text-right">
              {day.abierto ? (
                <span className="text-sm text-gray-600">
                  {formatTime(day.hora_apertura)} - {formatTime(day.hora_cierre)}
                </span>
              ) : (
                <span className="text-sm text-red-500 font-medium">
                  {t('catalog.restaurants.schedule.closed')}
                </span>
              )}
            </div>
          </DayComponent>
        );
      })}
    </div>
  );

  // Variante Sidebar para Desktop
  if (variant === 'sidebar') {
    return (
      <Card className={cn("bg-white shadow-lg border-0 p-4", className)}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-blue-600" />
            {t('catalog.restaurants.schedule.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScheduleContent animated={false} />
        </CardContent>
      </Card>
    );
  }

  // Variante Modal para Mobile
  return (
    <>
      {/* Botón para abrir modal */}
      <Button
        onClick={() => setIsModalOpen(true)}
        variant="outline"
        className={cn(
          "w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-12 rounded-xl",
          className
        )}
      >
        <Clock className="h-4 w-4 mr-2" />
        {t('catalog.restaurants.schedule.viewSchedule')}
      </Button>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />

            {/* Modal Content - Pantalla completa en mobile */}
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 bg-white flex flex-col"
            >
              {/* Header fijo */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-8 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Calendar className="h-5 w-5" />
                    {t('catalog.restaurants.schedule.title')}
                  </CardTitle>
                  <Button
                    onClick={() => setIsModalOpen(false)}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 rounded-full h-10 w-10 p-0"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <p className="text-blue-100 text-base">
                  {restaurantName}
                </p>
              </div>

              {/* Contenido con scroll */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <ScheduleContent isCompact={false} />
              </div>

              {/* Footer opcional */}
              <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0">
                <Button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white h-12 rounded-xl"
                >
                  {t('common.close')}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}