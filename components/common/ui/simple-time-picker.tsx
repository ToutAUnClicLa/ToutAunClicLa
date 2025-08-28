"use client";

import React, { useState } from 'react';
import { Button } from '@/components/common/ui/button';
import { Card } from '@/components/common/ui/card';
import { Clock } from 'lucide-react';

interface SimpleTimePickerProps {
  value?: string; // "HH:MM" format
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  error?: boolean;
  deliveryType?: 'estandar' | 'siguiente_dia'; // Para determinar si validar horas pasadas
}

export function SimpleTimePicker({ 
  value = "", 
  onChange,
  disabled = false,
  className = "",
  placeholder = "Seleccionar hora",
  error = false,
  deliveryType = 'estandar'
}: SimpleTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Generar opciones de tiempo (11:00 AM - 8:00 PM) en intervalos de 30 minutos
  const generateTimeOptions = () => {
    const options = [];
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Calcular hora mínima para entrega del mismo día (hora actual + 1 hora)
    const minDeliveryTime = new Date(now.getTime() + 60 * 60 * 1000);
    const minHour = minDeliveryTime.getHours();
    const minMinute = minDeliveryTime.getMinutes();
    
    // Desde 11:00 AM hasta 9:00 PM
    for (let hour = 11; hour <= 21; hour++) {
      for (let minute of [0, 30]) {
        // No agregar 9:30 PM, solo hasta 9:00 PM
        if (hour === 21 && minute > 0) break;
        
        const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // Formatear para mostrar (12 horas)
        let displayHour = hour;
        let period = hour >= 12 ? 'PM' : 'AM';
        
        if (hour === 0) {
          displayHour = 12;
        } else if (hour > 12) {
          displayHour = hour - 12;
        } else if (hour === 11) {
          period = 'AM';
        }
        
        const displayTime = `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
        
        // Determinar si está disponible
        let isAvailable = true;
        let isPassed = false;
        
        if (deliveryType === 'estandar') {
          // Para entrega del mismo día, validar que sea al menos 1 hora después
          const timeInMinutes = hour * 60 + minute;
          const minTimeInMinutes = minHour * 60 + minMinute;
          
          if (timeInMinutes < minTimeInMinutes) {
            isAvailable = false;
            isPassed = true;
          }
        }
        // Para día siguiente, todas las horas están disponibles
        
        options.push({
          value: time24,
          label: displayTime,
          hour: displayHour,
          minute: minute,
          period: period,
          isAvailable: isAvailable,
          isPassed: isPassed
        });
      }
    }
    
    return options;
  };

  const timeOptions = generateTimeOptions();

  const formatDisplayTime = () => {
    if (!value) return placeholder;
    
    const option = timeOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  const handleTimeSelect = (timeValue: string, isAvailable: boolean) => {
    if (!isAvailable) return; // No permitir selección de horas no disponibles
    onChange?.(timeValue);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Button trigger */}
      <Button
        type="button"
        variant="outline"
        className={`
          w-full justify-start text-left font-normal h-11 px-3
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}
          ${className}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <Clock className="h-4 w-4 mr-2 text-gray-500" />
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {formatDisplayTime()}
        </span>
      </Button>

      {/* Dropdown menu */}
      {isOpen && !disabled && (
        <Card className="absolute z-50 mt-2 w-full max-h-64 overflow-y-auto shadow-lg border border-gray-200">
          <div className="p-2">
            <div className="text-sm font-medium text-gray-700 mb-2 px-2">
              Selecciona una hora
            </div>
            <div className="grid grid-cols-2 gap-1">
              {timeOptions.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant={value === option.value ? "default" : "ghost"}
                  size="sm"
                  disabled={!option.isAvailable}
                  className={`
                    justify-start h-9 px-3 text-sm relative
                    ${!option.isAvailable 
                      ? 'opacity-40 cursor-not-allowed line-through text-gray-400' 
                      : value === option.value 
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                        : 'hover:bg-gray-100 text-gray-700'
                    }
                  `}
                  onClick={() => handleTimeSelect(option.value, option.isAvailable)}
                >
                  {option.label}
                  {option.isPassed && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-0.5 bg-red-400 opacity-60"></div>
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Overlay to close when clicking outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}