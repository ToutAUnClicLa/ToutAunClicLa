"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  Store,
  ArrowRight,
  Grid,
  Layers,
  Globe,
  ChevronDown,
  Shield
} from "lucide-react";
import { Button } from "@/components/common/ui/button";
import { Input } from "@/components/common/ui/input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/common/ui/sheet";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Image from "next/image";
import { CartButton } from "@/components/features/modules/cart/CartButton";
import { getFavoritesCount } from "@/lib/services/favorites";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/features/auth/AuthModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/common/ui/avatar";
import { Badge } from "@/components/common/ui/badge";
import { Separator } from "@/components/common/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/common/ui/dropdown-menu";
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/contexts/LanguageContext';

const LINKS = [
  { href: "/", label: "nav.home", icon: Home },
  { href: "/productos", label: "nav.products", icon: Package },
  { href: "/comidas", label: "nav.foods", icon: ShoppingBag },
  { href: "/boutique", label: "nav.boutique", icon: Store }
];

const PROFILE_MENU_ITEMS = [
  { icon: User, label: "nav.profile.myProfile", href: "/profile" },
  { icon: MapPin, label: "nav.profile.addresses", href: "/profile/addresses" },
  { icon: ShoppingBag, label: "nav.profile.myOrders", href: "/profile/orders" },
  { icon: Shield, label: "nav.profile.security", href: "/profile/security" },
  { icon: Bell, label: "nav.profile.notifications", href: "/profile/notifications" },
  { icon: Settings, label: "nav.profile.settings", href: "/profile/settings" }
];

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  
  // Usar el estado global del contexto de autenticación
  const { 
    isAuthenticated, 
    user, 
    isLoading: authLoading, 
    logout, 
    error: authError 
  } = useAuth();
  
  const { currentLanguage, setLanguage, availableLanguages } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgotPassword'>('login');
  const { t } = useTranslation();

  // Optimización: Solo cargar favoritos cuando el usuario esté autenticado y verificado
  useEffect(() => {
    let isMounted = true;
    
    const loadFavoritesCount = async () => {
      if (!isAuthenticated || !user?.verified) {
        setFavoritesCount(0);
        return;
      }
      
      try {
        const count = await getFavoritesCount();
        if (isMounted) {
          setFavoritesCount(count);
        }
      } catch (error) {
        console.error('Error loading favorites count:', error);
        if (isMounted) {
          setFavoritesCount(0);
        }
      }
    };

    loadFavoritesCount();
    
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user?.verified]);

  // Memoizar las funciones para evitar re-renders innecesarios
  const handleProfileNavigation = (href: string) => {
    setIsMobileMenuOpen(false);
    router.push(href);
  };

  const handleSignOut = async () => {
    try {
      setIsMobileMenuOpen(false);
      await logout();
      toast.success(t('navbar.logoutSuccess'));
      
      // Redireccionar si está en una página protegida
      if (pathname.startsWith('/profile')) {
        router.push('/');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error(t('navbar.logoutError'));
    }
  };

  const openAuthModal = (mode: 'login' | 'register' | 'forgotPassword' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Funciones optimizadas para obtener datos del usuario
  const getUserInitials = () => {
    if (!user?.nombre) return 'U';
    return user.nombre
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const isUserVerified = () => user?.verified || false;

  // Nuevo código: Agrupar los enlaces para el menú móvil
  const MENU_GROUPS = [
    {
      title: "Explorar",
      items: LINKS
    },
    {
      title: "Mi Cuenta",
      items: PROFILE_MENU_ITEMS,
      showWhen: "authenticated"
    }
  ];  const handleLanguageChange = (langCode: string) => {
    const newLang = availableLanguages.find(lang => lang.code === langCode) || availableLanguages[0];
    setLanguage(newLang.code);
    toast.success(`${t('navbar.languageChanged')} ${newLang.name}`);
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
                    {t(link.label)}
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
            </div>            {/* Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Language Selector - Desktop */}
              <div className="hidden md:flex">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-9 px-2 gap-1 text-gray-600 hover:text-indigo-600"
                    >                      <Globe className="h-4 w-4" />
                      <span className="text-sm font-medium">{availableLanguages.find(lang => lang.code === currentLanguage)?.flag}</span>
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[150px]">
                    {availableLanguages.map((lang) => (
                      <DropdownMenuItem
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <span className="text-base">{lang.flag}</span>
                        <span className="flex-1">{lang.name}</span>
                        {currentLanguage === lang.code && (
                          <div className="h-2 w-2 rounded-full bg-indigo-600" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Botón de favoritos - siempre visible */}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                title={isAuthenticated ? "Mis favoritos" : "Inicia sesión para ver favoritos"}
                onClick={() => {
                  if (isAuthenticated) {
                    router.push('/profile/favorites');
                  } else {
                    openAuthModal('login');
                  }
                }}
              >
                <Heart className="h-5 w-5 text-gray-600 hover:text-red-500 transition-colors duration-200" />
                {isAuthenticated && favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center animate-pulse">
                    {favoritesCount}
                  </span>
                )}
              </Button>

              <CartButton />

              {/* Language Selector - Mobile (visible only on mobile) */}
              <div className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors duration-200"
                    >
                      <span className="text-lg">{availableLanguages.find(lang => lang.code === currentLanguage)?.flag}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[140px]">
                    {availableLanguages.map((lang) => (
                      <DropdownMenuItem
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <span className="text-base">{lang.flag}</span>
                        <span className="flex-1">{lang.name}</span>
                        {currentLanguage === lang.code && (
                          <div className="h-2 w-2 rounded-full bg-indigo-600" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Autenticación */}
              <div className="hidden md:flex">
                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="relative cursor-pointer group">
                        <Avatar className="h-10 w-10 border-2 border-gray-200 hover:border-indigo-500 transition-colors duration-200 ring-2 ring-transparent group-hover:ring-indigo-100">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        {!isUserVerified() && (
                          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-500 border-2 border-white animate-pulse" 
                            title={t('navbar.accountNeedsVerification')}>
                          </span>
                        )}
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 p-0 shadow-lg border-0" align="end">
                      {user && (
                        <>
                          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-12 w-12 border-2 border-white/30">
                                <AvatarImage src="" />
                                <AvatarFallback className="bg-white/20 text-white font-semibold">
                                  {getUserInitials()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">
                                  {user.nombre}
                                </p>
                                <p className="text-xs text-white/80 truncate">
                                  {user.email}
                                </p>
                                {!isUserVerified() && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                                    <span className="text-xs text-amber-200 font-medium">
                                      {t('navbar.unverifiedAccount')}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="p-2">
                            {!isUserVerified() && (
                              <>
                                <div className="px-3 py-2 mb-2 bg-amber-50 rounded-lg border border-amber-200">
                                  <p className="text-xs text-amber-700 font-medium">
                                    Verifica tu cuenta para acceder a todas las funciones
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        </>
                      )}
                      <div className="p-2 space-y-1">
                        {PROFILE_MENU_ITEMS.map((item) => (
                          <DropdownMenuItem
                            key={item.href}
                            onClick={() => router.push(item.href)}
                            className="cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3"
                          >
                            <div className="p-1.5 bg-gray-100 rounded-full">
                              <item.icon className="h-4 w-4 text-gray-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              {t(item.label)}
                            </span>
                          </DropdownMenuItem>
                        ))}
                      </div>
                      <div className="border-t border-gray-100 p-2">
                        <DropdownMenuItem
                          onClick={handleSignOut}
                          className="cursor-pointer px-3 py-2 rounded-lg hover:bg-red-50 transition-colors duration-200 flex items-center gap-3 text-red-600 focus:text-red-600 focus:bg-red-50"
                        >
                          <div className="p-1.5 bg-red-100 rounded-full">
                            <LogOut className="h-4 w-4 text-red-600" />
                          </div>
                          <span className="text-sm font-medium">
                            {t('navbar.logoutButton')}
                          </span>
                        </DropdownMenuItem>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => openAuthModal('login')}
                      className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                    >
                      {t('nav.login')}
                    </Button>
                  </div>
                )}
              </div>              {/* Mobile Menu Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden h-9 w-9 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Nuevo Menú Móvil */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-white z-50 md:hidden flex flex-col"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Encabezado del menú móvil */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Grid className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-white">
                    <div className="text-lg font-bold">Menú</div>
                    <div className="text-sm opacity-90">Navegación</div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-white/10 rounded-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </div>
            
            {/* Contenido del menú móvil */}
            <div className="flex-1 overflow-y-auto pb-safe">
              {/* Información del usuario */}
              <div className="px-4 py-5">
                {isAuthenticated ? (
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <Avatar className="h-12 w-12 border-2 border-indigo-200 shadow-sm">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-semibold text-gray-900 truncate">
                        {user?.nombre || 'Usuario'}
                      </h2>
                      <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                      {!isUserVerified() && (
                        <Badge variant="outline" className="mt-1 bg-amber-50 text-amber-600 border-amber-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-1"></span>
                          Verificar cuenta
                        </Badge>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="h-8 w-8 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">¡Hola!</h3>
                    <p className="text-sm text-gray-600 mb-4">Inicia sesión para acceder a todas las funciones</p>
                    <Button 
                      size="sm"
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        openAuthModal('login');
                      }}
                    >
                      Iniciar sesión
                    </Button>
                  </div>
                )}
              </div>
              
              <Separator className="my-2" />
              
              {/* Accesos rápidos - siempre visibles */}
              <div className="px-4 py-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Accesos rápidos
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant="outline" 
                    className="h-auto flex flex-col items-center py-4 px-2 gap-2 relative"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (isAuthenticated) {
                        router.push('/profile/favorites');
                      } else {
                        openAuthModal('login');
                      }
                    }}
                  >
                    <div className="p-2 bg-red-50 rounded-full">
                      <Heart className="h-5 w-5 text-red-500" />
                    </div>
                    <span className="text-xs font-medium">Favoritos</span>
                    {isAuthenticated && favoritesCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 min-w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                        {favoritesCount}
                      </Badge>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto flex flex-col items-center py-4 px-2 gap-2"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (isAuthenticated) {
                        router.push('/profile/orders');
                      } else {
                        openAuthModal('login');
                      }
                    }}
                  >
                    <div className="p-2 bg-amber-50 rounded-full">
                      <ShoppingBag className="h-5 w-5 text-amber-500" />
                    </div>
                    <span className="text-xs font-medium">Pedidos</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto flex flex-col items-center py-4 px-2 gap-2"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (isAuthenticated) {
                        router.push('/profile/addresses');
                      } else {
                        openAuthModal('login');
                      }
                    }}
                  >
                    <div className="p-2 bg-indigo-50 rounded-full">
                      <MapPin className="h-5 w-5 text-indigo-500" />
                    </div>
                    <span className="text-xs font-medium">Direcciones</span>
                  </Button>
                </div>
              </div>
              
              {/* Menú principal */}
              <div className="px-4 py-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Explorar
                </h3>
                <div className="space-y-1">
                  {LINKS.map((link) => {
                    const isActive = pathname === link.href;
                    const LinkIcon = link.icon;
                    
                    return (
                      <Button
                        key={link.href}
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start text-base h-12 px-3",
                          isActive ? "bg-indigo-50 text-indigo-700 border border-indigo-200" : "text-gray-700 hover:bg-gray-50"
                        )}
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          router.push(link.href);
                        }}
                      >
                        <div className="flex items-center w-full">
                          <div className={cn(
                            "mr-3 p-2 rounded-lg", 
                            isActive ? "bg-indigo-100" : "bg-gray-100"
                          )}>
                            <LinkIcon className={cn(
                              "h-5 w-5", 
                              isActive ? "text-indigo-600" : "text-gray-500"
                            )} />
                          </div>
                          <span className="flex-1 text-left">{t(link.label)}</span>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>
              
              {/* Perfil y Configuración (Solo para usuarios autenticados) */}
              {isAuthenticated && (
                <>
                  <Separator className="my-2" />
                  
                  <div className="px-4 py-3">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Mi cuenta
                    </h3>
                    <div className="space-y-1">
                      {PROFILE_MENU_ITEMS.filter(item => 
                        !['nav.profile.favorites', 'nav.profile.myOrders', 'nav.profile.addresses'].includes(item.label)
                      ).map((item) => (
                        <Button
                          key={item.href}
                          variant="ghost"
                          className="w-full justify-start text-base h-11 px-3 hover:bg-gray-50"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            router.push(item.href);
                          }}
                        >
                          <div className="flex items-center w-full">
                            <div className="mr-3 p-2 rounded-lg bg-gray-100">
                              <item.icon className="h-5 w-5 text-gray-500" />
                            </div>
                            <span className="flex-1 text-left">{t(item.label)}</span>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              )}

            </div>
            
            {/* Pie del menú móvil */}
            {isAuthenticated && (
              <div className="px-4 py-4 border-t bg-gray-50">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 h-12 px-3"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleSignOut();
                  }}
                >
                  <div className="flex items-center w-full">
                    <div className="mr-3 p-2 rounded-lg bg-red-100">
                      <LogOut className="h-5 w-5 text-red-600" />
                    </div>
                    <span className="flex-1 text-left">Cerrar sesión</span>
                  </div>
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={closeAuthModal} 
        initialMode={authModalMode}
      />
    </>
  );
}