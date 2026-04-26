const isDevelopment = process.env.NODE_ENV === 'development';
const API_BASE_URL = isDevelopment 
  ? 'http://localhost:5500/api/v1' 
  : (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backendtoutaunclicla-production.up.railway.app/api/v1');

export interface UserProfile {
  id: string;
  email: string;
  nombre: string;
  telefono?: string;
  verified: boolean;
  createdAt: string;
  avatarUrl?: string;
  primaryAddressId?: string;
}

export interface UpdateProfileData {
  nombre: string;
  telefono?: string;
  avatarUrl?: string;
}

export interface UpdateBasicInfoData {
  nombre: string;
  telefono?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface ChangeEmailData {
  newEmail: string;
  password: string;
}

export interface DeleteAccountData {
  password: string;
}

/**
 * Obtener perfil del usuario desde el backend Express
 */
export async function getUserProfile(): Promise<UserProfile> {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener perfil');
    }

    const data = await response.json();
    return data.user;
  } catch (error: any) {
    console.error('Error al obtener perfil:', error);
    throw error;
  }
}

/**
 * Actualizar perfil del usuario
 */
export async function updateUserProfile(data: UpdateProfileData): Promise<UserProfile> {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar perfil');
    }

    const responseData = await response.json();
    return responseData.user;
  } catch (error: any) {
    console.error('Error al actualizar perfil:', error);
    throw error;
  }
}

/**
 * Actualizar información básica del usuario (desde página de seguridad)
 */
export async function updateBasicInfo(data: UpdateBasicInfoData): Promise<UserProfile> {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar información básica');
    }

    const responseData = await response.json();
    return responseData.user;
  } catch (error: any) {
    console.error('Error al actualizar información básica:', error);
    throw error;
  }
}

/**
 * Cambiar contraseña del usuario
 */
export async function changePassword(data: ChangePasswordData): Promise<void> {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_BASE_URL}/users/password`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al cambiar contraseña');
    }
  } catch (error: any) {
    console.error('Error al cambiar contraseña:', error);
    throw error;
  }
}

/**
 * Cambiar email del usuario
 * Nota: El backend no tiene endpoint específico para cambio de email
 * Esta función está preparada para cuando se implemente
 */
export async function changeEmail(data: ChangeEmailData): Promise<void> {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    // TODO: Implementar cuando el backend tenga el endpoint
    // Por ahora simulamos la funcionalidad
    throw new Error('Función no disponible aún en el backend');
  } catch (error: any) {
    console.error('Error al cambiar email:', error);
    throw error;
  }
}

/**
 * Eliminar cuenta del usuario
 */
export async function deleteAccount(data: DeleteAccountData): Promise<void> {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_BASE_URL}/users/account`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al eliminar cuenta');
    }

    // Limpiar el token después de eliminar la cuenta
    localStorage.removeItem('auth_token');
  } catch (error: any) {
    console.error('Error al eliminar cuenta:', error);
    throw error;
  }
}

