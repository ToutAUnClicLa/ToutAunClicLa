"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { MapPin, Plus, Home, Edit, Trash2, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/common/ui/button';
import { Badge } from '@/components/common/ui/badge';
import { AddAddressModal } from '@/components/features/modules/address/AddAddressModal';
import {
  getUserAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setPrimaryAddress,
  Address,
  CreateAddressData,
  UpdateAddressData,
} from '@/lib/services/addresses';
import { loginPath } from '@/lib/shop-auth';
import { PROFILE } from '@/lib/shop-profile';
import {
  ProfileCard,
  ProfilePageHeader,
  ProfileAddressesSkeleton,
  profileCtaClass,
  profileOutlineClass,
} from '@/components/features/profile/ProfileChrome';
import { cn } from '@/lib/utils';

export default function AddressesPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { t } = useTranslation();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadAddresses = useCallback(async () => {
    if (!user) return;
    setIsLoadingAddresses(true);
    try {
      const data = await getUserAddresses();
      setAddresses(data);
    } catch (error: any) {
      toast.error(t('addresses.errors.loadFailed'), {
        description: error.message || t('addresses.errors.loadFailedDesc'),
      });
    } finally {
      setIsLoadingAddresses(false);
    }
  }, [user, t]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(loginPath(PROFILE.addresses));
      return;
    }
    loadAddresses();
  }, [isLoading, user, loadAddresses, router]);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (editingAddress) {
        const updateData: UpdateAddressData = {
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
        };
        await updateAddress(editingAddress.id, updateData);
        toast.success(t('addresses.success.updated'), {
          description: t('addresses.success.updatedDesc'),
        });
      } else {
        const createData: CreateAddressData = {
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
        };
        await createAddress(createData);
        toast.success(t('addresses.success.created'), {
          description: t('addresses.success.createdDesc'),
        });
      }
      setIsDialogOpen(false);
      setEditingAddress(null);
      await loadAddresses();
    } catch (error: any) {
      toast.error(t('addresses.errors.saveFailed'), {
        description: error.message || t('addresses.errors.saveFailedDesc'),
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
        description: t('addresses.success.deletedDesc'),
      });
      await loadAddresses();
    } catch (error: any) {
      toast.error(t('addresses.errors.deleteFailed'), {
        description: error.message || t('addresses.errors.deleteFailedDesc'),
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetPrimary = async (addressId: string) => {
    try {
      await setPrimaryAddress(addressId);
      toast.success(t('addresses.success.primarySet'), {
        description: t('addresses.success.primarySetDesc'),
      });
      await loadAddresses();
    } catch (error: any) {
      toast.error(t('addresses.errors.primaryFailed'), {
        description: error.message || t('addresses.errors.primaryFailedDesc'),
      });
    }
  };

  if (isLoading || !user) {
    return <ProfileAddressesSkeleton />;
  }

  return (
    <div>
      <ProfilePageHeader
        title={t('addresses.title')}
        description={t('addresses.validation.montrealOnly')}
        action={
          <Button
            className={profileCtaClass()}
            onClick={() => {
              setEditingAddress(null);
              setIsDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t('addresses.addNew')}
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3">
        <ProfileCard className="p-4">
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-[var(--shop-purple)]" />
            <div>
              <p className="text-lg font-semibold text-[var(--shop-ink)]">{addresses.length}</p>
              <p className="text-xs text-[var(--shop-muted)]">{t('addresses.stats.total')}</p>
            </div>
          </div>
        </ProfileCard>
        <ProfileCard className="p-4">
          <div className="flex items-center gap-3">
            <Shield className="h-4 w-4 text-[var(--shop-purple)]" />
            <div>
              <p className="text-lg font-semibold text-[var(--shop-ink)]">
                {addresses.filter((addr) => addr.city.toLowerCase().includes('montreal')).length}
              </p>
              <p className="text-xs text-[var(--shop-muted)]">{t('addresses.cities.montreal')}</p>
            </div>
          </div>
        </ProfileCard>
      </div>

      {isLoadingAddresses ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <ProfileCard key={i} className="space-y-2 p-5">
              <div className="h-4 w-40 animate-pulse rounded-lg bg-[var(--shop-hairline)]" />
              <div className="h-3 w-64 max-w-full animate-pulse rounded-lg bg-[var(--shop-hairline)]" />
              <div className="h-3 w-48 animate-pulse rounded-lg bg-[var(--shop-hairline)]" />
            </ProfileCard>
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <ProfileCard className="px-5 py-12 text-center sm:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--shop-purple-wash)] text-[var(--shop-purple)]">
            <MapPin className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-[var(--shop-ink)]">
            {t('addresses.noAddresses')}
          </h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-[var(--shop-muted)]">
            {t('addresses.noAddressesDesc')}
          </p>
          <Button
            className={cn('mt-6', profileCtaClass())}
            onClick={() => {
              setEditingAddress(null);
              setIsDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t('addresses.addFirstAddress')}
          </Button>
        </ProfileCard>
      ) : (
        <div className="space-y-3">
          {addresses.map((address) => (
            <ProfileCard key={address.id} className="p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--shop-purple-wash)] text-[var(--shop-purple)]">
                    <Home className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <h3 className="font-medium text-[var(--shop-ink)]">
                        {t('addresses.actions.addressTitle')} {address.id.slice(-6)}
                      </h3>
                      {address.isPrimary ? (
                        <Badge className="border-0 bg-[var(--shop-purple-wash)] text-[var(--shop-purple)]">
                          {t('addresses.actions.primary')}
                        </Badge>
                      ) : null}
                    </div>
                    <p className="break-words text-sm font-medium text-[var(--shop-ink)]">
                      {address.street}
                    </p>
                    <p className="break-words text-sm text-[var(--shop-muted)]">
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p className="text-sm text-[var(--shop-muted)]">{address.country}</p>
                  </div>
                </div>
                <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:flex-col">
                  {!address.isPrimary ? (
                    <Button
                      variant="outline"
                      className={profileOutlineClass()}
                      onClick={() => handleSetPrimary(address.id)}
                    >
                      <Shield className="mr-1 h-4 w-4" />
                      {t('addresses.actions.setPrimary')}
                    </Button>
                  ) : null}
                  <Button
                    variant="outline"
                    className={profileOutlineClass()}
                    onClick={() => {
                      setEditingAddress(address);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit className="mr-1 h-4 w-4" />
                    {t('addresses.actions.edit')}
                  </Button>
                  <Button
                    variant="outline"
                    className={cn(profileOutlineClass(), 'text-red-600 hover:text-red-700')}
                    onClick={() => handleDeleteAddress(address.id)}
                    disabled={deletingId === address.id}
                  >
                    {deletingId === address.id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                    ) : (
                      <>
                        <Trash2 className="mr-1 h-4 w-4" />
                        {t('addresses.actions.delete')}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </ProfileCard>
          ))}
        </div>
      )}

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
