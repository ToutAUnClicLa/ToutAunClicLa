"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Heart, 
  ShoppingBag, 
  Settings, 
  Shield,
  Edit,
  CheckCircle,
  Clock,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/ui/card';
import { Badge } from '@/components/common/ui/badge';
import { Separator } from '@/components/common/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/common/ui/avatar';
import { useTranslation } from '@/hooks/useTranslation';
import { getUserAddresses } from '@/lib/services/addresses';
import { getFavoritesCount } from '@/lib/services/favorites';


interface UserProfile {
  id: string;
  nombre: string;
  email: string;
  fecha_creacion: string;
}

interface Stats {
  addresses: number;
  favorites: number;
  orders: number;
}

const getProfileSections = (t: any) => [
  {
    icon: Heart,
    title: t('profile.sections.favorites.title'),
    description: t('profile.sections.favorites.description'),
    href: "/profile/favorites",
    color: "text-red-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    count: 0
  },
  {
    icon: MapPin,
    title: t('profile.sections.addresses.title'),
    description: t('profile.sections.addresses.description'),
    href: "/profile/addresses",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    count: 0
  },
  {
    icon: ShoppingBag,
    title: t('profile.sections.orders.title'),
    description: t('profile.sections.orders.description'),
    href: "/profile/orders",
    color: "text-green-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    count: 0
  },
  {
    icon: Shield,
    title: t('profile.sections.security.title'),
    description: t('profile.sections.security.description'),
    href: "/profile/security",
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    count: null
  },
  {
    icon: Settings,
    title: t('profile.sections.settings.title'),
    description: t('profile.sections.settings.description'),
    href: "/profile/settings",
    color: "text-gray-500",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    count: null
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { 
    user, 
    isLoading,
    isAuthenticated,
    error,
    refreshAuth
  } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<Stats>({
    addresses: 0,
    favorites: 0,
    orders: 0,
  });
  const [isDataLoading, setIsDataLoading] = useState(true);

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

  // Función para formatear la fecha de registro
  const formatJoinDate = (dateString?: string) => {
    if (!dateString) return t('common.dateNotAvailable');
    try {
      return new Intl.DateTimeFormat('es-ES', { 
        year: 'numeric', 
        month: 'long' 
      }).format(new Date(dateString));
    } catch {
      return t('common.dateNotAvailable');
    }
  };

  const loadUserData = useCallback(async () => {
    if (!user) return;
    
    setIsDataLoading(true);
    try {
      // Ya tenemos los datos del usuario desde el hook useAuth
      setProfile({
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        fecha_creacion: user.createdAt,
      });

      // Cargar estadísticas reales
      const [addressesData, favoritesCount] = await Promise.all([
        getUserAddresses().catch(() => []),
        getFavoritesCount().catch(() => 0)
      ]);

      setStats({
        addresses: addressesData.length,
        favorites: favoritesCount,
        orders: 0, // TODO: Implementar cuando tengamos endpoint de pedidos
      });
      
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error(t('profile.errors.loadingUserData'));
    } finally {
      setIsDataLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
      return;
    }

    if (user) {
      loadUserData();
    }
  }, [user, isLoading, router, loadUserData]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Mapear secciones con stats
  const profileSections = getProfileSections(t);
  const sectionsWithStats = profileSections.map(section => ({
    ...section,
    count: section.title === t('profile.sections.favorites.title') ? stats.favorites :
           section.title === t('profile.sections.addresses.title') ? stats.addresses :
           section.title === t('profile.sections.orders.title') ? stats.orders :
           section.count
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30">
      <div className="container max-w-6xl mx-auto py-2 sm:py-4 md:py-6 px-3 sm:px-4">
        {/* Header del perfil - optimizado móvil */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 sm:mb-6"
        >
          <Card className="overflow-hidden shadow-lg border-0">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-3 sm:p-4 md:p-6 text-white relative">
              {/* Decoraciones de fondo más sutiles */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-pink-600/20"></div>
              <div className="absolute top-2 right-2 w-16 h-16 bg-white/5 rounded-full blur-2xl"></div>
              
              <div className="relative">
                {/* Layout móvil: vertical compacto */}
                <div className="flex flex-col space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <Avatar className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 border-2 border-white/40 shadow-lg">
                      <AvatarImage src="" alt={user.nombre} />
                      <AvatarFallback className="bg-white/20 text-white text-sm sm:text-base md:text-lg font-bold">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white truncate">
                        {t('profile.general.welcome')} {user.nombre.split(' ')[0]}! 👋
                      </h1>
                      {user.verified ? (
                        <Badge className="bg-green-500/80 text-white border-green-400/50 text-xs sm:text-sm font-medium mt-1">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {t('profile.general.verified')}
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-500/80 text-white border-amber-400/50 text-xs sm:text-sm font-medium mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {t('profile.general.pendingVerification')}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Información del usuario más compacta */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-indigo-100">
                    <div className="flex items-center gap-2 min-w-0">
                      <Mail className="h-4 w-4 flex-shrink-0 opacity-80" />
                      <span className="text-xs sm:text-sm truncate font-medium">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 flex-shrink-0 opacity-80" />
                      <span className="text-xs sm:text-sm font-medium">{t('profile.general.memberSince')} {formatJoinDate(user.createdAt)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Botón de editar posicionado mejor */}
                <div className="absolute top-0 right-0">
                  <Button 
                    size="sm"
                    variant="ghost"
                    className="bg-white/10 border border-white/20 text-white hover:bg-white/20 text-xs sm:text-sm backdrop-blur-sm h-8 sm:h-9 px-2 sm:px-3"
                    onClick={() => router.push('/profile/settings')}
                  >
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                    <span className="hidden sm:inline">{t('profile.general.editProfile')}</span>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Secciones de gestión - grid responsivo optimizado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
            <div className="p-1.5 sm:p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
              <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            {t('profile.general.manageAccount')}
          </h2>
          
          {/* Grid responsivo mejorado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            {sectionsWithStats.map((section, index) => (
              <motion.div
                key={section.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className="hover:shadow-lg transition-all duration-200 cursor-pointer border-0 shadow-sm bg-white group hover:bg-gray-50/80 h-full"
                  onClick={() => router.push(section.href)}
                >
                  <CardContent className="p-4 sm:p-5 h-full">
                    <div className="flex items-center justify-between h-full">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`p-2.5 sm:p-3 bg-gradient-to-r ${
                          section.title === t('profile.sections.favorites.title') ? 'from-red-500 to-pink-500' :
                          section.title === t('profile.sections.addresses.title') ? 'from-blue-500 to-indigo-500' :
                          section.title === t('profile.sections.orders.title') ? 'from-green-500 to-emerald-500' :
                          section.title === t('profile.sections.security.title') ? 'from-purple-500 to-violet-500' :
                          'from-gray-500 to-slate-500'
                        } rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200`}>
                          <section.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base truncate">{section.title}</h3>
                          <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{section.description}</p>
                          {section.count !== null && (
                            <Badge 
                              variant="secondary" 
                              className="text-xs bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 border-indigo-100 font-medium px-2 py-0.5"
                            >
                              {section.count}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 group-hover:text-indigo-500 transition-all duration-200 group-hover:translate-x-0.5" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sección de ayuda - más compacta */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 sm:mt-8"
        >
          <Card className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-0 shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="text-center space-y-3 sm:space-y-4">
                <div className="flex justify-center">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-sm">
                    <Heart className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    {t('profile.general.needsHelp')}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
                    {t('profile.general.supportText')}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                  <Button 
                    variant="outline" 
                    className="border-blue-300 text-blue-700 hover:bg-blue-100 text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200"
                    onClick={() => window.location.href = 'mailto:serviceclient@toutaunclicla.com?subject=Solicitud de soporte&body=Hola, necesito ayuda con...'}
                  >
                    💬 {t('profile.general.contactSupport')}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-purple-300 text-purple-700 hover:bg-purple-100 text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200"
                  >
                    📖 {t('profile.general.faq')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
