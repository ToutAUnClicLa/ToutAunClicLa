"use client";

import { useState } from 'react';
import { MapPin, Plus, Edit, Trash2, Check, MapPinIcon } from 'lucide-react';
import { Button } from '@/components/common/ui/button';
import { Card, CardContent } from '@/components/common/ui/card';
import { AddAddressModal } from '@/components/features/modules/address/AddAddressModal';
import { useAddresses } from '@/hooks/useAddresses';
import { useAuth } from '@/hooks/useAuth';
// Removed unused import: formatCanadianPostalCode
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import { shopChrome } from '@/lib/shop-theme';
import { cn } from '@/lib/utils';


export function AddressSelector() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { 
    addresses, 
    selectedAddress,
    isLoading, 
    selectAddress, 
    createAddress,
    updateAddress,
    deleteAddress,
    isSyncingWithBackend
  } = useAddresses();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [setIsConfiguringAddress] = useState(() => () => {});


  // 🚨 CRITICAL FIX: Manejar envío del formulario con logs detallados y configuración robusta
  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    console.log('📝 INICIANDO SUBMIT de formulario de dirección');
    
    try {
      let result;
      if (editingAddress) {
        console.log('✏️ Actualizando dirección existente:', editingAddress.id);
        result = await updateAddress(editingAddress.id, data);
        toast.success(t('addresses.success.updated'));
      } else {
        // Capturar el estado antes de crear la dirección
        const wasEmpty = addresses.length === 0;
        console.log('🆕 CREANDO NUEVA DIRECCIÓN:', {
          wasEmpty,
          currentAddressCount: addresses.length,
          addressData: data
        });
        
        result = await createAddress(data);
        
        console.log('✅ DIRECCIÓN CREADA EXITOSAMENTE EN ADDRESSSELECTOR:', {
          wasFirstAddress: wasEmpty,
          newAddress: result,
          newAddressId: result?.id,
          isPrimary: result?.isPrimary,
          totalAddresses: addresses.length + 1,
          timestamp: new Date().toISOString()
        });

        // 🚨 OPTIMIZADO: Feedback inmediato sin delays
        if (result?.id && wasEmpty) {
          console.log('✅ Primera dirección creada y auto-seleccionada');
          toast.success(t('addresses.selector.firstCreated'), {
            duration: 3000,
          });
        } else if (result?.id) {
          toast.success(t('addresses.success.created'));
        }
      }
      
      console.log('🚪 Cerrando modal de dirección');
      setIsDialogOpen(false);
      setEditingAddress(null);
      
      console.log('🎯 SUBMIT COMPLETADO - Los hooks deberían haber disparado eventos');
      
    } catch (error) {
      console.error('❌ ERROR CRÍTICO en handleSubmit:', error);
      toast.error(t('addresses.errors.saveFailed'));
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
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-base font-semibold text-[var(--shop-ink)] ">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--shop-purple-wash)]">
              <MapPin className="h-4 w-4 text-[var(--shop-purple)]" />
            </div>

          {t('addresses.selector.title')}
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={openCreateDialog}
          className="inline-flex h-11 min-h-11 items-center rounded-full border border-[var(--shop-hairline)] bg-white px-5 py-2.5 text-sm font-medium text-[var(--shop-ink)] hover:bg-[var(--shop-canvas-muted)]"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t('addresses.selector.add')}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--shop-hairline)] border-t-[var(--shop-purple)]" />
        </div>
      ) : addresses.length === 0 ? (
        <Card className="border-dashed border-[var(--shop-hairline)] bg-white shadow-none">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--shop-hairline)] bg-[var(--shop-canvas-muted)]">
              <MapPinIcon className="h-6 w-6 text-[var(--shop-muted)]" />
            </div>
            <h4 className="mb-4 text-base font-medium text-[var(--shop-ink)]">
              {t('addresses.noAddresses')}
            </h4>
            <Button onClick={openCreateDialog} className={shopChrome.inkCta}>
              <Plus className="mr-2 h-4 w-4" />
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
                  className={cn(
                    'cursor-pointer border shadow-none',
                    address.isPrimary || selectedAddress?.id === address.id
                      ? 'border-[var(--shop-purple)] bg-[var(--shop-purple-wash)]'
                      : 'border-[var(--shop-hairline)] bg-white hover:bg-[var(--shop-canvas-muted)]'
                  )}
                  onClick={() => handleSelectAddress(address)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          {(address.isPrimary || selectedAddress?.id === address.id) && (
                            <Check className="h-4 w-4 text-[var(--shop-purple)]" />
                          )}
                          <h4 className="font-medium text-[var(--shop-ink)]">
                            {address.street}
                          </h4>
                          {address.isPrimary && (
                            <span className="rounded-full border border-[var(--shop-hairline)] bg-white px-2 py-0.5 text-xs font-medium text-[var(--shop-ink)]">
                              {t('addresses.actions.primary')}
                            </span>
                          )}
                          {(isSyncingWithBackend && selectedAddress?.id === address.id) && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--shop-hairline)] bg-white px-2 py-0.5 text-xs font-medium text-[var(--shop-muted)]">
                              <div className="h-3 w-3 animate-spin rounded-full border border-[var(--shop-purple)] border-t-transparent" />
                              {t('addresses.selector.syncing')}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[var(--shop-muted)]">
                          {address.city}, {address.state} {address.zipCode}
                        </p>
                        <p className="text-sm text-[var(--shop-muted)]">{address.country}</p>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditDialog(address);
                          }}
                          className={cn('h-11 w-11 p-0 text-[var(--shop-muted)] hover:text-[var(--shop-ink)]', shopChrome.focus)}
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
                          className={cn('h-11 w-11 p-0 text-[var(--shop-muted)] hover:text-[var(--shop-ink)]', shopChrome.focus)}
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
      <div className="rounded-xl border border-[var(--shop-hairline)] bg-[var(--shop-canvas-muted)] p-3">
        <div className="flex items-center gap-2 text-[var(--shop-ink)]">
          <MapPin className="h-4 w-4 text-[var(--shop-purple)]" />
          <p className="text-sm font-medium">{t('addresses.selector.deliveryInfo')}</p>
        </div>
        <p className="mt-1 text-xs text-[var(--shop-muted)]">
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
