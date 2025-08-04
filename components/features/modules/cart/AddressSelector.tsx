"use client";

import { useState } from 'react';
import { MapPin, Plus, Edit, Trash2, Check, MapPinIcon } from 'lucide-react';
import { Button } from '@/components/common/ui/button';
import { Card, CardContent } from '@/components/common/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/common/ui/dialog';
import { Input } from '@/components/common/ui/input';
import { Label } from '@/components/common/ui/label';
import { useAddresses } from '@/hooks/useAddresses';
import { useAuth } from '@/hooks/useAuth';
import { validateMontrealAddress, formatCanadianPostalCode } from '@/lib/utils/montreal-validation';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';

interface FormData {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const initialFormData: FormData = {
  street: '',
  city: 'Montreal',
  state: 'Quebec',
  zipCode: '',
  country: 'Canada'
};

export function AddressSelector() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { 
    addresses, 
    selectedAddress, 
    primaryAddress,
    isLoading, 
    selectAddress, 
    createAddress,
    updateAddress,
    deleteAddress,
    setPrimaryAddress
  } = useAddresses();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validar dirección de Montreal
  const validateAddress = (data: FormData): boolean => {
    const validation = validateMontrealAddress(data.city, data.zipCode);
    
    if (!validation.isValid) {
      toast.error(t('addresses.validation.invalid'), {
        description: validation.error
      });
      return false;
    }
    
    if (!data.street.trim()) {
      toast.error(t('addresses.validation.streetRequired'));
      return false;
    }
    
    if (!data.country.trim()) {
      toast.error(t('addresses.validation.countryRequired'));
      return false;
    }
    
    return true;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAddress(formData)) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, formData);
      } else {
        await createAddress(formData);
      }
      
      setIsDialogOpen(false);
      setFormData(initialFormData);
      setEditingAddress(null);
    } catch (error) {
      // El error ya se maneja en el hook
    } finally {
      setIsSubmitting(false);
    }
  };

  // Abrir diálogo para crear nueva dirección
  const openCreateDialog = () => {
    setEditingAddress(null);
    setFormData(initialFormData);
    setIsDialogOpen(true);
  };

  // Abrir diálogo para editar dirección
  const openEditDialog = (address: any) => {
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

  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
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

  // Manejar eliminación de dirección
  const handleDeleteAddress = async (addressId: string) => {
    if (window.confirm(t('addresses.confirmDelete'))) {
      try {
        await deleteAddress(addressId);
      } catch (error) {
        // El error ya se maneja en el hook
      }
    }
  };

  // Seleccionar dirección (automáticamente se establece como principal)
  const handleSelectAddress = async (address: any) => {
    try {
      // El hook selectAddress automáticamente la establece como principal
      await selectAddress(address);
      
      // Solo mostrar mensaje si cambió la dirección principal
      if (!address.isPrimary) {
        toast.success(t('addresses.success.primarySet'));
      }
    } catch (error) {
      console.error('Error selecting address:', error);
      toast.error(t('addresses.errors.selectFailed'));
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-indigo-600" />
          {t('addresses.selector.title')}
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={openCreateDialog}
          className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('addresses.selector.add')}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
        </div>
      ) : addresses.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-200">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MapPinIcon className="h-6 w-6 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              {t('addresses.noAddresses')}
            </h4>
            <p className="text-gray-600 mb-4">
              {t('addresses.noAddressesDesc')}
            </p>
            <Button onClick={openCreateDialog} className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="h-4 w-4 mr-2" />
              {t('addresses.addNew')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {addresses.map((address) => (
              <motion.div
                key={address.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card 
                  className={`transition-all duration-200 cursor-pointer hover:shadow-md ${
                    address.isPrimary
                      ? 'ring-2 ring-indigo-500 bg-indigo-50' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleSelectAddress(address)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {address.isPrimary && (
                            <Check className="h-4 w-4 text-indigo-600" />
                          )}
                          <h4 className="font-medium text-gray-900">
                            {address.street}
                          </h4>
                          {address.isPrimary && (
                            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full font-medium">
                              {t('addresses.actions.primary')}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {address.city}, {address.state} {address.zipCode}
                        </p>
                        <p className="text-sm text-gray-600">{address.country}</p>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditDialog(address);
                          }}
                          className="text-gray-500 hover:text-gray-700"
                          title={t('addresses.actions.edit')}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAddress(address.id);
                          }}
                          className="text-red-500 hover:text-red-700"
                          title={t('addresses.actions.delete')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Información adicional */}
      <div className="bg-blue-50 p-3 rounded-lg">
        <div className="flex items-center gap-2 text-blue-800">
          <MapPin className="h-4 w-4" />
          <p className="text-sm font-medium">{t('addresses.selector.deliveryInfo')}</p>
        </div>
        <p className="text-xs text-blue-600 mt-1">
          {t('addresses.selector.deliveryNote')}
        </p>
      </div>

      {/* Modal para crear/editar dirección */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? t('addresses.editAddress') : t('addresses.addAddress')}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">
                {t('addresses.form.deliveryArea')}
              </p>
              <p className="text-xs text-blue-600">
                {t('addresses.form.deliveryAreaNote')}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="street">{t('addresses.form.street')}</Label>
              <Input
                id="street"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                placeholder={t('addresses.form.streetPlaceholder')}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">{t('addresses.form.city')}</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder={t('addresses.form.cityPlaceholder')}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state">{t('addresses.form.state')}</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder={t('addresses.form.statePlaceholder')}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zipCode">{t('addresses.form.zipCode')}</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  placeholder={t('addresses.form.zipCodePlaceholder')}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country">{t('addresses.form.country')}</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder={t('addresses.form.countryPlaceholder')}
                  required
                />
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1"
              >
                {t('addresses.form.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              >
                {isSubmitting ? t('addresses.form.saving') : (editingAddress ? t('common.update') : t('common.create'))}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
