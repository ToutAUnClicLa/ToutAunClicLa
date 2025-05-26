import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { toast } from 'sonner';
import crypto from 'crypto';
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail } from '@/lib/email/resend';
import { supabase, authOptions } from '@/lib/supabase/client';

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
  try {
    // Llamar a nuestra API de login segura
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.blocked) {
        throw new Error('Cuenta bloqueada por múltiples intentos fallidos. Contacta al soporte.');
      }
      if (data.needsVerification) {
        throw new Error('Tu cuenta requiere verificación. Revisa tu correo electrónico.');
      }
      throw new Error(data.error || 'Error al iniciar sesión');
    }

    // El login fue exitoso, la sesión ya está establecida por la API
    return { success: true, user: data.user };
  } catch (error: any) {
    console.error('Error en signInWithEmail:', error);
    throw error;
  }
}

/**
 * Comprobar si un correo electrónico ya está registrado
 */
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    // Verificamos en nuestra tabla personalizada
    const { data, error } = await supabase
      .from('usuarios')
      .select('id')
      .eq('correo_electronico', email);

    if (error) {
      console.error('Error al verificar email en tabla usuarios:', error);
      // Si hay un error específico, probablemente sea un problema de RLS
      if (error.code === '42501') {
        // En producción deberías manejar esto mejor
        console.warn('Error de permisos al verificar email. Considera ajustar las políticas RLS.');
      }
    }

    return data ? data.length > 0 : false;
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
    // Llamar a nuestra API de registro segura
    const response = await fetch('/api/auth/register-secure', {
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

    // Mostrar mensaje de éxito
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
  // Usar authOptions para mantener coherencia en la configuración
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: authOptions,
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
  
  // Verificar si hay discrepancias entre Auth y nuestra tabla
  const needsSync = syncUserDataIfNeeded(user, usuario);

  return { auth: user, usuario: usuario as UsuarioData };
}

/**
 * Función auxiliar para sincronizar datos del usuario si hay discrepancias
 */
async function syncUserDataIfNeeded(authUser: any, dbUser: any): Promise<boolean> {
  if (!authUser || !dbUser) return false;
  
  let needsUpdate = false;
  
  // Verificar si hay discrepancias en el estado de verificación
  const authUserVerified = !!authUser.email_confirmed_at;
  
  if (authUserVerified !== dbUser.verificado) {
    // Hay una discrepancia, sincronizar
    needsUpdate = true;
    
    try {
      if (authUserVerified && !dbUser.verificado) {
        // Auth dice que está verificado pero nuestra tabla no
        await supabase
          .from('usuarios')
          .update({ 
            verificado: true,
            fecha_actualizacion: new Date().toISOString()
          })
          .eq('id', dbUser.id);
      } else if (!authUserVerified && dbUser.verificado) {
        // Nuestra tabla dice que está verificado pero Auth no
        // Esto es más complicado porque requiere acceso admin
        // En este caso, preferimos confiar en nuestra tabla
        try {
          // No podemos usar updateUser directamente para confirmar email
          // En lugar de eso, registramos el evento y confiamos en nuestra tabla
          console.log('Se detectó discrepancia: usuario verificado en DB pero no en Auth');
          
          // La confirmación real requeriría admin API, que no está disponible en cliente
          // await supabase.auth.admin.updateUserById(authUser.id, {
          //   email_confirm: true
          // });
        } catch (e) {
          console.error('Error al registrar discrepancia:', e);
        }
      }
    } catch (e) {
      console.error('Error al sincronizar estado de verificación:', e);
    }
  }
  
  // Sincronizar metadatos si es necesario
  const userMetadata = authUser.user_metadata || {};
  const shouldUpdateMetadata = 
    (dbUser.nombre && dbUser.nombre !== userMetadata.nombre) ||
    (dbUser.telefono && dbUser.telefono !== userMetadata.telefono);
    
  if (shouldUpdateMetadata) {
    try {
      await supabase.auth.updateUser({
        data: {
          nombre: dbUser.nombre,
          telefono: dbUser.telefono || undefined,
          full_name: dbUser.nombre,
        }
      });
      needsUpdate = true;
    } catch (e) {
      console.error('Error al sincronizar metadatos con Auth:', e);
    }
  }
  
  return needsUpdate;
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
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al solicitar restablecimiento');
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error en resetPassword:', error);
    // Por seguridad, no revelamos el motivo del error
    return { success: true };
  }
}

/**
 * Restablecer contraseña con token
 */
export async function resetPasswordWithToken(token: string, newPassword: string) {
  try {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al restablecer contraseña');
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error en resetPasswordWithToken:', error);
    throw error;
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
  // 1. Actualizar nuestra tabla personalizada
  const { error } = await supabase
    .from('usuarios')
    .update({ 
      verificado: true,
      fecha_actualizacion: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) throw error;
  
  // 2. Obtener datos del usuario para sincronización
  const { data: userData, error: userError } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (userError || !userData) {
    console.error('Error al obtener datos del usuario para sincronización:', userError);
    return { success: true }; // Continuamos a pesar del error
  }
  
  try {
    // 3. Obtener el usuario de Auth para sincronizar
    const { data: authData } = await supabase.auth.getUser();
    
    if (authData.user) {
      // 4. Actualizar metadatos en Auth
      await supabase.auth.updateUser({
        data: {
          nombre: userData.nombre,
          telefono: userData.telefono || undefined,
          full_name: userData.nombre,
        }
      });
    }
  } catch (syncError) {
    console.error('Error al sincronizar metadatos con Auth:', syncError);
    // No bloqueamos el proceso por errores de sincronización
  }

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
 * Esta función debe ser llamada después de la autenticación social exitosa
 * para sincronizar el perfil del usuario.
 */
export async function handleAuthCallback() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return { success: false, error: 'No se encontró sesión' };
    }

    const user = session.user;

    // Verificar si el usuario ya existe en nuestra tabla personalizada
    const { data: existingUser, error: dbError } = await supabase
      .from('usuarios')
      .select('id, nombre, telefono, url_avatar, verificado')
      .eq('correo_electronico', user.email)
      .single();

    // Si no existe, crear un nuevo perfil (no debería ocurrir aquí,
    // ya que ahora lo manejamos en la ruta de callback)
    if (!existingUser) {
      console.warn('Usuario no encontrado en tabla personalizada tras autenticación social. Creando perfil...');
      
      // Extraer nombre del user_metadata
      const fullName = user.user_metadata?.full_name || 
                      user.user_metadata?.name || 
                      user.email?.split('@')[0] || 'Usuario';
                      
      // Extraer avatar de user_metadata
      const avatarUrl = user.user_metadata?.avatar_url;
      
      // Extraer teléfono si está disponible
      const phone = user.user_metadata?.phone || user.phone;

      // Crear perfil en nuestra tabla personalizada
      const { data: newUser, error } = await supabase
        .from('usuarios')
        .insert([
          {
            correo_electronico: user.email,
            contrasena_hash: 'autenticacion_social',
            nombre: fullName,
            telefono: phone || null,
            url_avatar: avatarUrl,
            verificado: true, // Con social auth consideramos que está verificado
            autenticacion_social: true,
            fecha_creacion: new Date().toISOString(),
            fecha_actualizacion: new Date().toISOString(),
          },
        ])
        .select('id, nombre, telefono, url_avatar')
        .single();

      if (error) {
        console.error('Error al crear perfil después de autenticación social:', error);
        return { success: false, error: error.message };
      }
      
      // Sincronizar metadatos de vuelta a Supabase Auth para mantener consistencia
      try {
        await supabase.auth.updateUser({
          data: {
            nombre: fullName,
            telefono: phone || undefined,
            full_name: fullName,
          }
        });
      } catch (updateError) {
        console.error('Error al sincronizar metadatos en Auth:', updateError);
        // No bloqueamos el proceso por error de sincronización
      }
      
      return { success: true, user, userData: newUser };
    } else {
      // El usuario ya existe, actualizamos su información si es necesario
      const userMetadata = user.user_metadata || {};
      
      // Comparar datos para ver si necesitamos actualizar
      const needsUpdate = 
        (userMetadata.avatar_url && userMetadata.avatar_url !== existingUser.url_avatar) ||
        (userMetadata.full_name && userMetadata.full_name !== existingUser.nombre) ||
        (userMetadata.phone && userMetadata.phone !== existingUser.telefono);
        
      if (needsUpdate) {
        // Actualizamos los datos con la información más reciente del proveedor social
        const updateData: any = {};
        
        if (userMetadata.avatar_url && userMetadata.avatar_url !== existingUser.url_avatar) {
          updateData.url_avatar = userMetadata.avatar_url;
        }
        
        if (userMetadata.full_name && userMetadata.full_name !== existingUser.nombre) {
          updateData.nombre = userMetadata.full_name;
        }
        
        if (userMetadata.phone && userMetadata.phone !== existingUser.telefono) {
          updateData.telefono = userMetadata.phone;
        }
        
        if (Object.keys(updateData).length > 0) {
          updateData.fecha_actualizacion = new Date().toISOString();
          
          await supabase
            .from('usuarios')
            .update(updateData)
            .eq('id', existingUser.id);
        }
      }
      
      // Asegurar que el estado de verificación esté sincronizado
      if (!existingUser.verificado) {
        await supabase
          .from('usuarios')
          .update({ 
            verificado: true,
            fecha_actualizacion: new Date().toISOString() 
          })
          .eq('id', existingUser.id);
      }
      
      return { success: true, user, userData: existingUser };
    }
  } catch (error: any) {
    console.error('Error en handleAuthCallback:', error);
    return { success: false, error: error.message || 'Error en el proceso de autenticación' };
  }
}