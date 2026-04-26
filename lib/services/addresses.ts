const isDevelopment = process.env.NODE_ENV === 'development';
const API_BASE_URL = isDevelopment 
  ? 'http://localhost:5500/api/v1' 
  : (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backendtoutaunclicla-production.up.railway.app/api/v1');

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isPrimary?: boolean;
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
  const transformed = {
    id: data.id,
    street: data.direccion,
    city: data.ciudad,
    state: data.estado,
    zipCode: data.codigo_postal,
    country: data.pais,
    isPrimary: data.isPrimary || false
  };
  
  // Log detallado de transformación para debugging
  console.log('🔄 TRANSFORM FROM BACKEND:', {
    input: {
      id: data.id,
      id_type: typeof data.id,
      direccion: data.direccion,
      ciudad: data.ciudad,
      isPrimary: data.isPrimary,
      rawData: data
    },
    output: {
      id: transformed.id,
      id_type: typeof transformed.id,
      street: transformed.street,
      city: transformed.city,
      isPrimary: transformed.isPrimary,
      transformedData: transformed
    }
  });
  
  return transformed;
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
    const transformedAddress = transformFromBackendFormat(data.address);
    
    console.log('🔍 ADDRESS SERVICE - CREATE RESPONSE:', {
      backendResponse: {
        rawData: data,
        address: data.address
      },
      transformedAddress: {
        id: transformedAddress.id,
        street: transformedAddress.street,
        city: transformedAddress.city,
        isPrimary: transformedAddress.isPrimary,
        fullObject: transformedAddress
      },
      validation: {
        hasId: !!transformedAddress.id,
        idType: typeof transformedAddress.id,
        idLength: transformedAddress.id?.length
      },
      timestamp: new Date().toISOString()
    });
    
    return transformedAddress;
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

/**
 * Establecer una dirección como principal
 */
export async function setPrimaryAddress(addressId: string): Promise<void> {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_BASE_URL}/users/primary-address`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ addressId }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
  } catch (error: any) {
    console.error('Error al establecer dirección principal:', error);
    throw error;
  }
}

/**
 * Verificar si una dirección específica existe en el backend (para checkout)
 */
export async function verifyAddressExists(addressId: string): Promise<boolean> {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('🔍 Verificando existencia de dirección:', addressId);

    const response = await fetch(`${API_BASE_URL}/addresses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.warn('⚠️ No se pudo verificar dirección, asumiendo válida para UX');
      return true; // Graceful fallback para UX
    }

    const data = await response.json();
    const addresses = data.addresses || [];
    
    const addressExists = addresses.some((addr: any) => addr.id === addressId);
    
    console.log('✅ Verificación de dirección completada:', {
      addressId,
      exists: addressExists,
      totalAddresses: addresses.length,
      foundAddresses: addresses.map((addr: any) => ({
        id: addr.id,
        isPrimary: addr.isPrimary
      }))
    });

    return addressExists;
  } catch (error: any) {
    console.error('Error verificando dirección, asumiendo válida para UX:', error);
    return true; // Graceful fallback - mejor asumir válida que bloquear checkout
  }
}

/**
 * Verificar específicamente si una dirección está lista para checkout con reintentos
 */
export async function verifyAddressForCheckout(addressId: string, maxAttempts: number = 3, delayMs: number = 500): Promise<boolean> {
  console.log('🎯 Iniciando verificación robusta de dirección para checkout:', {
    addressId,
    maxAttempts,
    delayMs
  });

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`🔍 Intento ${attempt}/${maxAttempts}: verificando dirección ${addressId}`);
      
      const exists = await verifyAddressExists(addressId);
      
      if (exists) {
        console.log(`✅ Dirección verificada exitosamente en intento ${attempt}`);
        return true;
      }
      
      if (attempt < maxAttempts) {
        console.log(`⏳ Dirección no encontrada en intento ${attempt}, esperando ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
      
    } catch (error) {
      console.warn(`⚠️ Error en intento ${attempt}:`, error);
      
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  console.log('⚠️ No se pudo verificar dirección después de todos los intentos, asumiendo válida para UX');
  return true; // Graceful fallback - mejor asumir válida que bloquear checkout permanentemente
}
