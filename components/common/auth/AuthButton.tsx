"use client";

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/common/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/common/ui/dropdown-menu';
import { Badge } from '@/components/common/ui/badge';
import { loginPath, registerPath, verifyPath } from '@/lib/shop-auth';
import { User, Settings, Heart, MapPin, ShoppingBag, LogOut, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AuthButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  showProfileMenu?: boolean;
}

/**
 * Botón inteligente de autenticación que se adapta al estado del usuario
 */
export function AuthButton({ 
  variant = 'default', 
  size = 'default', 
  className = '',
  showProfileMenu = true 
}: AuthButtonProps) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  // Función para obtener las iniciales del usuario
  const getUserInitials = () => {
    if (!user?.nombre) return 'U';
    return user.nombre
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Función para manejar el logout
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Funciones para abrir el modal
  const openLoginModal = () => router.push(loginPath());
  const openRegisterModal = () => router.push(registerPath());

  // Estado de carga
  if (isLoading) {
    return (
      <Button variant="ghost" size={size} className={`${className} animate-pulse`} disabled>
        <div className="h-5 w-16 bg-gray-200 rounded"></div>
      </Button>
    );
  }

  // Usuario autenticado
  if (isAuthenticated && user) {
    if (!showProfileMenu) {
      return (
        <Button
          variant={variant}
          size={size}
          className={className}
          onClick={() => router.push('/profile')}
        >
          <User className="h-4 w-4 mr-2" />
          Perfil
        </Button>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src="" alt={user.nombre} />
              <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            {!user.verified && (
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-yellow-500 rounded-full flex items-center justify-center">
                <Shield className="h-2.5 w-2.5 text-white" />
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium leading-none">{user.nombre}</p>
                {user.verified ? (
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                    Verificado
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="text-xs">
                    Sin verificar
                  </Badge>
                )}
              </div>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {!user.verified && (
            <>
              <DropdownMenuItem onClick={() => router.push(user.email ? verifyPath(user.email) : '/verify-email')} className="text-yellow-700">
                <Shield className="mr-2 h-4 w-4" />
                Verificar cuenta
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          
          <DropdownMenuItem onClick={() => router.push('/profile')}>
            <User className="mr-2 h-4 w-4" />
            Mi perfil
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/profile/favorites')}>
            <Heart className="mr-2 h-4 w-4" />
            Favoritos
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/profile/addresses')}>
            <MapPin className="mr-2 h-4 w-4" />
            Direcciones
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/profile/orders')}>
            <ShoppingBag className="mr-2 h-4 w-4" />
            Pedidos
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/profile/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            Configuración
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Usuario no autenticado
  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size={size}
          className={className}
          onClick={openLoginModal}
        >
          Iniciar sesión
        </Button>
        <Button
          variant={variant}
          size={size}
          onClick={openRegisterModal}
        >
          Registrarse
        </Button>
      </div>

    </>
  );
}
