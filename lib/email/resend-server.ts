import { Resend } from 'resend';

// Importar las interfaces desde el archivo de cliente
import { 
  VerificationEmailProps, 
  WelcomeEmailProps, 
  PasswordResetEmailProps 
} from './resend';

// Verificar que la API key existe en el servidor
if (!process.env.RESEND_API_KEY) {
  throw new Error('La variable de entorno RESEND_API_KEY no está configurada');
}

// Inicializar cliente de Resend solo para uso en servidor
export const resendServer = new Resend(process.env.RESEND_API_KEY);

// Configuración general de emails
const EMAIL_FROM = process.env.EMAIL_FROM || 'no-reply@toutaunclicla.com';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ;

/**
 * Envía un email de verificación al usuario (servidor)
 */
export async function sendVerificationEmailServer({ email, token, nombre }: VerificationEmailProps) {
  const verificationUrl = `${SITE_URL}/auth/verify-email?token=${token}`;
  
  try {
    const { data, error } = await resendServer.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: 'Verifica tu correo electrónico - Tout A Un Clic La',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${SITE_URL}/logoaunclic.svg" alt="Logo" style="width: 100px;">
          </div>
          <h1 style="color: #4F46E5; text-align: center; margin-bottom: 30px;">Verifica tu correo electrónico</h1>
          <p>Hola ${nombre || ''},</p>
          <p>Gracias por registrarte en Tout A Un Clic La. Para completar tu registro, por favor verifica tu correo electrónico haciendo clic en el botón de abajo:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verificar correo electrónico</a>
          </div>
          <p>O puedes copiar y pegar el siguiente enlace en tu navegador:</p>
          <p style="word-break: break-all; color: #4F46E5;">${verificationUrl}</p>
          <p>Este enlace expirará en 24 horas por seguridad.</p>
          <p>Si no has solicitado esta verificación, puedes ignorar este correo.</p>
          <div style="border-top: 1px solid #ddd; margin-top: 30px; padding-top: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Tout A Un Clic La. Todos los derechos reservados.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Error al enviar email de verificación:', error);
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error al enviar email de verificación:', error);
    throw error;
  }
}

/**
 * Envía un email de bienvenida al usuario después de verificar su cuenta (servidor)
 */
export async function sendWelcomeEmailServer({ email, nombre }: WelcomeEmailProps) {
  try {
    const { data, error } = await resendServer.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: '¡Bienvenido a Tout A Un Clic La!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${SITE_URL}/logoaunclic.svg" alt="Logo" style="width: 100px;">
          </div>
          <h1 style="color: #4F46E5; text-align: center; margin-bottom: 30px;">¡Bienvenido a Tout A Un Clic La!</h1>
          <p>Hola ${nombre || ''},</p>
          <p>¡Tu cuenta ha sido verificada con éxito! Ahora puedes comenzar a explorar y comprar en nuestra plataforma.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${SITE_URL}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Visitar la página</a>
          </div>
          <p>Gracias por unirte a nuestra comunidad.</p>
          <div style="border-top: 1px solid #ddd; margin-top: 30px; padding-top: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Tout A Un Clic La. Todos los derechos reservados.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Error al enviar email de bienvenida:', error);
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error al enviar email de bienvenida:', error);
    throw error;
  }
}

/**
 * Envía un email para restablecer la contraseña (servidor)
 */
export async function sendPasswordResetEmailServer({ email, token, nombre }: PasswordResetEmailProps) {
  const resetUrl = `${SITE_URL}/reset-password?token=${token}`;
  
  try {
    const { data, error } = await resendServer.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: 'Restablecimiento de contraseña - Tout A Un Clic La',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${SITE_URL}/logoaunclic.svg" alt="Logo" style="width: 100px;">
          </div>
          <h1 style="color: #4F46E5; text-align: center; margin-bottom: 30px;">Restablecimiento de contraseña</h1>
          <p>Hola ${nombre || ''},</p>
          <p>Has solicitado restablecer tu contraseña. Haz clic en el botón de abajo para crear una nueva contraseña:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Restablecer contraseña</a>
          </div>
          <p>O puedes copiar y pegar el siguiente enlace en tu navegador:</p>
          <p style="word-break: break-all; color: #4F46E5;">${resetUrl}</p>
          <p>Este enlace expirará en 24 horas por seguridad.</p>
          <p>Si no has solicitado este cambio, por favor ignora este correo o contáctanos si tienes alguna pregunta.</p>
          <div style="border-top: 1px solid #ddd; margin-top: 30px; padding-top: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Tout A Un Clic La. Todos los derechos reservados.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Error al enviar email de restablecimiento:', error);
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error al enviar email de restablecimiento:', error);
    throw error;
  }
} 