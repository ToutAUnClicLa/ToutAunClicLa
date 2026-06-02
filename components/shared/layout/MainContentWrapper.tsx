"use client";

import { usePathname } from "next/navigation";

export function MainContentWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // No aplicar el padding top en las rutas de administración (excepto login).
  // /factura/* tampoco lleva padding (imprime el documento sin chrome).
  const isDashboardRoute = (pathname?.startsWith('/restaurante') && pathname !== '/restaurante/login') ||
                           (pathname?.startsWith('/admin') && pathname !== '/admin/login') ||
                           pathname?.startsWith('/factura');

  return (
    <main className={`flex-1 w-full ${isDashboardRoute ? '' : 'pt-16'}`}>
      {children}
    </main>
  );
}
