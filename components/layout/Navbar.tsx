"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Menu, 
  X, 
  Search,
  Heart,
  ShoppingCart,
  User,
  Package,
  LogOut,
  Settings,
  ShoppingBag,
  CreditCard,
  Bell,
  MapPin,
  Home,
  ChevronRight,
  Store
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import AuthModal from "@/components/auth/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/supabase/auth";
import { toast } from "sonner";
import Image from "next/image";
import { CartDrawer } from "@/components/modules/cart/CartDrawer";
import { getFavoritesCount } from "@/lib/services/favorites";

const LINKS = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/productos", label: "Productos", icon: Package },
  { href: "/comidas", label: "Comidas", icon: ShoppingBag },
  { href: "/boutique", label: "Boutique", icon: Store }
];

const PROFILE_MENU_ITEMS = [
  { icon: User, label: "Mi Perfil", href: "/profile" },
  { icon: ShoppingBag, label: "Mis Pedidos", href: "/profile/orders" },
  { icon: Heart, label: "Favoritos", href: "/profile/favorites" },
  { icon: MapPin, label: "Direcciones", href: "/profile/addresses" },
  { icon: Bell, label: "Notificaciones", href: "/profile/notifications" },
  { icon: Settings, label: "Configuración", href: "/profile/settings" }
];

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadFavoritesCount();
    }
  }, [user]);

  const loadFavoritesCount = async () => {
    try {
      const count = await getFavoritesCount();
      setFavoritesCount(count);
    } catch (error) {
      console.error('Error loading favorites count:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Sesión cerrada exitosamente');
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  const handleProfileNavigation = (href: string) => {
    setIsMobileMenuOpen(false);
    router.push(href);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white border-b z-50">
        <nav className="container mx-auto">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <motion.img 
                src="/logoaunclic.svg" 
                alt="Logo A un clic" 
                className="h-[60px] w-[60px] xs:h-[60px] xs:w-[60px] sm:h-[65px] sm:w-[65px] md:h-[70px] md:w-[70px] filter drop-shadow-md" 
                width="88"
                height="88"
              />
              <div className="flex flex-col -ml-4">
                <span className="text-sm font-medium leading-none">Tout À Un</span>
                <span className="text-xl font-bold leading-none text-indigo-600">Clic là</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative py-2 text-base font-medium transition-colors duration-200",
                      isActive ? "text-indigo-600" : "text-gray-600 hover:text-indigo-600"
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 h-0.5 w-full bg-indigo-600"
                        layoutId="navbar-underline"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {!loading && user && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hidden md:flex"
                  onClick={() => router.push('/profile/favorites')}
                >
                  <Heart className="h-5 w-5 text-gray-600" />
                  {favoritesCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center">
                      {favoritesCount}
                    </span>
                  )}
                </Button>
              )}

              <CartDrawer />

              {!loading && (
                user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="hidden md:flex h-10 w-10 rounded-full p-0 overflow-hidden border-2 border-gray-200 hover:border-indigo-500 transition-colors"
                      >
                        {user.user_metadata?.avatar_url ? (
                          <Image
                            src={user.user_metadata.avatar_url}
                            alt={user.email || ''}
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-6 w-6 text-gray-600" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-72">
                      <div className="px-4 py-3 border-b">
                        <p className="text-sm font-medium text-gray-900">{user.user_metadata?.nombre || user.email}</p>
                        <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                      </div>
                      <div className="py-2">
                        {PROFILE_MENU_ITEMS.map((item) => (
                          <DropdownMenuItem 
                            key={item.href}
                            className="px-4 py-2.5 cursor-pointer"
                            onClick={() => handleProfileNavigation(item.href)}
                          >
                            <item.icon className="mr-3 h-4 w-4 text-gray-500" />
                            <span>{item.label}</span>
                          </DropdownMenuItem>
                        ))}
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="px-4 py-2.5 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                        onClick={handleSignOut}
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        <span>Cerrar Sesión</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setShowAuthModal(true)}
                    className="hidden md:flex"
                  >
                    Iniciar Sesión
                  </Button>
                )
              )}

              {/* Mobile Menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6 text-gray-600" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full max-w-[320px] p-0 [&>button]:hidden overflow-hidden">
                  {/* Header del menú móvil */}
                  <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
                  <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 border-b border-indigo-500">
                    <div className="flex items-center justify-between p-5">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 rounded-full overflow-hidden bg-white flex items-center justify-center shadow-md">
                          <motion.img 
                            src="/logoaunclic.svg" 
                            alt="Logo pequeño" 
                            width={34}
                            height={34}
                            className="h-9 w-9"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          />
                        </div>
                        <div className="font-bold text-lg text-white">Tout À Un Clic là</div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full h-10 w-10 hover:bg-indigo-500 text-white"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <X className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Cuerpo del menú móvil */}
                  <div className="flex flex-col h-[calc(100%-64px)]">
                    {/* Parte superior - Autenticación */}
                    <div className="p-4 border-b">
                      {!loading && (
                        user ? (
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-gray-200">
                              {user.user_metadata?.avatar_url ? (
                                <Image
                                  src={user.user_metadata.avatar_url}
                                  alt={user.email || ''}
                                  width={40}
                                  height={40}
                                  className="rounded-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-gray-100">
                                  <User className="h-5 w-5 text-gray-600" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm text-gray-900 truncate">
                                {user.user_metadata?.nombre || 'Usuario'}
                              </p>
                              <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full hover:bg-gray-100"
                              onClick={() => router.push('/profile')}
                            >
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            className="w-full"
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              setShowAuthModal(true);
                            }}
                          >
                            <User className="h-4 w-4 mr-2" />
                            Iniciar Sesión
                          </Button>
                        )
                      )}
                    </div>

                    {/* Menú de navegación */}
                    <div className="flex-1 overflow-y-auto py-2">
                      <div className="px-2">
                        {/* Enlaces principales */}
                        <div className="mb-4">
                          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Navegar
                          </div>
                          <div className="space-y-1">
                            {LINKS.map((link) => {
                              const isActive = pathname === link.href;
                              const LinkIcon = link.icon;
                              return (
                                <Link
                                  key={link.href}
                                  href={link.href}
                                  className={cn(
                                    "flex items-center py-2.5 px-3 rounded-lg text-sm font-medium transition-colors",
                                    isActive 
                                      ? "bg-indigo-50 text-indigo-700" 
                                      : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                                  )}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  <LinkIcon className={cn("h-5 w-5 mr-3", isActive ? "text-indigo-600" : "text-gray-500")} />
                                  {link.label}
                                </Link>
                              );
                            })}
                          </div>
                        </div>

                        {/* Enlaces de perfil (solo para usuarios autenticados) */}
                        {!loading && user && (
                          <div className="mb-4">
                            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Mi Cuenta
                            </div>
                            <div className="space-y-1">
                              {PROFILE_MENU_ITEMS.map((item) => (
                                <Button
                                  key={item.href}
                                  variant="ghost"
                                  className="w-full justify-start px-3 py-2.5 h-auto text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                                  onClick={() => handleProfileNavigation(item.href)}
                                >
                                  <item.icon className="h-5 w-5 mr-3 text-gray-500" />
                                  {item.label}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Pie del menú móvil */}
                    {!loading && user && (
                      <div className="p-4 border-t bg-gray-50">
                        <Button 
                          variant="destructive"
                          className="w-full"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            handleSignOut();
                          }}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Cerrar Sesión
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>
      </header>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}