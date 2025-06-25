"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Key, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Button } from '@/components/common/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/ui/card';
import { Input } from '@/components/common/ui/input';
import { Label } from '@/components/common/ui/label';
import { Separator } from '@/components/common/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from 'sonner';

export default function SecurityPage() {
  const router = useRouter();
  const { user } = useAuth();
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

  const [emailForm, setEmailForm] = useState({
    newEmail: '',
    password: ''
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Las contraseñas nuevas no coinciden');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implementar cambio de contraseña en el backend
      toast.success('Contraseña actualizada correctamente');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error('Error al cambiar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    try {
      // TODO: Implementar cambio de email en el backend
      toast.success('Se ha enviado un código de verificación a tu nuevo correo');
      setEmailForm({
        newEmail: '',
        password: ''
      });
    } catch (error) {
      toast.error('Error al cambiar el correo electrónico');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Seguridad</h1>
            <p className="text-gray-600">Gestiona la seguridad de tu cuenta</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Información de la cuenta */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Información de la cuenta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Correo electrónico</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-gray-900">{user?.email}</span>
                    {user?.verified && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Estado de verificación</Label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user?.verified 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user?.verified ? 'Verificado' : 'Pendiente de verificación'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cambiar contraseña */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-blue-600" />
                Cambiar contraseña
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Contraseña actual</Label>
                  <div className="relative mt-1">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      required
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="newPassword">Nueva contraseña</Label>
                  <div className="relative mt-1">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      required
                      minLength={6}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
                  <div className="relative mt-1">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                      minLength={6}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                  {isLoading ? 'Actualizando...' : 'Cambiar contraseña'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Cambiar correo electrónico */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-purple-600" />
                Cambiar correo electrónico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailChange} className="space-y-4">
                <div>
                  <Label htmlFor="newEmail">Nuevo correo electrónico</Label>
                  <Input
                    id="newEmail"
                    type="email"
                    value={emailForm.newEmail}
                    onChange={(e) => setEmailForm(prev => ({ ...prev, newEmail: e.target.value }))}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Confirma tu contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={emailForm.password}
                    onChange={(e) => setEmailForm(prev => ({ ...prev, password: e.target.value }))}
                    required
                    className="mt-1"
                  />
                </div>

                <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                  {isLoading ? 'Enviando...' : 'Cambiar correo electrónico'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Sesiones activas */}
          <Card>
            <CardHeader>
              <CardTitle>Sesiones activas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Sesión actual</p>
                    <p className="text-sm text-gray-600">Última actividad: Ahora</p>
                  </div>
                  <span className="text-green-600 text-sm font-medium">Activa</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <Button variant="outline" className="w-full">
                Cerrar todas las sesiones
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
