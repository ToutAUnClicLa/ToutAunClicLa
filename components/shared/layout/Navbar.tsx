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
  Shield,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/common/ui/button";
import { Input } from "@/components/common/ui/input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/common/ui/sheet";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useCartCount } from "@/hooks/useCartCount";
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
  { icon: Heart, label: "nav.profile.favorites", href: "/profile/favorites" },
  { icon: MapPin, label: "nav.profile.addresses", href: "/profile/addresses" },
  { icon: ShoppingBag, label: "nav.profile.myOrders", href: "/profile/orders" },
  { icon: Shield, label: "nav.profile.security", href: "/profile/security" },
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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgotPassword'>('login');
  const { t } = useTranslation();
  
  // Hook optimizado para contador del carrito
  const { count: cartCount } = useCartCount();

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

              {/* Botón de favoritos - solo para usuarios autenticados */}
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  title="Mis favoritos"
                  onClick={() => router.push('/profile/favorites')}
                >
                  <Heart className="h-5 w-5 text-gray-600 hover:text-red-500 transition-colors duration-200" />
                </Button>
              )}

              {/* Botón de carrito con contador optimizado */}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                title={`Carrito de compras${cartCount > 0 ? ` (${cartCount} productos)` : ''}`}
                onClick={() => router.push('/cart')}
              >
                <ShoppingCart className="h-5 w-5 text-gray-600 hover:text-indigo-600 transition-colors duration-200" />
                {cartCount > 0 && (
                  <Badge 
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold shadow-lg animate-pulse"
                  >
                    {cartCount > 99 ? '99+' : cartCount}
                  </Badge>
                )}
              </Button>

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

      {/* Menú Móvil Refactorizado */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-white z-50 md:hidden flex flex-col w-full overflow-hidden"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
          >
            {/* Header del menú móvil */}
            <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 px-4 py-4 w-full">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <div className="relative flex items-center justify-between">
                {/* Título */}
                <div className="text-white">
                  <div className="text-xl font-bold tracking-tight">{t('navbar.mobile.menu')}</div>
                  <div className="text-sm opacity-90 font-medium">{t('navbar.mobile.navigation')}</div>
                </div>
                
                {/* Botón cerrar */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white hover:bg-white/20 rounded-full h-10 w-10 backdrop-blur-sm border border-white/20"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </motion.div>
              </div>
            </div>
            
            {/* Contenido principal con scroll suave */}
            <div className="flex-1 overflow-y-auto overscroll-contain w-full">
              {isAuthenticated ? (
                <>
                  {/* Sección de usuario autenticado */}
                  <div className="px-4 py-5 bg-gradient-to-b from-gray-50 to-white w-full">
                    <motion.div 
                      className="relative p-4 bg-white rounded-2xl shadow-sm border border-gray-100"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Avatar className="h-14 w-14 border-3 border-white shadow-lg">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-lg">
                              {getUserInitials()}
                            </AvatarFallback>
                          </Avatar>
                          {!isUserVerified() && (
                            <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center">
                              <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h2 className="text-lg font-bold text-gray-900 truncate">
                            {user?.nombre || t('navbar.mobile.user')}
                          </h2>
                          <p className="text-sm text-gray-500 truncate mb-1">{user?.email}</p>
                          {!isUserVerified() ? (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {t('navbar.mobile.verifyAccount')}
                            </Badge>
                          ) : (
                            <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {t('navbar.mobile.accountVerified')}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Accesos rápidos mejorados - solo para usuarios autenticados */}
                  <div className="px-4 py-4 w-full">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-6 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
                      <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                        {t('navbar.mobile.quickAccess')}
                      </h3>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {/* Mi Perfil */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full"
                      >
                        <Button 
                          variant="outline" 
                          className="w-full h-20 flex flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100 hover:border-indigo-200 relative overflow-hidden group"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            router.push('/profile');
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <User className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                          <span className="text-xs font-semibold text-gray-700 text-center leading-tight">{t('navbar.mobile.myProfile')}</span>
                        </Button>
                      </motion.div>

                      {/* Pedidos */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full"
                      >
                        <Button 
                          variant="outline" 
                          className="w-full h-20 flex flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-100 hover:border-amber-200 relative overflow-hidden group"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            router.push('/profile/orders');
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <ShoppingBag className="h-5 w-5 text-amber-600 flex-shrink-0" />
                          <span className="text-xs font-semibold text-gray-700 text-center leading-tight">{t('navbar.mobile.orders')}</span>
                        </Button>
                      </motion.div>

                      {/* Direcciones */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full"
                      >
                        <Button 
                          variant="outline" 
                          className="w-full h-20 flex flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 hover:border-blue-200 relative overflow-hidden group"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            router.push('/profile/addresses');
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <MapPin className="h-5 w-5 text-blue-600 flex-shrink-0" />
                          <span className="text-xs font-semibold text-gray-700 text-center leading-tight">{t('navbar.mobile.addresses')}</span>
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                  
                  <div className="w-full border-t border-gray-200 my-2"></div>
                </>
              ) : null}
              
              {/* Navegación principal - siempre visible, arriba del todo para usuarios no autenticados */}
              <div className="px-4 py-4 w-full">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-6 w-1 bg-gradient-to-b from-green-500 to-blue-500 rounded-full"></div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                    {t('navbar.mobile.exploreStore')}
                  </h3>
                </div>
                <div className="space-y-2">
                  {LINKS.map((link, index) => {
                    const isActive = pathname === link.href;
                    const LinkIcon = link.icon;
                    
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          className={cn(
                            "w-full justify-start h-14 px-4 rounded-xl transition-all duration-200",
                            isActive 
                              ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200 shadow-sm" 
                              : "text-gray-700 hover:bg-gray-50 hover:shadow-sm"
                          )}
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            router.push(link.href);
                          }}
                        >
                          <div className="flex items-center w-full">
                            <div className={cn(
                              "mr-4 p-2.5 rounded-xl transition-colors",
                              isActive 
                                ? "bg-gradient-to-br from-indigo-100 to-purple-100" 
                                : "bg-gray-100"
                            )}>
                              <LinkIcon className={cn(
                                "h-5 w-5",
                                isActive ? "text-indigo-600" : "text-gray-500"
                              )} />
                            </div>
                            <span className="flex-1 text-left font-semibold">{t(link.label)}</span>
                            {isActive && (
                              <div className="h-2 w-2 bg-indigo-500 rounded-full"></div>
                            )}
                          </div>
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              
              {/* Mi cuenta (solo usuarios autenticados) */}
              {isAuthenticated && (
                <>
                  <div className="w-full border-t border-gray-200 my-2"></div>
                  
                  <div className="px-4 py-4 w-full">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-6 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                      <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                        {t('navbar.mobile.myAccount')}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {PROFILE_MENU_ITEMS.map((item, index) => (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <Button
                            variant="ghost"
                            className="w-full justify-start h-12 px-4 rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              router.push(item.href);
                            }}
                          >
                            <div className="flex items-center w-full">
                              <div className="mr-4 p-2 rounded-xl bg-gray-100">
                                <item.icon className="h-4 w-4 text-gray-600" />
                              </div>
                              <span className="flex-1 text-left font-medium text-gray-700">{t(item.label)}</span>
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            </div>
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Espacio adicional para el scroll */}
              <div className="h-5 w-full"></div>
            </div>
            
            {/* Footer fijo */}
            <div className="border-t bg-gray-50/80 backdrop-blur-sm w-full">
              {isAuthenticated ? (
                /* Cerrar sesión (solo usuarios autenticados) */
                <>
                  <div className="w-full border-t border-gray-200"></div>
                  <div className="px-4 py-3">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 h-12 px-3 rounded-xl"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleSignOut();
                      }}
                    >
                      <div className="flex items-center w-full">
                        <div className="mr-3 p-2 rounded-xl bg-red-100">
                          <LogOut className="h-4 w-4 text-red-600" />
                        </div>
                        <span className="flex-1 text-left font-semibold">{t('navbar.mobile.logout')}</span>
                      </div>
                    </Button>
                  </div>
                </>
              ) : (
                /* Botón compacto de iniciar sesión para usuarios no autenticados */
                <div className="px-4 py-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Button 
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold h-12 rounded-xl shadow-lg"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        openAuthModal('login');
                      }}
                    >
                      <div className="flex items-center justify-center gap-3">
                        <User className="h-5 w-5" />
                        <span>{t('navbar.mobile.login')}</span>
                      </div>
                    </Button>
                  </motion.div>
                </div>
              )}
            </div>
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