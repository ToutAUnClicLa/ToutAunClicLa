"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Truck, MessageSquare, Check, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/ui/card';
import { Label } from '@/components/common/ui/label';
import { Textarea } from '@/components/common/ui/textarea';
import { Button } from '@/components/common/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { useCart } from '@/hooks/useCart';
import type { DeliveryOptions } from '@/lib/services/cart';

// Funciones de seguridad para sanitizar input
const sanitizeInput = (input: string): string => {
  if (!input) return '';

  // Eliminar caracteres potencialmente peligrosos pero manteniendo espacios y caracteres normales
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
    .replace(/`/g, '') // Eliminar backticks
    .replace(/\|\|/g, '') // Eliminar OR operators
    .replace(/&&/g, ''); // Eliminar AND operators

  // NO escapar caracteres HTML ya que esto interfiere con el input normal
  // Solo limitar a caracteres seguros (letras, números, espacios, puntuación básica, acentos)
  sanitized = sanitized.replace(/[^\w\s\.\,\!\?\-\(\)\:\;\'\"\áéíóúüñÁÉÍÓÚÜÑàèìòùÀÈÌÒÙâêîôûÂÊÎÔÛ]/g, '');

  // Truncar si es muy largo
  if (sanitized.length > 500) {
    sanitized = sanitized.substring(0, 500);
  }

  return sanitized;
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
    metodoEntrega: 'puerta',
    notasEntrega: '',
    aplicarATodos: true
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState<{
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
    } else {
      // Para método de entrega, validar y aplicar inmediatamente
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

  // Aplicar cambios al carrito
  const handleApplyChanges = async () => {
    if (!validateOptions(deliveryOptions)) {
      return;
    }

    console.log('💾 Aplicando opciones al backend:', deliveryOptions);

    setIsLoading(true);
    try {
      await updateDeliveryOptions(deliveryOptions);
      setHasChanges(false);
    } catch (error) {
      console.error('Error updating delivery options:', error);
      setErrors({ notes: t('cart.delivery.error') });
    } finally {
      setIsLoading(false);
    }
  };

  // Efecto para validar opciones iniciales
  useEffect(() => {
    const isValid = validateOptions(deliveryOptions);
    onOptionsChange?.({ ...deliveryOptions, isValid });
  }, [deliveryOptions, onOptionsChange, validateOptions]);

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
    <Card className={`w-full ${className || 'border-[var(--shop-hairline)] bg-white shadow-none'}`}>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-[var(--shop-ink)] sm:text-lg">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--shop-purple-wash)]">
            <Truck className="h-4 w-4 text-[var(--shop-purple)]" />
          </div>
          {t('cart.delivery.title')}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 sm:space-y-5">
        {showAddressNote && (
          <div className="rounded-xl border border-[var(--shop-hairline)] bg-[var(--shop-canvas-muted)] p-3">
            <p className="text-sm text-[var(--shop-ink)]">
              {t('cart.delivery.addressRequired')}
            </p>
          </div>
        )}

        <div className="rounded-xl border border-[var(--shop-hairline)] bg-white p-3">
          <p className="flex items-center gap-2 text-sm text-[var(--shop-muted)]">
            <Clock className="h-4 w-4 text-[var(--shop-purple)]" />
            {t('cart.delivery.estimatedTime')}
          </p>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium text-[var(--shop-ink)]">
            <Truck className="h-4 w-4 text-[var(--shop-muted)]" />
            {t('cart.delivery.methodLabel')}
          </Label>

          <div className="grid grid-cols-1 gap-2 sm:gap-3">
            {deliveryMethods.map((method) => (
              <motion.button
                key={method.value}
                whileHover={{ scale: disabled ? 1 : 1.01 }}
                whileTap={{ scale: disabled ? 1 : 0.98 }}
                type="button"
                className={`w-full rounded-xl border p-3 text-left sm:p-4 ${
                  deliveryOptions.metodoEntrega === method.value
                    ? 'border-[var(--shop-purple)] bg-[var(--shop-purple-wash)]'
                    : 'border-[var(--shop-hairline)] bg-white hover:bg-[var(--shop-canvas-muted)]'
                } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                onClick={() => !disabled && handleOptionChange('metodoEntrega', method.value)}
                disabled={disabled}
              >
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 text-xl sm:text-2xl">{method.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-medium text-[var(--shop-ink)] sm:text-base">{method.title}</h4>
                      </div>
                      {deliveryOptions.metodoEntrega === method.value && (
                        <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[var(--shop-purple)]">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="delivery-notes" className="flex items-center gap-2 text-sm font-medium text-[var(--shop-ink)]">
            <MessageSquare className="h-4 w-4 text-[var(--shop-muted)]" />
            {t('cart.delivery.notesLabel')}
            <span className="text-xs text-[var(--shop-muted)]">({t('cart.delivery.notesOptional')})</span>
          </Label>

          <div className="relative">
            <Textarea
              id="delivery-notes"
              value={deliveryOptions.notasEntrega || ''}
              onChange={(e) => handleOptionChange('notasEntrega', e.target.value)}
              placeholder={t('cart.delivery.notesPlaceholder')}
              className={`min-h-[60px] sm:min-h-[80px] resize-none text-sm ${
                errors.notes ? 'border-red-500' : ''
              }`}
              disabled={disabled}
              maxLength={500}
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {(deliveryOptions.notasEntrega || '').length}/500
            </div>
          </div>

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
        </div>

        {/* Botón de aplicar cambios (solo para notas) */}
        {hasChanges && (
          <div className="pt-2">
            <Button
              onClick={handleApplyChanges}
              disabled={disabled || isLoading || Object.keys(errors).length > 0}
              className="inline-flex h-11 min-h-11 w-full items-center justify-center rounded-full bg-[var(--shop-purple)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--shop-purple-hover)]"
            >
              {isLoading ? t('cart.delivery.applying') : t('cart.delivery.apply')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}