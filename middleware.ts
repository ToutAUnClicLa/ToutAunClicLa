import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
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
  
  // Rate limiting para rutas sensibles de API
  const isAuthAPI = req.nextUrl.pathname.startsWith('/api/auth/');
  if (isAuthAPI) {
    // El rate limiting se maneja individualmente en cada endpoint
    // pero aquí podemos agregar headers informativos
    res.headers.set('X-Auth-Endpoint', 'true');
  }
  
  // Verificar si el usuario está autenticado
  const { data: { session } } = await supabase.auth.getSession();

  // Lista de rutas protegidas que requieren autenticación
  const protectedRoutes = [
    '/profile',
    '/profile/orders',
    '/profile/favorites',
    '/profile/addresses',
    '/profile/notifications',
    '/profile/settings',
    '/checkout',
    // Añadir más rutas protegidas según sea necesario
  ];

  // Verificar si la URL actual está en la lista de rutas protegidas
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith(`${route}/`)
  );

  // Si la ruta está protegida y el usuario no está autenticado, redirigir al inicio de sesión
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/sign-in', req.url);
    // Añadir la URL actual como parámetro de redirección
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
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