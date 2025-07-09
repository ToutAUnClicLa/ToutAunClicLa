"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, AlertCircle, CheckCircle, RefreshCw, Send } from 'lucide-react';
import { Button } from '@/components/common/ui/button';
import { Input } from '@/components/common/ui/input';
import { Label } from '@/components/common/ui/label';
import { Card, CardContent } from '@/components/common/ui/card';
import { Badge } from '@/components/common/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/common/ui/dialog';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import * as authService from '@/lib/services/auth';

interface ProfileVerificationProps {
  user: {
    email: string;
    verified: boolean;
  };
  onVerificationSuccess?: () => void;
}

export default function ProfileVerification({ user, onVerificationSuccess }: ProfileVerificationProps) {
  const { refreshAuth } = useAuth();
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reenviar código de verificación
  const handleResendVerification = async () => {
    setIsResending(true);
    setError(null);
    
    try {
      await authService.resendVerification(user.email);
      toast.success('Código enviado', {
        description: 'Revisa tu correo electrónico para el nuevo código de verificación'
      });
      setIsVerificationModalOpen(true);
    } catch (error: any) {
      console.error('Error al reenviar verificación:', error);
      setError(error.message || 'Error al enviar código de verificación');
      toast.error('Error al enviar código', {
        description: error.message || 'No pudimos enviar el código de verificación'
      });
    } finally {
      setIsResending(false);
    }
  };

  // Verificar código
  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Ingresa un código de 6 dígitos');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authService.verifyEmail(verificationCode, user.email);
      
      toast.success('¡Email verificado!', {
        description: 'Tu cuenta ha sido verificada correctamente'
      });

      // Actualizar estado de autenticación
      await refreshAuth();
      
      // Cerrar modal
      setIsVerificationModalOpen(false);
      setVerificationCode('');
      
      // Callback de éxito
      onVerificationSuccess?.();
      
    } catch (error: any) {
      console.error('Error en verificación:', error);
      setError(error.message || 'Código de verificación inválido');
    } finally {
      setIsLoading(false);
    }
  };

  // Si el usuario ya está verificado, mostrar estado verificado
  if (user.verified) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-green-800">Email verificado</h3>
              <p className="text-sm text-green-700">
                Tu cuenta está completamente verificada
              </p>
            </div>
            <Badge className="bg-green-100 text-green-700 border-green-300">
              Verificado
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Si no está verificado, mostrar opciones de verificación
  return (
    <>
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-full mt-1">
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-800 mb-1">
                Verificación pendiente
              </h3>
              <p className="text-sm text-amber-700 mb-3">
                Para acceder a todas las funciones, verifica tu correo electrónico: <strong>{user.email}</strong>
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={handleResendVerification}
                  disabled={isResending}
                  variant="outline"
                  size="sm"
                  className="border-amber-300 text-amber-700 hover:bg-amber-100"
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Reenviar código
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setIsVerificationModalOpen(true)}
                  size="sm"
                  className="bg-amber-600 text-white hover:bg-amber-700"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Ya tengo el código
                </Button>
              </div>
            </div>
            <Badge className="bg-amber-100 text-amber-700 border-amber-300">
              Pendiente
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Modal de verificación */}
      <Dialog open={isVerificationModalOpen} onOpenChange={setIsVerificationModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              Verificar email
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Ingresa el código de 6 dígitos enviado a:
              </p>
              <p className="font-medium text-gray-900">{user.email}</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200"
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <div className="space-y-2">
              <Label htmlFor="verification-code">Código de verificación</Label>
              <Input
                id="verification-code"
                type="text"
                value={verificationCode}
                onChange={(e) => {
                  setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                  setError(null);
                }}
                placeholder="123456"
                maxLength={6}
                className="text-center text-lg tracking-widest font-mono"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline"
                onClick={() => setIsVerificationModalOpen(false)}
                className="flex-1"
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleVerifyCode}
                className="flex-1" 
                disabled={isLoading || verificationCode.length !== 6}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  'Verificar'
                )}
              </Button>
            </div>

            <div className="text-center">
              <Button
                variant="link"
                onClick={handleResendVerification}
                disabled={isResending}
                className="text-sm"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                    Reenviando...
                  </>
                ) : (
                  'Reenviar código'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
