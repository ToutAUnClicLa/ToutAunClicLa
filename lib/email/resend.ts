import { Resend } from 'resend';

// Solo exportamos interfaces para tipar las funciones
// No inicializamos Resend en el cliente directamente

// Interfaz para emails de verificación
export interface VerificationEmailProps {
  email: string;
  token: string;
  nombre?: string;
}
   
// Interfaz para emails de bienvenida
export interface WelcomeEmailProps {
  email: string;
  nombre?: string;
}

// Interfaz para emails de restablecimiento de contraseña
export interface PasswordResetEmailProps {
  email: string;
  token: string;
  nombre?: string;
}

// Las funciones de envío ahora se implementan en las API routes
// Estas funciones son wrappers que llaman a las API routes

/**
 * Envía un email de verificación al usuario
 * Esta función llama a la API route correspondiente
 */
export async function sendVerificationEmail(params: VerificationEmailProps): Promise<{success: boolean; data?: any}> {
  try {
    const response = await fetch('/api/email/verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Error al enviar email de verificación');
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error al enviar email de verificación:', error);
    throw error;
  }
}

/**
 * Envía un email de bienvenida al usuario
 * Esta función llama a la API route correspondiente
 */
export async function sendWelcomeEmail(params: WelcomeEmailProps): Promise<{success: boolean; data?: any}> {
  try {
    const response = await fetch('/api/email/welcome', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Error al enviar email de bienvenida');
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error al enviar email de bienvenida:', error);
    throw error;
  }
}

/**
 * Envía un email de restablecimiento de contraseña
 * Esta función llama a la API route correspondiente
 */
export async function sendPasswordResetEmail(params: PasswordResetEmailProps): Promise<{success: boolean; data?: any}> {
  try {
    const response = await fetch('/api/email/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Error al enviar email de restablecimiento');
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error al enviar email de restablecimiento:', error);
    throw error;
  }
} 