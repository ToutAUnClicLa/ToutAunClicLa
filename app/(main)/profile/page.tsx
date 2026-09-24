"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
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
import { Badge } from '@/components/common/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/common/ui/avatar';
import { useTranslation } from '@/hooks/useTranslation';
import { getUserAddresses } from '@/lib/services/addresses';
import { getFavoritesCount } from '@/lib/services/favorites';
import { getUserOrderStats } from '@/lib/services/orders';
import { loginPath } from '@/lib/shop-auth';
import { PROFILE } from '@/lib/shop-profile';
import { ProfileCard, ProfileHubSkeleton, ProfilePageHeader, profileCtaClass, profileOutlineClass } from '@/components/features/profile/ProfileChrome';
import { shopChrome } from '@/lib/shop-theme';
import { cn } from '@/lib/utils';


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

export default function ProfilePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { 
    user, 
    isLoading,
  } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<Stats>({
    addresses: 0,
    favorites: 0,
    orders: 0,
  });
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Memorizar las secciones del perfil para evitar recreaciones innecesarias
  const profileSections = useMemo(() => [
    {
      icon: Heart,
      title: t('profile.sections.favorites.title'),
      description: t('profile.sections.favorites.description'),
      href: PROFILE.favorites,
      color: "text-red-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      count: stats.favorites
    },
    {
      icon: MapPin,
      title: t('profile.sections.addresses.title'),
      description: t('profile.sections.addresses.description'),
      href: PROFILE.addresses,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      count: stats.addresses
    },
    {
      icon: ShoppingBag,
      title: t('profile.sections.orders.title'),
      description: t('profile.sections.orders.description'),
      href: PROFILE.orders,
      color: "text-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      count: stats.orders
    },
    {
      icon: Shield,
      title: t('profile.sections.security.title'),
      description: t('profile.sections.security.description'),
      href: PROFILE.security,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      count: null
    },
    {
      icon: Settings,
      title: t('profile.sections.settings.title'),
      description: t('profile.sections.settings.description'),
      href: PROFILE.settings,
      color: "text-gray-500",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      count: null
    },
  ], [t, stats]);

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

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(loginPath(PROFILE.root));
      return;
    }

    if (user) {
      // Cargar datos del usuario directamente aquí
      const loadData = async () => {
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
          const [addressesData, favoritesCount, orderStats] = await Promise.all([
            getUserAddresses().catch(() => []),
            getFavoritesCount().catch(() => 0),
            getUserOrderStats().catch(() => ({ totalOrders: 0 }))
          ]);

          setStats({
            addresses: addressesData.length,
            favorites: favoritesCount,
            orders: orderStats.totalOrders,
          });
          
        } catch (error) {
          console.error('Error loading user data:', error);
          toast.error('Error al cargar los datos del usuario');
        } finally {
          setIsDataLoading(false);
        }
      };

      loadData();
    }
  }, [user, isLoading, router]); // Removido 't' de las dependencias

  if (isLoading || isDataLoading || !user) {
    return <ProfileHubSkeleton />;
  }

  return (
    <div>
      <ProfileCard className="mb-6 p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 sm:h-16 sm:w-16">
            <AvatarFallback className="bg-[var(--shop-purple-wash)] text-[var(--shop-purple)] text-base font-semibold">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 gap-2 flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate font-semibold text-[var(--shop-ink)]">Hola, {user.nombre}!</p>
              {user.verified ? (
                <Badge className="border-0 bg-[var(--shop-purple-wash)] text-[var(--shop-purple)]">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  {t('profile.general.verified')}
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-amber-50 text-amber-800">
                  <Clock className="mr-1 h-3 w-3" />
                  {t('profile.general.pendingVerification')}
                </Badge>
              )}
            </div>
            <div className="mt-1 flex flex-col gap-2 text-xs md:text-sm text-[var(--shop-muted)] sm:flex-row sm:gap-4">
              <span className="inline-flex min-w-0 items-center gap-1 break-all ">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                {user.email}
              </span>
              <span className="inline-flex items-center gap-1 ">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                {t('profile.general.memberSince')} {formatJoinDate(user.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </ProfileCard>

        {/* Secciones de gestión - grid responsivo optimizado */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {profileSections.map((section) => (
          <button
            key={section.href}
            type="button"
            onClick={() => router.push(section.href)}
            className={cn(
              'flex w-full items-center gap-3 rounded-xl border border-[var(--shop-hairline)] bg-white p-4 text-left hover:border-[var(--shop-purple-muted)]',
              shopChrome.focus
            )}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--shop-purple-wash)] text-[var(--shop-purple)]">
              <section.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-[var(--shop-ink)]">{section.title}</p>
              <p className="mt-0.5 line-clamp-2 text-sm text-[var(--shop-muted)]">{section.description}</p>
              {section.count !== null ? (
                <p className="mt-1 text-xs font-medium text-[var(--shop-purple)]">{section.count}</p>
              ) : null}
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-[var(--shop-muted)]" />
          </button>
        ))}
      </div>

      <ProfileCard className="mt-6 p-5 sm:p-6">
        <h2 className="text-base font-semibold text-[var(--shop-ink)]">
          {t('profile.general.needsHelp')}
        </h2>
        <p className="mt-1 text-sm text-[var(--shop-muted)]">{t('profile.general.supportText')}</p>
        <Button
          variant="outline"
          className={cn('mt-4', profileOutlineClass())}
          onClick={() => {
            window.location.href =
              'mailto:servicecli  ent@toutaunclicla.com?subject=Support&body=Hello, I need help with...';
          }}
        >
          {t('profile.general.contactSupport')}
        </Button>
      </ProfileCard>
    </div>
  );
}
