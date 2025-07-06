const API_BASE_URL = 'https://backendtoutaunclicla-production.up.railway.app/api/v1';

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CreateAddressData {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface UpdateAddressData {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Función para transformar datos del frontend al backend
function transformToBackendFormat(data: CreateAddressData | UpdateAddressData) {
  return {
    direccion: data.street,
    ciudad: data.city,
    estado: data.state,
    codigo_postal: data.zipCode,
    pais: data.country
  };
}

// Función para transformar datos del backend al frontend
function transformFromBackendFormat(data: any): Address {
  return {
    id: data.id,
    street: data.direccion,
    city: data.ciudad,
    state: data.estado,
    zipCode: data.codigo_postal,
    country: data.pais
  };
}

/**
 * Obtener todas las direcciones del usuario
 */
export async function getUserAddresses(): Promise<Address[]> {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_BASE_URL}/addresses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const addresses = data.addresses || [];
    return addresses.map(transformFromBackendFormat);
  } catch (error: any) {
    console.error('Error al obtener direcciones:', error);
    throw error;
  }
}

/**
 * Crear una nueva dirección
 */
export async function createAddress(addressData: CreateAddressData): Promise<Address> {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const backendData = transformToBackendFormat(addressData);

    const response = await fetch(`${API_BASE_URL}/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(backendData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return transformFromBackendFormat(data.address);
  } catch (error: any) {
    console.error('Error al crear dirección:', error);
    throw error;
  }
}

/**
 * Actualizar una dirección existente
 */
export async function updateAddress(addressId: string, addressData: UpdateAddressData): Promise<Address> {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const backendData = transformToBackendFormat(addressData);

    const response = await fetch(`${API_BASE_URL}/addresses/${addressId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(backendData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return transformFromBackendFormat(data.address);
  } catch (error: any) {
    console.error('Error al actualizar dirección:', error);
    throw error;
  }
}

/**
 * Eliminar una dirección
 */
export async function deleteAddress(addressId: string): Promise<void> {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_BASE_URL}/addresses/${addressId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
  } catch (error: any) {
    console.error('Error al eliminar dirección:', error);
    throw error;
  }
}
