// Configuración del módulo Pro (frontend)
// La base ya incluye /api/v1 (ver .env). Los endpoints Pro cuelgan de /pro.
export const PRO_API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5500/api/v1';

// Key de localStorage para el token del módulo Pro (distinta del e-commerce).
export const PRO_TOKEN_KEY = 'pro_token';
