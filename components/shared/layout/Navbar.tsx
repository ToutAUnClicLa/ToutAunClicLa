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
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/common/ui/button";
import { Input } from "@/components/common/ui/input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/common/ui/sheet";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Image from "next/image";
import { CartDrawer } from "@/components/features/modules/cart/CartDrawer";
import { getFavoritesCount } from "@/lib/services/favorites";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/features/auth/AuthModal";
import { signOut } from '@/lib/database/auth';
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
  { icon: Heart, label: "nav.profile.favorites", href: "/profile/favorites" },
  { icon: ShoppingBag, label: "nav.profile.myOrders", href: "/profile/orders" },
  { icon: Bell, label: "nav.profile.notifications", href: "/profile/notifications" },
  { icon: Settings, label: "nav.profile.settings", href: "/profile/settings" }
];

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, userData, isLoading } = useAuth();
  
  const { currentLanguage, setLanguage, availableLanguages } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgotPassword'>('login');
  const { t } = useTranslation();

  useEffect(() => {
    if (isAuthenticated && userData) {
      loadFavoritesCount();
    }
  }, [isAuthenticated, userData]);

  const loadFavoritesCount = async () => {
    try {
      const count = await getFavoritesCount();
      setFavoritesCount(count);
    } catch (error) {
      console.error('Error loading favorites count:', error);
    }
  };

  const handleProfileNavigation = (href: string) => {
    setIsMobileMenuOpen(false);
    router.push(href);
  };
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success(t('navbar.logoutSuccess'));
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

  // Obtener las iniciales del usuario para el avatar fallback
  const getUserInitials = () => {
    if (!userData || !userData.nombre) return 'U';
    const nombre = userData.nombre;
    return nombre.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2);
  };

  // Obtener el estado de verificación del usuario
  const isUserVerified = () => {
    return userData?.verificado || false;
  };

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

              {isAuthenticated && (
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
                      <div className="relative cursor-pointer">
                        <Avatar className="h-10 w-10 border-2 border-gray-200 hover:border-indigo-500 transition-colors">
                          <AvatarImage src={userData?.url_avatar || ''} />
                          <AvatarFallback className="bg-indigo-100 text-indigo-600">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        {!isUserVerified() && (
                          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-500 border-2 border-white" 
                            title={t('navbar.accountNeedsVerification')}>
                          </span>
                        )}
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48" align="end">
                      {userData && (
                        <>
                          <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                              <p className="text-sm font-medium leading-none truncate">
                                {userData.nombre}
                              </p>
                              <p className="text-xs leading-none text-muted-foreground truncate">
                                {userData.correo_electronico}
                              </p>
                              {!isUserVerified() && (
                                <p className="text-xs text-amber-600 font-medium">
                                  {t('navbar.unverifiedAccount')}
                                </p>
                              )}
                            </div>
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      {PROFILE_MENU_ITEMS.map((item) => (
                        <DropdownMenuItem
                          key={item.href}
                          onClick={() => router.push(item.href)}
                          className="cursor-pointer"
                        >
                          <item.icon className="h-4 w-4 mr-2" />
                          {t(item.label)}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleSignOut}
                        className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        {t('navbar.logoutButton')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center">
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => openAuthModal('login')}
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
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-white rounded-full shadow-md flex items-center justify-center overflow-hidden">
                    <motion.img 
                      src="/logoaunclic.svg" 
                      alt="Logo" 
                      className="w-8 h-8"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    />
                  </div>
                  <div className="text-white">
                    <div className="text-xs font-medium">Tout À Un</div>
                    <div className="text-lg font-bold">Clic là</div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-indigo-500/20 rounded-full"
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
                  <div className="flex items-start gap-4">
                    <Avatar className="h-14 w-14 rounded-full border-2 border-indigo-100 shadow-sm relative">
                      <AvatarImage src={userData?.url_avatar || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-600 text-lg">
                        {getUserInitials()}
                      </AvatarFallback>
                      {!isUserVerified() && (                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center">
                        <span className="sr-only">{t('navbar.unverifiedAccount')}</span>
                      </span>
                      )}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-semibold text-gray-900 truncate">
                        {userData?.nombre || 'Usuario'}
                      </h2>
                      <p className="text-sm text-gray-500 truncate">{userData?.correo_electronico}</p>
                      {!isUserVerified() && (                        <Badge variant="outline" className="mt-1 bg-amber-50 text-amber-600 border-amber-200 gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                          {t('navbar.pendingVerification')}
                        </Badge>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <div className="text-center mb-2">                      <h2 className="text-xl font-semibold text-gray-900">{t('navbar.welcome')}</h2>
                      <p className="text-sm text-gray-500">{t('navbar.accessYourAccount')}</p>
                    </div>
                    <Button 
                      size="lg"
                      className="w-full"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        openAuthModal('login');
                      }}
                    >                      <User className="h-4 w-4 mr-2" />
                      {t('navbar.loginButton')}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="w-full"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        openAuthModal('register');
                      }}
                    >
                      {t('navbar.createAccountButton')}
                    </Button>
                  </div>
                )}
              </div>
              
              <Separator className="my-2" />
              
              {/* Accesos rápidos */}
              {isAuthenticated && (
                <div className="px-4 py-3">                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    {t('navbar.quickAccess')}
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      variant="outline" 
                      className="h-auto flex flex-col items-center py-3 px-1 gap-2"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        router.push('/profile/favorites');
                      }}
                    >                      <Heart className="h-5 w-5 text-red-500" />
                      <span className="text-xs">{t('navbar.favorites')}</span>
                      {favoritesCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 min-w-5 p-0 flex items-center justify-center" variant="destructive">
                          {favoritesCount}
                        </Badge>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-auto flex flex-col items-center py-3 px-1 gap-2"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        router.push('/profile/orders');
                      }}
                    >                      <ShoppingBag className="h-5 w-5 text-amber-500" />
                      <span className="text-xs">{t('navbar.orders')}</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-auto flex flex-col items-center py-3 px-1 gap-2"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        router.push('/profile/addresses');
                      }}
                    >                      <MapPin className="h-5 w-5 text-indigo-500" />
                      <span className="text-xs">{t('navbar.addresses')}</span>
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Menú principal */}
              <div className="px-4 py-3">                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {t('navbar.mainMenu')}
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
                          "w-full justify-start text-base h-12",
                          isActive ? "bg-indigo-50 text-indigo-700" : "text-gray-700"
                        )}
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          router.push(link.href);
                        }}
                      >
                        <div className="flex items-center">
                          <div className={cn(
                            "mr-3 p-1.5 rounded-md", 
                            isActive ? "bg-indigo-100" : "bg-gray-100"
                          )}>
                            <LinkIcon className={cn(
                              "h-5 w-5", 
                              isActive ? "text-indigo-600" : "text-gray-500"
                            )} />
                          </div>
                          {t(link.label)}
                        </div>
                        <ChevronRight className="ml-auto h-4 w-4 text-gray-400" />
                      </Button>
                    );
                  })}
                </div>
              </div>
              
              {/* Perfil y Configuración (Solo para usuarios autenticados) */}
              {isAuthenticated && (
                <>
                  <Separator className="my-2" />
                  
                  <div className="px-4 py-3">                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      {t('navbar.myAccount')}
                    </h3>
                    <div className="space-y-1">
                      {PROFILE_MENU_ITEMS.filter(item => item.label !== 'Favoritos' && 
                                                       item.label !== 'Mis Pedidos' && 
                                                       item.label !== 'Direcciones').map((item) => (
                        <Button
                          key={item.href}
                          variant="ghost"
                          className="w-full justify-start text-base h-11"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            router.push(item.href);
                          }}
                        >
                          <item.icon className="h-5 w-5 mr-3 text-gray-500" />
                          {t(item.label)}
                          <ChevronRight className="ml-auto h-4 w-4 text-gray-400" />
                        </Button>
                      ))}
                    </div>
                  </div>
                </>              )}

            </div>
            
            {/* Pie del menú móvil */}
            {isAuthenticated && (
              <div className="px-4 py-4 border-t border-gray-200">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-red-600 border-red-100 hover:bg-red-50 hover:border-red-200"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleSignOut();
                  }}
                >                  <LogOut className="h-4 w-4 mr-2" />
                  {t('navbar.logoutButton')}
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