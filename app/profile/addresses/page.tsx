"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { 
  MapPin, 
  Plus, 
  ArrowLeft, 
  Home, 
  Building2, 
  Edit, 
  Trash2, 
  CheckCircle,
  AlertCircle,
  Shield
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/ui/card';
import { Badge } from '@/components/common/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/common/ui/dialog';
import { Input } from '@/components/common/ui/input';
import { Label } from '@/components/common/ui/label';
import {
  getUserAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  Address,
  CreateAddressData,
  UpdateAddressData
} from '@/lib/services/addresses';
import { validateMontrealAddress, formatCanadianPostalCode } from '@/lib/utils/montreal-validation';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

interface FormData {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const initialFormData: FormData = {
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: ''
};

export default function AddressesPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadAddresses = useCallback(async () => {
    if (!user) return;
    
    setIsLoadingAddresses(true);
    try {
      const data = await getUserAddresses();
      setAddresses(data);
    } catch (error: any) {
      console.error('Error loading addresses:', error);
      toast.error('Error al cargar direcciones', {
        description: error.message || 'No pudimos cargar tus direcciones'
      });
    } finally {
      setIsLoadingAddresses(false);
    }
  }, [user]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const validateAddress = (data: FormData): boolean => {
    const validation = validateMontrealAddress(data.city, data.zipCode);
    
    if (!validation.isValid) {
      toast.error('Dirección no válida', {
        description: validation.error
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAddress(formData)) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingAddress) {
        const updateData: UpdateAddressData = {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        };
        
        await updateAddress(editingAddress.id, updateData);
        toast.success('Dirección actualizada', {
          description: 'La dirección se ha actualizado correctamente'
        });
      } else {
        const createData: CreateAddressData = {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        };
        
        await createAddress(createData);
        toast.success('Dirección creada', {
          description: 'La dirección se ha creado correctamente'
        });
      }
      
      setIsDialogOpen(false);
      setFormData(initialFormData);
      setEditingAddress(null);
      await loadAddresses();
    } catch (error: any) {
      console.error('Error submitting address:', error);
      toast.error('Error al guardar', {
        description: error.message || 'No pudimos guardar la dirección'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    setDeletingId(addressId);
    try {
      await deleteAddress(addressId);
      toast.success('Dirección eliminada', {
        description: 'La dirección se ha eliminado correctamente'
      });
      await loadAddresses();
    } catch (error: any) {
      console.error('Error deleting address:', error);
      toast.error('Error al eliminar', {
        description: error.message || 'No pudimos eliminar la dirección'
      });
    } finally {
      setDeletingId(null);
    }
  };

  const openEditDialog = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingAddress(null);
    setFormData(initialFormData);
    setIsDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Formatear código postal automáticamente
    if (name === 'zipCode') {
      const formattedValue = formatCanadianPostalCode(value);
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-7xl mx-auto py-4 sm:py-6 md:py-8 px-3 sm:px-4">
        {/* Header responsive */}
        <div className="mb-6 sm:mb-8">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 sm:p-6 text-white">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-6">
                <div className="p-3 sm:p-4 bg-white/10 rounded-full">
                  <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 sm:gap-3 mb-2">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Mis Direcciones</h1>
                    <Badge className="bg-white/20 hover:bg-white/30 w-fit text-white border-white/30 text-sm">
                      {addresses.length} {addresses.length === 1 ? 'dirección' : 'direcciones'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-blue-100">
                    <p className="text-sm">
                      Solo se permiten direcciones en Montreal
                    </p>
                    <p className="text-xs">
                      Agrega, edita o elimina direcciones de entrega
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-sm h-9"
                    onClick={() => router.back()}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver
                  </Button>
                  <Button
                    className="bg-white text-blue-600 hover:bg-white/90 text-sm h-9"
                    onClick={openCreateDialog}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 bg-blue-50 rounded-full">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{addresses.length}</p>
                  <p className="text-xs sm:text-sm text-gray-600">Direcciones guardadas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 bg-green-50 rounded-full">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {addresses.filter(addr => addr.city.toLowerCase().includes('montreal')).length}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">En Montreal</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de direcciones */}
        {isLoadingAddresses ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600">Cargando direcciones...</p>
            </div>
          </div>
        ) : addresses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="relative">
                <div className="h-20 w-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-10 w-10 text-blue-600" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-8 w-8 bg-white rounded-full border-4 border-gray-50 flex items-center justify-center">
                  <Plus className="h-4 w-4 text-gray-600" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No tienes direcciones guardadas
              </h2>
              <p className="text-gray-500 text-center mb-6 max-w-md">
                Agrega direcciones de entrega en Montreal para agilizar tus compras
              </p>
              <Button onClick={openCreateDialog} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                <Plus className="h-4 w-4 mr-2" />
                Agregar primera dirección
              </Button>
            </CardContent>
          </Card>
        ) : (
          <AnimatePresence>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              {addresses.map((address, index) => (
                <motion.div 
                  key={address.id} 
                  variants={itemVariants}
                  layout
                  className="group"
                >
                  <Card className="h-full transition-all duration-200 hover:shadow-lg border-0 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <Home className="h-5 w-5 text-blue-600" />
                        <span className="truncate">Dirección {address.id.slice(-6)}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Building2 className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-900 font-medium break-words">{address.street}</p>
                            <p className="text-gray-600 text-sm break-words">
                              {address.city}, {address.state} {address.zipCode}
                            </p>
                            <p className="text-gray-500 text-sm">{address.country}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-4 border-t">
                        <Button 
                          variant="outline" 
                          className="flex-1 text-xs sm:text-sm h-8 sm:h-9"
                          onClick={() => openEditDialog(address)}
                        >
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          Editar
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1 text-xs sm:text-sm h-8 sm:h-9 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteAddress(address.id)}
                          disabled={deletingId === address.id}
                        >
                          {deletingId === address.id ? (
                            <div className="h-3 w-3 sm:h-4 sm:w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-1 sm:mr-2" />
                          ) : (
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          )}
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

        {/* Modal para crear/editar dirección */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? 'Editar dirección' : 'Nueva dirección'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-blue-800">
                  <Shield className="h-4 w-4" />
                  <p className="text-sm font-medium">Solo direcciones en Montreal</p>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  Validamos que la ciudad sea Montreal y que el código postal sea válido (H1A-H1Z, H2A-H2Z, H3A-H3Z, H4A-H4Z, H5A-H5B)
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="street">Dirección *</Label>
                <Input
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  placeholder="Ej: 1234 Rue Sainte-Catherine"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Montreal"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">Provincia *</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Quebec"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Código Postal *</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="H2X 1L4"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">País *</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="Canadá"
                    required
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Guardando...
                    </>
                  ) : (
                    editingAddress ? 'Actualizar' : 'Crear'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
