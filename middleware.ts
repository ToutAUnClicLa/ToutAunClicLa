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
    console.log(`🌐 [${new Date().toISOString()}] ${req.method} ${req.nextUrl.pathname} - IP: ${ip}`);
  }

  // Lista de rutas que requieren autenticación estricta del lado del servidor
  const strictProtectedRoutes = [
    '/profile/orders',
    '/profile/notifications',
  ];

  // Rutas que manejan su propia autenticación del lado del cliente
  const clientSideAuthRoutes = [
    '/profile',
    '/profile/favorites',
    '/profile/addresses',
    '/profile/settings',
    '/profile/security',
    '/cart',
  ];

  // Rutas de autenticación
  const authPages = ['/auth', '/login', '/register'];

  // Verificar si es una ruta de autenticación del lado del cliente
  const isClientSideAuthRoute = clientSideAuthRoutes.some(route =>
    req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith(`${route}/`)
  );

  // Para rutas del lado del cliente, simplemente pasar sin verificación
  if (isClientSideAuthRoute) {
    res.headers.set('X-Client-Auth-Route', 'true');
    return res;
  }

  // Solo verificar autenticación para rutas estrictamente protegidas
  const isStrictProtectedRoute = strictProtectedRoutes.some(route => 
    req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith(`${route}/`)
  );

  if (isStrictProtectedRoute) {
    // Verificar token solo para rutas estrictamente protegidas
    let isAuthenticated = false;
    let token = req.cookies.get('auth-token')?.value || req.cookies.get('auth_token')?.value;
    
    if (!token) {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    
    if (token && process.env.JWT_SECRET) {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        isAuthenticated = !!payload;
      } catch (error) {
        console.log('Token inválido o expirado:', error);
        isAuthenticated = false;
      }
    }

    if (!isAuthenticated) {
      const redirectUrl = new URL('/', req.url);
      redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Manejar redirección de páginas de auth (solo si tenemos token válido en cookies)
  const isAuthPage = authPages.some(page => req.nextUrl.pathname.startsWith(page));
  
  if (isAuthPage) {
    let token = req.cookies.get('auth-token')?.value || req.cookies.get('auth_token')?.value;
    if (token && process.env.JWT_SECRET) {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        if (payload) {
          return NextResponse.redirect(new URL('/profile', req.url));
        }
      } catch (error) {
        // Token inválido, permitir acceso a páginas de auth
      }
    }
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