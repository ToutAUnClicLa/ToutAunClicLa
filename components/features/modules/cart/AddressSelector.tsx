"use client";

import { useState } from 'react';
import { MapPin, Plus, Edit, Trash2, Check, MapPinIcon } from 'lucide-react';
import { Button } from '@/components/common/ui/button';
import { Card, CardContent } from '@/components/common/ui/card';
import { AddAddressModal } from '@/components/features/modules/address/AddAddressModal';
import { useAddresses } from '@/hooks/useAddresses';
import { useAuth } from '@/hooks/useAuth';
import { validateMontrealAddress, formatCanadianPostalCode } from '@/lib/utils/montreal-validation';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';


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
  const [isSubmitting, setIsSubmitting] = useState(false);


  // Manejar envío del formulario
  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, data);
      } else {
        await createAddress(data);
      }
      
      setIsDialogOpen(false);
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
    setIsDialogOpen(true);
  };

  // Abrir diálogo para editar dirección
  const openEditDialog = (address: any) => {
    setEditingAddress(address);
    setIsDialogOpen(true);
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
            <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <MapPin className="h-5 w-5 text-indigo-600" />
            </div>

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
      <AddAddressModal
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmit}
        editingAddress={editingAddress}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
