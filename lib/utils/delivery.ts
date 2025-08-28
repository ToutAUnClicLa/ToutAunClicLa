import type { DeliveryInfo } from '@/lib/services/cart';

// Helper function to get available delivery hours for today (copied from backend)
export const getAvailableHoursToday = (): string[] => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  // Horarios de entrega: 11:00 AM - 9:00 PM (última entrega)
  // Debe pedirse 1 hora antes, so último pedido para hoy es a las 8:00 PM
  const deliveryStartHour = 11; // 11:00 AM
  const deliveryEndHour = 21; // 9:00 PM (última entrega)
  const orderCutoffHour = 20; // 8:00 PM (última orden para hoy)
  
  // Si ya pasó las 8:00 PM, no hay horarios disponibles para hoy
  if (currentHour >= orderCutoffHour) {
    return [];
  }
  
  // Calcular primera hora disponible (1 hora después de ahora)
  let startHour = currentHour + 1;
  let startMinute = currentMinute;
  
  // Si los minutos hacen que se pase a la siguiente hora
  if (startMinute > 0) {
    startHour += 1;
    startMinute = 0;
  }
  
  // Asegurar que esté dentro del rango de entrega
  startHour = Math.max(startHour, deliveryStartHour);
  
  // Si la hora de inicio es después de las 9:00 PM, no hay horas disponibles
  if (startHour > deliveryEndHour) {
    return [];
  }
  
  // Generar horarios disponibles
  const availableHours = [];
  for (let hour = startHour; hour <= deliveryEndHour; hour++) {
    availableHours.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < deliveryEndHour) {
      availableHours.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }
  
  return availableHours;
};

// Helper function to get available delivery hours for tomorrow (copied from backend)
export const getAvailableHoursTomorrow = (): string[] => {
  // Mañana está disponible desde 11:00 AM hasta 9:00 PM
  const availableHours = [];
  for (let hour = 11; hour <= 21; hour++) {
    availableHours.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < 21) {
      availableHours.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }
  return availableHours;
};

// Helper function to validate delivery time and type (copied from backend)
export const validateDeliveryTimeAndType = (preferredTime: string, deliveryType: 'estandar' | 'siguiente_dia') => {
  const now = new Date();
  const currentHour = now.getHours();
  
  // Validar formato de hora
  if (!/^([0-9]{1,2}):[0-5][0-9]$/.test(preferredTime)) {
    return {
      valid: false,
      error: 'Invalid time format. Use HH:MM',
      availableHours: []
    };
  }
  
  const [prefHour, prefMinute] = preferredTime.split(':').map(Number);
  
  // Validar que la hora esté en el rango general (11:00 AM - 9:00 PM)
  if (prefHour < 11 || prefHour > 21) {
    return {
      valid: false,
      error: 'Delivery hours are 11:00 AM - 9:00 PM',
      availableHours: []
    };
  }
  
  if (deliveryType === 'estandar') {
    const availableHours = getAvailableHoursToday();
    
    // Si no hay horas disponibles para hoy
    if (availableHours.length === 0) {
      return {
        valid: false,
        error: 'No delivery slots available today. Orders must be placed 1 hour before delivery and last delivery is at 9:00 PM.',
        availableHours: [],
        suggestTomorrow: true
      };
    }
    
    // Verificar si la hora preferida está disponible
    if (!availableHours.includes(preferredTime)) {
      return {
        valid: false,
        error: `Time ${preferredTime} not available today. Next available slot is 1 hour from now.`,
        availableHours: availableHours
      };
    }
    
    return {
      valid: true,
      type: 'estandar',
      availableHours: availableHours
    };
  }
  
  if (deliveryType === 'siguiente_dia') {
    const availableHours = getAvailableHoursTomorrow();
    
    // Para mañana, cualquier hora en el rango es válida
    if (!availableHours.includes(preferredTime)) {
      return {
        valid: false,
        error: `Time ${preferredTime} not available. Available hours: 11:00 AM - 9:00 PM`,
        availableHours: availableHours
      };
    }
    
    return {
      valid: true,
      type: 'siguiente_dia',
      availableHours: availableHours
    };
  }
  
  // Tipo de entrega inválido
  return {
    valid: false,
    error: 'Invalid delivery type. Use "hoy" or "siguiente_dia"',
    availableHours: []
  };
};

/**
 * Calcula el tipo de entrega basado en el sistema inteligente del backend
 * Reglas exactas del backend:
 * - Si hora actual >= 8:00 PM (20:00) Montreal → siguiente_dia
 * - Si hora preferida > 9:00 PM (21:00) → siguiente_dia  
 * - Caso contrario → estandar
 */
export function calculateDeliveryType(preferredTime?: string): 'estandar' | 'siguiente_dia' {
  const now = new Date();
  const currentHour = now.getHours();
  
  // Regla 1: Si son más de las 8:00 PM (20:00), automáticamente día siguiente
  if (currentHour >= 20) {
    return 'siguiente_dia';
  }
  
  // Regla 2: Si la hora preferida es después de las 9:00 PM (21:00), día siguiente
  if (preferredTime) {
    const [hours, minutes] = preferredTime.split(':').map(Number);
    if (hours > 21) {
      return 'siguiente_dia';
    }
  }
  
  // Por defecto: entrega estándar (mismo día)
  return 'estandar';
}

/**
 * Determina si debe mostrarse día siguiente por defecto (después de 7PM)
 * Coincide exactamente con la lógica del backend
 */
export function shouldDefaultToNextDay(): boolean {
  const now = new Date();
  return now.getHours() >= 20; // 8:00 PM
}

/**
 * Determina si es después del corte de hoy (7PM) y no hay horarios disponibles
 */
export function isAfterTodayCutoff(): boolean {
  return getAvailableHoursToday().length === 0;
}

/**
 * Obtiene la información de entrega basada en el tipo
 */
export function getDeliveryInfo(type: 'estandar' | 'siguiente_dia'): DeliveryInfo {
  switch (type) {
    case 'siguiente_dia':
      return {
        type: 'siguiente_dia',
        description: 'Entrega para mañana'
      };
    case 'estandar':
    default:
      return {
        type: 'estandar',  
        description: 'Entrega estándar (mismo día con 1 hora mínima)'
      };
  }
}

/**
 * Calcula la hora mínima de entrega (hora actual + 1 hora)
 * Limitado al horario de servicio (11:00 AM - 8:00 PM)
 */
export function getMinimumDeliveryTime(): string {
  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
  let hours = oneHourLater.getHours();
  let minutes = oneHourLater.getMinutes();
  
  // Si es antes de 11:00 AM, establecer a 11:00 AM
  if (hours < 11) {
    hours = 11;
    minutes = 0;
  }
  // Si es después de 9:00 PM, será día siguiente (pero devolver 11:00 AM como default)
  else if (hours > 21 || (hours === 21 && minutes > 0)) {
    hours = 11;
    minutes = 0;
  }
  
  // Redondear a múltiplos de 30 minutos para facilitar selección
  if (minutes < 15) {
    minutes = 0;
  } else if (minutes < 45) {
    minutes = 30;
  } else {
    minutes = 0;
    hours += 1;
    // Verificar que no exceda las 9:00 PM
    if (hours > 21) {
      hours = 11; // Pasar al día siguiente
    }
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Valida que la hora esté en el rango permitido (11:00 AM - 9:00 PM)
 */
export function isValidDeliveryTime(time: string): boolean {
  if (!time || !time.includes(':')) return false;
  
  const [hoursStr, minutesStr] = time.split(':');
  const hours = parseInt(hoursStr);
  const minutes = parseInt(minutesStr);
  
  if (isNaN(hours) || isNaN(minutes)) return false;
  if (minutes < 0 || minutes > 59) return false;
  
  // Horario de servicio: 11:00 AM (11:00) - 9:00 PM (21:00)
  if (hours < 11 || hours > 21) return false;
  if (hours === 21 && minutes > 0) return false; // No permitir después de 21:00
  
  return true;
}

/**
 * Verifica si la hora seleccionada requiere entrega al día siguiente
 */
export function requiresNextDayDelivery(preferredTime: string): boolean {
  return calculateDeliveryType(preferredTime) === 'siguiente_dia';
}

/**
 * Formatea la hora para mostrar en UI (formato 12 horas con AM/PM)
 */
export function formatTimeForDisplay(time: string): string {
  if (!time || !time.includes(':')) return '';
  
  const [hoursStr, minutesStr] = time.split(':');
  const hours = parseInt(hoursStr);
  const minutes = parseInt(minutesStr);
  
  if (isNaN(hours) || isNaN(minutes)) return '';
  
  let displayHour = hours;
  let period = 'AM';
  
  if (hours === 0) {
    displayHour = 12;
    period = 'AM';
  } else if (hours === 12) {
    displayHour = 12;
    period = 'PM';
  } else if (hours > 12) {
    displayHour = hours - 12;
    period = 'PM';
  }
  
  return `${displayHour}:${minutesStr} ${period}`;
}