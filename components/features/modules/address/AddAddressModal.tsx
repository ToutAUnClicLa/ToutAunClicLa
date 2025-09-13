"use client";

import { useState } from 'react';
import { Shield } from 'lucide-react';
import { Button } from '@/components/common/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/common/ui/dialog';
import { Input } from '@/components/common/ui/input';
import { Label } from '@/components/common/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/common/ui/select';
import { validateMontrealAddress, formatCanadianPostalCode } from '@/lib/utils/montreal-validation';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';
import { CreateAddressData, UpdateAddressData } from '@/lib/services/addresses';

interface FormData {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const initialFormData: FormData = {
  street: '',
  city: 'Montreal', // Establecer Montreal como ciudad por defecto
  state: 'Quebec',
  zipCode: '',
  country: 'Canada'
};

interface AddAddressModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateAddressData | UpdateAddressData) => Promise<void>;
  editingAddress?: any;
  isSubmitting?: boolean;
}

export function AddAddressModal({
  isOpen,
  onOpenChange,
  onSubmit,
  editingAddress,
  isSubmitting = false
}: AddAddressModalProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>(
    editingAddress ? {
      street: editingAddress.street,
      city: editingAddress.city,
      state: editingAddress.state,
      zipCode: editingAddress.zipCode,
      country: editingAddress.country
    } : initialFormData
  );

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

    try {
      await onSubmit(formData);
      setFormData(initialFormData);
      onOpenChange(false);
      
      // Disparar evento para actualizar el carrito inmediatamente
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('addressChanged', {
          detail: { 
            action: 'created',
            address: formData 
          }
        }));
      }
    } catch (error) {
      // El error ya se maneja en el componente padre
    }
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
              <Select value={formData.city} onValueChange={(value) => handleSelectChange('city', value)}>
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder={t('addresses.form.cityPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Montreal">Montreal</SelectItem>
                  <SelectItem value="Mont-Royal">Mont-Royal</SelectItem>
                  <SelectItem value="Westmount">Westmount</SelectItem>
                  <SelectItem value="Côté-Saint-Luc">Côté-Saint-Luc</SelectItem>
                  <SelectItem value="Montreal-Ouest">Montreal-Ouest</SelectItem>
                  <SelectItem value="Hampstead">Hampstead</SelectItem>
                  <SelectItem value="Point-Claire">Point-Claire</SelectItem>
                  <SelectItem value="Dollard-Des Ormeaux">Dollard-Des Ormeaux</SelectItem>
                  <SelectItem value="Dorval">Dorval</SelectItem>
                  <SelectItem value="Longueuil">Longueuil</SelectItem>
                  <SelectItem value="Boucherville">Boucherville</SelectItem>
                  <SelectItem value="Saint-Lambert">Saint-Lambert</SelectItem>
                  <SelectItem value="Brossard">Brossard</SelectItem>
                  <SelectItem value="La Prairie">La Prairie</SelectItem>
                  <SelectItem value="Candiac">Candiac</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state" className="text-sm font-medium">{t('addresses.form.state')} *</Label>
              <Select value={formData.state} onValueChange={(value) => handleSelectChange('state', value)}>
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder={t('addresses.form.statePlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Quebec">Quebec</SelectItem>
                </SelectContent>
              </Select>
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
              <Select value={formData.country} onValueChange={(value) => handleSelectChange('country', value)}>
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder={t('addresses.form.countryPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Canada">Canada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1 h-10 text-sm"
              onClick={() => onOpenChange(false)}
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
  );
}