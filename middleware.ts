import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Agregar headers de seguridad
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Logging básico de requests (solo en desarrollo)
  if (process.env.NODE_ENV === 'development') {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    console.log(`🌐 [${new Date().toISOString()}] ${req.method} ${req.nextUrl.pathname} - IP: ${ip}`);
  }

  // Verificar si el usuario está autenticado usando el token del backend
  let isAuthenticated = false;
  // Primero intentar obtener el token de las cookies
  let token = req.cookies.get('auth-token')?.value || req.cookies.get('auth_token')?.value;
  
  // Si no hay token en cookies, intentar obtenerlo del header Authorization
  if (!token) {
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }
  
  if (token) {
    try {
      // Verificar el token JWT (usando la misma clave secreta que el backend)
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret');
      const { payload } = await jwtVerify(token, secret);
      isAuthenticated = !!payload;
    } catch (error) {
      console.log('Token inválido o expirado:', error);
      isAuthenticated = false;
    }
  }

  // Lista de rutas que requieren autenticación estricta del lado del servidor
  // Estas rutas SIEMPRE redirigirán si no hay token válido
  const strictProtectedRoutes = [
    '/checkout',
    '/profile/orders',
    '/profile/notifications',
    '/profile/settings',
  ];

  // Rutas de perfil que pueden manejar su propia autenticación del lado del cliente
  // Estas rutas NO redirigirán automáticamente - dejan que el componente maneje la auth
  const clientSideAuthRoutes = [
    '/profile',
    '/profile/favorites',
    '/profile/addresses',
    '/cart',
  ];

  // Rutas de autenticación (redirigir si ya está autenticado)
  const authPages = ['/auth', '/login', '/register'];

  // Verificar si la URL actual está en la lista de rutas estrictamente protegidas
  const isStrictProtectedRoute = strictProtectedRoutes.some(route => 
    req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith(`${route}/`)
  );

  // Verificar si es una ruta de autenticación del lado del cliente
  const isClientSideAuthRoute = clientSideAuthRoutes.some(route =>
    req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith(`${route}/`)
  );

  // Solo redirigir para rutas estrictamente protegidas sin token
  if (isStrictProtectedRoute && !isAuthenticated) {
    const redirectUrl = new URL('/', req.url);
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Para rutas de autenticación del lado del cliente, permitir que pasen 
  // (el componente manejará la autenticación)
  if (isClientSideAuthRoute) {
    // Agregar headers para que el cliente sepa que puede manejar la auth
    res.headers.set('X-Client-Auth-Route', 'true');
    return res;
  }

  // Si el usuario está autenticado y trata de acceder a páginas de auth, redirigir al perfil
  const isAuthPage = authPages.some(page => req.nextUrl.pathname.startsWith(page));
  
  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/profile', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    // Excluir archivos estáticos y rutas internas de Next.js
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Incluir rutas de API
    '/(api|trpc)(.*)',
  ],
}