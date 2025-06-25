const API_BASE_URL = 'https://backendtoutaunclicla-production.up.railway.app/api/v1';

export interface UserProfile {
  id: string;
  email: string;
  nombre: string;
  telefono?: string;
  verified: boolean;
  createdAt: string;
  avatarUrl?: string;
}

export interface UpdateProfileData {
  nombre: string;
  telefono?: string;
  avatarUrl?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
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

