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
// Removido import de supabase - ahora usamos solo el backend de Express
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/ui/card';
import { Badge } from '@/components/common/ui/badge';
import { Separator } from '@/components/common/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/common/ui/avatar';
import { useTranslation } from '@/hooks/useTranslation';

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

      // TODO: Implementar endpoints en tu backend para obtener estadísticas
      // Por ahora usar valores por defecto
      setStats({
        addresses: 0,
        favorites: 0,
        orders: 0,
      });
      
      toast.success('Perfil cargado correctamente');
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
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-7xl mx-auto py-8 px-4">
        {/* Header del perfil */}
        <div className="mb-8">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="h-20 w-20 md:h-24 md:w-24 border-4 border-white shadow-lg">
                  <AvatarImage src="" alt={user.nombre} />
                  <AvatarFallback className="bg-white text-indigo-600 text-xl font-bold">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold">{user.nombre}</h1>
                    {user.verified ? (
                      <Badge className="bg-green-500 hover:bg-green-600 w-fit">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verificado
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="w-fit">
                        <Clock className="h-3 w-3 mr-1" />
                        Pendiente verificación
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-1 text-indigo-100">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Miembro desde {formatJoinDate(user.createdAt)}</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="secondary" 
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={() => router.push('/profile/settings')}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar perfil
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-50 rounded-full">
                  <Heart className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.favorites}</p>
                  <p className="text-sm text-gray-600">Productos favoritos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-full">
                  <MapPin className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.addresses}</p>
                  <p className="text-sm text-gray-600">Direcciones guardadas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-50 rounded-full">
                  <ShoppingBag className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.orders}</p>
                  <p className="text-sm text-gray-600">Pedidos realizados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secciones de gestión */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Gestionar cuenta</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sectionsWithStats.map((section, index) => (
              <motion.div
                key={section.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`hover:shadow-lg transition-all duration-200 cursor-pointer border-2 ${section.borderColor} hover:border-opacity-50`}
                  onClick={() => router.push(section.href)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 ${section.bgColor} rounded-lg`}>
                          <section.icon className={`h-6 w-6 ${section.color}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{section.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{section.description}</p>
                          {section.count !== null && (
                            <Badge variant="secondary" className="text-xs">
                              {section.count} elementos
                            </Badge>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sección de ayuda */}
        <div className="mt-12">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">¿Necesitas ayuda?</h3>
                <p className="text-gray-600 mb-4">
                  Si tienes alguna pregunta o problema, nuestro equipo de soporte está aquí para ayudarte.
                </p>
                <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                  Contactar soporte
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
