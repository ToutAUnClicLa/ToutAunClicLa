"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Truck, MessageSquare, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/ui/card';
import { Label } from '@/components/common/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/common/ui/select';
import { Textarea } from '@/components/common/ui/textarea';
import { Button } from '@/components/common/ui/button';
import { Badge } from '@/components/common/ui/badge';
import { useTranslation } from '@/hooks/useTranslation';
import { useCart } from '@/hooks/useCart';
import type { DeliveryOptions } from '@/lib/services/cart';

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
  
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOptions>({
    horaEntregaPreferida: '18:00',
    metodoEntrega: 'puerta',
    notasEntrega: '',
    aplicarATodos: true
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState<{
    time?: string;
    method?: string;
    notes?: string;
  }>({});
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // Generar opciones de tiempo (11:00 AM - 9:00 PM) con validación de tiempo actual + 1 hora
  const generateTimeOptions = () => {
    const options = [];
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Calcular la hora mínima (hora actual + 1 hora)
    const minDeliveryTime = new Date(now.getTime() + 60 * 60 * 1000); // +1 hora
    const minHour = minDeliveryTime.getHours();
    const minMinute = minDeliveryTime.getMinutes();
    
    for (let hour = 11; hour <= 21; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        // No generar horarios después de 21:00 (9:00 PM)
        if (hour === 21 && minute > 0) {
          break;
        }
        
        // Verificar si esta hora está disponible (al menos 1 hora después de ahora)
        const isAvailable = hour > minHour || (hour === minHour && minute >= minMinute);
        
        // Solo agregar opciones disponibles
        if (isAvailable) {
          const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          
          // Formatear la hora para mostrar
          let displayTime;
          if (hour === 12) {
            displayTime = `12:${minute.toString().padStart(2, '0')} PM`;
          } else if (hour > 12) {
            displayTime = `${(hour - 12).toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} PM`;
          } else {
            displayTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} AM`;
          }
          
          options.push({ value: timeStr, label: displayTime });
        }
      }
    }
    return options;
  };

  const [timeOptions, setTimeOptions] = useState(generateTimeOptions());

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
  const validateOptions = (options: DeliveryOptions) => {
    const newErrors: typeof errors = {};
    
    if (!options.horaEntregaPreferida) {
      newErrors.time = t('cart.delivery.validation.timeRequired');
    } else {
      // Validar formato de hora
      if (!/^\d{2}:\d{2}$/.test(options.horaEntregaPreferida)) {
        newErrors.time = t('cart.delivery.validation.timeInvalid');
      } else {
        const [hours, minutes] = options.horaEntregaPreferida.split(':').map(Number);
        
        // Validar que los números sean válidos
        if (isNaN(hours) || isNaN(minutes)) {
          newErrors.time = t('cart.delivery.validation.timeInvalid');
        } else if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
          newErrors.time = t('cart.delivery.validation.timeInvalid');
        } else if (hours < 11 || hours > 21 || (hours === 21 && minutes > 0)) {
          // Verificar que esté en el rango de horarios de servicio (11:00 AM - 9:00 PM exacto)
          newErrors.time = t('cart.delivery.validation.timeInvalid');
        } else {
          // Verificar que sea al menos 1 hora después de ahora
          const now = new Date();
          const selectedTime = new Date();
          selectedTime.setHours(hours, minutes, 0, 0);
          
          // Si el tiempo seleccionado es para hoy y es menor que ahora + 1 hora
          const minDeliveryTime = new Date(now.getTime() + 60 * 60 * 1000); // +1 hora
          
          if (selectedTime <= minDeliveryTime) {
            const minHour = minDeliveryTime.getHours();
            const minMinute = minDeliveryTime.getMinutes();
            const minTimeFormatted = `${minHour > 12 ? minHour - 12 : minHour}:${minMinute.toString().padStart(2, '0')} ${minHour >= 12 ? 'PM' : 'AM'}`;
            newErrors.time = t('cart.delivery.validation.timeTooEarly', { time: minTimeFormatted });
          }
        }
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
  };

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
    } else {
      // Para otros campos, validar inmediatamente
      const newOptions = { ...deliveryOptions, [field]: sanitizedValue };
      setDeliveryOptions(newOptions);
      setHasChanges(true);
      
      const isValid = validateOptions(newOptions);
      onOptionsChange?.({ ...newOptions, isValid });
    }
  };

  // Aplicar cambios al carrito
  const handleApplyChanges = async () => {
    if (!validateOptions(deliveryOptions)) {
      return;
    }

    setIsLoading(true);
    try {
      await updateDeliveryOptions(deliveryOptions);
      setHasChanges(false);
    } catch (error) {
      console.error('Error updating delivery options:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Efecto para validar opciones iniciales
  useEffect(() => {
    const isValid = validateOptions(deliveryOptions);
    onOptionsChange?.({ ...deliveryOptions, isValid });
  }, []);

  // Efecto para actualizar opciones de tiempo cada minuto
  useEffect(() => {
    const updateTimeOptions = () => {
      const newTimeOptions = generateTimeOptions();
      setTimeOptions(newTimeOptions);
      
      // Si la hora actualmente seleccionada ya no está disponible, resetear
      const currentSelectedTime = deliveryOptions.horaEntregaPreferida;
      const isCurrentTimeStillAvailable = newTimeOptions.some(option => option.value === currentSelectedTime);
      
      if (!isCurrentTimeStillAvailable && newTimeOptions.length > 0) {
        const newDeliveryOptions = { ...deliveryOptions, horaEntregaPreferida: newTimeOptions[0].value };
        setDeliveryOptions(newDeliveryOptions);
        setHasChanges(true);
        const isValid = validateOptions(newDeliveryOptions);
        onOptionsChange?.({ ...newDeliveryOptions, isValid });
      }
    };

    const interval = setInterval(updateTimeOptions, 60000); // Actualizar cada minuto
    
    return () => {
      clearInterval(interval);
      // Limpiar timer de debounce si existe
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [deliveryOptions, onOptionsChange, debounceTimer]);

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
        {/* Selector de hora */}
        <div className="space-y-2">
          <Label htmlFor="delivery-time" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Clock className="h-4 w-4 text-gray-500" />
            {t('cart.delivery.timeLabel')}
          </Label>
          <Select
            value={deliveryOptions.horaEntregaPreferida}
            onValueChange={(value) => handleOptionChange('horaEntregaPreferida', value)}
            disabled={disabled}
          >
            <SelectTrigger className={`w-full h-11 ${errors.time ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`}>
              <SelectValue placeholder={t('cart.delivery.timePlaceholder')} />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {timeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="py-2">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.time && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-600 flex items-center gap-1"
            >
              <span className="text-red-500">⚠</span>
              {errors.time}
            </motion.p>
          )}
          <p className="text-xs text-gray-500">
            {t('cart.delivery.timeHelper')}
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
                  ⚠ Contenido filtrado
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

        {/* Botón para aplicar cambios (solo si hay cambios) */}
        <AnimatePresence>
          {hasChanges && (
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
                    {t('common.save')} {t('cart.delivery.title')}
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
