"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Key,
  Eye,
  EyeOff,
  Mail,
  CheckCircle,
  AlertCircle,
  Monitor,
  LogOut,
  User,
  Phone,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/common/ui/button';
import { Input } from '@/components/common/ui/input';
import { Label } from '@/components/common/ui/label';
import { Badge } from '@/components/common/ui/badge';
import { toast } from 'sonner';
import { changePassword, deleteAccount, updateBasicInfo } from '@/lib/services/profile';
import { loginPath } from '@/lib/shop-auth';
import { PROFILE } from '@/lib/shop-profile';
import {
  ProfileCard,
  ProfilePageHeader,
  ProfileSecuritySkeleton,
  profileCtaClass,
  profileOutlineClass,
} from '@/components/features/profile/ProfileChrome';
import { shopChrome } from '@/lib/shop-theme';
import { cn } from '@/lib/utils';

export default function SecurityPage() {
  const router = useRouter();
  const { user, logout, refreshAuth } = useAuth();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [basicInfoForm, setBasicInfoForm] = useState({ nombre: '', telefono: '' });
  const [deleteForm, setDeleteForm] = useState({ password: '', confirmText: '' });
  const [showDeleteSection, setShowDeleteSection] = useState(false);

  useEffect(() => {
    if (!user) {
      router.replace(loginPath(PROFILE.security));
    } else {
      setBasicInfoForm({
        nombre: user.nombre || '',
        telefono: user.telefono || '',
      });
    }
  }, [user, router]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error(t('profile.security.password.errors.passwordsNotMatch'));
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error(t('profile.security.password.errors.minLength'));
      return;
    }
    setIsLoading(true);
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success(t('profile.security.password.success'));
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error.message || t('profile.security.password.errors.generic'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBasicInfoUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!basicInfoForm.nombre.trim()) {
      toast.error(t('profile.security.basicInfo.errors.nameRequired'));
      return;
    }
    if (basicInfoForm.nombre.trim().length < 2) {
      toast.error(t('profile.security.basicInfo.errors.nameMinLength'));
      return;
    }
    setIsLoading(true);
    try {
      await updateBasicInfo({
        nombre: basicInfoForm.nombre.trim(),
        telefono: basicInfoForm.telefono.trim() || undefined,
      });
      toast.success(t('profile.security.basicInfo.success'));
      await refreshAuth();
    } catch (error: any) {
      toast.error(error.message || t('profile.security.basicInfo.errors.generic'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteForm.confirmText !== 'ELIMINAR') {
      toast.error(t('profile.security.delete.errors.confirmText'));
      return;
    }
    setIsLoading(true);
    try {
      await deleteAccount({ password: deleteForm.password });
      toast.success(t('profile.security.delete.success'));
      await logout();
      router.push('/');
    } catch (error: any) {
      toast.error(error.message || t('profile.security.delete.errors.generic'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <ProfileSecuritySkeleton />;
  }

  return (
    <div>
      <ProfilePageHeader
        title={t('profile.security.title')}
        description={t('profile.security.subtitle')}
      />

      <div className="space-y-6">
        <ProfileCard className="p-5 sm:p-6">
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-[var(--shop-ink)]">
            <Shield className="h-4 w-4 text-[var(--shop-purple)]" />
            {t('profile.security.account.title')}
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label className="text-sm text-[var(--shop-muted)]">
                {t('profile.security.account.email')}
              </Label>
              <div className="mt-1 flex items-center gap-2 text-[var(--shop-ink)]">
                <Mail className="h-4 w-4 text-[var(--shop-muted)]" />
                {user.email}
              </div>
            </div>
            <div>
              <Label className="text-sm text-[var(--shop-muted)]">
                {t('profile.security.account.verification')}
              </Label>
              <div className="mt-1">
                {user.verified ? (
                  <Badge className="border-0 bg-[var(--shop-purple-wash)] text-[var(--shop-purple)]">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    {t('profile.security.account.verified')}
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-amber-50 text-amber-800">
                    <AlertCircle className="mr-1 h-3 w-3" />
                    {t('profile.security.account.notVerified')}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </ProfileCard>

        <ProfileCard className="p-5 sm:p-6">
          <h2 className="text-base font-semibold text-[var(--shop-ink)]">
            <span className="inline-flex items-center gap-2">
              <User className="h-4 w-4 text-[var(--shop-purple)]" />
              {t('profile.security.basicInfo.title')}
            </span>
          </h2>
          <p className="mt-1 text-sm text-[var(--shop-muted)]">
            {t('profile.security.basicInfo.subtitle')}
          </p>
          <form onSubmit={handleBasicInfoUpdate} className="mt-4 space-y-4">
            <div>
              <Label htmlFor="nombre">{t('profile.security.basicInfo.name')}</Label>
              <Input
                id="nombre"
                type="text"
                value={basicInfoForm.nombre}
                onChange={(e) => setBasicInfoForm((prev) => ({ ...prev, nombre: e.target.value }))}
                required
                className={cn('mt-1 h-11', shopChrome.focus)}
                placeholder={t('profile.security.basicInfo.namePlaceholder')}
              />
            </div>
            <div>
              <Label htmlFor="telefono">{t('profile.security.basicInfo.phone')}</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--shop-muted)]" />
                <Input
                  id="telefono"
                  type="tel"
                  value={basicInfoForm.telefono}
                  onChange={(e) => setBasicInfoForm((prev) => ({ ...prev, telefono: e.target.value }))}
                  className={cn('h-11 pl-10', shopChrome.focus)}
                  placeholder={t('profile.security.basicInfo.phonePlaceholder')}
                />
              </div>
            </div>
            <Button type="submit" disabled={isLoading} className={profileCtaClass()}>
              {isLoading ? t('common.loading') : t('profile.security.basicInfo.update')}
            </Button>
          </form>
        </ProfileCard>

        <ProfileCard className="p-5 sm:p-6">
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-[var(--shop-ink)]">
            <Key className="h-4 w-4 text-[var(--shop-purple)]" />
            {t('profile.security.password.title')}
          </h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {(
              [
                {
                  id: 'currentPassword',
                  label: t('profile.security.password.current'),
                  value: passwordForm.currentPassword,
                  show: showCurrentPassword,
                  toggle: () => setShowCurrentPassword((v) => !v),
                  field: 'currentPassword' as const,
                  placeholder: t('profile.security.password.currentPlaceholder'),
                },
                {
                  id: 'newPassword',
                  label: t('profile.security.password.new'),
                  value: passwordForm.newPassword,
                  show: showNewPassword,
                  toggle: () => setShowNewPassword((v) => !v),
                  field: 'newPassword' as const,
                  placeholder: t('profile.security.password.newPlaceholder'),
                },
                {
                  id: 'confirmPassword',
                  label: t('profile.security.password.confirm'),
                  value: passwordForm.confirmPassword,
                  show: showConfirmPassword,
                  toggle: () => setShowConfirmPassword((v) => !v),
                  field: 'confirmPassword' as const,
                  placeholder: t('profile.security.password.confirmPlaceholder'),
                },
              ]
            ).map((field) => (
              <div key={field.id}>
                <Label htmlFor={field.id}>{field.label}</Label>
                <div className="relative mt-1">
                  <Input
                    id={field.id}
                    type={field.show ? 'text' : 'password'}
                    value={field.value}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({ ...prev, [field.field]: e.target.value }))
                    }
                    required
                    className={cn('h-11 pr-10', shopChrome.focus)}
                    placeholder={field.placeholder}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={field.toggle}
                  >
                    {field.show ? (
                      <EyeOff className="h-4 w-4 text-[var(--shop-muted)]" />
                    ) : (
                      <Eye className="h-4 w-4 text-[var(--shop-muted)]" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
            <Button type="submit" disabled={isLoading} className={profileCtaClass()}>
              {isLoading ? t('common.loading') : t('profile.security.password.update')}
            </Button>
          </form>
        </ProfileCard>

        <ProfileCard className="p-5 sm:p-6">
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-[var(--shop-ink)]">
            <Monitor className="h-4 w-4 text-[var(--shop-purple)]" />
            {t('profile.security.sessions.title')}
          </h2>
          <div className="flex items-center justify-between rounded-lg border border-[var(--shop-hairline)] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--shop-purple-wash)] text-[var(--shop-purple)]">
                <Monitor className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-[var(--shop-ink)]">
                  {t('profile.security.sessions.currentDevice')}
                </p>
                <p className="text-sm text-[var(--shop-muted)]">
                  {t('profile.security.sessions.lastActivity')}
                </p>
              </div>
            </div>
            <Badge className="border-0 bg-[var(--shop-purple-wash)] text-[var(--shop-purple)]">
              {t('profile.security.sessions.active')}
            </Badge>
          </div>
          <Button
            variant="outline"
            className={cn('mt-4 w-full', profileOutlineClass())}
            onClick={() => toast.info(t('profile.security.sessions.logoutAllNotAvailable'))}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {t('profile.security.sessions.closeAll')}
          </Button>
        </ProfileCard>

        <ProfileCard className="border-red-200 p-5 sm:p-6">
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-red-600">
            <AlertCircle className="h-4 w-4" />
            {t('profile.security.delete.title')}
          </h2>
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">{t('profile.security.delete.warning')}</p>
          </div>
          {!showDeleteSection ? (
            <Button
              variant="outline"
              className="h-11 border-red-300 text-red-600 hover:bg-red-50"
              onClick={() => setShowDeleteSection(true)}
            >
              {t('profile.security.delete.showForm')}
            </Button>
          ) : (
            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div>
                <Label htmlFor="deletePassword">{t('profile.security.delete.passwordConfirm')}</Label>
                <Input
                  id="deletePassword"
                  type="password"
                  value={deleteForm.password}
                  onChange={(e) => setDeleteForm((prev) => ({ ...prev, password: e.target.value }))}
                  required
                  className={cn('mt-1 h-11', shopChrome.focus)}
                  placeholder={t('profile.security.delete.passwordPlaceholder')}
                />
              </div>
              <div>
                <Label htmlFor="confirmText">{t('profile.security.delete.confirmLabel')}</Label>
                <Input
                  id="confirmText"
                  type="text"
                  value={deleteForm.confirmText}
                  onChange={(e) => setDeleteForm((prev) => ({ ...prev, confirmText: e.target.value }))}
                  required
                  className={cn('mt-1 h-11', shopChrome.focus)}
                  placeholder="ELIMINAR"
                />
                <p className="mt-1 text-xs text-[var(--shop-muted)]">
                  {t('profile.security.delete.confirmHelp')}
                </p>
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" className={profileOutlineClass()} onClick={() => setShowDeleteSection(false)}>
                  {t('common.cancel')}
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || deleteForm.confirmText !== 'ELIMINAR'}
                  className="h-11 bg-red-600 text-white hover:bg-red-700"
                >
                  {isLoading ? t('common.loading') : t('profile.security.delete.confirm')}
                </Button>
              </div>
            </form>
          )}
        </ProfileCard>
      </div>
    </div>
  );
}
