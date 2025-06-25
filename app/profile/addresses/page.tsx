"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { MapPin, Plus, ChevronLeft, Home, Building2, Phone } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/ui/card';
// Removido import de supabase - TODO: Implementar servicio de direcciones con tu backend

interface Address {
  id: number;
  direccion: string;
  ciudad: string;
  estado: string;
  codigo_postal: string;
  pais: string;
  telefono: string | null;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function AddressesPage() {
  const router = useRouter();
  const { 
    user, 
    userData, 
    isLoading,
    isAuthenticated
  } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);

  const loadAddresses = useCallback(async () => {
    try {
      // TODO: Implementar endpoint GET /addresses en tu backend
      console.warn('loadAddresses: Endpoint de direcciones no implementado en el backend');
      setAddresses([]);
      toast.info('Funcionalidad de direcciones pendiente de implementar');
    } catch (error) {
      console.error('Error loading addresses:', error);
      toast.error('Error al cargar las direcciones');
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      loadAddresses();
    }
  }, [user, loadAddresses]);

  async function handleDeleteAddress(addressId: number) {
    try {
      // TODO: Implementar endpoint DELETE /addresses/:id en tu backend
      console.warn('handleDeleteAddress: Endpoint de eliminación de direcciones no implementado');
      setAddresses(addresses.filter(addr => addr.id !== addressId));
      toast.info('Funcionalidad de eliminación pendiente de implementar');
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Error al eliminar la dirección');
    }
  }

  if (isLoading || !user) {
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
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => router.back()}
              className="lg:hidden"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <MapPin className="h-8 w-8 text-indigo-600" />
              <div>
                <h1 className="text-2xl font-bold">Mis Direcciones</h1>
                <p className="text-sm text-gray-500">
                  {addresses.length} {addresses.length === 1 ? 'dirección' : 'direcciones'}
                </p>
              </div>
            </div>
          </div>
          <Button onClick={() => router.push('/profile/addresses/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar dirección
          </Button>
        </div>

        {addresses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MapPin className="h-16 w-16 text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No tienes direcciones guardadas
              </h2>
              <p className="text-gray-500 text-center mb-6 max-w-md">
                Agrega direcciones de envío para agilizar tus compras
              </p>
              <Button onClick={() => router.push('/profile/addresses/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar dirección
              </Button>
            </CardContent>
          </Card>
        ) : (
          <AnimatePresence>
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {addresses.map((address) => (
                <motion.div key={address.id} variants={item}>
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Home className="h-5 w-5 text-indigo-600" />
                        Dirección {address.id}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <Building2 className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-gray-900">{address.direccion}</p>
                            <p className="text-gray-500">
                              {address.ciudad}, {address.estado} {address.codigo_postal}
                            </p>
                            <p className="text-gray-500">{address.pais}</p>
                          </div>
                        </div>
                        {address.telefono && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <p className="text-gray-600">{address.telefono}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => router.push(`/profile/addresses/${address.id}`)}
                        >
                          Editar
                        </Button>
                        <Button 
                          variant="destructive"
                          onClick={() => handleDeleteAddress(address.id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}