"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { User, Mail, Calendar, MapPin, Heart, ShoppingBag, Settings } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

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
    href: "/profile/favorites",
    color: "text-red-500",
    bgColor: "bg-red-50",
  },
  {
    icon: MapPin,
    title: "Direcciones",
    href: "/profile/addresses",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    icon: ShoppingBag,
    title: "Pedidos",
    href: "/profile/orders",
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    icon: Settings,
    title: "Configuración",
    href: "/profile/settings",
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<Stats>({
    addresses: 0,
    favorites: 0,
    orders: 0,
  });

  const loadUserData = useCallback(async () => {
    if (!user) return;
    
    try {
      // Load user profile
      const { data: profileData, error: profileError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', user.email)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Load stats
      const [addressesCount, favoritesCount] = await Promise.all([
        supabase
          .from('direcciones_envio')
          .select('id', { count: 'exact' })
          .eq('usuario_id', profileData.id),
        supabase
          .from('favoritos')
          .select('id', { count: 'exact' })
          .eq('usuario_id', profileData.id),
      ]);

      setStats({
        addresses: addressesCount.count || 0,
        favorites: favoritesCount.count || 0,
        orders: 0, // Placeholder for orders when implemented
      });
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Error al cargar los datos del usuario');
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
      return;
    }

    if (user) {
      loadUserData();
    }
  }, [user, loading, router, loadUserData]);

  if (loading || !profile) {
    return (
      <div className="container max-w-6xl py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-white shadow-lg">
                {user.user_metadata?.avatar_url ? (
                  <Image
                    src={user.user_metadata.avatar_url}
                    alt={profile.nombre}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-indigo-100 flex items-center justify-center">
                    <User className="h-12 w-12 text-indigo-600" />
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {profile.nombre}
              </h2>
              <div className="flex items-center text-gray-500 text-sm mb-4">
                <Mail className="h-4 w-4 mr-1" />
                {profile.email}
              </div>
              <div className="flex items-center text-gray-500 text-sm">
                <Calendar className="h-4 w-4 mr-1" />
                Miembro desde {new Date(profile.fecha_creacion).toLocaleDateString()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats and Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-red-500 mb-3">
                    <Heart className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.favorites}</h3>
                  <p className="text-gray-500">Favoritos</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-500 mb-3">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.addresses}</h3>
                  <p className="text-gray-500">Direcciones</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-50 text-green-500 mb-3">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.orders}</h3>
                  <p className="text-gray-500">Pedidos</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Accesos Rápidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PROFILE_SECTIONS.map((section) => (
                  <motion.div
                    key={section.href}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full h-auto p-4 flex items-center gap-3"
                      onClick={() => router.push(section.href)}
                    >
                      <div className={`p-2 rounded-lg ${section.bgColor}`}>
                        <section.icon className={`h-5 w-5 ${section.color}`} />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-medium">{section.title}</h3>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}