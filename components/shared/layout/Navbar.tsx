"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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
import { loginPath } from "@/lib/shop-auth";
import { PROFILE } from "@/lib/shop-profile";
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
import { ShopLangSwitcher } from '@/components/shared/layout/ShopLangSwitcher';
import { shopChrome } from '@/lib/shop-theme';

const LINKS = [
  { href: "/", label: "nav.home", icon: Home },
  // Productos ocultado temporalmente (conservar para reactivar)
  // { href: "/productos", label: "nav.products", icon: Package },
  { href: "/comidas", label: "nav.foods", icon: ShoppingBag },
  { href: "/servicios", label: "nav.services", icon: Layers },
  { href: "/boutique", label: "nav.boutique", icon: Store }
];

const PROFILE_MENU_ITEMS = [
  { icon: User, label: "nav.profile.myProfile", href: PROFILE.root },
  { icon: Heart, label: "nav.profile.favorites", href: PROFILE.favorites },
  { icon: MapPin, label: "nav.profile.addresses", href: PROFILE.addresses },
  { icon: ShoppingBag, label: "nav.profile.myOrders", href: PROFILE.orders },
  { icon: Shield, label: "nav.profile.security", href: PROFILE.security },
  { icon: Settings, label: "nav.profile.settings", href: PROFILE.settings }
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

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

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

  const goLogin = () => {
    router.push(loginPath(`${pathname}${typeof window !== 'undefined' ? window.location.search : ''}`));
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [isMobileMenuOpen]);

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
  ];

  // No renderizar Navbar en las rutas de administrador, EXCEPTO en las páginas de login.
  // Tampoco en /factura/* (la factura debe imprimirse sin navbar).
  const isDashboardRoute = (pathname?.startsWith('/restaurante') && pathname !== '/restaurante/login') ||
    (pathname?.startsWith('/admin') && pathname !== '/admin/login') ||
    pathname?.startsWith('/factura');

  if (isDashboardRoute) {
    return null;
  }

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 h-[4.5rem] bg-white/90 backdrop-blur-md border-b border-[var(--shop-hairline)]",
        scrolled ? "shadow-[0_1px_0_0_var(--shop-hairline)]" : ""
      )}>
        <nav className="container mx-auto h-full" aria-label="Principal">
          <div className="flex h-[4.5rem] min-w-0 flex-nowrap items-center gap-1.5 sm:gap-3">
            <Link
              href="/"
              className={cn("flex min-h-11 shrink-0 items-center gap-2", shopChrome.focus)}
              aria-label="Tout à un Clic Là"
            >
              <img
                src="/icons/logo.png"
                alt=""
                className="h-[60px] w-[60px] shrink-0 object-contain"
                width="60"
                height="60"
              />
              <span className={cn(shopChrome.wordmark, "shrink-0")}>
                <span className="text-sm font-medium text-[var(--shop-ink)] whitespace-nowrap sm:text-[15px]">Tout à un</span>
                <span className="text-sm font-extrabold text-[var(--shop-purple)] whitespace-nowrap sm:text-[15px]">Clic Là</span>
              </span>
            </Link>

            <div className="hidden min-w-0 flex-1 items-center justify-center gap-5 lg:flex xl:gap-7">
              {LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      shopChrome.navLink,
                      shopChrome.focus,
                      isActive ? "text-[var(--shop-purple)]" : "text-gray-600 hover:text-[var(--shop-purple)]"
                    )}
                  >
                    {t(link.label)}
                    {isActive && (
                      <span className="absolute inset-x-0 bottom-2 h-px bg-[var(--shop-purple)]" />
                    )}
                  </Link>
                );
              })}
            </div>
            <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-3">
              <ShopLangSwitcher />

              {/* Botón de favoritos - solo para usuarios autenticados */}
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("relative hidden lg:inline-flex", shopChrome.iconBtn)}
                  title="Mis favoritos"
                  onClick={() => router.push(PROFILE.favorites)}
                >
                  <Heart className="h-5 w-5" />
                </Button>
              )}

              {/* Botón de carrito con contador optimizado */}
              <Button
                variant="ghost"
                size="icon"
                className={cn("relative", shopChrome.iconBtn)}
                title={`Carrito de compras${cartCount > 0 ? ` (${cartCount} productos)` : ''}`}
                onClick={() => router.push('/cart')}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs font-bold shadow-lg"
                  >
                    {cartCount > 99 ? '99+' : cartCount}
                  </Badge>
                )}
              </Button>

              {/* Autenticación */}
              <div className="hidden lg:flex items-center gap-5">
                <Link
                  href="/pro"
                  className={cn("inline-flex h-11 min-h-11 items-center px-1 text-sm font-medium", shopChrome.textLink)}
                >
                  Pro
                </Link>
                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="relative cursor-pointer group">
                        <Avatar className="h-10 w-10 border-2 border-gray-200 hover:border-[var(--shop-purple)] transition-colors duration-200 ring-2 ring-transparent group-hover:ring-[var(--shop-purple-wash)]">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-[var(--shop-purple)] text-white font-semibold">
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
                          <div className="bg-[var(--shop-purple)] p-4 text-white">
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
                  <Button
                    variant="ghost"
                    onClick={goLogin}
                    className={cn("h-9 min-h-11 px-4 py-2 rounded-full bg-[var(--shop-purple)] text-white hover:bg-[var(--shop-purple-hover)] hover:text-white", shopChrome.focus)}
                  >
                    {t('nav.login')}
                  </Button>
                )}
              </div>              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className={cn("lg:hidden", shopChrome.iconBtn)}
                aria-expanded={isMobileMenuOpen}
                aria-controls="shop-mobile-nav"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">{t('navbar.mobile.menu')}</span>
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Menú Móvil Refactorizado */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="shop-mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label={t('navbar.mobile.menu')}
            className="fixed inset-0 bg-white z-50 lg:hidden flex flex-col w-full overflow-hidden"
            initial={reduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: '100%' }}
            transition={reduceMotion ? { duration: 0 } : { type: 'spring', damping: 30, stiffness: 400 }}
          >
            {/* Header del menú móvil — mismo alto y wordmark que el chrome */}
            <div className="relative h-[4.5rem] w-full shrink-0 border-b border-[var(--shop-hairline)] bg-white px-4">
              <div className="flex h-[4.5rem] items-center justify-between gap-2">
                  <Link
                  href="/"
                  className={cn("flex min-h-11 shrink-0 items-center gap-2", shopChrome.focus)}
                  aria-label="Tout à un Clic Là"
                >
                  <img
                    src="/icons/logo.png"
                    alt=""
                    className="h-[60px] w-[60px] shrink-0 object-contain"
                    width="60"
                    height="60"
                  />
                  <span className={cn(shopChrome.wordmark, "shrink-0")}>
                    <span className="text-sm font-medium text-[var(--shop-ink)] whitespace-nowrap sm:text-[15px]">Tout à un</span>
                    <span className="text-sm font-extrabold text-[var(--shop-purple)] whitespace-nowrap sm:text-[15px]">Clic Là</span>
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("border-0 shadow-none", shopChrome.iconBtn)}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">{t('navbar.mobile.menu')}</span>
                </Button>
              </div>
            </div>

            {/* Contenido principal con scroll suave */}
            <div className="flex-1 overflow-y-auto overscroll-contain w-full">
              {isAuthenticated ? (
                <>
                  {/* Sección de usuario autenticado */}
                  <div className="px-4 py-5 bg-gray-50 w-full">
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
                            <AvatarFallback className="bg-[var(--shop-purple)] text-white font-bold text-lg">
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
                      <h3 className="text-sm font-semibold text-[var(--shop-ink)]">
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
                          className="w-full h-20 flex flex-col items-center justify-center gap-1.5 bg-[var(--shop-purple-wash)] border-[var(--shop-purple-muted)] hover:border-[var(--shop-purple)] relative overflow-hidden group"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            router.push(PROFILE.root);
                          }}
                        >
                          <User className="h-5 w-5 text-[var(--shop-purple)] flex-shrink-0" />
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
                          className="w-full h-20 flex flex-col items-center justify-center gap-1.5 bg-[var(--food-wash)] border-gray-200 hover:border-[var(--food-accent)] relative overflow-hidden group"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            router.push(PROFILE.orders);
                          }}
                        >
                          <ShoppingBag className="h-5 w-5 text-[var(--food-accent)] flex-shrink-0" />
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
                          className="w-full h-20 flex flex-col items-center justify-center gap-1.5 bg-[var(--svc-wash)] border-gray-200 hover:border-[var(--svc-primary)] relative overflow-hidden group"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            router.push(PROFILE.addresses);
                          }}
                        >
                          <MapPin className="h-5 w-5 text-[var(--svc-primary)] flex-shrink-0" />
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
                  <h3 className="text-sm font-semibold text-[var(--shop-ink)]">
                    {t('navbar.mobile.exploreStore')}
                  </h3>
                </div>
                <div className="space-y-1">
                  {LINKS.map((link) => {
                    const isActive = pathname === link.href;
                    const LinkIcon = link.icon;
                    const label = t(link.label);

                    return (
                      <Button
                        key={link.href}
                        variant="ghost"
                        className={cn(
                          shopChrome.drawerRow,
                          isActive && "bg-[var(--shop-purple-wash)] text-[var(--shop-purple)]"
                        )}
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          router.push(link.href);
                        }}
                      >
                        <LinkIcon className={cn("mr-3 h-5 w-5", isActive ? "text-[var(--shop-purple)]" : "text-gray-500")} />
                        <span className="flex-1 text-left font-medium">{label}</span>
                      </Button>
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
                      <h3 className="text-sm font-semibold text-[var(--shop-ink)]">
                        {t('navbar.mobile.myAccount')}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {PROFILE_MENU_ITEMS.map((item) => (
                        <div key={item.href}>
                          <Button
                            variant="ghost"
                            className={shopChrome.drawerRow}
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
                        </div>
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
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 min-h-11 h-11 px-3 rounded-lg focus-visible:ring-2 focus-visible:ring-[var(--shop-purple)]"
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
                      className="w-full min-h-11 bg-[var(--shop-purple)] hover:bg-[var(--shop-purple-hover)] text-white font-medium h-11 rounded-lg focus-visible:ring-2 focus-visible:ring-[var(--shop-purple)] focus-visible:ring-offset-2"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        goLogin();
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

    </>
  );
}
