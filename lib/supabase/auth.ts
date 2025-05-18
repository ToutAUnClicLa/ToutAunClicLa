import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { toast } from 'sonner';
import crypto from 'crypto';
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail } from '@/lib/email/resend';

export const supabase = createClientComponentClient<Database>();

export type SignInParams = {
  email: string;
  password: string;
};

export type SignUpParams = {
  email: string;
  password: string;
  nombre: string;
  telefono?: string;
};

export type UsuarioData = {
  id: string;
  nombre: string;
  correo_electronico: string;
  telefono?: string;
  url_avatar?: string;
  verificado: boolean;
  autenticacion_social: boolean;
  fecha_creacion: string;
};

/**
 * Iniciar sesión con email y contraseña
 */
export async function signInWithEmail({ email, password }: SignInParams) {
  // 1. Iniciar sesión en Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) throw authError;

  // 2. Obtener datos del usuario desde nuestra tabla personalizada
  const { data: usuario, error: userError } = await supabase
    .from('usuarios')
    .select('*')
    .eq('correo_electronico', email)
    .single();

  if (userError) {
    console.error('Error al obtener datos del usuario:', userError);
    // No lanzamos error aquí porque el usuario ya se autenticó correctamente
  }

  return { auth: authData, usuario };
}

/**
 * Comprobar si un correo electrónico ya está registrado
 */
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    // Verificamos en nuestra tabla personalizada
    const { count, error } = await supabase
      .from('usuarios')
      .select('*', { count: 'exact', head: true })
      .eq('correo_electronico', email);

    if (error) {
      console.error('Error al verificar email en tabla usuarios:', error);
      // Si hay un error específico, probablemente sea un problema de RLS
      if (error.code === '42501') {
        // En producción deberías manejar esto mejor
        console.warn('Error de permisos al verificar email. Considera ajustar las políticas RLS.');
      }
    }

    return count ? count > 0 : false;
  } catch (error) {
    console.error('Error al verificar si email existe:', error);
    // En caso de error, asumimos que no existe para evitar bloquear el registro
    return false;
  }
}

/**
 * Genera un token para verificación de email
 */
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Registrarse con email y contraseña
 */
export async function signUpWithEmail({ email, password, nombre, telefono }: SignUpParams) {
  try {
    // Llamar a nuestra API de registro personalizada en lugar de Supabase directamente
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        nombre,
        telefono,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al crear la cuenta');
    }

    // Aunque el usuario ya está creado, no estará verificado todavía
    // Mostramos el mensaje de éxito con instrucciones para verificar
    toast.success('Cuenta creada correctamente. Revisa tu email para verificar tu cuenta.');

    // No iniciamos sesión automáticamente para esperar la verificación
    return { success: true, email };
  } catch (error: any) {
    console.error('Error en signUpWithEmail:', error);
    throw error;
  }
}

/**
 * Iniciar sesión con Google
 */
export async function signInWithGoogle() {
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
}

/**
 * Verificar un token de email
 */
export async function verifyEmailToken(token: string): Promise<{ success: boolean; userId?: string; error?: string }> {
  try {
    // Llamar a nuestra API de verificación
    const response = await fetch(`/api/auth/verify-email?token=${token}`);
    const data = await response.json();
    
    if (!response.ok) {
      return { 
        success: false, 
        error: data.error || 'Token no válido o expirado' 
      };
    }
    
    return { 
      success: true,
      userId: data.userId
    };
  } catch (error: any) {
    console.error('Error al verificar token:', error);
    return { 
      success: false,
      error: error.message || 'Error al verificar el token' 
    };
  }
}

/**
 * Reenviar email de verificación
 */
export async function resendVerificationEmail(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Llamar a nuestra API de reenvío de verificación
    const response = await fetch('/api/auth/resend-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { 
        success: false,
        error: data.error || 'Error al reenviar email de verificación'
      };
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Error al reenviar email de verificación:', error);
    return { 
      success: false,
      error: error.message || 'Error al reenviar email de verificación'
    };
  }
}

/**
 * Obtener el usuario actual autenticado y sus datos
 */
export async function getCurrentUser(): Promise<{ auth: any, usuario: UsuarioData | null }> {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return { auth: null, usuario: null };
  }

  // Obtener datos de nuestra tabla personalizada
  const { data: usuario, error: userError } = await supabase
    .from('usuarios')
    .select('*')
    .eq('correo_electronico', user.email)
    .single();

  if (userError) {
    console.error('Error al obtener datos del usuario:', userError);
    return { auth: user, usuario: null };
  }

  return { auth: user, usuario: usuario as UsuarioData };
}

/**
 * Actualizar el perfil del usuario
 */
export async function updateUserProfile(userId: string, data: Partial<UsuarioData>) {
  const { error } = await supabase
    .from('usuarios')
    .update({
      ...data,
      fecha_actualizacion: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) throw error;

  // También actualizamos los metadatos en Auth si es necesario
  if (data.nombre) {
    await supabase.auth.updateUser({
      data: { nombre: data.nombre }
    });
  }

  return { success: true };
}

/**
 * Solicitar restablecimiento de contraseña
 */
export async function resetPassword(email: string) {
  try {
    // 1. Verificar que el usuario existe
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('id, nombre')
      .eq('correo_electronico', email)
      .single();
    
    if (userError) {
      if (userError.code === 'PGRST116') {
        // Usuario no encontrado, pero no lo informamos por seguridad
        return { success: true };
      }
      throw userError;
    }
    
    // 2. Generar token
    const token = generateVerificationToken();
    
    // 3. Calcular fecha de expiración (24 horas)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    
    // 4. Eliminar tokens de recuperación anteriores
    await supabase
      .from('tokens_recuperacion')
      .delete()
      .eq('usuario_id', userData.id);
    
    // 5. Guardar nuevo token
    const { error: tokenError } = await supabase
      .from('tokens_recuperacion')
      .insert([
        {
          usuario_id: userData.id,
          token,
          expires_at: expiresAt.toISOString(),
        }
      ]);
    
    if (tokenError) {
      console.error('Error al crear token de recuperación:', tokenError);
      throw new Error('Error al crear token de recuperación');
    }
    
    // 6. Enviar email con el enlace
    try {
      await sendPasswordResetEmail({
        email,
        token,
        nombre: userData.nombre,
      });
    } catch (emailError) {
      console.error('Error al enviar email de recuperación:', emailError);
      throw new Error('Error al enviar email de recuperación');
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Error en resetPassword:', error);
    // Por seguridad, no revelamos el motivo del error
    return { success: true };
  }
}

/**
 * Actualizar contraseña
 */
export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  
  if (error) throw error;
  
  return { success: true };
}

/**
 * Verificar correo electrónico
 */
export async function verifyEmail(userId: string) {
  const { error } = await supabase
    .from('usuarios')
    .update({ 
      verificado: true,
      fecha_actualizacion: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) throw error;

  return { success: true };
}

/**
 * Cerrar sesión
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return { success: true };
}

/**
 * Manejar el callback de autenticación social
 * Esta función debe ser llamada en la página de callback después de la autenticación social
 */
export async function handleAuthCallback() {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return { success: false, error: 'No se encontró sesión' };
  }

  const user = session.user;

  // Verificar si el usuario ya existe en nuestra tabla personalizada
  const { data: existingUser } = await supabase
    .from('usuarios')
    .select('id')
    .eq('correo_electronico', user.email)
    .single();

  // Si no existe, crear un nuevo perfil
  if (!existingUser) {
    const { error } = await supabase
      .from('usuarios')
      .insert([
        {
          correo_electronico: user.email,
          contrasena_hash: 'autenticacion_social',
          nombre: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
          url_avatar: user.user_metadata?.avatar_url,
          verificado: true, // Con social auth consideramos que está verificado
          autenticacion_social: true,
          fecha_creacion: new Date().toISOString(),
          fecha_actualizacion: new Date().toISOString(),
        },
      ]);

    if (error) {
      console.error('Error al crear perfil después de autenticación social:', error);
      return { success: false, error: error.message };
    }
  }

  return { success: true, user };
}