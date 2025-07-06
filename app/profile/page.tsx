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

const PROFILE_SECTIONS = [
  {
    icon: Heart,
    title: "Favoritos",
    description: "Productos que te gustan",
    href: "/profile/favorites",
    color: "text-red-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    count: 0
  },
  {
    icon: MapPin,
    title: "Direcciones",
    description: "Direcciones de entrega",
    href: "/profile/addresses",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    count: 0
  },
  {
    icon: ShoppingBag,
    title: "Pedidos",
    description: "Historial de compras",
    href: "/profile/orders",
    color: "text-green-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    count: 0
  },
  {
    icon: Shield,
    title: "Seguridad",
    description: "Contraseña y privacidad",
    href: "/profile/security",
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    count: null
  },
  {
    icon: Settings,
    title: "Configuración",
    description: "Preferencias y notificaciones",
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
    if (!dateString) return 'Fecha no disponible';
    try {
      return new Intl.DateTimeFormat('es-ES', { 
        year: 'numeric', 
        month: 'long' 
      }).format(new Date(dateString));
    } catch {
      return 'Fecha no disponible';
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
      toast.error('Error al cargar la información del usuario');
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
  const sectionsWithStats = PROFILE_SECTIONS.map(section => ({
    ...section,
    count: section.title === 'Favoritos' ? stats.favorites :
           section.title === 'Direcciones' ? stats.addresses :
           section.title === 'Pedidos' ? stats.orders :
           section.count
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30">
      <div className="container max-w-7xl mx-auto py-3 sm:py-6 md:py-8 px-3 sm:px-4">
        {/* Header del perfil - responsive mejorado */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 sm:mb-8"
        >
          <Card className="overflow-hidden shadow-xl border-0">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-4 sm:p-6 md:p-8 text-white relative">
              {/* Decoraciones de fondo */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-pink-600/20 backdrop-blur-sm"></div>
              <div className="absolute top-4 right-4 w-24 h-24 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-4 left-4 w-20 h-20 bg-white/5 rounded-full blur-2xl"></div>
              
              <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-4 sm:gap-6">
                <Avatar className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 border-4 border-white/40 shadow-2xl backdrop-blur-sm">
                  <AvatarImage src="" alt={user.nombre} />
                  <AvatarFallback className="bg-white/20 text-white text-xl sm:text-2xl font-bold backdrop-blur-sm">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-indigo-100 bg-clip-text text-transparent">
                      ¡Hola, {user.nombre.split(' ')[0]}! 👋
                    </h1>
                    {user.verified ? (
                      <Badge className="bg-green-500/80 hover:bg-green-600/80 w-fit text-white border-green-400/50 text-sm font-medium backdrop-blur-sm shadow-lg">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verificado
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-amber-500/80 text-white border-amber-400/50 w-fit text-sm font-medium backdrop-blur-sm">
                        <Clock className="h-3 w-3 mr-1" />
                        Pendiente verificación
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-indigo-100">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 sm:h-5 sm:w-5 opacity-80" />
                      <span className="text-sm sm:text-base truncate font-medium">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5 opacity-80" />
                      <span className="text-sm sm:text-base font-medium">Miembro desde {formatJoinDate(user.createdAt)}</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="secondary" 
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30 text-sm font-medium backdrop-blur-sm transition-all duration-200 shadow-lg hover:shadow-xl"
                  onClick={() => router.push('/profile/settings')}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar perfil
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Estadísticas rápidas - responsive mejoradas */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl shadow-lg">
                  <Heart className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.favorites}</p>
                  <p className="text-sm sm:text-base text-gray-600 font-medium">Productos favoritos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                  <MapPin className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.addresses}</p>
                  <p className="text-sm sm:text-base text-gray-600 font-medium">Direcciones guardadas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="sm:col-span-2 lg:col-span-1 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
                  <ShoppingBag className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.orders}</p>
                  <p className="text-sm sm:text-base text-gray-600 font-medium">Pedidos realizados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Secciones de gestión - responsive mejoradas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
              <Settings className="h-5 w-5 text-white" />
            </div>
            Gestionar cuenta
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {sectionsWithStats.map((section, index) => (
              <motion.div
                key={section.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:bg-white group`}
                  onClick={() => router.push(section.href)}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 sm:gap-4 flex-1">
                        <div className={`p-3 sm:p-4 bg-gradient-to-r ${
                          section.title === 'Favoritos' ? 'from-red-500 to-pink-500' :
                          section.title === 'Direcciones' ? 'from-blue-500 to-indigo-500' :
                          section.title === 'Pedidos' ? 'from-green-500 to-emerald-500' :
                          section.title === 'Seguridad' ? 'from-purple-500 to-violet-500' :
                          'from-gray-500 to-slate-500'
                        } rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                          <section.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 mb-1 text-base sm:text-lg">{section.title}</h3>
                          <p className="text-sm sm:text-base text-gray-600 mb-3">{section.description}</p>
                          {section.count !== null && (
                            <Badge 
                              variant="secondary" 
                              className="text-xs bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border-indigo-200 font-medium"
                            >
                              {section.count} elementos
                            </Badge>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 flex-shrink-0 group-hover:text-indigo-500 transition-colors duration-300 group-hover:translate-x-1 transform" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sección de ayuda - responsive mejorada */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 sm:mt-12"
        >
          <Card className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-0 shadow-lg">
            <CardContent className="p-6 sm:p-8">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-lg">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    ¿Necesitas ayuda? Estamos aquí para ti
                  </h3>
                  <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    Nuestro equipo de soporte está disponible para ayudarte con cualquier pregunta o problema. 
                    <span className="font-semibold text-indigo-600"> Tu satisfacción es nuestra prioridad.</span>
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2">
                  <Button 
                    variant="outline" 
                    className="border-2 border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400 font-medium px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    💬 Contactar soporte
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-2 border-purple-300 text-purple-700 hover:bg-purple-100 hover:border-purple-400 font-medium px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    📖 Ver preguntas frecuentes
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
