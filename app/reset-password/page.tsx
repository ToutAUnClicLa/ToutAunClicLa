"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [tokenValidating, setTokenValidating] = useState(true);
  const [tokenError, setTokenError] = useState<string | null>(null);
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validar el token al cargar la página
  useEffect(() => {
    async function validateToken() {
      try {
        const tokenFromUrl = searchParams.get('token');
        setToken(tokenFromUrl);
        
        if (!tokenFromUrl) {
          setTokenValid(false);
          setTokenError('No se proporcionó un token de recuperación');
          setTokenValidating(false);
          return;
        }
        
        // Validar que el token existe y es válido usando nuestra API
        const response = await fetch(`/api/auth/verify-token?token=${tokenFromUrl}&type=reset`);
        
        if (!response.ok) {
          setTokenValid(false);
          setTokenError('El token no es válido o ha expirado');
          setTokenValidating(false);
          return;
        }
        
        setTokenValid(true);
        setTokenValidating(false);
      } catch (error) {
        console.error('Error al validar token:', error);
        setTokenValid(false);
        setTokenError('Error al validar el token');
        setTokenValidating(false);
      }
    }
    
    validateToken();
  }, [searchParams]);

  const validatePassword = (password: string): boolean => {
    // Mínimo 6 caracteres, al menos una letra y un número
    return password.length >= 6 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError('Token de recuperación no válido');
      return;
    }

    // Validar contraseña
    if (!validatePassword(password)) {
      setError('La contraseña debe tener al menos 6 caracteres, una letra y un número');
      return;
    }

    // Verificar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      setIsProcessing(true);
      
      // Usar nuestra API para restablecer la contraseña
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword: password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al restablecer la contraseña');
      }
      
      setIsSuccess(true);
      toast.success('Contraseña actualizada correctamente');
    } catch (error: any) {
      console.error('Error al restablecer la contraseña:', error);
      setError(error.message || 'Error al restablecer la contraseña');
      toast.error('Error al restablecer la contraseña');
    } finally {
      setIsProcessing(false);
    }
  };

  if (tokenValidating) {
    return (
      <div className="flex flex-col items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
          <div className="flex justify-center">
            <img 
              src="/logoaunclic.svg" 
              alt="Logo"
              className="h-16 w-16 filter drop-shadow-md"
            />
          </div>
          
          <h1 className="text-2xl font-semibold text-center text-gray-900">
            Verificando enlace
          </h1>
          
          <div className="flex flex-col items-center space-y-4 py-4">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600">Verificando la validez del enlace de recuperación...</p>
          </div>
        </div>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
          <div className="flex justify-center">
            <img 
              src="/logoaunclic.svg" 
              alt="Logo"
              className="h-16 w-16 filter drop-shadow-md"
            />
          </div>
          
          <h1 className="text-2xl font-semibold text-center text-gray-900">
            Enlace no válido
          </h1>
          
          <div className="text-center space-y-4 py-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-medium text-gray-900">Error de validación</h2>
              <p className="text-red-600 mt-1">
                {tokenError || 'El enlace de recuperación no es válido o ha expirado'}
              </p>
            </div>
            <Button 
              className="w-full mt-4"
              onClick={() => router.push('/')}
            >
              Volver a la página principal
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="flex justify-center">
          <img 
            src="/logoaunclic.svg" 
            alt="Logo"
            className="h-16 w-16 filter drop-shadow-md"
          />
        </div>
        
        <h1 className="text-2xl font-semibold text-center text-gray-900">
          Restablecer Contraseña
        </h1>
        
        {isSuccess ? (
          <div className="text-center space-y-4 py-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-medium text-gray-900">¡Contraseña actualizada!</h2>
              <p className="text-gray-600 mt-1">
                Tu contraseña ha sido actualizada correctamente.
              </p>
            </div>
            <Button 
              className="w-full mt-4"
              onClick={() => router.push('/sign-in')}
            >
              Ir a iniciar sesión
            </Button>
          </div>
        ) : (
          <>
            {error && (
              <div className="p-3 bg-red-50 rounded-lg flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="password">Nueva Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-10"
                    placeholder="********"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  La contraseña debe tener al menos 6 caracteres, una letra y un número.
                </p>
              </div>

              <div className="space-y-1">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-9 pr-10"
                    placeholder="********"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Restablecer contraseña"
                )}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
} 