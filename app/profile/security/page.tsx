"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Shield, 
  Key, 
  Lock, 
  Eye, 
  EyeOff, 
  Mail,
  CheckCircle,
  AlertCircle,
  Monitor,
  Smartphone,
  Globe,
  LogOut,
  User,
  Phone
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/common/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/ui/card';
import { Input } from '@/components/common/ui/input';
import { Label } from '@/components/common/ui/label';
import { Separator } from '@/components/common/ui/separator';
import { Badge } from '@/components/common/ui/badge';
import { toast } from 'sonner';
import { changePassword, deleteAccount, updateBasicInfo } from '@/lib/services/profile';

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
    confirmPassword: ''
  });

  const [basicInfoForm, setBasicInfoForm] = useState({
    nombre: '',
    telefono: ''
  });

  const [deleteForm, setDeleteForm] = useState({
    password: '',
    confirmText: ''
  });

  const [showDeleteSection, setShowDeleteSection] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/');
    } else {
      // Inicializar el formulario con los datos actuales del usuario
      setBasicInfoForm({
        nombre: user.nombre || '',
        telefono: user.telefono || ''
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
        newPassword: passwordForm.newPassword
      });
      
      toast.success(t('profile.security.password.success'));
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
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
        telefono: basicInfoForm.telefono.trim() || undefined
      });
      
      toast.success(t('profile.security.basicInfo.success'));
      
      // Actualizar el contexto de autenticación
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

  const handleLogoutAllSessions = () => {
    toast.info(t('profile.security.sessions.logoutAllNotAvailable'));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30">
      <div className="container max-w-4xl mx-auto py-2 sm:py-4 md:py-6 px-3 sm:px-4">
        {/* Header Banner con estilo consistente */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 sm:mb-6"
        >
          <Card className="overflow-hidden shadow-lg border-0">
            <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 p-3 sm:p-4 md:p-6 text-white relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-violet-600/20"></div>
              <div className="absolute top-2 right-2 w-16 h-16 bg-white/5 rounded-full blur-2xl"></div>
              
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-2 sm:p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                      <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                        {t('profile.security.title')}
                      </h1>
                      <p className="text-purple-100 text-sm sm:text-base opacity-90">
                        {t('profile.security.subtitle')}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className="bg-white/10 border border-white/20 text-white hover:bg-white/20 backdrop-blur-sm h-8 sm:h-9 px-2 sm:px-3"
                  >
                    <ArrowLeft className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">{t('common.back')}</span>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="space-y-6">
          {/* Información de la cuenta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  {t('profile.security.account.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      {t('profile.security.account.email')}
                    </Label>
                    <div className="mt-1 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{user.email}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      {t('profile.security.account.verification')}
                    </Label>
                    <div className="mt-1">
                      <Badge variant={user.verified ? "default" : "destructive"} className="flex items-center gap-1 w-fit">
                        {user.verified ? (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            {t('profile.security.account.verified')}
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-3 w-3" />
                            {t('profile.security.account.notVerified')}
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Cambiar contraseña */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-blue-600" />
                  {t('profile.security.password.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">
                      {t('profile.security.password.current')}
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                        required
                        className="pr-10"
                        placeholder={t('profile.security.password.currentPlaceholder')}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="newPassword">
                      {t('profile.security.password.new')}
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        required
                        className="pr-10"
                        placeholder={t('profile.security.password.newPlaceholder')}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">
                      {t('profile.security.password.confirm')}
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                        className="pr-10"
                        placeholder={t('profile.security.password.confirmPlaceholder')}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isLoading} 
                    className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isLoading ? t('common.loading') : t('profile.security.password.update')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Información básica */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-indigo-600" />
                  {t('profile.security.basicInfo.title')}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {t('profile.security.basicInfo.subtitle')}
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBasicInfoUpdate} className="space-y-4">
                  <div>
                    <Label htmlFor="nombre">
                      {t('profile.security.basicInfo.name')}
                    </Label>
                    <Input
                      id="nombre"
                      type="text"
                      value={basicInfoForm.nombre}
                      onChange={(e) => setBasicInfoForm(prev => ({ ...prev, nombre: e.target.value }))}
                      required
                      className="mt-1"
                      placeholder={t('profile.security.basicInfo.namePlaceholder')}
                    />
                  </div>

                  <div>
                    <Label htmlFor="telefono">
                      {t('profile.security.basicInfo.phone')}
                    </Label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="telefono"
                        type="tel"
                        value={basicInfoForm.telefono}
                        onChange={(e) => setBasicInfoForm(prev => ({ ...prev, telefono: e.target.value }))}
                        className="pl-10"
                        placeholder={t('profile.security.basicInfo.phonePlaceholder')}
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    {isLoading ? t('common.loading') : t('profile.security.basicInfo.update')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sesiones activas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-indigo-600" />
                  {t('profile.security.sessions.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50 border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Monitor className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {t('profile.security.sessions.currentDevice')}
                        </p>
                        <p className="text-sm text-gray-600">
                          {t('profile.security.sessions.lastActivity')}
                        </p>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-green-100 text-green-700">
                      {t('profile.security.sessions.active')}
                    </Badge>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <Button 
                  variant="outline" 
                  className="w-full flex items-center gap-2"
                  onClick={handleLogoutAllSessions}
                >
                  <LogOut className="h-4 w-4" />
                  {t('profile.security.sessions.closeAll')}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Zona peligrosa - Eliminar cuenta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="shadow-lg border-0 border-red-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  {t('profile.security.delete.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-red-700">
                    {t('profile.security.delete.warning')}
                  </p>
                </div>
                
                {!showDeleteSection ? (
                  <Button
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                    onClick={() => setShowDeleteSection(true)}
                  >
                    {t('profile.security.delete.showForm')}
                  </Button>
                ) : (
                  <form onSubmit={handleDeleteAccount} className="space-y-4">
                    <div>
                      <Label htmlFor="deletePassword">
                        {t('profile.security.delete.passwordConfirm')}
                      </Label>
                      <Input
                        id="deletePassword"
                        type="password"
                        value={deleteForm.password}
                        onChange={(e) => setDeleteForm(prev => ({ ...prev, password: e.target.value }))}
                        required
                        className="mt-1"
                        placeholder={t('profile.security.delete.passwordPlaceholder')}
                      />
                    </div>

                    <div>
                      <Label htmlFor="confirmText">
                        {t('profile.security.delete.confirmLabel')}
                      </Label>
                      <Input
                        id="confirmText"
                        type="text"
                        value={deleteForm.confirmText}
                        onChange={(e) => setDeleteForm(prev => ({ ...prev, confirmText: e.target.value }))}
                        required
                        className="mt-1"
                        placeholder="ELIMINAR"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {t('profile.security.delete.confirmHelp')}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowDeleteSection(false)}
                      >
                        {t('common.cancel')}
                      </Button>
                      <Button
                        type="submit"
                        disabled={isLoading || deleteForm.confirmText !== 'ELIMINAR'}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        {isLoading ? t('common.loading') : t('profile.security.delete.confirm')}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
