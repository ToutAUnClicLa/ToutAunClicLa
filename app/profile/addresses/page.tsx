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
import { useTranslation } from '@/hooks/useTranslation';
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
  const { t } = useTranslation();
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
      toast.error(t('addresses.errors.loadFailed'), {
        description: error.message || t('addresses.errors.loadFailedDesc')
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
      toast.error(t('addresses.validation.invalid'), {
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
        toast.success(t('addresses.success.updated'), {
          description: t('addresses.success.updatedDesc')
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
        toast.success(t('addresses.success.created'), {
          description: t('addresses.success.createdDesc')
        });
      }
      
      setIsDialogOpen(false);
      setFormData(initialFormData);
      setEditingAddress(null);
      await loadAddresses();
    } catch (error: any) {
      console.error('Error submitting address:', error);
      toast.error(t('addresses.errors.saveFailed'), {
        description: error.message || t('addresses.errors.saveFailedDesc')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    setDeletingId(addressId);
    try {
      await deleteAddress(addressId);
      toast.success(t('addresses.success.deleted'), {
        description: t('addresses.success.deletedDesc')
      });
      await loadAddresses();
    } catch (error: any) {
      console.error('Error deleting address:', error);
      toast.error(t('addresses.errors.deleteFailed'), {
        description: error.message || t('addresses.errors.deleteFailedDesc')
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
      <div className="container max-w-6xl mx-auto py-2 sm:py-4 md:py-6 px-3 sm:px-4">
        {/* Header optimizado para móvil */}
        <div className="mb-4 sm:mb-6">
          <Card className="overflow-hidden shadow-lg border-0">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 sm:p-4 md:p-5 text-white">
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 sm:p-3 bg-white/10 rounded-full">
                    <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold truncate">{t('addresses.title')}</h1>
                    <Badge className="bg-white/20 text-white border-white/30 text-xs sm:text-sm mt-1">
                      {addresses.length} {addresses.length === 1 ? t('addresses.stats.main') : t('addresses.stats.delivery')}
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-8 w-8 sm:h-9 sm:w-auto sm:px-3 p-0 sm:p-2"
                      onClick={() => router.back()}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span className="hidden sm:inline ml-2">{t('common.back')}</span>
                    </Button>
                    <Button
                      size="sm"
                      className="bg-white text-blue-600 hover:bg-white/90 h-8 sm:h-9 px-2 sm:px-3"
                      onClick={openCreateDialog}
                    >
                      <Plus className="h-4 w-4" />
                      <span className="hidden sm:inline ml-2">{t('addresses.addNew')}</span>
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-1 text-blue-100">
                  <p className="text-xs sm:text-sm">
                    {t('addresses.validation.montrealOnly')}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Estadísticas más compactas */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 bg-blue-50 rounded-full">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold text-gray-900">{addresses.length}</p>
                  <p className="text-xs sm:text-sm text-gray-600">{t('addresses.stats.total')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 bg-green-50 rounded-full">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold text-gray-900">
                    {addresses.filter(addr => addr.city.toLowerCase().includes('montreal')).length}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">{t('addresses.cities.montreal')}</p>
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
              <p className="text-gray-600">{t('common.loading')}...</p>
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
                {t('addresses.noAddresses')}
              </h2>
              <p className="text-gray-500 text-center mb-6 max-w-md">
                {t('addresses.noAddressesDesc')}
              </p>
              <Button onClick={openCreateDialog} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                <Plus className="h-4 w-4 mr-2" />
                {t('addresses.addFirstAddress')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <AnimatePresence>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-3 sm:space-y-4"
            >
              {addresses.map((address, index) => (
                <motion.div 
                  key={address.id} 
                  variants={itemVariants}
                  layout
                  className="group"
                >
                  <Card className="transition-all duration-200 hover:shadow-lg border-0 shadow-sm">
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="p-2 bg-blue-50 rounded-full mt-1">
                            <Home className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">
                              {t('addresses.actions.addressTitle')} {address.id.slice(-6)}
                            </h3>
                            <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                              <p className="font-medium text-gray-900 break-words">{address.street}</p>
                              <p className="break-words">
                                {address.city}, {address.state} {address.zipCode}
                              </p>
                              <p className="text-gray-500">{address.country}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 sm:gap-3 sm:flex-col sm:w-auto w-full">
                          <Button 
                            variant="outline" 
                            className="flex-1 sm:flex-none text-xs sm:text-sm h-8 sm:h-9 sm:w-20"
                            onClick={() => openEditDialog(address)}
                          >
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            {t('addresses.actions.edit')}
                          </Button>
                          <Button 
                            variant="outline" 
                            className="flex-1 sm:flex-none text-xs sm:text-sm h-8 sm:h-9 sm:w-20 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteAddress(address.id)}
                            disabled={deletingId === address.id}
                          >
                            {deletingId === address.id ? (
                              <div className="h-3 w-3 sm:h-4 sm:w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                {t('addresses.actions.delete')}
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Modal para crear/editar dirección - optimizado móvil */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-lg w-[95vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">
                {editingAddress ? t('addresses.editAddress') : t('addresses.addNew')}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-blue-800">
                  <Shield className="h-4 w-4 flex-shrink-0" />
                  <p className="text-sm font-medium">{t('addresses.validation.montrealOnly')}</p>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  {t('addresses.validation.validationInfo')}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="street" className="text-sm font-medium">{t('addresses.form.street')} *</Label>
                <Input
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  placeholder={t('addresses.form.streetPlaceholder')}
                  className="h-10 text-sm"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium">{t('addresses.form.city')} *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder={t('addresses.form.cityPlaceholder')}
                    className="h-10 text-sm"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-sm font-medium">{t('addresses.form.state')} *</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder={t('addresses.form.statePlaceholder')}
                    className="h-10 text-sm"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode" className="text-sm font-medium">{t('addresses.form.zipCode')} *</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder={t('addresses.form.zipCodePlaceholder')}
                    className="h-10 text-sm"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-sm font-medium">{t('addresses.form.country')} *</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder={t('addresses.form.countryPlaceholder')}
                    className="h-10 text-sm"
                    required
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 h-10 text-sm"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  {t('addresses.form.cancel')}
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 h-10 text-sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      {t('addresses.form.saving')}
                    </>
                  ) : (
                    editingAddress ? t('common.update') : t('common.create')
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
