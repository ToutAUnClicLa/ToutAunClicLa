"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Truck, MessageSquare, Check, Calendar, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/ui/card';
import { Label } from '@/components/common/ui/label';
import { Textarea } from '@/components/common/ui/textarea';
import { Button } from '@/components/common/ui/button';
import { Badge } from '@/components/common/ui/badge';
import { SimpleTimePicker } from '@/components/common/ui/simple-time-picker';
import { useTranslation } from '@/hooks/useTranslation';
import { useCart } from '@/hooks/useCart';
import { 
  getDeliveryInfo, 
  getMinimumDeliveryTime,
  isValidDeliveryTime,
  formatTimeForDisplay,
  shouldDefaultToNextDay,
  getAvailableHoursToday,
  getAvailableHoursTomorrow,
  isAfterTodayCutoff
} from '@/lib/utils/delivery';
import type { DeliveryOptions, DeliveryInfo, DeliveryUpdateResponse } from '@/lib/services/cart';

// Funciones de seguridad para sanitizar input
const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Eliminar caracteres potencialmente peligrosos
  let sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Eliminar tags script
    .replace(/<[^>]*>/g, '') // Eliminar todos los tags HTML
    .replace(/javascript:/gi, '') // Eliminar javascript:
    .replace(/vbscript:/gi, '') // Eliminar vbscript:
    .replace(/on\w+\s*=/gi, '') // Eliminar event handlers (onclick, onload, etc.)
    .replace(/data:/gi, '') // Eliminar data URLs
    .replace(/expression\s*\(/gi, '') // Eliminar CSS expressions
    .replace(/url\s*\(/gi, '') // Eliminar CSS url()
    .replace(/import\s+/gi, '') // Eliminar import statements
    .replace(/exec\s*\(/gi, '') // Eliminar exec calls
    .replace(/eval\s*\(/gi, '') // Eliminar eval calls
    .replace(/document\./gi, '') // Eliminar acceso a document
    .replace(/window\./gi, '') // Eliminar acceso a window
    .replace(/\$\{.*?\}/g, '') // Eliminar template literals
    .replace(/`.*?`/g, '') // Eliminar backticks
    .replace(/\|\|/g, '') // Eliminar OR operators
    .replace(/&&/g, '') // Eliminar AND operators
    .replace(/[<>'"&]/g, (match) => { // Escapar caracteres especiales
      const escapeMap: { [key: string]: string } = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      };
      return escapeMap[match] || match;
    });

  // Limitar a caracteres seguros (letras, números, espacios, puntuación básica)
  sanitized = sanitized.replace(/[^\w\s\.\,\!\?\-\(\)\:]/g, '');
  
  // Truncar si es muy largo
  if (sanitized.length > 500) {
    sanitized = sanitized.substring(0, 500);
  }
  
  return sanitized.trim();
};

// Validar que el contenido no contenga patrones sospechosos
const validateSecureInput = (input: string): boolean => {
  if (!input) return true;
  
  const suspiciousPatterns = [
    /select\s+.*from/i, // SQL injection patterns
    /union\s+select/i,
    /insert\s+into/i,
    /delete\s+from/i,
    /update\s+.*set/i,
    /drop\s+table/i,
    /create\s+table/i,
    /alter\s+table/i,
    /exec\s*\(/i,
    /execute\s*\(/i,
    /script\s*>/i,
    /javascript\s*:/i,
    /vbscript\s*:/i,
    /data\s*:/i,
    /base64/i,
    /\bxss\b/i,
    /<.*>/,
    /\$\{.*\}/,
    /`.*`/,
    /eval\s*\(/i,
    /function\s*\(/i,
    /var\s+\w+\s*=/i,
    /let\s+\w+\s*=/i,
    /const\s+\w+\s*=/i
  ];
  
  return !suspiciousPatterns.some(pattern => pattern.test(input));
};

interface DeliveryOptionsComponentProps {
  onOptionsChange?: (options: DeliveryOptions & { isValid: boolean }) => void;
  disabled?: boolean;
  className?: string;
  showAddressNote?: boolean;
}

export default function DeliveryOptionsComponent({ 
  onOptionsChange, 
  disabled = false,
  className = '',
  showAddressNote = false
}: DeliveryOptionsComponentProps) {
  const { t } = useTranslation();
  const { updateDeliveryOptions } = useCart();
  
  // Calcular tiempo por defecto usando Montreal timezone
  const shouldBeNextDay = shouldDefaultToNextDay();
  const defaultDeliveryType = shouldBeNextDay ? 'siguiente_dia' : 'estandar';
  
  // Obtener primera hora disponible según el tipo de entrega
  const getInitialHour = () => {
    if (shouldBeNextDay) {
      const tomorrowHours = getAvailableHoursTomorrow();
      return tomorrowHours[0] || '11:00';
    } else {
      const todayHours = getAvailableHoursToday();
      if (todayHours.length > 0) {
        return todayHours[0];
      } else {
        // Si no hay horas disponibles hoy, usar mañana
        const tomorrowHours = getAvailableHoursTomorrow();
        return tomorrowHours[0] || '11:00';
      }
    }
  };

  const defaultDeliveryTime = getInitialHour();
  
  console.log('🕐 DeliveryOptions initialization:', {
    shouldBeNextDay,
    defaultDeliveryType,
    defaultDeliveryTime,
    availableToday: getAvailableHoursToday(),
    availableTomorrow: getAvailableHoursTomorrow()
  });

  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOptions>({
    horaEntregaPreferida: defaultDeliveryTime,
    metodoEntrega: 'puerta',
    notasEntrega: '',
    aplicarATodos: true,
    tipoEntrega: defaultDeliveryType
  });

  const [, setDeliveryInfo] = useState<DeliveryInfo>(getDeliveryInfo(defaultDeliveryType));
  const [manualDeliveryType, setManualDeliveryType] = useState<'estandar' | 'siguiente_dia'>(defaultDeliveryType);
  
  // Inicializar horarios disponibles según el tipo de entrega
  const getInitialAvailableHours = () => {
    if (defaultDeliveryType === 'siguiente_dia') {
      return getAvailableHoursTomorrow();
    } else {
      const todayHours = getAvailableHoursToday();
      return todayHours.length > 0 ? todayHours : getAvailableHoursTomorrow();
    }
  };
  
  const [availableHours, setAvailableHours] = useState<string[]>(getInitialAvailableHours());
  const [showAlternativeHours, setShowAlternativeHours] = useState(false);
  const [backendSuggestsTomorrow, setBackendSuggestsTomorrow] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState<{
    time?: string;
    method?: string;
    notes?: string;
  }>({});
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);


  // Opciones de método de entrega
  const deliveryMethods = [
    {
      value: 'puerta' as const,
      icon: '🚪',
      title: t('cart.delivery.methods.puerta.title'),
      description: t('cart.delivery.methods.puerta.description')
    },
    {
      value: 'manos' as const,
      icon: '🤝',
      title: t('cart.delivery.methods.manos.title'),
      description: t('cart.delivery.methods.manos.description')
    },
    {
      value: 'recepcion' as const,
      icon: '🏢',
      title: t('cart.delivery.methods.recepcion.title'),
      description: t('cart.delivery.methods.recepcion.description')
    }
  ];

  // Validar opciones
  const validateOptions = useCallback((options: DeliveryOptions) => {
    const newErrors: typeof errors = {};
    
    if (!options.horaEntregaPreferida) {
      newErrors.time = t('cart.delivery.validation.timeRequired');
    } else if (!isValidDeliveryTime(options.horaEntregaPreferida)) {
      newErrors.time = t('cart.delivery.validation.timeInvalid');
    } else {
      // Verificar que sea al menos 1 hora después de ahora
      const minimumTime = getMinimumDeliveryTime();
      const [minHours, minMinutes] = minimumTime.split(':').map(Number);
      const [selectedHours, selectedMinutes] = options.horaEntregaPreferida.split(':').map(Number);
      
      const minTimeInMinutes = minHours * 60 + minMinutes;
      const selectedTimeInMinutes = selectedHours * 60 + selectedMinutes;
      
      if (selectedTimeInMinutes < minTimeInMinutes) {
        const minTimeFormatted = formatTimeForDisplay(minimumTime);
        newErrors.time = t('cart.delivery.validation.timeTooEarly', { time: minTimeFormatted });
      }
    }

    if (!options.metodoEntrega) {
      newErrors.method = t('cart.delivery.validation.methodRequired');
    }

    if (options.notasEntrega) {
      // Validación de longitud
      if (options.notasEntrega.length > 500) {
        newErrors.notes = t('cart.delivery.validation.notesTooLong');
      }
      
      // Validación de seguridad
      if (!validateSecureInput(options.notasEntrega)) {
        newErrors.notes = t('cart.delivery.validation.notesUnsafe');
      }
      
      // Verificar que no contenga solo espacios
      if (options.notasEntrega.trim().length === 0 && options.notasEntrega.length > 0) {
        newErrors.notes = t('cart.delivery.validation.notesEmpty');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [t]);

  // Manejar cambios en las opciones
  const handleOptionChange = (field: keyof DeliveryOptions, value: string) => {
    let sanitizedValue = value;
    
    // Sanitizar específicamente el campo de notas
    if (field === 'notasEntrega') {
      sanitizedValue = sanitizeInput(value);
      
      // Limpiar timer anterior si existe
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      
      const newOptions = { ...deliveryOptions, [field]: sanitizedValue };
      setDeliveryOptions(newOptions);
      setHasChanges(true);
      
      // Debounce para validación de notas (más costosa)
      const timer = setTimeout(() => {
        const isValid = validateOptions(newOptions);
        onOptionsChange?.({ ...newOptions, isValid });
      }, 300); // 300ms de debounce
      
      setDebounceTimer(timer);
    } else if (field === 'horaEntregaPreferida') {
      // Usar el tipo de entrega seleccionado manualmente, no calculado automáticamente
      const newOptions = { 
        ...deliveryOptions, 
        [field]: sanitizedValue,
        tipoEntrega: manualDeliveryType // Usar el tipo seleccionado manualmente
      };
      
      setDeliveryOptions(newOptions);
      setHasChanges(false); // No requerir botón de aplicar para cambios inmediatos
      
      const isValid = validateOptions(newOptions);
      onOptionsChange?.({ ...newOptions, isValid });
      
      // Aplicar cambios automáticamente
      if (isValid) {
        updateDeliveryOptions(newOptions).catch(console.error);
      }
    } else {
      // Para otros campos, validar y aplicar inmediatamente
      const newOptions = { ...deliveryOptions, [field]: sanitizedValue };
      setDeliveryOptions(newOptions);
      setHasChanges(false); // No requerir botón de aplicar para cambios inmediatos
      
      const isValid = validateOptions(newOptions);
      onOptionsChange?.({ ...newOptions, isValid });
      
      // Aplicar cambios automáticamente
      if (isValid) {
        updateDeliveryOptions(newOptions).catch(console.error);
      }
    }
  };

  // Manejar cambio de tipo de entrega manual
  const handleDeliveryTypeChange = (newType: 'estandar' | 'siguiente_dia') => {
    console.log('🚛 Cambiando tipo de entrega:', {
      anterior: manualDeliveryType,
      nuevo: newType,
      metodoActual: deliveryOptions.metodoEntrega,
      horaActual: new Date().getHours()
    });
    
    // VALIDACIÓN CRÍTICA: No permitir seleccionar "hoy" después de las 8PM
    const availableHoursToday = getAvailableHoursToday();
    
    // Usar la lógica de disponibilidad en lugar de hora fija
    if (newType === 'estandar' && availableHoursToday.length === 0) {
      console.warn('❌ No hay horarios disponibles para entrega estándar');
      
      // Mostrar mensaje de error temporal
      setErrors(prev => ({
        ...prev,
        time: t('cart.delivery.autoNextDay')
      }));
      
      // Limpiar error después de 3 segundos
      setTimeout(() => {
        setErrors(prev => ({ ...prev, time: undefined }));
      }, 3000);
      
      // Forzar selección de "mañana"
      setManualDeliveryType('siguiente_dia');
      return;
    }
    
    
    setManualDeliveryType(newType);
    const newDeliveryInfo = getDeliveryInfo(newType);
    setDeliveryInfo(newDeliveryInfo);
    
    // Actualizar horarios disponibles según el tipo seleccionado
    const newAvailableHours = newType === 'estandar' ? getAvailableHoursToday() : getAvailableHoursTomorrow();
    setAvailableHours(newAvailableHours);
    
    // Validar si la hora actual es válida para el nuevo tipo
    let updatedTime = deliveryOptions.horaEntregaPreferida;
    if (!newAvailableHours.includes(updatedTime)) {
      // Si la hora actual no está disponible, usar la primera disponible
      updatedTime = newAvailableHours[0] || '11:00';
      console.log('⏰ Hora ajustada automáticamente:', updatedTime);
    }
    
    // Cuando cambiamos a día siguiente, también necesitamos actualizar el método si es necesario
    let updatedMetodo = deliveryOptions.metodoEntrega;
    
    // Si es día siguiente y el método actual no es compatible, usar 'puerta' por defecto
    if (newType === 'siguiente_dia' && !updatedMetodo) {
      updatedMetodo = 'puerta';
    }
    
    const newOptions = { 
      ...deliveryOptions, 
      tipoEntrega: newType,
      metodoEntrega: updatedMetodo,
      horaEntregaPreferida: updatedTime
    };
    
    console.log('🎯 Opciones actualizadas con validación:', newOptions);
    
    setDeliveryOptions(newOptions);
    setHasChanges(false); // No requerir botón de aplicar para cambios inmediatos
    
    const isValid = validateOptions(newOptions);
    onOptionsChange?.({ ...newOptions, isValid });
    
    // Aplicar cambios automáticamente
    if (isValid) {
      updateDeliveryOptions(newOptions).catch(console.error);
    }
  };

  // Aplicar cambios al carrito
  const handleApplyChanges = async () => {
    if (!validateOptions(deliveryOptions)) {
      return;
    }

    console.log('💾 Aplicando opciones al backend:', deliveryOptions);
    
    setIsLoading(true);
    try {
      const response: DeliveryUpdateResponse = await updateDeliveryOptions(deliveryOptions);
      
      if (response.error) {
        // El backend sugiere horarios alternativos
        if (response.error.availableHours) {
          setAvailableHours(response.error.availableHours);
          setShowAlternativeHours(true);
        }
        if (response.error.suggestTomorrow) {
          setBackendSuggestsTomorrow(true);
        }
        setErrors({ time: response.error.message });
      } else {
        setHasChanges(false);
        setShowAlternativeHours(false);
        setAvailableHours([]);
        setBackendSuggestsTomorrow(false);
      }
    } catch (error) {
      console.error('Error updating delivery options:', error);
      setErrors({ time: t('cart.delivery.error') });
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar selección de hora alternativa
  const handleAlternativeHourSelect = (hour: string) => {
    handleOptionChange('horaEntregaPreferida', hour);
    setShowAlternativeHours(false);
    setAvailableHours([]);
    setErrors({ ...errors, time: undefined });
  };

  // Manejar sugerencia de mañana
  const handleAcceptTomorrowSuggestion = () => {
    handleDeliveryTypeChange('siguiente_dia');
    setBackendSuggestsTomorrow(false);
    setErrors({ ...errors, time: undefined });
  };

  // Efecto para validar opciones iniciales
  useEffect(() => {
    // Inicializar horarios disponibles y validar configuración inicial
    const initialAvailableHours = manualDeliveryType === 'estandar' ? getAvailableHoursToday() : getAvailableHoursTomorrow();
    setAvailableHours(initialAvailableHours);
    
    // Si no hay horarios disponibles para entrega estándar, forzar cambio a "mañana"
    if (manualDeliveryType === 'estandar' && initialAvailableHours.length === 0) {
      console.log('🚨 Inicialización: No hay horarios disponibles hoy, forzando cambio a mañana');
      setManualDeliveryType('siguiente_dia');
      const tomorrowHours = getAvailableHoursTomorrow();
      setAvailableHours(tomorrowHours);
      
      const updatedOptions: DeliveryOptions = {
        ...deliveryOptions,
        tipoEntrega: 'siguiente_dia',
        horaEntregaPreferida: tomorrowHours[0] || '11:00'
      };
      setDeliveryOptions(updatedOptions);
      
      const isValid = validateOptions(updatedOptions);
      onOptionsChange?.({ ...updatedOptions, isValid });
      return;
    }
    
    
    // Validar que la hora actual esté disponible
    if (!initialAvailableHours.includes(deliveryOptions.horaEntregaPreferida)) {
      const firstAvailable = initialAvailableHours[0] || '11:00';
      console.log('⏰ Inicialización: Ajustando hora no disponible:', deliveryOptions.horaEntregaPreferida, '→', firstAvailable);
      
      const updatedOptions: DeliveryOptions = {
        ...deliveryOptions,
        horaEntregaPreferida: firstAvailable
      };
      setDeliveryOptions(updatedOptions);
      
      const isValid = validateOptions(updatedOptions);
      onOptionsChange?.({ ...updatedOptions, isValid });
      return;
    }
    
    // Validación estándar si todo está correcto
    const isValid = validateOptions(deliveryOptions);
    onOptionsChange?.({ ...deliveryOptions, isValid });
  }, [deliveryOptions, manualDeliveryType, onOptionsChange, validateOptions]);

  // Efecto para limpiar timer de debounce en unmount
  useEffect(() => {
    return () => {
      // Limpiar timer de debounce si existe
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return (
    <Card className={`w-full ${className || 'border-gray-200 shadow-sm'}`}>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg font-semibold text-gray-900">
          <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
            <Truck className="h-4 w-4 text-indigo-600" />
          </div>
          {t('cart.delivery.title')}
        </CardTitle>
        {showAddressNote && (
          <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-700 flex items-center gap-1">
              <span>ℹ️</span>
              {t('cart.delivery.addressNote')}
            </p>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Selector de tipo de entrega */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Truck className="h-4 w-4 text-gray-500" />
            {t('cart.delivery.typeLabel')}
          </Label>
          
          <div className="space-y-3">
            {/* Opción Estándar */}
            <motion.div
              whileHover={!disabled ? { scale: 1.01 } : {}}
              whileTap={!disabled ? { scale: 0.99 } : {}}
            >
              <button
                type="button"
                className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                  manualDeliveryType === 'estandar'
                    ? 'border-green-500 bg-green-50 ring-2 ring-green-500 ring-opacity-20'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                } ${
                  disabled || isAfterTodayCutoff()
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'cursor-pointer'
                }`}
                onClick={() => {
                  const hasHoursToday = getAvailableHoursToday().length > 0;
                  
                  if (!disabled && hasHoursToday) {
                    handleDeliveryTypeChange('estandar');
                  }
                }}
                disabled={disabled || isAfterTodayCutoff()}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{t('cart.delivery.today.title')}</h4>
                        <p className="text-xs text-gray-600 mt-0.5">{t('cart.delivery.today.description')}</p>
                      </div>
                      {manualDeliveryType === 'estandar' && (
                        <div className="flex-shrink-0 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>

            {/* Opción Día Siguiente */}
            <motion.div
              whileHover={!disabled ? { scale: 1.01 } : {}}
              whileTap={!disabled ? { scale: 0.99 } : {}}
            >
              <button
                type="button"
                className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                  manualDeliveryType === 'siguiente_dia'
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-opacity-20'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={() => !disabled && handleDeliveryTypeChange('siguiente_dia')}
                disabled={disabled}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{t('cart.delivery.tomorrow.title')}</h4>
                        <p className="text-xs text-gray-600 mt-0.5">{t('cart.delivery.tomorrow.description')}</p>
                      </div>
                      {manualDeliveryType === 'siguiente_dia' && (
                        <div className="flex-shrink-0 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          </div>

          {/* Mensaje automático si es después de 7PM */}
          {shouldDefaultToNextDay() && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {t('cart.delivery.autoNextDay')}
              </p>
            </div>
          )}

          {/* Sugerencia del backend para mañana */}
          {backendSuggestsTomorrow && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-sm text-yellow-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {t('cart.delivery.alternativeHours.suggestTomorrow')}
                </p>
                <Button
                  size="sm"
                  onClick={handleAcceptTomorrowSuggestion}
                  className="ml-2 bg-yellow-600 hover:bg-yellow-700"
                >
                  {t('cart.delivery.alternativeHours.acceptTomorrow')}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Selector de hora simple */}
        <div className="space-y-2">
          <Label htmlFor="delivery-time" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Clock className="h-4 w-4 text-gray-500" />
            {t('cart.delivery.timeLabel')}
          </Label>

          <SimpleTimePicker
            value={deliveryOptions.horaEntregaPreferida}
            onChange={(value) => handleOptionChange('horaEntregaPreferida', value)}
            disabled={disabled}
            placeholder={t('cart.delivery.timePlaceholder')}
            error={!!errors.time}
            className="w-full"
            deliveryType={manualDeliveryType}
          />
          
          {errors.time && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <p className="text-sm text-red-600 flex items-center gap-1">
                <span className="text-red-500">⚠</span>
                {errors.time}
              </p>
              
              {/* Mostrar horarios alternativos si están disponibles */}
              {showAlternativeHours && availableHours.length > 0 && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm font-medium text-orange-700 mb-2">{t('cart.delivery.alternativeHours.title')}</p>
                  <div className="flex flex-wrap gap-2">
                    {availableHours.map((hour) => (
                      <Button
                        key={hour}
                        size="sm"
                        variant="outline"
                        onClick={() => handleAlternativeHourSelect(hour)}
                        className="text-xs bg-white hover:bg-orange-100 border-orange-300"
                      >
                        {formatTimeForDisplay(hour)}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
          <p className="text-xs text-gray-500">
            {t('cart.delivery.schedule')}
          </p>
        </div>

        {/* Selector de método de entrega */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Truck className="h-4 w-4 text-gray-500" />
            {t('cart.delivery.methodLabel')}
          </Label>
          
          <div className="grid gap-2 sm:gap-3">
            {deliveryMethods.map((method) => (
              <motion.div
                key={method.value}
                whileHover={!disabled ? { scale: 1.01 } : {}}
                whileTap={!disabled ? { scale: 0.99 } : {}}
              >
                <button
                  type="button"
                  className={`w-full p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    deliveryOptions.metodoEntrega === method.value
                      ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500 ring-opacity-20'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  onClick={() => !disabled && handleOptionChange('metodoEntrega', method.value)}
                  disabled={disabled}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                      {method.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 text-sm sm:text-base">{method.title}</h4>
                        {deliveryOptions.metodoEntrega === method.value && (
                          <div className="flex-shrink-0 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">{method.description}</p>
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
          
          {errors.method && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-600 flex items-center gap-1"
            >
              <span className="text-red-500">⚠</span>
              {errors.method}
            </motion.p>
          )}
          <p className="text-xs text-gray-500">
            {t('cart.delivery.methodHelper')}
          </p>
        </div>

        {/* Campo de notas */}
        <div className="space-y-2">
          <Label htmlFor="delivery-notes" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <MessageSquare className="h-4 w-4 text-gray-500" />
            {t('cart.delivery.notesLabel')}
          </Label>
          <Textarea
            id="delivery-notes"
            placeholder={t('cart.delivery.notesPlaceholder')}
            value={deliveryOptions.notasEntrega || ''}
            onChange={(e) => handleOptionChange('notasEntrega', e.target.value)}
            className={`min-h-20 resize-none ${errors.notes ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`}
            maxLength={500}
            disabled={disabled}
            autoComplete="off"
            spellCheck="false"
            data-gramm="false"
            data-gramm_editor="false"
            data-enable-grammarly="false"
          />
          {errors.notes && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-600 flex items-center gap-1"
            >
              <span className="text-red-500">⚠</span>
              {errors.notes}
            </motion.p>
          )}
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">
              {t('cart.delivery.notesHelper')}
            </p>
            <div className="flex items-center gap-2">
              {deliveryOptions.notasEntrega && deliveryOptions.notasEntrega !== (deliveryOptions.notasEntrega || '').replace(/[^\w\s\.\,\!\?\-\(\)\:]/g, '') && (
                <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                  {t('cart.summary.coupon.filteredContent')}
                </span>
              )}
              <span className={`text-xs ${
                (deliveryOptions.notasEntrega?.length || 0) > 450 
                  ? 'text-red-500' 
                  : (deliveryOptions.notasEntrega?.length || 0) > 400 
                    ? 'text-amber-500' 
                    : 'text-gray-400'
              }`}>
                {deliveryOptions.notasEntrega?.length || 0}/500
              </span>
            </div>
          </div>
        </div>

        {/* Botón para aplicar cambios - Solo mostrar si hay cambios pendientes (para notas principalmente) */}
        <AnimatePresence>
          {hasChanges && deliveryOptions.notasEntrega && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="pt-4 border-t border-gray-200"
            >
              <Button
                onClick={handleApplyChanges}
                disabled={isLoading || disabled || Object.keys(errors).length > 0}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 h-11 text-sm font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('common.loading')}...
                  </div>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    {t('common.save')} {t('cart.delivery.notesLabel')}
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Badge de estado */}
        {!hasChanges && !disabled && (
          <div className="flex justify-center pt-2">
            <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
              <Check className="h-3 w-3 mr-1" />
              {t('cart.delivery.success')}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
